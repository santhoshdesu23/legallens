import { z } from 'zod';

const riskLevel = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const documentSummarySchema = z.object({
  executiveSummary: z.string(),
  whatThisDocumentIs: z.string(),
  readingLevels: z.object({
    simple: z.string(),
    detailed: z.string(),
    professional: z.string(),
  }),
  keyPoints: z.object({
    parties: z.string(),
    purpose: z.string(),
    term: z.string(),
    payment: z.string(),
    obligations: z.string(),
    termination: z.string(),
    disputeResolution: z.string(),
  }),
});

export const extractedClauseSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  riskLevel,
  plainLanguageExplanation: z.string(),
  potentialImplication: z.string(),
  sourcePage: z.number().int().positive(),
  sourceSection: z.string().optional(),
  sourceClauseText: z.string(),
});

export const riskFindingSchema = z.object({
  id: z.string(),
  title: z.string(),
  riskLevel,
  category: z.enum(['Financial', 'Termination', 'Liability', 'Restrictions', 'Deadlines', 'Dispute Resolution', 'Ambiguity']),
  whyFlagged: z.string(),
  relevantClause: z.string(),
  page: z.number().int().positive(),
  evidence: z.string(),
  potentialImplication: z.string(),
  questionForLawyer: z.string(),
});

export const attentionScoreSchema = z.object({
  overallLevel: riskLevel,
  overallScore: z.number().min(0).max(100),
  breakdown: z.object({
    financial: z.number().min(0).max(100),
    termination: z.number().min(0).max(100),
    liability: z.number().min(0).max(100),
    restrictions: z.number().min(0).max(100),
    deadlines: z.number().min(0).max(100),
    disputeResolution: z.number().min(0).max(100),
  }),
  summary: z.string(),
});

export const riskResponseSchema = z.object({
  attentionScore: attentionScoreSchema,
  risks: z.array(riskFindingSchema),
});

export const actionPlanSchema = z.object({
  whatAppearsToBeHappening: z.string(),
  immediateChecklist: z.array(z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
    category: z.enum(['Immediate', 'Gather Correspondence', 'Verification', 'Professional Review']),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  })),
  documentsToCollect: z.array(z.string()),
  importantDates: z.array(z.object({
    id: z.string(),
    date: z.string(),
    event: z.string(),
    sourceClause: z.string(),
    sourcePage: z.number().int().positive(),
    potentialImportance: z.string(),
    isLegalDeadline: z.boolean(),
  })),
  options: z.array(z.object({
    id: z.string(),
    title: z.string(),
    purpose: z.string(),
    potentialAdvantages: z.array(z.string()),
    potentialConsiderations: z.array(z.string()),
    informationNeeded: z.array(z.string()),
    whenProfessionalAdviceUseful: z.string(),
  })),
});

export const lawyerBriefSchema = z.object({
  situationSummary: z.string(),
  parties: z.array(z.object({ name: z.string(), role: z.string(), obligationsSummary: z.string().optional() })),
  relevantDocuments: z.array(z.string()),
  importantDates: z.array(z.object({ date: z.string(), event: z.string(), page: z.number().int().positive() })),
  importantClauses: z.array(z.object({ clause: z.string(), page: z.number().int().positive(), explanation: z.string() })),
  potentialIssuesForReview: z.array(z.object({ issue: z.string(), severity: riskLevel, notes: z.string() })),
  questionsForLawyer: z.array(z.string()),
  missingInformation: z.array(z.string()),
  documentsToBring: z.array(z.string()),
});

export const comparisonSchema = z.object({
  executiveSummary: z.string(),
  keyDifferencesCount: z.number().int().min(0),
  highRiskShifts: z.array(z.string()),
  recommendedQuestions: z.array(z.string()),
  differences: z.array(z.object({
    id: z.string(),
    clauseName: z.string(),
    changeType: z.enum(['added', 'removed', 'modified', 'unchanged']),
    docAText: z.string().optional(),
    docBText: z.string().optional(),
    docAPage: z.number().int().positive().optional(),
    docBPage: z.number().int().positive().optional(),
    whatChanged: z.string(),
    whyItMatters: z.string(),
    potentialImpact: z.string(),
    questionToAsk: z.string(),
    riskShift: z.enum(['increased', 'decreased', 'neutral']),
  })),
});

export const qaResponseSchema = z.object({
  answer: z.string(),
  basedOnDocument: z.string(),
  evidence: z.array(z.object({
    sourceType: z.enum(['document', 'official_legal_source', 'interpretation']),
    page: z.number().int().positive().optional(),
    section: z.string().optional(),
    clause: z.string().optional(),
    evidenceText: z.string(),
  })),
  legalContext: z.string(),
  whatRemainsUncertain: z.string(),
  considerAskingLawyer: z.array(z.string()),
  isHighRisk: z.boolean(),
  highRiskCategory: z.string(),
});

export function parseWithSchema<T>(raw: string, schema: z.ZodType<T>, fallback: T): T {
  try {
    const parsed: unknown = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, '').trim());
    const result = schema.safeParse(parsed);
    return result.success ? result.data : fallback;
  } catch {
    return fallback;
  }
}