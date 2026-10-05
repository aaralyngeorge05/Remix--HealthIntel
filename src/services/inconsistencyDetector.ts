/**
 * Inconsistency and Missing Information Detection Service
 * Performs cross-document clinical reconciliation, discrepancy checks,
 * missing clinical data auditing, and doctor question synthesis.
 * Follows strict medical ethics: never says "The doctor is wrong" - uses
 * "Potential inconsistency detected. Please verify with a qualified healthcare professional."
 */

import {
  ExtractedMedicalInformation,
  GeneratedQuestionItem,
  InconsistencyItem,
  MissingInformationItem,
  PatientDocument,
} from '../types';

export class InconsistencyDetectorService {
  /**
   * Detects missing or incomplete medical information across patient records
   */
  public static detectMissingInformation(info: ExtractedMedicalInformation): MissingInformationItem[] {
    const missing: MissingInformationItem[] = [];

    // 1. Allergy History Audit
    if (!info.allergies || info.allergies.length === 0) {
      missing.push({
        id: 'miss-allergy',
        category: 'Allergy History',
        item: 'Allergy history not explicitly documented',
        severity: 'HIGH',
        rationale:
          'No documented allergy status found (NKDA or specific drug allergies). Administering antibiotics or new pharmacotherapy without verified allergy history presents acute hypersensitivity risk.',
        recommendedQuery: 'Are there any known drug, food, or latex allergies that should be formally recorded in the chart?',
      });
    }

    // 2. Medication Dosages Audit
    if (info.medications && info.medications.length > 0) {
      const missingDosageMeds = info.medications.filter(
        (m) => !m.dosage || m.dosage.includes('Not available') || m.dosage.trim() === ''
      );
      if (missingDosageMeds.length > 0) {
        missing.push({
          id: 'miss-dosage',
          category: 'Medication Regimen',
          item: `Dosage specification unavailable for: ${missingDosageMeds.map((m) => m.name).join(', ')}`,
          severity: 'HIGH',
          rationale:
            'A medication was noted without a verified strength or dose quantity, impeding safe administration and compliance tracking.',
          recommendedQuery: 'Could you please confirm the exact milligrams/strength and frequency intended for this medication?',
        });
      }
    } else {
      missing.push({
        id: 'miss-med-list',
        category: 'Medication Regimen',
        item: 'Current medication reconciliation unavailable',
        severity: 'MEDIUM',
        rationale: 'No baseline medication list identified in the provided documents.',
        recommendedQuery: 'What routine prescription or over-the-counter medications is the patient actively taking?',
      });
    }

    // 3. Symptom duration/onset
    if (info.symptoms && info.symptoms.length > 0) {
      const missingDuration = info.symptoms.filter((s) => !s.duration);
      if (missingDuration.length > 0) {
        missing.push({
          id: 'miss-symptom-duration',
          category: 'Symptomatology',
          item: `Symptom onset and duration unavailable for: ${missingDuration.map((s) => s.name).join(', ')}`,
          severity: 'MEDIUM',
          rationale:
            'Chronicity (acute vs subacute vs chronic) cannot be established without onset timelines, which informs differential diagnosis.',
          recommendedQuery: 'Approximately how many days or weeks have these symptoms been present?',
        });
      }
    }

    // 4. Follow-up instructions
    if (!info.followUp || info.followUp.length === 0) {
      missing.push({
        id: 'miss-followup',
        category: 'Care Plan',
        item: 'Explicit follow-up timeframe unavailable in records',
        severity: 'MEDIUM',
        rationale:
          'No scheduled re-evaluation interval was specified in the provided discharge or consultation documentation.',
        recommendedQuery: 'When is the recommended interval for the patient’s next clinical follow-up or lab check?',
      });
    }

    // 5. Baseline Demographics
    if (!info.dateOfBirth || info.dateOfBirth.includes('Not available')) {
      missing.push({
        id: 'miss-dob',
        category: 'Demographics',
        item: 'Date of birth unavailable in record headers',
        severity: 'LOW',
        rationale: 'Exact age calculations and pediatric/geriatric dosing adjustments benefit from verified birth date records.',
        recommendedQuery: 'Could the official date of birth be verified on the patient record?',
      });
    }

    return missing;
  }

  /**
   * Compares multiple documents for the same patient to find cross-document discrepancies
   */
  public static detectCrossDocumentInconsistencies(documents: PatientDocument[]): InconsistencyItem[] {
    const inconsistencies: InconsistencyItem[] = [];
    if (documents.length < 2) {
      return inconsistencies;
    }

    // A. Check for Medication Dosage Discrepancies across documents
    const medMap: Map<string, { doc: PatientDocument; dosage: string; text: string; page: number }[]> = new Map();

    for (const doc of documents) {
      const meds = doc.extractedInfo?.medications || [];
      for (const med of meds) {
        const normName = med.name.trim().toLowerCase();
        if (!medMap.has(normName)) {
          medMap.set(normName, []);
        }
        medMap.get(normName)!.push({
          doc,
          dosage: med.dosage,
          text: med.originalText || `${med.name} ${med.dosage}`,
          page: med.page || 1,
        });
      }
    }

    // Look for conflicting dosages for the same medication across different documents
    for (const [medName, instances] of medMap.entries()) {
      if (instances.length >= 2) {
        for (let i = 0; i < instances.length; i++) {
          for (let j = i + 1; j < instances.length; j++) {
            const instA = instances[i];
            const instB = instances[j];

            if (
              instA.doc.id !== instB.doc.id &&
              instA.dosage &&
              instB.dosage &&
              !instA.dosage.includes('Not available') &&
              !instB.dosage.includes('Not available') &&
              instA.dosage.trim().toLowerCase() !== instB.dosage.trim().toLowerCase()
            ) {
              inconsistencies.push({
                id: `incon-dosage-${medName}-${Date.now()}`,
                category: 'Dosage',
                title: `Potential medication dosage discrepancy detected for ${instA.text.split(' ')[0]}`,
                description: `Document "${instA.doc.filename}" lists ${instA.dosage}, whereas document "${instB.doc.filename}" lists ${instB.dosage}.`,
                severity: 'HIGH',
                sourceA: {
                  documentName: instA.doc.filename,
                  page: instA.page,
                  excerpt: instA.text,
                },
                sourceB: {
                  documentName: instB.doc.filename,
                  page: instB.page,
                  excerpt: instB.text,
                },
                verificationRecommendation:
                  'Potential dosage discrepancy detected. Please verify the active target dose and titration plan with the prescribing physician or pharmacist.',
              });
            }
          }
        }
      }
    }

    // B. Check for Allergy vs Prescribed Medication Conflict
    // Collect all documented allergies
    const allAllergies: { allergen: string; doc: PatientDocument; page: number; text: string }[] = [];
    for (const doc of documents) {
      const allergies = doc.extractedInfo?.allergies || [];
      for (const al of allergies) {
        allAllergies.push({
          allergen: al.allergen.toLowerCase(),
          doc,
          page: al.page || 1,
          text: al.originalText || al.allergen,
        });
      }
    }

    // Penicillin cross-reactivity check (Penicillin, Amoxicillin, Ampicillin, Augmentin, Piperacillin)
    const penAllergy = allAllergies.find((a) => a.allergen.includes('penicillin'));
    if (penAllergy) {
      for (const doc of documents) {
        const meds = doc.extractedInfo?.medications || [];
        for (const med of meds) {
          const medLower = med.name.toLowerCase();
          if (
            medLower.includes('amoxicillin') ||
            medLower.includes('augmentin') ||
            medLower.includes('penicillin') ||
            medLower.includes('ampicillin')
          ) {
            inconsistencies.push({
              id: `incon-allergy-conflict-${Date.now()}`,
              category: 'Allergy-Medication Conflict',
              title: 'Potential medication / documented allergy conflict detected',
              description: `Document "${penAllergy.doc.filename}" documents a Penicillin allergy, but document "${doc.filename}" contains a prescription for ${med.name}.`,
              severity: 'HIGH',
              sourceA: {
                documentName: penAllergy.doc.filename,
                page: penAllergy.page,
                excerpt: penAllergy.text,
              },
              sourceB: {
                documentName: doc.filename,
                page: med.page || 1,
                excerpt: med.originalText || `${med.name} ${med.dosage}`,
              },
              verificationRecommendation:
                'Critical allergy conflict alert: Verify cross-reactivity and confirm patient tolerance before dispensing or administering this antimicrobial agent.',
            });
          }
        }
      }
    }

    // C. Check for Demographic Inconsistencies (DOB, Age) across documents
    const docA = documents[0];
    const docB = documents[1];
    if (
      docA.extractedInfo?.dateOfBirth &&
      docB.extractedInfo?.dateOfBirth &&
      !docA.extractedInfo.dateOfBirth.includes('Not available') &&
      !docB.extractedInfo.dateOfBirth.includes('Not available') &&
      docA.extractedInfo.dateOfBirth.trim() !== docB.extractedInfo.dateOfBirth.trim()
    ) {
      inconsistencies.push({
        id: `incon-dob-${Date.now()}`,
        category: 'Demographic',
        title: 'Potential demographic date-of-birth inconsistency detected',
        description: `Document "${docA.filename}" records DOB as ${docA.extractedInfo.dateOfBirth}, while "${docB.filename}" records DOB as ${docB.extractedInfo.dateOfBirth}.`,
        severity: 'MEDIUM',
        sourceA: {
          documentName: docA.filename,
          page: 1,
          excerpt: `DOB: ${docA.extractedInfo.dateOfBirth}`,
        },
        sourceB: {
          documentName: docB.filename,
          page: 1,
          excerpt: `DOB: ${docB.extractedInfo.dateOfBirth}`,
        },
        verificationRecommendation:
          'Please verify the patient identification credentials with hospital registration records to avoid chart misattribution.',
      });
    }

    return inconsistencies;
  }

  /**
   * Synthesizes clinically structured questions for a patient or caregiver to present to their healthcare professional
   */
  public static generateQuestionsForDoctor(
    info: ExtractedMedicalInformation,
    missing: MissingInformationItem[],
    inconsistencies: InconsistencyItem[]
  ): GeneratedQuestionItem[] {
    const questions: GeneratedQuestionItem[] = [];

    // Questions from Inconsistencies (Highest Priority)
    for (const inc of inconsistencies) {
      if (inc.category === 'Dosage') {
        questions.push({
          id: `q-inc-dose-${Date.now()}-${questions.length}`,
          category: 'Medication Dosage',
          question: `There is a discrepancy in the records between ${inc.sourceA.excerpt} and ${inc.sourceB.excerpt}. Which dosage should be taken at this time?`,
          context: `Detected across ${inc.sourceA.documentName} and ${inc.sourceB.documentName}`,
          priority: 'HIGH',
        });
      } else if (inc.category === 'Allergy-Medication Conflict') {
        questions.push({
          id: `q-inc-allergy-${Date.now()}-${questions.length}`,
          category: 'Allergy Safety',
          question: `Given the documented allergy (${inc.sourceA.excerpt}), is the prescribed medication (${inc.sourceB.excerpt}) safe, or should an alternative be considered?`,
          context: `Allergy documented in ${inc.sourceA.documentName}`,
          priority: 'HIGH',
        });
      } else {
        questions.push({
          id: `q-inc-gen-${Date.now()}-${questions.length}`,
          category: 'Chart Consistency',
          question: `Could we please clarify the difference noted in the records regarding ${inc.title.toLowerCase()}?`,
          context: `Discrepancy noted between ${inc.sourceA.documentName} and ${inc.sourceB.documentName}`,
          priority: 'MEDIUM',
        });
      }
    }

    // Questions from Missing Information
    for (const item of missing) {
      if (item.severity === 'HIGH' || item.severity === 'MEDIUM') {
        questions.push({
          id: `q-miss-${item.id}-${Date.now()}`,
          category: item.category,
          question: item.recommendedQuery,
          context: item.rationale,
          priority: item.severity === 'HIGH' ? 'HIGH' : 'MEDIUM',
        });
      }
    }

    // Routine clinical safety questions
    if (info.medications && info.medications.length > 0) {
      questions.push({
        id: `q-med-purpose-${Date.now()}`,
        category: 'Medication Understanding',
        question: 'What are the main goals and potential common side effects of each current medication on this list?',
        context: 'Routine medication reconciliation and caregiver awareness',
        priority: 'ROUTINE',
      });
    }

    return questions;
  }
}
