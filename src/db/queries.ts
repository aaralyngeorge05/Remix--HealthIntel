import { db } from './index.ts';
import { patients, inconsistencies, claimAudits, documents } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getPatientsFromDb() {
  try {
    return await db.select().from(patients);
  } catch (error) {
    console.error('Database query failed in getPatientsFromDb:', error);
    throw new Error('Failed to retrieve patients from database.', { cause: error });
  }
}

export async function getInconsistenciesFromDb(patientId: string) {
  try {
    return await db
      .select()
      .from(inconsistencies)
      .where(eq(inconsistencies.patientId, patientId));
  } catch (error) {
    console.error('Database query failed in getInconsistenciesFromDb:', error);
    throw new Error('Failed to retrieve inconsistencies from database.', { cause: error });
  }
}

export async function reconcileInconsistencyInDb(
  id: string,
  reconciledBy: string,
  reconciliationNote: string
) {
  try {
    const result = await db
      .update(inconsistencies)
      .set({
        reconciled: 1,
        reconciledAt: new Date().toISOString(),
        reconciledBy,
        reconciliationNote,
      })
      .where(eq(inconsistencies.id, id))
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in reconcileInconsistencyInDb:', error);
    throw new Error('Failed to update inconsistency in database.', { cause: error });
  }
}

export async function saveClaimAuditToDb(data: {
  id: string;
  userUid?: string;
  claim: string;
  normalizedClaim: string;
  verdict: string;
  confidence: number;
  evidenceStrength: string;
  riskLevel: string;
  explanation: string;
  whatEvidenceSays: string;
  recommendedAction: string;
  isDangerousRequest: boolean;
  entitiesExtracted: string[];
  sources: any[];
}) {
  try {
    const result = await db
      .insert(claimAudits)
      .values({
        id: data.id,
        userUid: data.userUid || null,
        claim: data.claim,
        normalizedClaim: data.normalizedClaim,
        verdict: data.verdict,
        confidence: data.confidence,
        evidenceStrength: data.evidenceStrength,
        riskLevel: data.riskLevel,
        explanation: data.explanation,
        whatEvidenceSays: data.whatEvidenceSays,
        recommendedAction: data.recommendedAction,
        isDangerousRequest: data.isDangerousRequest ? 1 : 0,
        entitiesExtracted: JSON.stringify(data.entitiesExtracted),
        sources: JSON.stringify(data.sources),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in saveClaimAuditToDb:', error);
    throw new Error('Failed to persist claim audit in database.', { cause: error });
  }
}

export async function getClaimAuditsFromDb(limit = 50) {
  try {
    return await db
      .select()
      .from(claimAudits)
      .orderBy(desc(claimAudits.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('Database query failed in getClaimAuditsFromDb:', error);
    throw new Error('Failed to retrieve claim audits from database.', { cause: error });
  }
}
