import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const outputPath = path.join(process.cwd(), 'public', 'HealthIntel_Technical_Architecture_Whitepaper.pdf');

// Ensure output directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  info: {
    Title: 'AI-Powered Health Information Intelligence & Credibility Assessment System — Technical Architecture Whitepaper',
    Author: 'HealthIntel Clinical Engineering Team',
    Subject: 'System Architecture, Methodology, Scientific Principles, Hardware & Software Requirements',
    Keywords: 'Healthcare, Clinical NLP, RAG, PubMed, Gemini, Evidence-Based Medicine, Architecture, Technical Whitepaper',
  },
  bufferPages: true,
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Styling helpers
const primaryColor = '#0f172a'; // slate-900
const accentColor = '#0284c7';  // sky-600
const secondaryColor = '#334155'; // slate-700
const mutedColor = '#64748b';    // slate-500
const cardBg = '#f8fafc';        // slate-50

function addHeader(title: string, category: string = 'TECHNICAL WHITE PAPER & SYSTEM ARCHITECTURE') {
  doc.fontSize(8).fillColor(mutedColor).text(category.toUpperCase(), { align: 'left' });
  doc.moveDown(0.2);
  doc.fontSize(18).fillColor(primaryColor).font('Helvetica-Bold').text(title);
  doc.strokeColor(accentColor).lineWidth(1.5).moveTo(50, doc.y + 4).lineTo(545, doc.y + 4).stroke();
  doc.moveDown(0.8);
}

function addSectionTitle(title: string) {
  doc.moveDown(0.8);
  doc.fontSize(13).fillColor(accentColor).font('Helvetica-Bold').text(title);
  doc.moveDown(0.3);
}

function addSubsectionTitle(title: string) {
  doc.moveDown(0.5);
  doc.fontSize(10.5).fillColor(primaryColor).font('Helvetica-Bold').text(title);
  doc.moveDown(0.2);
}

function addParagraph(text: string) {
  doc.fontSize(9.5).fillColor(secondaryColor).font('Helvetica').text(text, {
    align: 'justify',
    lineGap: 2.5,
  });
  doc.moveDown(0.4);
}

function addBullet(label: string, description: string) {
  doc.fontSize(9).fillColor(primaryColor).font('Helvetica-Bold').text(`•  ${label}: `, { continued: true });
  doc.font('Helvetica').fillColor(secondaryColor).text(description, { lineGap: 2 });
  doc.moveDown(0.25);
}

// ==========================================
// PAGE 1: TITLE & EXECUTIVE SUMMARY
// ==========================================
addHeader('AI-Powered Health Information Intelligence & Clinical Credibility Assessment Platform', 'ARCHITECTURAL DESIGN & ENGINEERING SPECIFICATION');

addParagraph('HealthIntel is a full-stack, clinical-grade medical intelligence system engineered to combat online biomedical misinformation, analyze patient medical documents using high-fidelity multimodal OCR, perform cross-document conflict reconciliation, and synthesize evidence-based credibility audits with peer-reviewed literature grounded in live NCBI PubMed data and authoritative medical guidelines.');

addSectionTitle('1. Executive Summary & Project Mission');
addParagraph('The explosion of health misinformation on social networks and consumer web portals poses severe clinical risks, including fatal medication cessation (e.g., substituting insulin with unproven botanical remedies) and delay of standard oncology treatments. Current search engines and commercial LLMs frequently hallucinate references or fail to distinguish plant biology / agricultural studies from human clinical trials.');
addParagraph('HealthIntel addresses these vulnerabilities by establishing a dual-pillar clinical architecture: (1) An explainable, multi-factor Retrieval-Augmented Generation (RAG) pipeline connecting to both a curated golden medical corpus and real-time NCBI PubMed E-Utilities with rigorous semantic disambiguation, and (2) An OCR-enabled clinical document processing suite capable of detecting intra-document errors and cross-document dosage/allergy contraindications across a patient longitudinal record.');

addSectionTitle('2. System & Website Architecture');
addParagraph('The platform is built on an asynchronous, decoupled client-server architecture deployed on Google Cloud Run containerized infrastructure.');

addSubsectionTitle('2.1 High-Level Architectural Flow');
addBullet('Presentation Layer (React 19 SPA)', 'Client-side interface delivering responsive, multi-role dashboards (General User, Caregiver, Clinician/Auditor) with instant multi-step audit visualization.');
addBullet('Application Proxy & Orchestration Layer (Node.js & Express)', 'Server-side API hosting secure proxy endpoints, multipart file ingestion, buffer streaming, and integration with the @google/genai SDK without client-side API key exposure.');
addBullet('Live Medical Evidence Layer (NCBI Entrez E-Utilities)', 'Real-time REST retrieval engine invoking esearch.fcgi, esummary.fcgi, and efetch.fcgi to pull peer-reviewed PubMed citations and structured XML abstracts.');
addBullet('Clinical Intelligence & Multimodal OCR Layer (Gemini 3.8 Flash)', 'Vision-capable model deployed server-side for OCR extraction from scanned clinical documents, medical entity extraction (MeSH/RxNorm aligned), and structured synthesis generation.');
addBullet('Persistence Layer (Firestore & In-Memory Audit Cache)', 'Persistent audit logging, session state, patient medical profiles, and cross-document discrepancy trackers.');

// ==========================================
// PAGE 2: TECH STACK & METHODOLOGY
// ==========================================
doc.addPage();
addHeader('2. Technological Stack & Engineering Tools', 'TECHNICAL SPECIFICATION — LANGUAGES & TOOLS');

addSectionTitle('3. Programming Languages, Frameworks & Libraries');

addSubsectionTitle('3.1 Core Languages & Runtime');
addBullet('TypeScript (v5.8)', '100% strictly typed codebase ensuring complete end-to-end type safety for clinical entities, evidence structures, classification types, and API payloads.');
addBullet('Node.js (v22 LTS)', 'High-performance event-driven server runtime handling asynchronous streaming, multipart uploads, and live NCBI HTTP requests.');

addSubsectionTitle('3.2 Frontend Framework & UI Libraries');
addBullet('React 19', 'Modern functional component architecture utilizing custom hooks for pipeline tracking, optimistic updates, and reactive audit rendering.');
addBullet('Vite 6', 'Next-generation ES-module frontend build tool with instantaneous HMR and optimized tree-shaken production bundles.');
addBullet('Tailwind CSS (v4)', 'Zero-runtime utility CSS engine with customized clinical color palettes, accessibility compliance, and dark-mode support.');
addBullet('Lucide React', 'Consistent, medical-grade vector iconography for clinical indicators, risk badges, and audit statuses.');

addSubsectionTitle('3.3 Backend Framework & Utilities');
addBullet('Express (v4.21)', 'RESTful middleware routing, JSON request validation, and proxying.');
addBullet('Multer (v2.3)', 'In-memory buffer streaming for medical PDFs and images without disk latency.');
addBullet('pdf-parse (v2.4)', 'Server-side stream extraction of structured text from digital medical PDF files.');
addBullet('@google/genai SDK (v2.4)', 'Modern official Google Gen AI TypeScript SDK configured with Gemini 3.8 Flash for structured JSON extraction and multimodal vision OCR.');
addBullet('PDFKit', 'Server-side vector and document generation engine for whitepapers and clinical audit reports.');

addSectionTitle('4. Engineering Methodology & Processing Pipeline');
addParagraph('The platform follows an 8-stage explainable pipeline for claim analysis and a 4-stage pipeline for document discrepancy auditing:');
addBullet('Stage 1: User Claim Normalization', 'Input cleaning, stop-word elimination, and grammatical restructuring to extract core semantic poles (Intervention + Target Condition).');
addBullet('Stage 2: Clinical Entity Extraction', 'Identification of pharmacological compounds, anatomical targets, pathogen classes, and dosage instructions.');
addBullet('Stage 3: Evidence Retrieval via RAG', 'Simultaneous querying of the curated clinical guidelines corpus and real-time NCBI PubMed E-Utilities API.');
addBullet('Stage 4: Explainable Relevance Scoring', 'Execution of the proprietary 4-component scoring algorithm with agricultural/non-clinical penalty filters.');
addBullet('Stage 5: Evidence Quality Assessment', 'Grading evidence levels according to Oxford Centre for Evidence-Based Medicine (CEBM) hierarchy.');
addBullet('Stage 6: Claim vs. Evidence Comparison', 'Contrastive semantic evaluation determining alignment, exaggeration, omission, or dangerous conflict.');
addBullet('Stage 7: Clinical Risk Stratification', 'Scoring potential morbidity/mortality risk into Low, Medium, High, or Critical.');
addBullet('Stage 8: Explainable Synthesis Generation', 'Producing non-judgmental explanations, what biomedical consensus confirms, and actionable guidance.');

// ==========================================
// PAGE 3: SCIENTIFIC IDEAS & RELEVANCE ALGORITHM
// ==========================================
doc.addPage();
addHeader('3. Scientific Concepts & Algorithmic Design', 'BIOMEDICAL NLP & CLINICAL EVIDENCE RETRIEVAL');

addSectionTitle('5. Explainable Semantic Relevance Scoring Algorithm');
addParagraph('Standard search engines and generic BM25 / TF-IDF bag-of-words algorithms fail in medical search due to semantic polysemy (e.g., matching a postharvest agricultural paper about chilling injury in zucchini for "Vitamin C cures a cold" because of the words "cold", "day", and "vitamin").');
addParagraph('HealthIntel implements a deterministic, explainable scoring algorithm bounded strictly between 0.00 and 1.00:');

doc.moveDown(0.3);
doc.rect(50, doc.y, 495, 24).fillAndStroke(cardBg, accentColor);
doc.fontSize(9.5).fillColor(primaryColor).font('Helvetica-Bold')
  .text('FinalScore = min(1.0, max(0.0, (C1 + C2 + C3 + C4) - AgriculturalPenalty))', 60, doc.y - 18);
doc.moveDown(0.8);

addSubsectionTitle('5.1 The Four Component Weights (Total Base Score = 1.00)');
addBullet('Component 1: Multi-Word Phrase & Medical Entity Match (Weight = 0.35)', 'Preserves compound medical entities (e.g., "vitamin c", "common cold", "lemon water", "blood pressure") and prevents single-letter drops (keeping "C" in Vitamin C). Full 0.35 awarded when both intervention and target condition match as compound clinical entities.');
addBullet('Component 2: Field-Weighted Presence (Weight = 0.25)', 'Reflects primary research focus. Title matches carry 0.15 weight (strongest signal of primary study objective), while abstract body keyword density contributes 0.10.');
addBullet('Component 3: Term Co-occurrence & Proximity (Weight = 0.25)', 'Differentiates active clinical investigation from coincidental keyword mentions: (a) Same-Sentence Co-occurrence (0.15) awarded when intervention and condition appear in the exact same sentence; (b) 25-Token Proximity (0.10) awarded when terms co-occur within a 25-token sliding window across sentences.');
addBullet('Component 4: Clinical Domain & Evidence Tier (Weight = 0.15)', 'Awards 0.10 for documented human clinical trials, patient cohorts, or randomized controls, plus up to 0.05 tier bonus for Systematic Reviews, Cochrane Meta-Analyses, or Clinical Guidelines.');

addSubsectionTitle('5.2 The Agricultural & Non-Clinical Penalty (-0.40 Deduction)');
addParagraph('If document text contains agricultural, botanical, or postharvest markers (e.g., postharvest, seedling, cultivar, fruit storage, zucchini, chilling injury, crop) AND lacks human clinical subject markers (patients, clinical trial, human subjects), an immediate 0.40 penalty is deducted. This drives agricultural false-positives to 0.00 while preserving human clinical trials.');

addSectionTitle('6. Safe XML Article-by-Article Parsing');
addParagraph('To prevent abstract leakage where one paper\'s abstract bleeds into subsequent records, the XML parser isolates each <PubmedArticle> node as an independent atomic block before extracting the specific PMID and its nested <AbstractText> tags, ensuring zero cross-contamination.');

// ==========================================
// PAGE 4: OCR, INCONSISTENCY DETECTION & DATA PREPARATION
// ==========================================
doc.addPage();
addHeader('4. Multimodal OCR & Clinical Discrepancy Auditing', 'CLINICAL SAFETY & DATA WORKFLOW');

addSectionTitle('7. Document Ingestion, Multimodal OCR & Entity Extraction');
addParagraph('Medical records arrive in diverse formats: structured electronic PDFs, plain text clinic notes, and scanned prescription photos. HealthIntel handles all three modalities:');
addBullet('Digital PDF Parsing', 'Extracts embedded text streams, font structures, and tabular data via pdf-parse module in server memory.');
addBullet('Multimodal Vision OCR (Gemini 3.8 Flash)', 'Accepts Base64 image streams (JPEG, PNG). The multimodal model transcribes full visible text and simultaneously extracts structured medical entities including medication names, dosages, frequencies, routes, active conditions, documented allergies, and lab results.');
addBullet('Intra-Document Inconsistency Flagging', 'Identifies conflicting data within a single clinic document (e.g., a note stating "Patient denies chest pain" in the history section but documenting "Nitroglycerin prescribed for acute chest pain" in the discharge instructions).');

addSectionTitle('8. Cross-Document Longitudinal Inconsistency Detector');
addParagraph('When multiple documents are uploaded across a patient record, HealthIntel executes an automated cross-document discrepancy audit:');
addBullet('Medication Dosage Discrepancies', 'Identifies dosage conflicts across visits (e.g., Outpatient Prescription ordering Metformin 500mg daily vs. Hospital Discharge ordering Metformin 1000mg twice daily).');
addBullet('Severe Allergy Contraindications', 'Cross-checks documented patient allergies against active prescriptions (e.g., Patient documented with severe anaphylactic Penicillin allergy prescribed Amoxicillin-Clavulanate), triggering an immediate High-Severity Patient Hazard Alert.');
addBullet('Diagnostic & Treatment Plan Conflicts', 'Flags unaddressed findings between laboratory reports and subsequent clinical follow-up plans.');
addBullet('Doctor Question Generation', 'Automatically formulates specific, clarifying clinical questions that patients or caregivers can bring to their physician consultations.');

addSectionTitle('9. Data Preparation & Corpus Design');
addSubsectionTitle('9.1 Curated Medical Evidence Corpus');
addParagraph('A benchmark corpus of high-authority clinical evidence sources derived from Cochrane Systematic Reviews, National Cancer Institute (NCI), American Diabetes Association (ADA), American Heart Association (AHA), FDA Consumer Advisories, The Lancet, NEJM, and BMJ. Each entry includes verified DOIs, authority weights (0.90–1.00), and structured clinical takeaways.');

addSubsectionTitle('9.2 Synthetic Patient Longitudinal Records');
addParagraph('To enable rigorous verification without risking protected health information (PHI), the platform includes standardized synthetic scenarios (e.g., Patient Robert Miller, MRN RM-948210) with realistic clinical discrepancies designed to test contraindication detection algorithms.');

// ==========================================
// PAGE 5: REQUIREMENTS & VERIFICATION
// ==========================================
doc.addPage();
addHeader('5. Hardware/Software Requirements & Verification', 'SYSTEM REQUIREMENTS & SPECIFICATIONS');

addSectionTitle('10. Hardware Requirements');
addSubsectionTitle('10.1 Server / Deployment Environment');
addBullet('Processor (CPU)', 'Minimum 1 vCPU (2.0 GHz+ x86_64 or ARM64); 2 vCPUs recommended for concurrent multimodal OCR and PubMed parsing.');
addBullet('Random Access Memory (RAM)', 'Minimum 512 MB; 2.0 GB recommended for high-volume concurrent PDF parsing and buffer streaming.');
addBullet('Storage Disk', 'Stateless container architecture requiring < 500 MB disk space. No persistent local disk required.');
addBullet('Network Connectivity', 'High-speed outbound broadband connection (HTTPS port 443) for NCBI E-Utilities API calls and Google AI Studio Gemini API communication.');

addSubsectionTitle('10.2 Client-Side Device Requirements');
addBullet('Operating System', 'OS-agnostic: Windows 10/11, macOS 12+, Linux (Ubuntu, Fedora, Debian), iOS 15+, Android 12+.');
addBullet('Web Browser', 'Modern evergreen browser supporting ES2022 and HTML5: Google Chrome 110+, Mozilla Firefox 115+, Apple Safari 16+, Microsoft Edge 110+.');
addBullet('Hardware Specs', 'Any standard workstation, laptop, tablet, or smartphone with at least 2 GB system RAM and 1024x768 screen resolution.');

addSectionTitle('11. Software Requirements & Environment Configuration');
addBullet('Runtime Environment', 'Node.js 20.x or 22.x LTS with npm 10+ and tsx (TypeScript execution engine).');
addBullet('Environment Variables', 'GEMINI_API_KEY (Google AI Studio Gemini API Key), PORT (Default: 3000), NODE_ENV ("development" or "production").');
addBullet('Containerization', 'Docker / Cloud Run compliant container with node:22-slim base image.');

addSectionTitle('12. Test Verification & Empirical Results');
addParagraph('The platform has been rigorously tested across live benchmark health claims and complex document scenarios:');
addBullet('"Vitamin C cures a cold in one day"', 'Successfully rejected plant zucchini chilling injury study (Relevance: 0.00) while ranking peer-reviewed common-cold/Vitamin C clinical trial at 0.93 (93%).');
addBullet('"Drinking lemon water cures cancer"', 'Rejected rodent soft-drink sweetener study (Relevance: 0.12) while surfacing oncology dietary guidance (Relevance: 0.90).');
addBullet('"Garlic completely cures high blood pressure"', 'Downranked culinary roasting volatile chemistry study (Relevance: 0.11) while scoring human hypertension meta-analysis at 0.94 (94%).');
addBullet('Patient A Discrepancy Audit', 'Instantly detected 500mg vs 1000mg Metformin dosage conflict and triggered immediate Critical Hazard alert for Penicillin allergy vs. Amoxicillin prescription.');

doc.moveDown(1.5);
doc.fontSize(8.5).fillColor(mutedColor).text('Document Ref: HEALTHINTEL-ARCH-WP-2026-V1.0 • Prepared for Google AI Studio Cloud Build • Medical Intelligence Architecture', { align: 'center' });

// Add page numbers
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.fontSize(8).fillColor(mutedColor).text(
    `Page ${i + 1} of ${range.count}`,
    50,
    795,
    { align: 'right', width: 495 }
  );
}

doc.end();

writeStream.on('finish', () => {
  console.log('PDF successfully generated at:', outputPath);
});
