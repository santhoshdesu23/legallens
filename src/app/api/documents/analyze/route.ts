import { NextRequest, NextResponse } from 'next/server';
import { documentStore } from '@/lib/store';
import { callGemini, parseJsonSafe } from '@/lib/ai/gemini-client';
import { PROMPTS } from '@/lib/ai/prompts';
import { redactText } from '@/lib/document-processor/pii-detector';
import { getSessionId } from '@/lib/session';
import {
  actionPlanSchema,
  attentionScoreSchema,
  documentSummarySchema,
  extractedClauseSchema,
  lawyerBriefSchema,
  parseWithSchema,
  riskFindingSchema,
  riskResponseSchema,
} from '@/lib/ai/schemas';
import { toPublicDocument } from '@/lib/security/public-document';
import { 
  DocumentType, 
  DocumentSummary, 
  ExtractedClause, 
  RiskFinding, 
  DocumentAttentionScore, 
  ActionPlan, 
  LawyerBrief, 
  ExtractedDeadline,
  ClaimClassification
} from '@/lib/types';

function normalizeClauseResponse(raw: unknown): ExtractedClause[] {
  if (Array.isArray(raw)) return raw as ExtractedClause[];
  if (!raw || typeof raw !== 'object') return [];
  const value = raw as { clauses?: unknown; items?: unknown; data?: unknown };
  if (Array.isArray(value.clauses)) return value.clauses as ExtractedClause[];
  if (Array.isArray(value.items)) return value.items as ExtractedClause[];
  if (value.data && typeof value.data === 'object') return normalizeClauseResponse(value.data);
  return [];
}

function extractNumberedSections(doc: { pages: { pageNumber: number; text: string }[] }): ExtractedClause[] {
  const sections: ExtractedClause[] = [];
  const headingPattern = /(?:^|\n)\s*(?:#{1,6}\s*)?((?:Section\s+)?\d+(?:\.\d+)*[.)]?)\s+([^\n]{2,120})/gi;

  for (const page of doc.pages) {
    const matches = Array.from(page.text.matchAll(headingPattern));
    matches.forEach((match, index) => {
      const section = match[1].trim();
      const title = match[2].trim().replace(/[.:]+$/, '');
      const isMarkdownHeading = /(?:^|\n)\s*#{1,6}\s*/.test(match[0]);
      const isSectionHeading = /^section\b/i.test(section) || /^[A-Z0-9][A-Z0-9 &,'/-]+$/.test(title);
      if (!isMarkdownHeading && !isSectionHeading) return;
      const start = match.index ?? 0;
      const end = matches[index + 1]?.index ?? page.text.length;
      const content = page.text.slice(start, end).trim();
      if (content.length < 20) return;

      sections.push({
        id: `c_section_${page.pageNumber}_${index + 1}`,
        title,
        category: 'Other',
        riskLevel: 'LOW',
        plainLanguageExplanation: 'This clause is reproduced from the uploaded document for review.',
        potentialImplication: 'Requires review in the context of the surrounding agreement.',
        sourcePage: page.pageNumber,
        sourceSection: section,
        sourceClauseText: content,
      });
    });
  }

  // PDF text extraction can flatten line breaks. Recover numbered all-caps headings in that form.
  const flattenedHeadingPattern = /(?:^|\s)((?:Section\s+)?\d+(?:\.\d+)*[.)]?)\s+([A-Z][A-Z0-9 &,'/:-]{2,100})(?=\s+[A-Z][a-z]|\s*$)/g;
  for (const page of doc.pages) {
    const matches = Array.from(page.text.matchAll(flattenedHeadingPattern));
    matches.forEach((match, index) => {
      const section = match[1].trim();
      const title = match[2].trim().replace(/[.:]+$/, '');
      const start = match.index ?? 0;
      const nextStart = matches[index + 1]?.index;
      const content = page.text.slice(start, nextStart ?? page.text.length).trim();
      sections.push({
        id: `c_section_${page.pageNumber}_${index + 1}`,
        title,
        category: 'Other',
        riskLevel: 'LOW',
        plainLanguageExplanation: 'This clause is reproduced from the uploaded document for review.',
        potentialImplication: 'Requires review in the context of the surrounding agreement.',
        sourcePage: page.pageNumber,
        sourceSection: section,
        sourceClauseText: content,
      });
    });
  }

  const uniqueSections = new Map<string, ExtractedClause>();
  for (const section of sections) {
    const key = `${section.sourcePage}:${section.sourceSection}:${section.title}`;
    uniqueSections.set(key, section);
  }
  return Array.from(uniqueSections.values());
}

function mergeClauseCoverage(aiClauses: ExtractedClause[], documentSections: ExtractedClause[]): ExtractedClause[] {
  const result = [...aiClauses];
  const sectionKey = (clause: ExtractedClause) => {
    const section = clause.sourceSection || '';
    const number = section.match(/(?:section\s*)?(\d+(?:\.\d+)?)/i)?.[1];
    return number ? `section-${number}` : clause.title.toLowerCase();
  };
  const knownSections = new Set(result.map(sectionKey));
  for (const section of documentSections) {
    const key = sectionKey(section);
    if (!knownSections.has(key)) {
      result.push(section);
    }
  }
  return result;
}

export async function POST(req: NextRequest) {
  let documentId: string | undefined;
  
  try {
    const body = await req.json();
    documentId = body.documentId;
    const language = body.language === 'hi' || body.language === 'te' ? body.language : 'en';
    
    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
    }

    const session = getSessionId(req);
    const doc = documentStore.getById(documentId);
    if (!doc || !documentStore.canAccess(doc, session.id)) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Demo documents are pre-analyzed; uploaded documents must always use their stored extracted text.
    if (doc.analysisStatus === 'COMPLETED' && doc.isSyntheticDemo) {
      return NextResponse.json({ success: true, document: toPublicDocument(doc) });
    }

    if (!doc.fullText.trim() || !doc.pages?.length || !doc.chunks?.length) {
      throw new Error('Document has no extracted text, pages, or chunks available for analysis.');
    }

    doc.analysisStatus = 'ANALYZING';
    documentStore.save(doc);

    const sampleText = (doc.pages || []).map(p => `--- PAGE ${p.pageNumber} ---\n${redactText(p.text)}`).join('\n\n');
    const languageName = language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English';
    const analysisPrompt = `${sampleText}\n\nRespond in ${languageName}. Preserve exact source quotes, section identifiers, and page references in the document's original language.`;

    // 1. Classify Document
    try {
      const classRaw = await callGemini(PROMPTS.DOCUMENT_CLASSIFIER, `Document Content:\n${analysisPrompt}`, { jsonMode: true });
      const classData = parseJsonSafe<{ documentType: DocumentType; title?: string }>(classRaw, { documentType: 'other' });
      if (classData.documentType) {
        doc.documentType = classData.documentType;
      }
      if (classData.title && !doc.title.includes('Agreement')) {
        doc.title = classData.title;
      }
    } catch (e) {
      console.warn('Document classification failed, using defaults:', e);
    }

    // 2. Summarize
    const summaryFallback: DocumentSummary = {
      executiveSummary: 'This document defines rights, obligations, payments, and termination conditions between the parties.',
      whatThisDocumentIs: 'This appears to be a legally binding contract between the named parties.',
      readingLevels: {
        simple: 'A contract outlining what you must do, payments, and rules for ending the agreement.',
        detailed: 'Comprehensive legal instrument establishing responsibilities, liabilities, and dispute terms.',
        professional: 'A formal bilateral agreement governed by applicable statutory jurisprudence.'
      },
      keyPoints: {
        parties: 'Identified parties in document',
        purpose: 'Contractual transaction and responsibilities',
        term: 'Standard term specified in agreement',
        payment: 'Specified financial terms and considerations',
        obligations: 'Mutual contractual covenants',
        termination: 'Notice periods and grounds for termination',
        disputeResolution: 'Jurisdiction specified in agreement'
      }
    };
    let summaryData = summaryFallback;
    try {
      const sumRaw = await callGemini(PROMPTS.DOCUMENT_SUMMARIZER, `Document Content:\n${analysisPrompt}`, { jsonMode: true });
      summaryData = parseWithSchema(sumRaw, documentSummarySchema, summaryFallback);
    } catch (e) {
      console.warn('Document summarization failed, using fallback:', e);
    }
    doc.summary = summaryData;

    // 3. Extract Clauses
    const documentSections = extractNumberedSections(doc);
    let clausesToStore: ExtractedClause[] = [];
    try {
      const clauseRaw = await callGemini(PROMPTS.CLAUSE_EXTRACTOR, `Document Content:\n${analysisPrompt}`, { jsonMode: true });
      const clauseData = parseJsonSafe<unknown>(clauseRaw, {});
      const aiClauses = normalizeClauseResponse(clauseData);
      const validAiClauses = extractedClauseSchema.array().safeParse(aiClauses);
      const extractedClauses = mergeClauseCoverage(validAiClauses.success ? validAiClauses.data as ExtractedClause[] : [], documentSections);
      clausesToStore = extractedClauses.length > 0 ? extractedClauses : (documentSections.length > 0 ? documentSections : [{
        id: 'c_gen_1',
        title: 'Uncategorized Document Terms',
        category: 'Other',
        riskLevel: 'LOW',
        plainLanguageExplanation: 'The uploaded document contains contractual text that requires review.',
        potentialImplication: 'The document terms should be reviewed with the source evidence shown below.',
        sourcePage: 1,
        sourceSection: 'General',
        sourceClauseText: doc.pages[0]?.text || 'No extracted text available'
      }]);
    } catch (e) {
      console.warn('Document clause extraction failed, using document sections fallback:', e);
      clausesToStore = documentSections.length > 0 ? documentSections : [{
        id: 'c_gen_1',
        title: 'Uncategorized Document Terms',
        category: 'Other',
        riskLevel: 'LOW',
        plainLanguageExplanation: 'The uploaded document contains contractual text that requires review.',
        potentialImplication: 'The document terms should be reviewed with the source evidence shown below.',
        sourcePage: 1,
        sourceSection: 'General',
        sourceClauseText: doc.pages[0]?.text || 'No extracted text available'
      }];
    }
    doc.clauses = clausesToStore.map(clause => ({
      ...clause,
      claimClassification: clause.sourceClauseText && doc.fullText.includes(clause.sourceClauseText)
        ? 'FACT' as ClaimClassification
        : 'UNKNOWN' as ClaimClassification,
      evidenceVerified: Boolean(clause.sourceClauseText && doc.fullText.includes(clause.sourceClauseText)),
    }));

    // 4. Risk Analysis & Document Attention Score
    const riskFallback: { attentionScore: DocumentAttentionScore; risks: RiskFinding[] } = {
      attentionScore: {
        overallLevel: 'MEDIUM',
        overallScore: 40,
        breakdown: {
          financial: 35,
          termination: 45,
          liability: 40,
          restrictions: 40,
          deadlines: 30,
          disputeResolution: 35
        },
        summary: 'Standard contract containing customary obligations. Review termination and liability clauses with counsel.'
      },
      risks: []
    };
    let riskData = riskFallback;
    try {
      const riskRaw = await callGemini(PROMPTS.RISK_ANALYZER, `Document Content:\n${analysisPrompt}`, { jsonMode: true });
      const parsedRiskData = parseJsonSafe<unknown>(riskRaw, {});
      const riskDataResult = riskResponseSchema.safeParse(parsedRiskData);
      riskData = riskDataResult.success ? riskDataResult.data : riskFallback;
    } catch (e) {
      console.warn('Risk analysis failed, using fallback:', e);
    }
    doc.attentionScore = riskData.attentionScore;
    doc.risks = (riskData.risks || []).map(risk => ({
      ...risk,
      claimClassification: risk.evidence && doc.fullText.includes(risk.evidence)
        ? 'AI_INTERPRETATION' as ClaimClassification
        : 'UNKNOWN' as ClaimClassification,
      evidenceVerified: Boolean(risk.evidence && doc.fullText.includes(risk.evidence)),
    }));

    // 5. Action Plan & Deadlines
    const actionFallback: ActionPlan = {
      whatAppearsToBeHappening: 'You are reviewing a legal document for execution or compliance.',
      immediateChecklist: [
        { id: 'chk_1', text: 'Preserve the original signed copy and all annexures', completed: false, category: 'Immediate', priority: 'HIGH' },
        { id: 'chk_2', text: 'Verify all effective dates and notice timelines', completed: false, category: 'Verification', priority: 'HIGH' },
        { id: 'chk_3', text: 'Schedule lawyer review for highlighted risk points', completed: false, category: 'Professional Review', priority: 'MEDIUM' }
      ],
      documentsToCollect: ['Official photo identification', 'Written correspondence & emails related to this agreement'],
      importantDates: [],
      options: [
        {
          id: 'opt_1',
          title: 'Review and Propose Mutual Modifications',
          purpose: 'Address flagged concerns before final signature',
          potentialAdvantages: ['Reduces one-sided liability', 'Clarifies ambiguous clauses'],
          potentialConsiderations: ['May require counterparty approval time'],
          informationNeeded: ['Specific markup clause requests'],
          whenProfessionalAdviceUseful: 'Prior to executing amendments'
        }
      ]
    };
    let actionData = actionFallback;
    try {
      const actionRaw = await callGemini(PROMPTS.ACTION_PLAN_GENERATOR, `Document Content:\n${analysisPrompt}`, { jsonMode: true });
      actionData = parseWithSchema(actionRaw, actionPlanSchema, actionFallback);
    } catch (e) {
      console.warn('Action plan generation failed, using fallback:', e);
    }
    doc.actionPlan = actionData;
    doc.deadlines = actionData.importantDates || [];

    // 6. Lawyer Brief
    const lawyerFallback: LawyerBrief = {
      situationSummary: `Review of ${doc.title} (${doc.documentType}) containing ${doc.pages.length} pages.`,
      parties: [
        { name: 'First Party', role: 'Primary Signatory', obligationsSummary: 'Core contractual duties' }
      ],
      relevantDocuments: [doc.fileName],
      importantDates: (doc.deadlines || []).map((d: any) => ({ date: d.date, event: d.event, page: d.sourcePage })),
      importantClauses: (doc.clauses || []).slice(0, 4).map((c: any) => ({ clause: c.title, page: c.sourcePage, explanation: c.plainLanguageExplanation })),
      potentialIssuesForReview: (doc.risks || []).map((r: any) => ({ issue: r.title, severity: r.riskLevel, notes: r.whyFlagged })),
      questionsForLawyer: [
        'Are there any unstated statutory liabilities in this jurisdiction?',
        'How can we negotiate more balanced dispute resolution terms?'
      ],
      missingInformation: ['Specific schedule exhibits or annexures referenced'],
      documentsToBring: [doc.fileName, 'Any email or chat communications negotiating terms']
    };
    let lawyerData = lawyerFallback;
    try {
      const lawyerRaw = await callGemini(PROMPTS.LAWYER_PREP_GENERATOR, `Document Content:\n${analysisPrompt}`, { jsonMode: true });
      lawyerData = parseWithSchema(lawyerRaw, lawyerBriefSchema, lawyerFallback);
    } catch (e) {
      console.warn('Lawyer brief generation failed, using fallback:', e);
    }
    doc.lawyerBrief = lawyerData;

    // Save updated document in store
    doc.analysisStatus = 'COMPLETED';
    documentStore.save(doc);

    return NextResponse.json({
      success: true,
      document: toPublicDocument(doc)
    });
  } catch (error: unknown) {
    console.error('Document analysis error:', error);
    
    // Update store with failed status if document was found
    if (documentId) {
      try {
        const doc = documentStore.getById(documentId);
        if (doc) {
          doc.analysisStatus = 'FAILED';
          doc.analysisError = 'Document analysis could not be completed.';
          documentStore.save(doc);
        }
      } catch (e) {
        console.error('Failed to update document status to FAILED:', e);
      }
    }

    return NextResponse.json({
      error: 'Document analysis could not be completed.'
    }, { status: 500 });
  }
}
