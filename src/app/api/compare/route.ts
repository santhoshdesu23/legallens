import { NextRequest, NextResponse } from 'next/server';
import { documentStore } from '@/lib/store';
import { callGemini } from '@/lib/ai/gemini-client';
import { PROMPTS } from '@/lib/ai/prompts';
import { ComparisonResult } from '@/lib/types';
import { redactText } from '@/lib/document-processor/pii-detector';
import { getSessionId } from '@/lib/session';
import { comparisonSchema, parseWithSchema } from '@/lib/ai/schemas';

export async function POST(req: NextRequest) {
  try {
    const { docAId, docBId, language = 'en' } = await req.json();

    if (!docAId || !docBId) {
      return NextResponse.json({ error: 'Both docAId and docBId are required' }, { status: 400 });
    }

    const docA = documentStore.getById(docAId);
    const docB = documentStore.getById(docBId);
    const session = getSessionId(req);

    if (!docA || !docB || !documentStore.canAccess(docA, session.id) || !documentStore.canAccess(docB, session.id)) {
      return NextResponse.json({ error: 'One or both documents not found' }, { status: 404 });
    }

    const docAText = (docA.pages || []).map(p => `[Doc A - Page ${p.pageNumber}]\n${redactText(p.text)}`).join('\n\n');
    const docBText = (docB.pages || []).map(p => `[Doc B - Page ${p.pageNumber}]\n${redactText(p.text)}`).join('\n\n');

    const userPrompt = `Compare these two documents:

DOCUMENT A (${docA.title}):
${docAText}

DOCUMENT B (${docB.title}):
${docBText}

Respond in ${language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English'} while preserving exact document quotations, page numbers, and section references.`;

    const rawResponse = await callGemini(PROMPTS.CONTRACT_COMPARATOR, userPrompt, { jsonMode: true });
    const comparisonFallback: ComparisonResult = {
      docAId: docA.id,
      docATitle: docA.title,
      docBId: docB.id,
      docBTitle: docB.title,
      executiveSummary: `Comparison completed between ${docA.title} and ${docB.title}.`,
      keyDifferencesCount: 0,
      highRiskShifts: [],
      recommendedQuestions: ['Consult legal counsel to review highlighted changes.'],
      differences: []
    };
    const parsed = parseWithSchema(rawResponse, comparisonSchema, comparisonFallback) as ComparisonResult;

    const redactedDocAText = redactText(docA.fullText);
    const redactedDocBText = redactText(docB.fullText);
    parsed.differences = parsed.differences.map(difference => {
      const docAEvidenceVerified = Boolean(difference.docAText && redactedDocAText.includes(difference.docAText));
      const docBEvidenceVerified = Boolean(difference.docBText && redactedDocBText.includes(difference.docBText));
      return {
        ...difference,
        clauseName: redactText(difference.clauseName),
        docAText: docAEvidenceVerified ? difference.docAText : undefined,
        docBText: docBEvidenceVerified ? difference.docBText : undefined,
        whatChanged: redactText(difference.whatChanged),
        whyItMatters: redactText(difference.whyItMatters),
        potentialImpact: redactText(difference.potentialImpact),
        questionToAsk: redactText(difference.questionToAsk),
        evidenceVerified: (!difference.docAText || docAEvidenceVerified) && (!difference.docBText || docBEvidenceVerified),
      };
    });

    parsed.executiveSummary = redactText(parsed.executiveSummary);
    parsed.highRiskShifts = parsed.highRiskShifts.map((shift: string) => redactText(shift));
    parsed.recommendedQuestions = parsed.recommendedQuestions.map((question: string) => redactText(question));

    parsed.docAId = docA.id;
    parsed.docATitle = docA.title;
    parsed.docBId = docB.id;
    parsed.docBTitle = docB.title;

    return NextResponse.json({ success: true, comparison: parsed });
  } catch (error: unknown) {
    console.error('Comparison error:', error);
    return NextResponse.json({
      error: 'The documents could not be compared.'
    }, { status: 500 });
  }
}
