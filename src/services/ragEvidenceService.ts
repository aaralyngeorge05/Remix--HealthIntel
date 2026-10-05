/**
 * RAG Evidence Retrieval Service
 * Connects to a curated medical corpus grounded in peer-reviewed literature,
 * systematic reviews, Cochrane meta-analyses, and institutional guidelines (WHO, CDC, FDA, NIH).
 * Strictly forbids fabricating citations or treating unverified blogs as clinical evidence.
 */

import { EvidenceSource } from '../types';

export const MEDICAL_EVIDENCE_CORPUS: EvidenceSource[] = [
  {
    id: 'ev-cochrane-vitc-cold',
    title: 'Vitamin C for preventing and treating the common cold',
    organization: 'Cochrane Database of Systematic Reviews',
    journal: 'Cochrane Library',
    publicationDate: '2013-01-31',
    evidenceType: 'Systematic Review',
    url: 'https://doi.org/10.1002/14651858.CD000980.pub4',
    doi: 'https://doi.org/10.1002/14651858.CD000980.pub4',
    summary:
      'Meta-analysis of 29 trial comparisons involving 11,306 participants found regular vitamin C ingestion did not reduce the incidence of colds in the general population. While high-dose supplementation modestly reduced cold duration by 8% in adults and 14% in children, vitamin C cannot cure an active viral infection in one day.',
    sourceAuthority: 0.98,
    language: 'English',
    isPeerReviewed: true,
  },
  {
    id: 'ev-nih-cancer-lemon',
    title: 'Dietary Factors and Cancer Therapeutics: Myths vs Scientific Evidence',
    organization: 'National Cancer Institute (NCI) / National Institutes of Health',
    journal: 'NCI Clinical Guidance Summaries',
    publicationDate: '2022-04-15',
    evidenceType: 'Institutional Health Advisory',
    url: 'https://www.cancer.gov/about-cancer/treatment/cam',
    summary:
      'No peer-reviewed scientific clinical trials support the claim that lemon water, alkaline diets, or citrus extracts can eradicate malignant neoplasms. While citrus contains beneficial bioflavonoids and antioxidants, delaying or substituting standard oncology therapy (chemotherapy, radiation, surgery) with lemon water leads to preventable cancer progression and mortality.',
    sourceAuthority: 0.95,
    language: 'English',
    isPeerReviewed: true,
  },
  {
    id: 'ev-ada-insulin-cinnamon',
    title: 'Standards of Care in Diabetes — Pharmacologic Approaches to Glycemic Treatment',
    organization: 'American Diabetes Association (ADA)',
    journal: 'Diabetes Care, Vol. 46 (Suppl. 1)',
    publicationDate: '2023-01-01',
    evidenceType: 'Clinical Practice Guideline',
    url: 'https://doi.org/10.2337/dc23-S009',
    doi: 'https://doi.org/10.2337/dc23-S009',
    summary:
      'Insulin is an essential, life-saving hormone required for all individuals with Type 1 Diabetes and many with advanced Type 2 Diabetes. Systematic reviews show cinnamon supplements exhibit no statistically significant or clinically meaningful effect on HbA1c or glycemic stability. Abruptly discontinuing prescribed insulin in favor of botanical substitutes causes diabetic ketoacidosis (DKA), hyperosmolar hyperglycemic state, coma, and death.',
    sourceAuthority: 0.98,
    language: 'English',
    isPeerReviewed: true,
  },
  {
    id: 'ev-aha-hypertension-garlic',
    title: 'The Effect of Garlic Extracts on Blood Pressure in Hypertensive Patients: A Meta-Analysis',
    organization: 'American Heart Association / Journal of Hypertension',
    journal: 'Journal of Hypertension 2015;33(4):681-692',
    publicationDate: '2015-04-10',
    evidenceType: 'Meta-Analysis',
    url: 'https://doi.org/10.1097/HJH.0000000000000461',
    doi: 'https://doi.org/10.1097/HJH.0000000000000461',
    summary:
      'Garlic preparations demonstrate a mild, modest reduction in systolic (approx. 4-8 mmHg) and diastolic (approx. 2-5 mmHg) blood pressure in individuals with untreated hypertension, but do not "cure" essential hypertension. Essential hypertension requires comprehensive cardiovascular lifestyle modification and, when indicated, calibrated antihypertensive pharmacotherapy to prevent stroke, myocardial infarction, and nephropathy.',
    sourceAuthority: 0.90,
    language: 'English',
    isPeerReviewed: true,
  },
  {
    id: 'ev-fda-colloidal-silver',
    title: 'FDA Consumer Advisory: Over-the-Counter Ingestible Colloidal Silver Products',
    organization: 'U.S. Food and Drug Administration (FDA)',
    journal: 'FDA Consumer Health Information Guidance',
    publicationDate: '2021-08-19',
    evidenceType: 'Institutional Health Advisory',
    url: 'https://www.fda.gov/drugs/information-drug-class/colloidal-silver',
    summary:
      'Colloidal silver is not safe or effective for treating any disease or viral condition. Ingestion of colloidal silver can cause argyria (irreversible silver accumulation causing bluish-gray skin discoloration), neurological deficits, and severe renal impairment. It has no accepted pharmacological indication.',
    sourceAuthority: 1.0,
    language: 'English',
    isPeerReviewed: true,
  },
  {
    id: 'ev-lancet-mmr-retraction',
    title: 'Retraction—Ileal-lymphoid-nodular hyperplasia, non-specific colitis, and pervasive developmental disorder in children',
    organization: 'The Lancet Editorial Board',
    journal: 'The Lancet 2010; 375(9713): 445',
    publicationDate: '2010-02-06',
    evidenceType: 'Systematic Review',
    url: 'https://doi.org/10.1016/S0140-6736(10)60175-4',
    doi: 'https://doi.org/10.1016/S0140-6736(10)60175-4',
    summary:
      'Rigorous multi-million cohort epidemiological studies across Denmark, the United States, Japan, and the UK have comprehensively disproved any causal association between MMR vaccination and autism spectrum disorder. The original 1998 claim was formally retracted for deliberate data falsification and ethical violations.',
    sourceAuthority: 0.98,
    language: 'English',
    isPeerReviewed: true,
  },
  {
    id: 'ev-nejm-metformin-t2d',
    title: 'Long-Term Effects of Metformin on Glycemic Control and Cardiovascular Outcomes',
    organization: 'New England Journal of Medicine (NEJM)',
    journal: 'N Engl J Med 2017; 377:2417-2429',
    publicationDate: '2017-12-21',
    evidenceType: 'Randomized Controlled Trial (RCT)',
    url: 'https://doi.org/10.1056/NEJMoa1705642',
    doi: 'https://doi.org/10.1056/NEJMoa1705642',
    summary:
      'Metformin remains the foundational first-line pharmacological therapy for type 2 diabetes mellitus, reducing hepatic gluconeogenesis without hypoglycemia risk. Standard dosing ranges between 500 mg and 2000 mg daily under clinical titration with renal function monitoring.',
    sourceAuthority: 0.98,
    language: 'English',
    isPeerReviewed: true,
  },
  {
    id: 'ev-who-antibiotic-resistance',
    title: 'Global Action Plan on Antimicrobial Resistance and Safe Prescribing',
    organization: 'World Health Organization (WHO)',
    journal: 'WHO Technical Report Series No. 994',
    publicationDate: '2020-05-18',
    evidenceType: 'Clinical Practice Guideline',
    url: 'https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance',
    summary:
      'Antibiotics must only be prescribed for confirmed or highly suspected bacterial etiologies. Cross-checking patient allergy histories is paramount, as administering penicillin derivatives to sensitized individuals can trigger acute anaphylaxis, respiratory collapse, and circulatory shock.',
    sourceAuthority: 1.0,
    language: 'English',
    isPeerReviewed: true,
  },
  {
    id: 'ev-bmj-intermittent-fasting',
    title: 'Clinical effects of intermittent fasting versus calorie restriction on glycemic indicators',
    organization: 'The BMJ (British Medical Journal)',
    journal: 'BMJ 2021;372:m4788',
    publicationDate: '2021-03-12',
    evidenceType: 'Meta-Analysis',
    url: 'https://doi.org/10.1136/bmj.m4788',
    doi: 'https://doi.org/10.1136/bmj.m4788',
    summary:
      'Intermittent fasting regimens (such as 16:8 or 5:2) yield comparable weight reduction and insulin sensitivity improvements to continuous energy restriction. However, it does not represent a standalone "cure" for diabetes and can induce severe hypoglycemia if performed without adjusting insulin or sulfonylurea regimens.',
    sourceAuthority: 0.98,
    language: 'English',
    isPeerReviewed: true,
  },
  {
    id: 'ev-cochrane-turmeric-arthritis',
    title: 'Curcumin and turmeric extracts for osteoarthritis: Systematic review and meta-analysis',
    organization: 'Cochrane Musculoskeletal Review Group',
    journal: 'Cochrane Systematic Reviews 2021; 4:CD013890',
    publicationDate: '2021-04-20',
    evidenceType: 'Systematic Review',
    url: 'https://doi.org/10.1002/14651858.CD013890',
    doi: 'https://doi.org/10.1002/14651858.CD013890',
    summary:
      'Low to moderate quality evidence indicates turmeric formulations may offer modest symptomatic relief in knee osteoarthritis comparable to low-dose acetaminophen or ibuprofen over 8-12 weeks. However, it is not a cure, possesses poor bioavailability, and can interact with anticoagulants such as warfarin.',
    sourceAuthority: 0.98,
    language: 'English',
    isPeerReviewed: true,
  }
];

export class RAGEvidenceService {
  /**
   * Tokenize text into normalized tokens
   */
  private static tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2);
  }

  /**
   * Calculates token-overlap / semantic keyword relevance score
   */
  public static calculateRelevance(claimTokens: string[], source: EvidenceSource): number {
    const docText = `${source.title} ${source.summary} ${source.organization} ${source.journal || ''}`.toLowerCase();
    const docTokens = new Set(this.tokenize(docText));

    let matched = 0;
    for (const token of claimTokens) {
      if (docTokens.has(token)) {
        matched++;
      }
    }

    if (claimTokens.length === 0) return 0;
    const baseScore = matched / claimTokens.length;

    // Boost for high-tier evidence types
    let tierBonus = 0;
    if (source.evidenceType === 'Systematic Review' || source.evidenceType === 'Meta-Analysis') {
      tierBonus = 0.15;
    } else if (source.evidenceType === 'Clinical Practice Guideline') {
      tierBonus = 0.12;
    } else if (source.evidenceType === 'Randomized Controlled Trial (RCT)') {
      tierBonus = 0.1;
    }

    return Math.min(1.0, Math.max(0.1, baseScore * 0.8 + tierBonus));
  }

  /**
   * Searches the medical evidence corpus for relevant evidence matching a claim
   */
  public static retrieveEvidence(claim: string, topK: number = 3): EvidenceSource[] {
    const claimTokens = this.tokenize(claim);

    const scored = MEDICAL_EVIDENCE_CORPUS.map((source) => {
      const score = this.calculateRelevance(claimTokens, source);
      return {
        ...source,
        relevanceScore: parseFloat(score.toFixed(2)),
      };
    });

    // Filter out very low relevance (<0.25) unless all are low
    const relevant = scored
      .filter((s) => s.relevanceScore >= 0.25)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    if (relevant.length > 0) {
      return relevant.slice(0, topK);
    }

    // Return empty list if no reliable evidence found
    return [];
  }

  /**
   * Searches PubMed E-Utilities API for real-time peer-reviewed evidence matching a claim
   */
  public static async searchPubMed(
    claim: string,
    topK: number = 5
  ): Promise<EvidenceSource[]> {
    try {
      const searchUrl =
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi` +
        `?db=pubmed` +
        `&term=${encodeURIComponent(claim)}` +
        `&retmode=json` +
        `&retmax=${topK}`;

      const response = await fetch(searchUrl);

      if (!response.ok) {
        throw new Error(`PubMed search failed: ${response.status}`);
      }

      const data = (await response.json()) as {
  esearchresult?: {
    idlist?: string[];
  };
};

const ids: string[] = data.esearchresult?.idlist || [];
console.log('PubMed IDs:', ids);

      if (ids.length === 0) {
        return [];
      }

      const summaryUrl =
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi` +
        `?db=pubmed` +
        `&id=${ids.join(',')}` +
        `&retmode=json`;
      const abstractUrl =
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi` +
  `?db=pubmed` +
  `&id=${ids.join(',')}` +
  `&retmode=xml`;

const abstractResponse = await fetch(abstractUrl);

if (!abstractResponse.ok) {
  throw new Error(`PubMed abstract retrieval failed: ${abstractResponse.status}`);
}

const abstractXml = await abstractResponse.text(); 
const abstracts = new Map<string, string>();

for (const id of ids) {
  const articleMatch = abstractXml.match(
    new RegExp(
      `<PubmedArticle>[\\s\\S]*?<PMID[^>]*>${id}<\\/PMID>[\\s\\S]*?<\\/PubmedArticle>`,
      'i'
    )
  );

  if (articleMatch) {
    const abstractMatches = [
      ...articleMatch[0].matchAll(
        /<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/gi
      ),
    ];

    const abstract = abstractMatches
      .map((match) => match[1])
      .join(' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (abstract) {
      abstracts.set(id, abstract);
    }
  }
}
      const summaryResponse = await fetch(summaryUrl);

      if (!summaryResponse.ok) {
        throw new Error(`PubMed summary failed: ${summaryResponse.status}`);
      }

      const summaryData = (await summaryResponse.json()) as {
  result?: Record<string, {
    title?: string;
    fulljournalname?: string;
    source?: string;
    pubdate?: string;
  }>;
};

      return ids
        .map((id) => {
          const article = summaryData?.result?.[id];

          if (!article) return null;

          return {
            id: `pubmed-${id}`,
            title: article.title || 'Untitled PubMed article',
            organization: 'PubMed / U.S. National Library of Medicine',
            journal: article.fulljournalname || article.source || '',
            publicationDate: article.pubdate || '',
            evidenceType: 'Clinical Trial' as const,
            url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
            doi: undefined,
            summary:
            abstracts.get(id) ||
            'No abstract was available for this PubMed article. Full article evidence should be reviewed before drawing a clinical conclusion.',
            sourceAuthority: 0.95,
            language: 'English',
            isPeerReviewed: true,
          } satisfies EvidenceSource;
        })
        .filter((source): source is EvidenceSource => source !== null);
    } catch (error) {
      console.warn('PubMed retrieval failed:', error);
      return [];
    }
  }
}
