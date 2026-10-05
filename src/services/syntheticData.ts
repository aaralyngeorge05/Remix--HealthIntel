/**
 * Synthetic Test Data & Pre-loaded Clinical Scenarios
 * Used for rigorous clinical verification, automated unit tests, and live demonstrations.
 * Contains synthetic, non-identifiable clinical records with intentional controlled discrepancies.
 */

import { Patient, PatientDocument, User } from '../types';

export const SYNTHETIC_USERS: User[] = [
  {
    id: 'user-gen-01',
    name: 'Sarah Jenkins',
    email: 'user@healthintel.org',
    role: 'general_user',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'user-care-01',
    name: 'Michael Davis (Family Caregiver)',
    email: 'caregiver@healthintel.org',
    role: 'caregiver',
    createdAt: '2026-01-10T09:30:00Z',
  },
  {
    id: 'user-dr-01',
    name: 'Dr. Elena Rostova, MD, FACP',
    email: 'dr.rostova@clinicalcare.org',
    role: 'healthcare_professional',
    institution: 'Metropolitan Health System & Clinical Institute',
    createdAt: '2025-11-20T14:15:00Z',
  },
];

export const SYNTHETIC_DOCUMENTS_PATIENT_A: PatientDocument[] = [
  {
    id: 'doc-presc-001',
    patientId: 'patient-a',
    filename: 'Prescription_Outpatient_Clinic.pdf',
    fileType: 'application/pdf',
    category: 'Prescription',
    fileSize: 142800,
    uploadDate: '2026-02-10T10:00:00Z',
    pageCount: 2,
    extractedText: `CLINICAL PRESCRIPTION ORDER
Metropolitan Endocrinology Care
Date: February 10, 2026
Patient Name: Robert Miller
Age: 56
DOB: 1970-04-12
Sex: Male
MRN: RM-948210

Documented Allergies:
- Penicillin (History of severe urticaria/rash and bronchospasm)

Active Clinical Diagnosis:
- Type 2 Diabetes Mellitus (E11.9)
- Essential Hypertension (I10)

Prescribed Medications:
1. Metformin HCl
   Dosage: 500 mg
   Route: Oral
   Frequency: Twice daily with meals (BID)
   Quantity: 60 tablets
   Refills: 3

2. Lisinopril
   Dosage: 10 mg
   Route: Oral
   Frequency: Once daily in morning
   Quantity: 30 tablets

Physician: Dr. Marcus Vance, MD
License: MD-94821`,
    extractedInfo: {
      patientName: 'Robert Miller',
      age: '56',
      dateOfBirth: '1970-04-12',
      sex: 'Male',
      conditions: [
        {
          id: 'c1',
          name: 'Type 2 Diabetes Mellitus',
          status: 'Active',
          sourceDoc: 'Prescription_Outpatient_Clinic.pdf',
          page: 1,
          originalText: 'Type 2 Diabetes Mellitus (E11.9)',
        },
        {
          id: 'c2',
          name: 'Essential Hypertension',
          status: 'Active',
          sourceDoc: 'Prescription_Outpatient_Clinic.pdf',
          page: 1,
          originalText: 'Essential Hypertension (I10)',
        },
      ],
      medications: [
        {
          id: 'm1',
          name: 'Metformin HCl',
          dosage: '500 mg',
          frequency: 'Twice daily with meals',
          route: 'Oral',
          status: 'Active',
          sourceDoc: 'Prescription_Outpatient_Clinic.pdf',
          page: 1,
          originalText: 'Metformin HCl 500 mg Twice daily with meals',
        },
        {
          id: 'm2',
          name: 'Lisinopril',
          dosage: '10 mg',
          frequency: 'Once daily in morning',
          route: 'Oral',
          status: 'Active',
          sourceDoc: 'Prescription_Outpatient_Clinic.pdf',
          page: 1,
          originalText: 'Lisinopril 10 mg Once daily in morning',
        },
      ],
      allergies: [
        {
          id: 'a1',
          allergen: 'Penicillin',
          reaction: 'Severe urticaria/rash and bronchospasm',
          severity: 'Severe',
          sourceDoc: 'Prescription_Outpatient_Clinic.pdf',
          page: 1,
          originalText: 'Penicillin (History of severe urticaria/rash and bronchospasm)',
        },
      ],
      investigations: [],
      symptoms: [],
      procedures: [],
      followUp: [],
    },
  },
  {
    id: 'doc-disch-002',
    patientId: 'patient-a',
    filename: 'Hospital_Discharge_Summary.pdf',
    fileType: 'application/pdf',
    category: 'Discharge Summary',
    fileSize: 285400,
    uploadDate: '2026-03-01T14:30:00Z',
    pageCount: 4,
    extractedText: `HOSPITAL DISCHARGE SUMMARY
General Memorial Hospital - Acute Inpatient Services
Admission Date: February 26, 2026
Discharge Date: March 01, 2026
Patient Name: Robert Miller
Age: 56
DOB: 1970-04-12
Sex: Male
MRN: RM-948210

Discharge Diagnosis:
- Acute Bronchitis
- Type 2 Diabetes Mellitus (Uncontrolled at admission)

Hospital Course:
Patient presented with productive cough and mild pyrexia. Glycemic levels were elevated on admission (FBG 240 mg/dL). Medication regimen was reviewed.

Discharge Medications:
1. Metformin HCl
   Dosage: 1000 mg
   Frequency: Twice daily with meals (Titrated upward during admission)
   Route: Oral

2. Amoxicillin-Clavulanate (Augmentin)
   Dosage: 875/125 mg
   Frequency: Every 12 hours for 7 days
   Route: Oral

Follow-up Plan:
Follow up with primary care physician within 7-10 days for repeat metabolic panel.`,
    extractedInfo: {
      patientName: 'Robert Miller',
      age: '56',
      dateOfBirth: '1970-04-12',
      sex: 'Male',
      conditions: [
        {
          id: 'c3',
          name: 'Acute Bronchitis',
          status: 'Active',
          sourceDoc: 'Hospital_Discharge_Summary.pdf',
          page: 1,
          originalText: 'Acute Bronchitis',
        },
        {
          id: 'c4',
          name: 'Type 2 Diabetes Mellitus',
          status: 'Active',
          sourceDoc: 'Hospital_Discharge_Summary.pdf',
          page: 1,
          originalText: 'Type 2 Diabetes Mellitus (Uncontrolled at admission)',
        },
      ],
      medications: [
        {
          id: 'm3',
          name: 'Metformin HCl',
          dosage: '1000 mg',
          frequency: 'Twice daily with meals',
          route: 'Oral',
          status: 'Active',
          sourceDoc: 'Hospital_Discharge_Summary.pdf',
          page: 2,
          originalText: 'Metformin HCl 1000 mg Twice daily with meals',
        },
        {
          id: 'm4',
          name: 'Amoxicillin-Clavulanate (Augmentin)',
          dosage: '875/125 mg',
          frequency: 'Every 12 hours for 7 days',
          route: 'Oral',
          status: 'Active',
          sourceDoc: 'Hospital_Discharge_Summary.pdf',
          page: 2,
          originalText: 'Amoxicillin-Clavulanate 875/125 mg Every 12 hours',
        },
      ],
      allergies: [], // Notice allergy was omitted on discharge summary (Missing Info trigger!)
      investigations: [
        {
          id: 'inv-1',
          testName: 'Fasting Blood Glucose',
          result: '240',
          unit: 'mg/dL',
          referenceRange: '70-99 mg/dL',
          flag: 'HIGH',
          sourceDoc: 'Hospital_Discharge_Summary.pdf',
          page: 1,
          originalText: 'FBG 240 mg/dL',
        },
      ],
      symptoms: [
        {
          id: 'sym-1',
          name: 'Productive Cough & Pyrexia',
          severity: 'Moderate',
          sourceDoc: 'Hospital_Discharge_Summary.pdf',
          page: 1,
          originalText: 'Productive cough and mild pyrexia',
        },
      ],
      procedures: [],
      followUp: [
        {
          instructions: 'Follow up with primary care physician for repeat metabolic panel',
          timeframe: '7-10 days',
          sourceDoc: 'Hospital_Discharge_Summary.pdf',
          page: 3,
          originalText: 'Follow up with primary care physician within 7-10 days for repeat metabolic panel',
        },
      ],
    },
  },
  {
    id: 'doc-lab-003',
    patientId: 'patient-a',
    filename: 'Diagnostic_Blood_Chemistry_Panel.pdf',
    fileType: 'application/pdf',
    category: 'Laboratory Report',
    fileSize: 198200,
    uploadDate: '2026-02-27T08:15:00Z',
    pageCount: 2,
    extractedText: `ACCU-PATH CLINICAL REFERENCE LABORATORIES
Comprehensive Metabolic Panel & Lipid Profile
Patient: Robert Miller
Age: 56
Sex: Male
Collection Date: 2026-02-26

TEST RESULTS:
HbA1c: 8.6 % (Reference: < 5.7%) [HIGH]
Estimated Average Glucose: 200 mg/dL [HIGH]
Serum Creatinine: 1.1 mg/dL (Reference: 0.7 - 1.3 mg/dL) [NORMAL]
eGFR: 84 mL/min/1.73m2 (Reference: > 60 mL/min) [NORMAL]
Total Cholesterol: 218 mg/dL (Reference: < 200 mg/dL) [HIGH]
LDL Cholesterol: 138 mg/dL (Reference: < 100 mg/dL) [HIGH]
HDL Cholesterol: 42 mg/dL (Reference: > 40 mg/dL) [NORMAL]
Triglycerides: 190 mg/dL (Reference: < 150 mg/dL) [HIGH]

Comments: Poor glycemic control. Elevated cardiovascular lipid risk indicators.`,
    extractedInfo: {
      patientName: 'Robert Miller',
      age: '56',
      dateOfBirth: '1970-04-12',
      sex: 'Male',
      conditions: [],
      medications: [],
      allergies: [],
      investigations: [
        {
          id: 'inv-hba1c',
          testName: 'HbA1c',
          result: '8.6',
          unit: '%',
          referenceRange: '< 5.7%',
          flag: 'HIGH',
          sourceDoc: 'Diagnostic_Blood_Chemistry_Panel.pdf',
          page: 1,
          originalText: 'HbA1c: 8.6 % [HIGH]',
        },
        {
          id: 'inv-creat',
          testName: 'Serum Creatinine',
          result: '1.1',
          unit: 'mg/dL',
          referenceRange: '0.7 - 1.3 mg/dL',
          flag: 'NORMAL',
          sourceDoc: 'Diagnostic_Blood_Chemistry_Panel.pdf',
          page: 1,
          originalText: 'Serum Creatinine: 1.1 mg/dL [NORMAL]',
        },
        {
          id: 'inv-chol',
          testName: 'Total Cholesterol',
          result: '218',
          unit: 'mg/dL',
          referenceRange: '< 200 mg/dL',
          flag: 'HIGH',
          sourceDoc: 'Diagnostic_Blood_Chemistry_Panel.pdf',
          page: 1,
          originalText: 'Total Cholesterol: 218 mg/dL [HIGH]',
        },
      ],
      symptoms: [],
      procedures: [],
      followUp: [],
    },
  },
];

export const SYNTHETIC_PATIENTS: Patient[] = [
  {
    id: 'patient-a',
    name: 'Robert Miller',
    age: 56,
    dateOfBirth: '1970-04-12',
    sex: 'Male',
    mrn: 'RM-948210',
    assignedCaregiverId: 'user-care-01',
    primaryPhysician: 'Dr. Marcus Vance, MD (Metropolitan Care)',
    documents: SYNTHETIC_DOCUMENTS_PATIENT_A,
    extractedInfo: {
      patientName: 'Robert Miller',
      age: '56',
      dateOfBirth: '1970-04-12',
      sex: 'Male',
      conditions: [
        {
          id: 'c1',
          name: 'Type 2 Diabetes Mellitus',
          status: 'Active',
          sourceDoc: 'Prescription_Outpatient_Clinic.pdf',
          page: 1,
          originalText: 'Type 2 Diabetes Mellitus (E11.9)',
        },
        {
          id: 'c2',
          name: 'Essential Hypertension',
          status: 'Active',
          sourceDoc: 'Prescription_Outpatient_Clinic.pdf',
          page: 1,
          originalText: 'Essential Hypertension (I10)',
        },
        {
          id: 'c3',
          name: 'Acute Bronchitis',
          status: 'Active',
          sourceDoc: 'Hospital_Discharge_Summary.pdf',
          page: 1,
          originalText: 'Acute Bronchitis',
        },
      ],
      symptoms: [
        {
          id: 'sym-1',
          name: 'Productive Cough & Pyrexia',
          severity: 'Moderate',
          duration: '3 days',
          sourceDoc: 'Hospital_Discharge_Summary.pdf',
          page: 1,
          originalText: 'Productive cough and mild pyrexia',
        },
      ],
      medications: [
        {
          id: 'm1',
          name: 'Metformin HCl',
          dosage: '500 mg (Clinic) / 1000 mg (Discharge)',
          frequency: 'Twice daily',
          route: 'Oral',
          purpose: 'Glycemic management',
          status: 'Active',
          sourceDoc: 'Hospital_Discharge_Summary.pdf & Prescription_Outpatient_Clinic.pdf',
          page: 1,
          originalText: 'Metformin 500 mg vs 1000 mg',
        },
        {
          id: 'm2',
          name: 'Lisinopril',
          dosage: '10 mg',
          frequency: 'Once daily',
          route: 'Oral',
          purpose: 'Blood pressure control',
          status: 'Active',
          sourceDoc: 'Prescription_Outpatient_Clinic.pdf',
          page: 1,
          originalText: 'Lisinopril 10 mg Once daily',
        },
        {
          id: 'm4',
          name: 'Amoxicillin-Clavulanate (Augmentin)',
          dosage: '875/125 mg',
          frequency: 'Every 12 hours for 7 days',
          route: 'Oral',
          purpose: 'Antimicrobial',
          status: 'Active',
          sourceDoc: 'Hospital_Discharge_Summary.pdf',
          page: 2,
          originalText: 'Amoxicillin-Clavulanate 875/125 mg',
        },
      ],
      allergies: [
        {
          id: 'a1',
          allergen: 'Penicillin',
          reaction: 'Severe urticaria, rash, and bronchospasm',
          severity: 'Severe',
          sourceDoc: 'Prescription_Outpatient_Clinic.pdf',
          page: 1,
          originalText: 'Penicillin (History of severe urticaria/rash and bronchospasm)',
        },
      ],
      investigations: [
        {
          id: 'inv-hba1c',
          testName: 'HbA1c',
          result: '8.6',
          unit: '%',
          referenceRange: '< 5.7%',
          flag: 'HIGH',
          testDate: '2026-02-26',
          sourceDoc: 'Diagnostic_Blood_Chemistry_Panel.pdf',
          page: 1,
          originalText: 'HbA1c: 8.6 % [HIGH]',
        },
        {
          id: 'inv-creat',
          testName: 'Serum Creatinine',
          result: '1.1',
          unit: 'mg/dL',
          referenceRange: '0.7 - 1.3 mg/dL',
          flag: 'NORMAL',
          testDate: '2026-02-26',
          sourceDoc: 'Diagnostic_Blood_Chemistry_Panel.pdf',
          page: 1,
          originalText: 'Serum Creatinine: 1.1 mg/dL [NORMAL]',
        },
        {
          id: 'inv-chol',
          testName: 'Total Cholesterol',
          result: '218',
          unit: 'mg/dL',
          referenceRange: '< 200 mg/dL',
          flag: 'HIGH',
          testDate: '2026-02-26',
          sourceDoc: 'Diagnostic_Blood_Chemistry_Panel.pdf',
          page: 1,
          originalText: 'Total Cholesterol: 218 mg/dL [HIGH]',
        },
      ],
      procedures: [],
      followUp: [
        {
          instructions: 'Repeat basic metabolic panel and primary care consultation',
          timeframe: 'Within 7-10 days',
          sourceDoc: 'Hospital_Discharge_Summary.pdf',
          page: 3,
          originalText: 'Follow up with primary care physician within 7-10 days',
        },
      ],
    },
    missingInfo: [
      {
        id: 'miss-allergy-reconciliation',
        category: 'Inpatient Documentation',
        item: 'Allergy history omitted on Hospital Discharge Summary',
        severity: 'HIGH',
        rationale:
          'While the outpatient prescription clearly documents Penicillin allergy, the discharge summary lacks any allergy reconciliation section, leading to unsafe prescription of Amoxicillin-Clavulanate.',
        recommendedQuery: 'Can the hospital discharge record be amended to record the documented Penicillin allergy?',
      },
      {
        id: 'miss-lipid-plan',
        category: 'Cardiovascular Prophylaxis',
        item: 'Statin management plan not documented despite elevated LDL and diabetes',
        severity: 'MEDIUM',
        rationale:
          'ADA guidelines recommend moderate to high-intensity statin therapy for diabetic patients age 40-75 with LDL > 100 mg/dL.',
        recommendedQuery: 'Should a lipid-lowering statin (e.g. Atorvastatin) be evaluated given the elevated LDL and diabetic profile?',
      },
    ],
    inconsistencies: [
      {
        id: 'incon-1',
        category: 'Dosage',
        title: 'Potential medication dosage discrepancy detected for Metformin HCl',
        description:
          'Prescription_Outpatient_Clinic.pdf records Metformin 500 mg BID, whereas Hospital_Discharge_Summary.pdf prescribes Metformin 1000 mg BID.',
        severity: 'HIGH',
        sourceA: {
          documentName: 'Prescription_Outpatient_Clinic.pdf',
          page: 1,
          excerpt: 'Metformin HCl 500 mg Twice daily with meals',
        },
        sourceB: {
          documentName: 'Hospital_Discharge_Summary.pdf',
          page: 2,
          excerpt: 'Metformin HCl 1000 mg Twice daily with meals',
        },
        verificationRecommendation:
          'Potential dosage discrepancy detected. Please verify with the attending physician whether the dose was intentionally titrated up to 1000 mg BID due to inpatient hyperglycemia or if 500 mg BID remains the maintenance dose.',
      },
      {
        id: 'incon-2',
        category: 'Allergy-Medication Conflict',
        title: 'Potential medication / documented allergy conflict detected',
        description:
          'Prescription_Outpatient_Clinic.pdf documents a known Penicillin allergy with history of bronchospasm, but Hospital_Discharge_Summary.pdf prescribes Amoxicillin-Clavulanate 875/125 mg (a penicillin-class beta-lactam).',
        severity: 'HIGH',
        sourceA: {
          documentName: 'Prescription_Outpatient_Clinic.pdf',
          page: 1,
          excerpt: 'Penicillin (History of severe urticaria/rash and bronchospasm)',
        },
        sourceB: {
          documentName: 'Hospital_Discharge_Summary.pdf',
          page: 2,
          excerpt: 'Amoxicillin-Clavulanate 875/125 mg Every 12 hours for 7 days',
        },
        verificationRecommendation:
          'Critical allergy conflict alert: Amoxicillin is a penicillin derivative with high cross-reactivity. Do not administer until prescribing physician or clinical pharmacist reviews allergy chart to select a non-beta-lactam alternative (e.g. Azithromycin, Doxycycline, or Levofloxacin).',
      },
    ],
    generatedQuestions: [
      {
        id: 'q-1',
        category: 'Medication Safety',
        question:
          'Prescription lists Metformin at 500 mg twice daily, but discharge summary states 1000 mg twice daily. What is the verified target dosage to continue at home?',
        context: 'Discrepancy between outpatient clinic prescription and hospital discharge summary',
        priority: 'HIGH',
      },
      {
        id: 'q-2',
        category: 'Allergy Contraindication',
        question:
          'Patient has a documented severe allergy to Penicillin. Is Amoxicillin-Clavulanate safe, or should an alternative non-penicillin antibiotic be substituted?',
        context: 'Prescription lists Penicillin allergy; discharge summary prescribes penicillin-derivative Amoxicillin',
        priority: 'HIGH',
      },
      {
        id: 'q-3',
        category: 'Laboratory Follow-up',
        question:
          'HbA1c was elevated at 8.6% on February 26. When should repeat testing or glycemic adjustment be scheduled?',
        context: 'Accu-Path Lab Panel shows uncontrolled diabetic indicator (8.6%)',
        priority: 'MEDIUM',
      },
    ],
    lastUpdated: '2026-03-01T15:00:00Z',
  },
  {
    id: 'patient-b',
    name: 'Eleanor Campbell',
    age: 71,
    dateOfBirth: '1955-09-23',
    sex: 'Female',
    mrn: 'EC-718293',
    assignedCaregiverId: 'user-care-01',
    primaryPhysician: 'Dr. Anita Patel, MD',
    documents: [],
    extractedInfo: {
      patientName: 'Eleanor Campbell',
      age: '71',
      dateOfBirth: '1955-09-23',
      sex: 'Female',
      conditions: [
        {
          id: 'cb1',
          name: 'Osteoarthritis (Bilateral Knees)',
          status: 'Active',
          sourceDoc: 'Rheumatology_Consult.pdf',
          page: 1,
          originalText: 'Osteoarthritis',
        },
        {
          id: 'cb2',
          name: 'Atrial Fibrillation',
          status: 'Active',
          sourceDoc: 'Cardiology_Note.pdf',
          page: 1,
          originalText: 'Non-valvular Atrial Fibrillation',
        },
      ],
      symptoms: [],
      medications: [
        {
          id: 'mb1',
          name: 'Apixaban (Eliquis)',
          dosage: '5 mg',
          frequency: 'Twice daily',
          route: 'Oral',
          purpose: 'Stroke prevention in Afib',
          status: 'Active',
          sourceDoc: 'Cardiology_Note.pdf',
          page: 1,
          originalText: 'Apixaban 5 mg BID',
        },
      ],
      allergies: [
        {
          id: 'ab1',
          allergen: 'Sulfa Drugs',
          reaction: 'Maculopapular rash',
          severity: 'Moderate',
          sourceDoc: 'Chart_Intake.pdf',
          page: 1,
          originalText: 'Sulfa',
        },
      ],
      investigations: [],
      procedures: [],
      followUp: [],
    },
    missingInfo: [
      {
        id: 'miss-ec-creatinine',
        category: 'Renal Safety',
        item: 'Serum Creatinine / Renal Clearance not documented within the past 6 months',
        severity: 'HIGH',
        rationale: 'Apixaban dosing requires periodic monitoring of renal function, especially in geriatric patients > 70 years.',
        recommendedQuery: 'Could a basic metabolic panel be ordered to check serum creatinine for oral anticoagulant dosing safety?',
      },
    ],
    inconsistencies: [],
    generatedQuestions: [
      {
        id: 'q-ec-1',
        category: 'Anticoagulant Safety',
        question:
          'When is the next scheduled renal function test to ensure Eliquis dosage remains appropriate for patient age and kidney function?',
        context: 'Patient on direct oral anticoagulant without recent creatinine record',
        priority: 'HIGH',
      },
    ],
    lastUpdated: '2026-02-18T11:20:00Z',
  },
];

export const SYNTHETIC_DEMO_CLAIMS = [
  {
    title: 'Vitamin C & Cold Duration',
    claim: 'Vitamin C cures a cold in one day.',
    category: 'Misinformation / Exaggeration',
    expectedVerdict: 'Partially Supported',
  },
  {
    title: 'Lemon Water & Malignancy',
    claim: 'Drinking lemon water cures cancer.',
    category: 'Unproven Alternative Cancer Therapy',
    expectedVerdict: 'Misleading',
  },
  {
    title: 'Insulin Cessation Hazard',
    claim: 'Stop insulin and use cinnamon instead.',
    category: 'Critical Patient Hazard',
    expectedVerdict: 'Potentially Dangerous',
  },
  {
    title: 'Garlic & Hypertension',
    claim: 'Garlic completely cures high blood pressure.',
    category: 'Cardiovascular Misinformation',
    expectedVerdict: 'Misleading',
  },
  {
    title: 'Vaccine Misinformation',
    claim: 'Childhood vaccines cause autism spectrum disorders.',
    category: 'Debunked Misinformation',
    expectedVerdict: 'False',
  },
  {
    title: 'Colloidal Silver Ingestion',
    claim: 'Colloidal silver safely cures internal bacterial and viral infections.',
    category: 'Toxic Ingestion / Heavy Metal Hazard',
    expectedVerdict: 'Potentially Dangerous',
  },
];
