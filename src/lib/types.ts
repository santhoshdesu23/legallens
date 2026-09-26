export type DocumentType = 
  | 'employment_agreement'
  | 'residential_lease'
  | 'commercial_contract'
  | 'nda'
  | 'insurance_policy'
  | 'service_agreement'
  | 'other';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ClaimClassification = 'FACT' | 'AI_INTERPRETATION' | 'UNKNOWN';

export interface DocumentPage {
  pageNumber: number;
  text: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  page: number;
  section?: string;
  clause?: string;
  content: string;
}

export interface ExtractedClause {
  id: string;
  title: string;
  category: 
    | 'Parties & Purpose'
    | 'Definitions'
    | 'Obligations & Duties'
    | 'Rights & Entitlements'
    | 'Payment & Fees'
    | 'Penalties & Forfeitures'
    | 'Liability & Indemnity'
    | 'Confidentiality & IP'
    | 'Termination & Default'
    | 'Renewal & Extension'
    | 'Non-Compete & Restrictive Covenants'
    | 'Dispute Resolution & Jurisdiction'
    | 'Governing Law'
    | 'Notice & Communication'
    | 'Deadlines & Timelines'
    | 'Other';
  riskLevel: RiskLevel;
  plainLanguageExplanation: string;
  potentialImplication: string;
  sourcePage: number;
  sourceSection?: string;
  sourceClauseText: string;
  evidenceVerified?: boolean;
  claimClassification?: ClaimClassification;
}

export interface RiskFinding {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  category: 'Financial' | 'Termination' | 'Liability' | 'Restrictions' | 'Deadlines' | 'Dispute Resolution' | 'Ambiguity';
  whyFlagged: string;
  relevantClause: string;
  page: number;
  evidence: string;
  evidenceVerified?: boolean;
  claimClassification?: ClaimClassification;
  potentialImplication: string;
  questionForLawyer: string;
}

export interface AttentionScoreBreakdown {
  financial: number;      // 0 - 100
  termination: number;    // 0 - 100
  liability: number;      // 0 - 100
  restrictions: number;   // 0 - 100
  deadlines: number;      // 0 - 100
  disputeResolution: number; // 0 - 100
}

export interface DocumentAttentionScore {
  overallLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  overallScore: number; // 0-100 (where higher means needs more review/attention)
  breakdown: AttentionScoreBreakdown;
  summary: string;
}

export interface ExtractedDeadline {
  id: string;
  date: string;
  event: string;
  sourceClause: string;
  sourcePage: number;
  potentialImportance: string;
  isLegalDeadline: boolean;
}

export interface DocumentSummary {
  executiveSummary: string;
  whatThisDocumentIs: string;
  readingLevels: {
    simple: string;
    detailed: string;
    professional: string;
  };
  keyPoints: {
    parties: string;
    purpose: string;
    term: string;
    payment: string;
    obligations: string;
    termination: string;
    disputeResolution: string;
  };
}

export interface ActionOption {
  id: string;
  title: string;
  purpose: string;
  potentialAdvantages: string[];
  potentialConsiderations: string[];
  informationNeeded: string[];
  whenProfessionalAdviceUseful: string;
}

export interface ActionChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'Immediate' | 'Gather Correspondence' | 'Verification' | 'Professional Review';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ActionPlan {
  whatAppearsToBeHappening: string;
  immediateChecklist: ActionChecklistItem[];
  documentsToCollect: string[];
  importantDates: ExtractedDeadline[];
  options: ActionOption[];
}

export interface LawyerBrief {
  situationSummary: string;
  parties: {
    name: string;
    role: string;
    obligationsSummary?: string;
  }[];
  relevantDocuments: string[];
  importantDates: {
    date: string;
    event: string;
    page: number;
  }[];
  importantClauses: {
    clause: string;
    page: number;
    explanation: string;
  }[];
  potentialIssuesForReview: {
    issue: string;
    severity: RiskLevel;
    notes: string;
  }[];
  questionsForLawyer: string[];
  missingInformation: string[];
  documentsToBring: string[];
}

export interface EvidenceCitation {
  sourceType: 'document' | 'official_legal_source' | 'interpretation';
  documentId?: string;
  documentTitle?: string;
  page?: number;
  section?: string;
  clause?: string;
  evidenceText: string;
  verified?: boolean;
  officialSource?: {
    title: string;
    section: string;
    authority: string;
    url?: string;
  };
}

export interface QAMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  question?: string;
  answer?: string;
  basedOnDocument?: string;
  evidence?: EvidenceCitation[];
  legalContext?: string;
  whatRemainsUncertain?: string;
  considerAskingLawyer?: string[];
  isHighRisk?: boolean;
  highRiskCategory?: string;
}

export interface ComparisonDiffItem {
  id: string;
  clauseName: string;
  changeType: 'added' | 'removed' | 'modified' | 'unchanged';
  docAText?: string;
  docBText?: string;
  docAPage?: number;
  docBPage?: number;
  whatChanged: string;
  whyItMatters: string;
  potentialImpact: string;
  questionToAsk: string;
  riskShift: 'increased' | 'decreased' | 'neutral';
  evidenceVerified?: boolean;
}

export interface ComparisonResult {
  docAId: string;
  docATitle: string;
  docBId: string;
  docBTitle: string;
  executiveSummary: string;
  keyDifferencesCount: number;
  differences: ComparisonDiffItem[];
  highRiskShifts: string[];
  recommendedQuestions: string[];
}

export interface LegalDocument {
  id: string;
  ownerId?: string;
  title: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  documentType: DocumentType;
  pages: DocumentPage[];
  fullText: string;
  chunks: DocumentChunk[];
  summary?: DocumentSummary;
  clauses?: ExtractedClause[];
  risks?: RiskFinding[];
  attentionScore?: DocumentAttentionScore;
  deadlines?: ExtractedDeadline[];
  actionPlan?: ActionPlan;
  lawyerBrief?: LawyerBrief;
  isSyntheticDemo?: boolean;
  sensitiveInfoDetected?: {
    names: string[];
    emails: string[];
    phones: string[];
    ids: string[];
    financials: string[];
  };
  analysisStatus?: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  analysisError?: string;
}
