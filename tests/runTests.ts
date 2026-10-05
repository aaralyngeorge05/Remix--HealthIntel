/**
 * Automated Verification & Academic Capstone Test Suite
 * Tests core components: RAG retrieval, inconsistency detection,
 * missing information auditing, dangerous claim interception, and doctor question synthesis.
 */

import { InconsistencyDetectorService } from '../src/services/inconsistencyDetector';
import { RAGEvidenceService } from '../src/services/ragEvidenceService';
import { AIService } from '../src/services/aiService';
import { SYNTHETIC_DOCUMENTS_PATIENT_A, SYNTHETIC_PATIENTS } from '../src/services/syntheticData';
import { ExtractedMedicalInformation } from '../src/types';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
  }
}

async function runAllTests() {
  console.log('\n=============================================================');
  console.log('  CLINICAL AI INTELLIGENCE SYSTEM — CAPSTONE TEST SUITE');
  console.log('=============================================================\n');

  // -------------------------------------------------------------
  // SUITE 1: RAG Retrieval & Knowledge Grounding
  // -------------------------------------------------------------
  console.log('▶ [Suite 1] RAG Evidence Retrieval & Grounding:');

  const vitCResults = RAGEvidenceService.retrieveEvidence('Vitamin C common cold', 3);
  assert(
    vitCResults.length > 0 && vitCResults[0].id.includes('vitc'),
    'Retrieves Cochrane Vitamin C systematic review for cold query'
  );

  const insulinResults = RAGEvidenceService.retrieveEvidence('insulin cinnamon diabetes', 3);
  assert(
    insulinResults.length > 0 && insulinResults[0].organization.includes('Diabetes'),
    'Retrieves ADA guideline for insulin and cinnamon query'
  );

  const lemonResults = RAGEvidenceService.retrieveEvidence('lemon water cancer', 3);
  assert(
    lemonResults.length > 0 && lemonResults[0].title.toLowerCase().includes('cancer'),
    'Retrieves National Cancer Institute guidance for cancer query'
  );

  // -------------------------------------------------------------
  // SUITE 2: Cross-Document Inconsistency Detection (Feature 8)
  // -------------------------------------------------------------
  console.log('\n▶ [Suite 2] Cross-Document Inconsistency Detection:');

  const inconsistencies = InconsistencyDetectorService.detectCrossDocumentInconsistencies(
    SYNTHETIC_DOCUMENTS_PATIENT_A
  );

  const dosageInconsistency = inconsistencies.find((i) => i.category === 'Dosage');
  assert(
    Boolean(dosageInconsistency),
    'Detects medication dosage discrepancy between Clinic (500mg) and Discharge (1000mg)',
    JSON.stringify(dosageInconsistency)
  );

  assert(
    dosageInconsistency?.sourceA.documentName.includes('Prescription') &&
      dosageInconsistency?.sourceB.documentName.includes('Discharge'),
    'Maps side-by-side sources correctly (Prescription vs Discharge)'
  );

  const allergyConflict = inconsistencies.find((i) => i.category === 'Allergy-Medication Conflict');
  assert(
    Boolean(allergyConflict),
    'Detects critical Penicillin allergy vs Amoxicillin-Clavulanate contraindication'
  );

  assert(
    allergyConflict?.severity === 'HIGH',
    'Assigns HIGH severity to acute penicillin cross-reactivity conflict'
  );

  // -------------------------------------------------------------
  // SUITE 3: Clinical Missing Information Audit (Feature 7)
  // -------------------------------------------------------------
  console.log('\n▶ [Suite 3] Missing Information Detection:');

  const incompleteRecord: ExtractedMedicalInformation = {
    patientName: 'John Doe',
    age: '62',
    dateOfBirth: 'Not available in header',
    sex: 'Male',
    conditions: [{ id: '1', name: 'Hypertension', status: 'Active', sourceDoc: 'note.pdf', page: 1, originalText: 'HTN' }],
    symptoms: [{ id: '1', name: 'Dizziness', sourceDoc: 'note.pdf', page: 1, originalText: 'Dizzy' }], // Missing duration
    medications: [{ id: '1', name: 'Amlodipine', dosage: '', status: 'Active', sourceDoc: 'note.pdf', page: 1, originalText: 'Amlodipine' }], // Missing dosage
    allergies: [], // Missing allergy history
    investigations: [],
    procedures: [],
    followUp: [], // Missing follow-up
  };

  const missingItems = InconsistencyDetectorService.detectMissingInformation(incompleteRecord);

  const missingAllergy = missingItems.find((m) => m.category === 'Allergy History');
  assert(
    Boolean(missingAllergy && missingAllergy.severity === 'HIGH'),
    'Flags undocumented allergy status as HIGH severity missing item'
  );

  const missingDosage = missingItems.find((m) => m.category === 'Medication Regimen');
  assert(
    Boolean(missingDosage && missingDosage.severity === 'HIGH'),
    'Flags unspecified medication dosage as HIGH severity'
  );

  const missingFollowUp = missingItems.find((m) => m.category === 'Care Plan');
  assert(
    Boolean(missingFollowUp && missingFollowUp.severity === 'MEDIUM'),
    'Flags omitted follow-up interval as MEDIUM severity'
  );

  // -------------------------------------------------------------
  // SUITE 4: Doctor Questions Synthesis (Feature 9)
  // -------------------------------------------------------------
  console.log('\n▶ [Suite 4] Questions for Healthcare Professional:');

  const generatedQuestions = InconsistencyDetectorService.generateQuestionsForDoctor(
    incompleteRecord,
    missingItems,
    inconsistencies
  );

  assert(
    generatedQuestions.length >= 3,
    `Synthesizes actionable questions for doctor visit (generated ${generatedQuestions.length})`
  );

  const dosageQuestion = generatedQuestions.find((q) => q.category === 'Medication Dosage');
  assert(
    Boolean(dosageQuestion && dosageQuestion.priority === 'HIGH'),
    'Generates HIGH priority question clarifying conflicting Metformin dosage'
  );

  // -------------------------------------------------------------
  // SUITE 5: Critical Hazard & Misinformation Interception (Feature 1 & 16)
  // -------------------------------------------------------------
  console.log('\n▶ [Suite 5] Dangerous Health Claim Interception:');

  const dangerousResult = await AIService.analyzeClaim('Stop insulin and use cinnamon instead.');
  assert(
    dangerousResult.verdict === 'Potentially Dangerous',
    'Correctly classifies insulin cessation as Potentially Dangerous'
  );

  assert(
    dangerousResult.riskLevel === 'Critical',
    'Flags insulin replacement as Critical risk level'
  );

  assert(
    dangerousResult.isDangerousRequest === true,
    'Activates isDangerousRequest emergency trigger'
  );

  // -------------------------------------------------------------
  // SUITE 6: Ethical Communication Neutrality Standard
  // -------------------------------------------------------------
  console.log('\n▶ [Suite 6] Ethical Communication Neutrality Standard:');

  const allAlertTexts = [
    ...inconsistencies.map((i) => i.verificationRecommendation + ' ' + i.description),
    dangerousResult.explanation,
    dangerousResult.recommendedAction,
  ].join(' ');

  assert(
    !allAlertTexts.toLowerCase().includes('the doctor made a mistake') &&
      !allAlertTexts.toLowerCase().includes('the physician is wrong'),
    'Enforces non-adversarial clinical language (No "doctor made a mistake" or "physician is wrong")'
  );

  assert(
    allAlertTexts.toLowerCase().includes('verify') || allAlertTexts.toLowerCase().includes('consult'),
    'Appropriately directs user to verify with attending healthcare professional'
  );

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n=============================================================');
  console.log(`  TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (passedTests === totalTests) {
    console.log('  STATUS: ALL CAPSTONE VERIFICATION CHECKS GREEN ✅');
  } else {
    console.log(`  STATUS: ${totalTests - passedTests} FAILURES DETECTED ❌`);
  }
  console.log('=============================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
