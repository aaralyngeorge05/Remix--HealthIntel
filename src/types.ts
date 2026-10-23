/**
 * AI-Powered Health Information Intelligence & Credibility Assessment System
 * Shared Core TypeScript Interfaces and Types
 */

export type UserRole = 'general_user' | 'caregiver' | 'healthcare_professional';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution?: string;
  createdAt: string;
}

export type ClaimClassification =
  | 'Supported'
  | 'Partially Supported'
  | 'Misleading'
  | 'Unsupported'
  | 'False'
  | 'Insufficient Evidence'
  | 'Potentially Dangerous';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type EvidenceStrength = 'Low' | 'Moderate' | 'High' | 'Rigorous';

export interface EvidenceSource {
  id: string;
  title: string;
  organization: string;

  journal?: string;

  publicationDate: string;
  lastUpdated?: string;

  evidenceType:
    | 'Systematic Review'
    | 'Meta-Analysis'
    | 'Randomized Controlled Trial (RCT)'
    | 'Clinical Practice Guideline'
    | 'Observational Cohort Study'
    | 'Institutional Health Advisory'
    | 'Government Health Information'
    | 'Clinical Trial'
    | 'Patient Health Information';

  url: string;
  doi?: string;

  summary: string;

  topics?: string[];
  diseases?: string[];
  treatments?: string[];

  evidenceLevel?: string;

  sourceAuthority: number; // 0 to 1

  language: string;

  isPeerReviewed?: boolean;
  relevanceScore?: number;
}

export type MedicalEvidenceItem = EvidenceSource;

export interface ClaimAnalysisResult {
  id: string;
  claim: string;
  normalizedClaim: string;
  entitiesExtracted: string[];
  verdict: ClaimClassification;
  confidence: number; // e.g. 91%
  evidenceStrength: EvidenceStrength;
  riskLevel: RiskLevel;
  explanation: string;
  whatEvidenceSays: string;
  recommendedAction: string;
  sources: EvidenceSource[];
  isDangerousRequest?: boolean;
  timestamp: string;
  userId?: string;
}

export interface ClinicalItemSource {
  sourceDoc: string;
  page: number;
  originalText: string;
}

export interface ClinicalCondition extends ClinicalItemSource {
  id: string;
  name: string;
  status: 'Active' | 'Historical' | 'Suspected' | 'Resolved';
  onsetDate?: string;
}

export interface ClinicalSymptom extends ClinicalItemSource {
  id: string;
  name: string;
  severity?: 'Mild' | 'Moderate' | 'Severe';
  duration?: string;
}

export interface ClinicalMedication extends ClinicalItemSource {
  id: string;
  name: string;
  dosage: string;
  frequency?: string;
  route?: string;
  purpose?: string;
  status: 'Active' | 'Discontinued' | 'As Needed';
}

export interface ClinicalAllergy extends ClinicalItemSource {
  id: string;
  allergen: string;
  reaction?: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Anaphylactic' | 'Unknown';
}

export interface ClinicalInvestigation extends ClinicalItemSource {
  id: string;
  testName: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  flag?: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  testDate?: string;
}

export interface ClinicalProcedure extends ClinicalItemSource {
  id: string;
  name: string;
  date?: string;
  notes?: string;
}

export interface ExtractedMedicalInformation {
  patientName: string;
  age: string;
  dateOfBirth: string;
  sex: string;
  conditions: ClinicalCondition[];
  symptoms: ClinicalSymptom[];
  medications: ClinicalMedication[];
  allergies: ClinicalAllergy[];
  investigations: ClinicalInvestigation[];
  procedures: ClinicalProcedure[];
  followUp: {
    instructions: string;
    timeframe: string;
    sourceDoc: string;
    page: number;
    originalText: string;
  }[];
  inconsistencies?: {
  type: string;
  description: string;
  evidence: string;
  severity: 'Low' | 'Medium' | 'High';
}[];
}

export type DocumentCategory =
  | 'Medical History'
  | 'Prescription'
  | 'Blood Report'
  | 'Laboratory Report'
  | 'Discharge Summary'
  | 'Consultation Note'
  | 'Diagnostic Report'
  | 'Medication List';

export interface PatientDocument {
  id: string;
  patientId: string;
  filename: string;
  fileType: string;
  category: DocumentCategory;
  fileSize: number;
  uploadDate: string;
  pageCount: number;
  extractedText: string;
  extractedInfo: Partial<ExtractedMedicalInformation>;
}

export interface MissingInformationItem {
  id: string;
  category: string;
  item: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  rationale: string;
  recommendedQuery: string;
}

export interface InconsistencyItem {
  id: string;
  category:
    | 'Medication'
    | 'Dosage'
    | 'Allergy-Medication Conflict'
    | 'Demographic'
    | 'Laboratory'
    | 'Diagnostic';
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  sourceA: {
    documentName: string;
    page: number;
    excerpt: string;
  };
  sourceB: {
    documentName: string;
    page: number;
    excerpt: string;
  };
  verificationRecommendation: string;
}

export interface GeneratedQuestionItem {
  id: string;
  category: string;
  question: string;
  context: string;
  priority: 'HIGH' | 'MEDIUM' | 'ROUTINE';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  dateOfBirth: string;
  sex: string;
  mrn: string;
  assignedCaregiverId?: string;
  primaryPhysician: string;
  documents: PatientDocument[];
  extractedInfo: ExtractedMedicalInformation;
  missingInfo: MissingInformationItem[];
  inconsistencies: InconsistencyItem[];
  generatedQuestions: GeneratedQuestionItem[];
  lastUpdated: string;
}

export interface AnalysisHistoryItem {
  id: string;
  date: string;
  type: 'Claim Credibility' | 'Document Extraction' | 'Discrepancy Audit';
  title: string;
  summary: string;
  verdictOrStatus: string;
  riskLevel: RiskLevel;
  userId: string;
  metadata?: Record<string, any>;
}
