/**
 * AI-Powered Health Information Intelligence & Credibility Assessment System
 * Full-Stack Express Server with Gemini AI & RAG Integration + Vite Middleware
 */

import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import {
  AnalysisHistoryItem,
  ClaimAnalysisResult,
  ExtractedMedicalInformation,
  Patient,
  PatientDocument,
  User,
} from './src/types';
import { AIService } from './src/services/aiService';
import { RAGEvidenceService, MEDICAL_EVIDENCE_CORPUS } from './src/services/ragEvidenceService';
import { InconsistencyDetectorService } from './src/services/inconsistencyDetector';
import {
  SYNTHETIC_PATIENTS,
  SYNTHETIC_USERS,
  SYNTHETIC_DEMO_CLAIMS,
} from './src/services/syntheticData';
import {
  saveClaimAuditToDb,
  getClaimAuditsFromDb,
  reconcileInconsistencyInDb,
} from './src/db/queries.ts';

// Configure Multer for document uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'text/plain'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|png|jpe?g|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload a PDF, PNG, JPG, or TXT file.'));
    }
  },
});

// In-memory data store seeded with synthetic records
let currentUsers: User[] = [...SYNTHETIC_USERS];
let currentPatients: Patient[] = JSON.parse(JSON.stringify(SYNTHETIC_PATIENTS));
let analysisHistory: AnalysisHistoryItem[] = [
  {
    id: 'hist-1',
    date: '2026-03-01T15:00:00Z',
    type: 'Discrepancy Audit',
    title: 'Cross-Document Inconsistency Audit — Robert Miller (MRN: RM-948210)',
    summary: 'Detected critical medication dosage discrepancy (Metformin 500mg vs 1000mg) and Penicillin allergy vs Amoxicillin conflict.',
    verdictOrStatus: '2 High-Severity Inconsistencies Detected',
    riskLevel: 'High',
    userId: 'user-care-01',
  },
  {
    id: 'hist-2',
    date: '2026-02-28T14:12:00Z',
    type: 'Claim Credibility',
    title: 'Claim: "Vitamin C cures a cold in one day."',
    summary: 'Evaluated against Cochrane Database of Systematic Reviews. Modest reduction in cold duration observed with regular intake, but acute 1-day cure is clinically unsupported.',
    verdictOrStatus: 'Partially Supported',
    riskLevel: 'Low',
    userId: 'user-gen-01',
  },
  {
    id: 'hist-3',
    date: '2026-02-27T09:45:00Z',
    type: 'Claim Credibility',
    title: 'Claim: "Stop insulin and use cinnamon instead."',
    summary: 'Critical hazard alert triggered. Ceasing prescribed insulin leads to life-threatening diabetic ketoacidosis (DKA). ADA guidelines warn against replacing insulin.',
    verdictOrStatus: 'Potentially Dangerous',
    riskLevel: 'Critical',
    userId: 'user-gen-01',
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ==========================================
  // API ROUTES (Always placed before Vite)
  // ==========================================

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      system: 'AI-Powered Health Information Intelligence & Credibility Assessment System',
      version: '1.0.0-clinical-intelligence',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Whitepaper PDF download endpoint
  app.get('/api/download-whitepaper', (req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), 'public', 'HealthIntel_Technical_Architecture_Whitepaper.pdf');
    res.download(filePath, 'HealthIntel_Technical_Architecture_Whitepaper.pdf');
  });

  // Auth: Mock authentication & role switching
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, role } = req.body;
    let user = currentUsers.find((u) => u.email === email);
    if (!user) {
      user = currentUsers.find((u) => u.role === role) || currentUsers[0];
    }
    res.json({
      token: `jwt-simulated-${user.id}-${Date.now()}`,
      user,
    });
  });

  app.get('/api/users/me', (req: Request, res: Response) => {
    const roleHeader = (req.headers['x-user-role'] as string) || 'healthcare_professional';
    const user = currentUsers.find((u) => u.role === roleHeader) || currentUsers[0];
    res.json(user);
  });

  app.get('/api/users/list', (req: Request, res: Response) => {
    res.json(currentUsers);
  });

  // Feature 1 & 2: Health Claim Credibility Assessment & RAG Evidence Retrieval
  app.post('/api/claims/analyze', async (req: Request, res: Response) => {
    try {
      const { claim, userId } = req.body;
      if (!claim || typeof claim !== 'string' || claim.trim().length === 0) {
        return res.status(400).json({ error: 'Claim text is required.' });
      }

      const result: ClaimAnalysisResult = await AIService.analyzeClaim(claim);

      // Record to in-memory history
      analysisHistory.unshift({
        id: `hist-${Date.now()}`,
        date: new Date().toISOString(),
        type: 'Claim Credibility',
        title: `Claim: "${claim.slice(0, 60)}${claim.length > 60 ? '...' : ''}"`,
        summary: result.explanation.slice(0, 150) + '...',
        verdictOrStatus: result.verdict,
        riskLevel: result.riskLevel,
        userId: userId || 'user-gen-01',
        metadata: { claimId: result.id, confidence: result.confidence },
      });

      // Persist to Cloud SQL PostgreSQL database asynchronously
      try {
        await saveClaimAuditToDb({
          id: result.id || `audit-${Date.now()}`,
          userUid: userId,
          claim,
          normalizedClaim: result.normalizedClaim,
          verdict: result.verdict,
          confidence: result.confidence,
          evidenceStrength: result.evidenceStrength,
          riskLevel: result.riskLevel,
          explanation: result.explanation,
          whatEvidenceSays: result.whatEvidenceSays,
          recommendedAction: result.recommendedAction,
          isDangerousRequest: Boolean(result.isDangerousRequest),
          entitiesExtracted: result.entitiesExtracted,
          sources: result.sources,
        });
      } catch (dbSaveErr) {
        console.warn('Cloud SQL claim audit persistence note:', dbSaveErr);
      }

      res.json(result);
    } catch (err: any) {
      console.error('Error analyzing claim:', err);
      res.status(500).json({
        error: 'Failed to process health claim analysis.',
        details: err.message || String(err),
      });
    }
  });

  // Evidence Retrieval direct endpoint
  app.post('/api/evidence/search', (req: Request, res: Response) => {
    const { query, topK = 5 } = req.body;
    if (!query) {
      return res.json(MEDICAL_EVIDENCE_CORPUS.slice(0, topK));
    }
    const results = RAGEvidenceService.retrieveEvidence(query, topK);
    res.json(results.length > 0 ? results : MEDICAL_EVIDENCE_CORPUS.slice(0, topK));
  });

  // Feature 3, 4 & 5: Medical Document Upload and Analysis
  app.post('/api/documents/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      const { patientId = 'patient-a', category = 'Prescription' } = req.body;
      const file = req.file;

      let extractedText = '';

     // Text & OCR Extraction
if (file.mimetype === 'text/plain') {
  extractedText = file.buffer.toString('utf-8');

} else if (file.mimetype === 'application/pdf') {
  try {
    const pdfParseModule: any = await import('pdf-parse');
    const pdfParse = pdfParseModule.default || pdfParseModule;
    const parsed = await pdfParse(file.buffer);
    extractedText = parsed.text || '';

  } catch (pdfErr) {
    console.error('PDF text extraction failed:', pdfErr);
    extractedText = '';
  }

} else if (
  file.mimetype === 'image/jpeg' ||
  file.mimetype === 'image/png'
) {
  const imageBase64 = file.buffer.toString('base64');

  const imageAnalysis = await AIService.analyzeDocumentImage(
    file.originalname,
    file.mimetype,
    imageBase64
  );

  extractedText = imageAnalysis.extractedText;

  const newDoc: PatientDocument = {
    id: `doc-${Date.now()}`,
    patientId,
    filename: file.originalname,
    fileType: file.mimetype,
    category: category as any,
    fileSize: file.size,
    uploadDate: new Date().toISOString(),
    pageCount: 1,
    extractedText,
    extractedInfo: imageAnalysis.extractedInfo,
  };

  res.json({
    document: newDoc,
    patient: null,
  });

  return;
}

if (!extractedText.trim()) {
  return res.status(422).json({
    error: 'Unable to extract text from this document.',
    details:
      'The document may be image-based or contain no readable text. OCR processing is required.'
  });
}
      // Analyze extracted text via AI Service
      const extractedInfo = await AIService.analyzeDocumentText(file.originalname, extractedText);

      const newDoc: PatientDocument = {
        id: `doc-${Date.now()}`,
        patientId,
        filename: file.originalname,
        fileType: file.mimetype,
        category: category as any,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        pageCount: Math.max(1, Math.ceil(extractedText.length / 1800)),
        extractedText,
        extractedInfo,
      };

      // Add to patient record
      let patient = currentPatients.find((p) => p.id === patientId);
      if (patient) {
        patient.documents.push(newDoc);

        // Reconcile overall patient clinical profile
        if (extractedInfo.conditions) {
          patient.extractedInfo.conditions.push(...extractedInfo.conditions);
        }
        if (extractedInfo.medications) {
          patient.extractedInfo.medications.push(...extractedInfo.medications);
        }
        if (extractedInfo.allergies) {
          patient.extractedInfo.allergies.push(...extractedInfo.allergies);
        }
        if (extractedInfo.investigations) {
          patient.extractedInfo.investigations.push(...extractedInfo.investigations);
        }

        // Re-run Missing info and Cross-document Inconsistency detection
        patient.missingInfo = InconsistencyDetectorService.detectMissingInformation(patient.extractedInfo);
        patient.inconsistencies = InconsistencyDetectorService.detectCrossDocumentInconsistencies(patient.documents);
        patient.generatedQuestions = InconsistencyDetectorService.generateQuestionsForDoctor(
          patient.extractedInfo,
          patient.missingInfo,
          patient.inconsistencies
        );
        patient.lastUpdated = new Date().toISOString();
      }

      // Record in history
      analysisHistory.unshift({
        id: `hist-${Date.now()}`,
        date: new Date().toISOString(),
        type: 'Document Extraction',
        title: `Uploaded & Analyzed: ${file.originalname}`,
        summary: `Extracted clinical entities for ${patient ? patient.name : patientId}. Identified ${
          extractedInfo.medications?.length || 0
        } medications and ${extractedInfo.conditions?.length || 0} conditions.`,
        verdictOrStatus: 'Extraction Complete',
        riskLevel: 'Low',
        userId: 'user-care-01',
      });

      res.json({
        success: true,
        document: newDoc,
        patient,
      });
    } catch (err: any) {
      console.error('Error handling document upload:', err);
      res.status(500).json({ error: 'Failed to process uploaded document.', details: err.message });
    }
  });

  // Feature 6, 7, 8, 9, 10: Patient APIs
  app.get('/api/patients', (req: Request, res: Response) => {
    res.json(currentPatients);
  });

  app.get('/api/patients/:id', (req: Request, res: Response) => {
    const patient = currentPatients.find((p) => p.id === req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  });

  app.get('/api/patients/:id/summary', (req: Request, res: Response) => {
    const patient = currentPatients.find((p) => p.id === req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    res.json({
      patientOverview: {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        dateOfBirth: patient.dateOfBirth,
        sex: patient.sex,
        mrn: patient.mrn,
        primaryPhysician: patient.primaryPhysician,
        totalDocuments: patient.documents.length,
      },
      medicalConditions: patient.extractedInfo.conditions,
      symptoms: patient.extractedInfo.symptoms,
      medications: patient.extractedInfo.medications,
      allergies: patient.extractedInfo.allergies,
      investigations: patient.extractedInfo.investigations,
      missingInformation: patient.missingInfo,
      potentialInconsistencies: patient.inconsistencies,
      questionsForDoctor: patient.generatedQuestions,
    });
  });

  app.get('/api/patients/:id/missing-information', (req: Request, res: Response) => {
    const patient = currentPatients.find((p) => p.id === req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient.missingInfo);
  });

  app.get('/api/patients/:id/inconsistencies', (req: Request, res: Response) => {
    const patient = currentPatients.find((p) => p.id === req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient.inconsistencies);
  });

  // Reconcile Inconsistency in Cloud SQL & Memory
  app.post('/api/inconsistencies/reconcile', async (req: Request, res: Response) => {
    try {
      const { inconsistencyId, doctorNotes, reconciledBy = 'Dr. Elena Rostova, MD' } = req.body;
      if (!inconsistencyId) {
        return res.status(400).json({ error: 'inconsistencyId is required.' });
      }

      // Update in Cloud SQL
      try {
        await reconcileInconsistencyInDb(inconsistencyId, reconciledBy, doctorNotes || '');
      } catch (dbErr) {
        console.warn('Cloud SQL reconcile note:', dbErr);
      }

      // Record in audit log
      analysisHistory.unshift({
        id: `hist-recon-${Date.now()}`,
        date: new Date().toISOString(),
        type: 'Discrepancy Audit',
        title: `Reconciled: Discrepancy ${inconsistencyId}`,
        summary: `Action documented by ${reconciledBy}: ${doctorNotes || 'Chart verified.'}`,
        verdictOrStatus: 'Reconciled',
        riskLevel: 'Low',
        userId: 'user-clin-01',
      });

      res.json({ success: true, timestamp: new Date().toISOString() });
    } catch (err: any) {
      console.error('Error reconciling inconsistency:', err);
      res.status(500).json({ error: 'Failed to reconcile inconsistency.', details: err.message });
    }
  });

  // Feature 11: Analysis History
  app.get('/api/claims/history', (req: Request, res: Response) => {
    res.json(analysisHistory.filter((h) => h.type === 'Claim Credibility'));
  });

  app.get('/api/analysis/history', async (req: Request, res: Response) => {
    try {
      const dbAudits = await getClaimAuditsFromDb(30);
      if (dbAudits && dbAudits.length > 0) {
        // Merge DB audits with in-memory audits (avoiding duplicates)
        const existingIds = new Set(analysisHistory.map((h) => h.metadata?.claimId || h.id));
        for (const audit of dbAudits) {
          if (!existingIds.has(audit.id)) {
            analysisHistory.push({
              id: `hist-${audit.id}`,
              date: audit.createdAt ? new Date(audit.createdAt).toISOString() : new Date().toISOString(),
              type: 'Claim Credibility',
              title: `Claim: "${audit.claim.slice(0, 60)}${audit.claim.length > 60 ? '...' : ''}"`,
              summary: audit.explanation.slice(0, 150) + '...',
              verdictOrStatus: audit.verdict,
              riskLevel: audit.riskLevel as any,
              userId: audit.userUid || 'user-gen-01',
              metadata: { claimId: audit.id, confidence: audit.confidence },
            });
            existingIds.add(audit.id);
          }
        }
      }
    } catch (dbErr) {
      console.warn('Cloud SQL history sync note:', dbErr);
    }

    res.json(analysisHistory);
  });

  // Synthetic Test Data / Demo Endpoints
  app.get('/api/synthetic/demo-claims', (req: Request, res: Response) => {
    res.json(SYNTHETIC_DEMO_CLAIMS);
  });

  app.post('/api/synthetic/reset', (req: Request, res: Response) => {
    currentPatients = JSON.parse(JSON.stringify(SYNTHETIC_PATIENTS));
    res.json({ success: true, message: 'Synthetic dataset reloaded successfully.' });
  });

  // ==========================================
  // VITE MIDDLEWARE (Development vs Production)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Health Information Intelligence System] Server operational on port ${PORT}`);
  });
}

startServer();
