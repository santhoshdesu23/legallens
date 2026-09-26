import { LegalDocument, DocumentSummary, ActionPlan, LawyerBrief, ExtractedDeadline } from '../types';
import { redactText, SensitiveDataReport } from '../document-processor/pii-detector';

function redactForClient(text: string, sensitiveInfo?: SensitiveDataReport): string {
  let output = redactText(text);
  for (const name of sensitiveInfo?.names || []) {
    if (name) output = output.split(name).join('[NAME REDACTED]');
  }
  return output;
}

function maskedReport(report?: SensitiveDataReport): SensitiveDataReport | undefined {
  if (!report) return undefined;
  return {
    names: report.names.map(() => '[NAME REDACTED]'),
    emails: report.emails.map(() => '[EMAIL REDACTED]'),
    phones: report.phones.map(() => '[PHONE REDACTED]'),
    ids: report.ids.map(() => '[ID REDACTED]'),
    financials: report.financials.map(() => '[FINANCIAL TERM REDACTED]'),
  };
}

function r(text: string | undefined, si?: SensitiveDataReport): string {
  return text ? redactForClient(text, si) : '';
}

/**
 * Redact PII from AI-generated summary fields.
 * The AI may echo names / contact details it read from the document, so every
 * free-text string in the summary must pass through the redactor.
 */
function redactSummary(
  summary: DocumentSummary | undefined,
  si?: SensitiveDataReport
): DocumentSummary | undefined {
  if (!summary) return undefined;
  return {
    executiveSummary: r(summary.executiveSummary, si),
    whatThisDocumentIs: r(summary.whatThisDocumentIs, si),
    readingLevels: {
      simple: r(summary.readingLevels?.simple, si),
      detailed: r(summary.readingLevels?.detailed, si),
      professional: r(summary.readingLevels?.professional, si),
    },
    keyPoints: {
      parties: r(summary.keyPoints?.parties, si),
      purpose: r(summary.keyPoints?.purpose, si),
      term: r(summary.keyPoints?.term, si),
      payment: r(summary.keyPoints?.payment, si),
      obligations: r(summary.keyPoints?.obligations, si),
      termination: r(summary.keyPoints?.termination, si),
      disputeResolution: r(summary.keyPoints?.disputeResolution, si),
    },
  };
}

function redactDeadline(d: ExtractedDeadline, si?: SensitiveDataReport): ExtractedDeadline {
  return {
    ...d,
    event: r(d.event, si),
    potentialImportance: r(d.potentialImportance, si),
    sourceClause: r(d.sourceClause, si),
  };
}

function redactActionPlan(
  plan: ActionPlan | undefined,
  si?: SensitiveDataReport
): ActionPlan | undefined {
  if (!plan) return undefined;
  return {
    whatAppearsToBeHappening: r(plan.whatAppearsToBeHappening, si),
    immediateChecklist: plan.immediateChecklist.map(item => ({
      ...item,
      text: r(item.text, si),
    })),
    documentsToCollect: plan.documentsToCollect.map(d => r(d, si)),
    importantDates: plan.importantDates.map(d => redactDeadline(d, si)),
    options: plan.options.map(opt => ({
      ...opt,
      title: r(opt.title, si),
      purpose: r(opt.purpose, si),
      potentialAdvantages: opt.potentialAdvantages.map(s => r(s, si)),
      potentialConsiderations: opt.potentialConsiderations.map(s => r(s, si)),
      informationNeeded: opt.informationNeeded.map(s => r(s, si)),
      whenProfessionalAdviceUseful: r(opt.whenProfessionalAdviceUseful, si),
    })),
  };
}

function redactLawyerBrief(
  brief: LawyerBrief | undefined,
  si?: SensitiveDataReport
): LawyerBrief | undefined {
  if (!brief) return undefined;
  return {
    situationSummary: r(brief.situationSummary, si),
    parties: brief.parties.map(p => ({
      name: r(p.name, si),
      role: r(p.role, si),
      obligationsSummary: p.obligationsSummary ? r(p.obligationsSummary, si) : undefined,
    })),
    relevantDocuments: brief.relevantDocuments.map(d => r(d, si)),
    importantDates: brief.importantDates.map(d => ({
      date: r(d.date, si),
      event: r(d.event, si),
      page: d.page,
    })),
    importantClauses: brief.importantClauses.map(c => ({
      clause: r(c.clause, si),
      page: c.page,
      explanation: r(c.explanation, si),
    })),
    potentialIssuesForReview: brief.potentialIssuesForReview.map(issue => ({
      issue: r(issue.issue, si),
      severity: issue.severity,
      notes: r(issue.notes, si),
    })),
    questionsForLawyer: brief.questionsForLawyer.map(q => r(q, si)),
    missingInformation: brief.missingInformation.map(m => r(m, si)),
    documentsToBring: brief.documentsToBring.map(d => r(d, si)),
  };
}

export function toPublicDocument(document: LegalDocument): Omit<LegalDocument, 'fullText' | 'ownerId'> {
  const sensitiveInfo = document.sensitiveInfoDetected;
  return {
    id: document.id,
    title: document.title,
    fileName: document.fileName,
    fileSize: document.fileSize,
    uploadedAt: document.uploadedAt,
    documentType: document.documentType,
    pages: document.pages.map(page => ({
      pageNumber: page.pageNumber,
      text: redactForClient(page.text, sensitiveInfo),
    })),
    chunks: document.chunks.map(chunk => ({
      ...chunk,
      content: redactForClient(chunk.content, sensitiveInfo),
    })),
    summary: redactSummary(document.summary, sensitiveInfo),
    clauses: document.clauses?.map(clause => ({
      ...clause,
      sourceClauseText: redactForClient(clause.sourceClauseText, sensitiveInfo),
    })),
    risks: document.risks?.map(risk => ({
      ...risk,
      evidence: redactForClient(risk.evidence, sensitiveInfo),
    })),
    attentionScore: document.attentionScore
      ? {
          ...document.attentionScore,
          summary: r(document.attentionScore.summary, sensitiveInfo),
        }
      : undefined,
    deadlines: document.deadlines?.map(d => redactDeadline(d, sensitiveInfo)),
    actionPlan: redactActionPlan(document.actionPlan, sensitiveInfo),
    lawyerBrief: redactLawyerBrief(document.lawyerBrief, sensitiveInfo),
    isSyntheticDemo: document.isSyntheticDemo,
    sensitiveInfoDetected: maskedReport(sensitiveInfo),
    analysisStatus: document.analysisStatus,
    analysisError: document.analysisError,
  };
}
