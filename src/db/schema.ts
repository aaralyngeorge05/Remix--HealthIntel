import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Registered users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  role: text('role').notNull().default('general_user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Clinical Patients
export const patients = pgTable('patients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  mrn: text('mrn').notNull().unique(),
  dateOfBirth: text('date_of_birth').notNull(),
  sex: text('sex').notNull(),
  primaryPhysician: text('primary_physician').notNull(),
  allergies: text('allergies').notNull(), // JSON string array
  activeDiagnoses: text('active_diagnoses').notNull(), // JSON string array
  createdAt: timestamp('created_at').defaultNow(),
});

// Clinical Documents
export const documents = pgTable('documents', {
  id: text('id').primaryKey(),
  patientId: text('patient_id')
    .references(() => patients.id)
    .notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  uploadDate: text('upload_date').notNull(),
  status: text('status').notNull(),
  confidence: integer('confidence').notNull(),
  content: text('content').notNull(),
  extractedEntities: text('extracted_entities').notNull(), // JSON object
  createdAt: timestamp('created_at').defaultNow(),
});

// Cross-Document Inconsistencies & Reconciliation
export const inconsistencies = pgTable('inconsistencies', {
  id: text('id').primaryKey(),
  patientId: text('patient_id')
    .references(() => patients.id)
    .notNull(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  severity: text('severity').notNull(),
  description: text('description').notNull(),
  clinicalRisk: text('clinical_risk').notNull(),
  sourceA: text('source_a').notNull(), // JSON object
  sourceB: text('source_b').notNull(), // JSON object
  suggestedAction: text('suggested_action').notNull(),
  reconciled: integer('reconciled').notNull().default(0),
  reconciledAt: text('reconciled_at'),
  reconciledBy: text('reconciled_by'),
  reconciliationNote: text('reconciliation_note'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Health Claim Audits (History)
export const claimAudits = pgTable('claim_audits', {
  id: text('id').primaryKey(),
  userUid: text('user_uid'),
  claim: text('claim').notNull(),
  normalizedClaim: text('normalized_claim').notNull(),
  verdict: text('verdict').notNull(),
  confidence: integer('confidence').notNull(),
  evidenceStrength: text('evidence_strength').notNull(),
  riskLevel: text('risk_level').notNull(),
  explanation: text('explanation').notNull(),
  whatEvidenceSays: text('what_evidence_says').notNull(),
  recommendedAction: text('recommended_action').notNull(),
  isDangerousRequest: integer('is_dangerous_request').notNull().default(0),
  entitiesExtracted: text('entities_extracted').notNull(), // JSON array
  sources: text('sources').notNull(), // JSON array
  createdAt: timestamp('created_at').defaultNow(),
});
