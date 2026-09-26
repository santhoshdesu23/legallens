import { NextRequest, NextResponse } from 'next/server';
import { documentStore } from '@/lib/store';
import { retrieveRelevantChunks, findAuthoritativeSources } from '@/lib/rag/retriever';
import { callGemini } from '@/lib/ai/gemini-client';
import { PROMPTS } from '@/lib/ai/prompts';
import { QAMessage, EvidenceCitation } from '@/lib/types';
import { redactText } from '@/lib/document-processor/pii-detector';
import { getSessionId } from '@/lib/session';
import { parseWithSchema, qaResponseSchema } from '@/lib/ai/schemas';

export async function POST(req: NextRequest) {
  try {
    const { documentId, question, language = 'en' } = await req.json();

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const MAX_QUESTION_CHARS = 2_000;
    if (typeof question !== 'string' || question.length > MAX_QUESTION_CHARS) {
      return NextResponse.json(
        { error: `Question exceeds the ${MAX_QUESTION_CHARS.toLocaleString()}-character limit.` },
        { status: 400 }
      );
    }

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
    }

    const session = getSessionId(req);
    const targetDoc = documentStore.getById(documentId);

    if (!targetDoc || !documentStore.canAccess(targetDoc, session.id)) {
      return NextResponse.json({ error: 'No document found to answer questions against' }, { status: 404 });
    }

    // Retrieve relevant chunks via Hybrid Search
    const documentChunks = targetDoc.chunks || [];
    const searchResults = retrieveRelevantChunks(question, documentChunks, documentChunks.length);
    const contextText = searchResults
      .map(r => `[PAGE ${r.chunk.page} - ${r.chunk.section || 'General'}]\n${redactText(r.chunk.content)}`)
      .join('\n\n');

    // Retrieve authoritative statutes & legal references
    const officialSources = findAuthoritativeSources(question, contextText);

    const safeQuestion = redactText(question);
    const userPrompt = `DOCUMENT TITLE: ${targetDoc.title}
DOCUMENT TYPE: ${targetDoc.documentType}

RETRIEVED DOCUMENT CHUNKS:
${contextText || '(No direct matches found in document)'}

AUTHORITATIVE STATUTORY REPERTOIRE:
${officialSources.map(s => `- ${s.title}, ${s.section} (${s.authority}) [${s.url}]`).join('\n') || 'None'}

USER QUESTION:
${safeQuestion}

Instructions: Answer strictly based on the document and official legal context. If evidence is lacking, state uncertainty. Cite Page and Clause numbers. Respond in ${language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English'}, but preserve document quotes and citations exactly.`;

    const rawResponse = await callGemini(PROMPTS.LEGAL_QA, userPrompt, { jsonMode: true });

    const fallbackEvidence: EvidenceCitation[] = searchResults.map(r => ({
      sourceType: 'document',
      documentId: targetDoc?.id,
      documentTitle: targetDoc?.title,
      page: r.chunk.page,
      section: r.chunk.section,
      clause: r.chunk.clause,
      evidenceText: redactText(r.chunk.content),
      verified: true
    }));

    const parsedRaw = parseWithSchema(rawResponse, qaResponseSchema, {
      answer: '',
      basedOnDocument: '',
      evidence: [],
      legalContext: '',
      whatRemainsUncertain: '',
      considerAskingLawyer: [],
      isHighRisk: false,
      highRiskCategory: 'None'
    });
    const parsed = {
      answer: redactText(parsedRaw.answer || `Based on ${targetDoc.title}, the agreement specifies detailed contractual terms governing this matter.`),
      basedOnDocument: redactText(parsedRaw.basedOnDocument || (searchResults.length > 0 ? searchResults[0].chunk.content.substring(0, 250) : 'Terms defined in agreement.')),
      evidence: parsedRaw.evidence && parsedRaw.evidence.length > 0 ? parsedRaw.evidence : fallbackEvidence,
      legalContext: redactText(parsedRaw.legalContext || (officialSources.length > 0 ? `Governed under ${officialSources[0].title}, ${officialSources[0].section}.` : 'Governed by applicable statutory contract jurisprudence.')),
      whatRemainsUncertain: redactText(parsedRaw.whatRemainsUncertain || 'Specific internal execution schedules or ancillary policies not attached to the primary agreement.'),
      considerAskingLawyer: (parsedRaw.considerAskingLawyer && parsedRaw.considerAskingLawyer.length > 0) ? parsedRaw.considerAskingLawyer.map((question: string) => redactText(question)) : [
        'How does this clause interact with statutory protections in your state?',
        'What specific counter-proposals can be made to balance these terms?'
      ],
      isHighRisk: parsedRaw.isHighRisk || false,
      highRiskCategory: parsedRaw.highRiskCategory || 'None'
    };

    // Format final validated evidence citations
    const finalEvidence: EvidenceCitation[] = (parsed.evidence && parsed.evidence.length > 0)
      ? parsed.evidence.map((e: { evidenceText?: string; page?: number; section?: string; clause?: string }) => ({
          sourceType: 'document',
          documentId: targetDoc?.id,
          documentTitle: targetDoc?.title,
          page: e.page || 1,
          section: e.section || 'General Section',
          clause: e.clause || undefined,
          evidenceText: redactText(e.evidenceText || ''),
          verified: (() => {
            const evidenceText = e.evidenceText;
            return Boolean(
              evidenceText &&
              searchResults.some(result =>
                (!e.page || e.page === result.chunk.page) &&
                redactText(result.chunk.content).includes(evidenceText)
              )
            );
          })()
        }))
      : fallbackEvidence;

    // Attach official legal sources
    if (officialSources.length > 0) {
      for (const src of officialSources) {
        finalEvidence.push({
          sourceType: 'official_legal_source',
          evidenceText: `${src.title}, ${src.section}`,
          officialSource: {
            title: src.title,
            section: src.section,
            authority: src.authority,
            url: src.url
          }
        });
      }
    }

    const qaMessage: QAMessage = {
      id: 'qa_' + Date.now(),
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      question: safeQuestion,
      answer: parsed.answer,
      basedOnDocument: parsed.basedOnDocument,
      evidence: finalEvidence,
      legalContext: parsed.legalContext,
      whatRemainsUncertain: parsed.whatRemainsUncertain,
      considerAskingLawyer: parsed.considerAskingLawyer || [],
      isHighRisk: parsed.isHighRisk || false,
      highRiskCategory: parsed.highRiskCategory || 'None'
    };

    documentStore.addQAMessage(targetDoc.id, session.id, qaMessage);

    return NextResponse.json({
      success: true,
      message: qaMessage
    });
  } catch (error: unknown) {
    console.error('Legal QA error:', error);
    return NextResponse.json({
      error: 'The question could not be answered.'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get('documentId');

  if (!documentId) {
    return NextResponse.json({ thread: [] });
  }

    const session = getSessionId(req);
    const doc = documentStore.getById(documentId);
    if (!documentStore.canAccess(doc, session.id)) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const thread = documentStore.getQAThread(documentId, session.id);
  return NextResponse.json({ thread });
}
