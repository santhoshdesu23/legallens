import { describe, expect, it, beforeEach, vi } from 'vitest';
import JSZip from 'jszip';
import { NextRequest } from 'next/server';
import { POST as upload } from '@/app/api/documents/upload/route';
import { POST as analyze } from '@/app/api/documents/analyze/route';
import { POST as ask } from '@/app/api/ask/route';
import { POST as compare } from '@/app/api/compare/route';
import { POST as toggleChecklist } from '@/app/api/action-plan/toggle/route';
import { POST as translate } from '@/app/api/translate/route';
import { callGemini } from '@/lib/ai/gemini-client';
import { documentStore } from '@/lib/store';

vi.mock('@/lib/ai/gemini-client', () => ({
  callGemini: vi.fn(),
  parseJsonSafe: <T>(raw: string, fallback: T): T => {
    try { return JSON.parse(raw) as T; } catch { return fallback; }
  },
}));

const mockedCallGemini = vi.mocked(callGemini);

function makeRequest(url: string, init: RequestInit = {}, cookie?: string): NextRequest {
  const headers = new Headers(init.headers);
  if (cookie) headers.set('cookie', cookie);
  return new NextRequest(`http://localhost${url}`, { method: init.method, headers, body: init.body });
}

function cookieFrom(response: Response): string {
  return (response.headers.get('set-cookie') || '').split(';')[0];
}

async function uploadFile(name: string, body: Uint8Array | string, type: string, cookie?: string) {
  const form = new FormData();
  form.append('file', new File([typeof body === 'string' ? body : Buffer.from(body)], name, { type }));
  return upload(makeRequest('/api/documents/upload', { method: 'POST', body: form }, cookie));
}

function validSummary() {
  return {
    executiveSummary: 'This agreement defines the parties, their obligations, payment terms, and termination process.',
    whatThisDocumentIs: 'This appears to be a consulting agreement.',
    readingLevels: { simple: 'This explains the work and rules.', detailed: 'This covers the agreement section by section.', professional: 'This is a concise contractual briefing.' },
    keyPoints: { parties: 'Consultant and Client', purpose: 'Consulting services', term: 'The term is stated in the agreement.', payment: 'Payment terms are stated in the agreement.', obligations: 'The parties have stated obligations.', termination: 'Termination terms are stated in the agreement.', disputeResolution: 'No dispute process was identified.' },
  };
}

function validActionPlan() {
  return {
    whatAppearsToBeHappening: 'The uploaded document is being reviewed before action.',
    immediateChecklist: [{ id: 'check_1', text: 'Review the source clauses.', completed: false, category: 'Verification', priority: 'HIGH' }],
    documentsToCollect: ['Signed agreement'],
    importantDates: [],
    options: [{ id: 'option_1', title: 'Request clarification', purpose: 'Clarify ambiguous terms.', potentialAdvantages: ['Better understanding'], potentialConsiderations: ['The other party may need to respond.'], informationNeeded: ['The relevant clause'], whenProfessionalAdviceUseful: 'Before signing.' }],
  };
}

function validLawyerBrief() {
  return {
    situationSummary: 'The uploaded document is ready for legal review.',
    parties: [{ name: 'Consultant', role: 'Service provider', obligationsSummary: 'Perform services.' }],
    relevantDocuments: ['uploaded document'],
    importantDates: [],
    importantClauses: [],
    potentialIssuesForReview: [],
    questionsForLawyer: ['What should be clarified before signing?'],
    missingInformation: [],
    documentsToBring: ['Uploaded document'],
  };
}

function configureValidAi() {
  mockedCallGemini.mockImplementation(async (systemInstruction: string) => {
    if (systemInstruction.includes('classify it')) return JSON.stringify({ documentType: 'commercial_contract', confidence: 0.9, title: 'Consulting Agreement', primaryParties: ['Consultant', 'Client'], governingJurisdiction: 'Unknown' });
    if (systemInstruction.includes('comprehensive, plain-language')) return JSON.stringify(validSummary());
    if (systemInstruction.includes('Extract key clauses')) return JSON.stringify({ clauses: [{ id: 'clause_1', title: 'Termination', category: 'Termination & Default', riskLevel: 'MEDIUM', plainLanguageExplanation: 'The agreement states how it may end.', potentialImplication: 'The parties must follow the stated process.', sourcePage: 1, sourceSection: 'Section 6', sourceClauseText: "Termination requires 30 days' written notice." }] });
    if (systemInstruction.includes('rigorous risk audit')) return JSON.stringify({ attentionScore: { overallLevel: 'MEDIUM', overallScore: 40, breakdown: { financial: 20, termination: 50, liability: 30, restrictions: 20, deadlines: 30, disputeResolution: 20 }, summary: 'Review the stated terms.' }, risks: [] });
    if (systemInstruction.includes('actionable checklist')) return JSON.stringify(validActionPlan());
    if (systemInstruction.includes('lawyer consultation')) return JSON.stringify(validLawyerBrief());
    return JSON.stringify({});
  });
}

/**
 * Generate a minimal, standards-compliant PDF 1.4 that pdf-parse@1.1.1 can parse.
 *
 * PDFKit generates PDFs that the bundled pdf.js (v1.10.100) inside pdf-parse cannot
 * reliably read, because pdf-parse's pdfjs does `new Uint8Array(buf)` on the raw
 * Buffer object. Node.js Buffers from Buffer.concat() have a non-zero `byteOffset`
 * into their underlying ArrayBuffer pool; when pdfjs's webpack bundle wraps such a
 * Buffer with `new Uint8Array(buf)` it accidentally creates a view that starts at
 * position 0 of the full pool ArrayBuffer — wrong bytes, corrupted XRef offsets,
 * "bad XRef entry" error.
 *
 * This hand-crafted builder avoids the issue by:
 *  1. Assembling the complete PDF as a single Latin-1 string first.
 *  2. Calling Buffer.from(str, 'binary') once — this always allocates a fresh Buffer
 *     with byteOffset === 0, which pdfjs handles correctly.
 *  3. Returning a Uint8Array (also byteOffset === 0) so the File constructor gets
 *     the bytes it expects.
 */
function makePdf(text: string): Uint8Array {
  // Escape PDF string literal special chars
  const escaped = text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

  const NL = '\r\n';
  const stream = `BT /F1 12 Tf 72 720 Td (${escaped}) Tj ET`;
  const streamLen = Buffer.byteLength(stream, 'latin1');

  const obj1 = `1 0 obj${NL}<< /Type /Catalog /Pages 2 0 R >>${NL}endobj${NL}`;
  const obj2 = `2 0 obj${NL}<< /Type /Pages /Kids [3 0 R] /Count 1 >>${NL}endobj${NL}`;
  const obj3 = `3 0 obj${NL}<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>${NL}endobj${NL}`;
  const obj4 = `4 0 obj${NL}<< /Length ${streamLen} >>${NL}stream${NL}${stream}${NL}endstream${NL}endobj${NL}`;
  const obj5 = `5 0 obj${NL}<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>${NL}endobj${NL}`;

  const header = `%PDF-1.4${NL}`;
  const body = header + obj1 + obj2 + obj3 + obj4 + obj5;

  // Compute byte offsets for each object within the body string
  const byteLen = (s: string) => Buffer.byteLength(s, 'latin1');
  let pos = byteLen(header);
  const offsets: number[] = [];
  for (const obj of [obj1, obj2, obj3, obj4, obj5]) {
    offsets.push(pos);
    pos += byteLen(obj);
  }
  const xrefStart = pos;

  // Each XRef entry must be exactly 20 bytes: 10 digits SP 5 digits SP type CRLF
  const entry = (off: number, gen: number, type: string) =>
    String(off).padStart(10, '0') + ' ' + String(gen).padStart(5, '0') + ' ' + type + NL;

  const xref =
    `xref${NL}0 6${NL}` +
    entry(0, 65535, 'f') +
    offsets.map(o => entry(o, 0, 'n')).join('');

  const trailer =
    `trailer${NL}<< /Size 6 /Root 1 0 R >>${NL}startxref${NL}${xrefStart}${NL}%%EOF${NL}`;

  // Single Buffer.from call — then copy into a dedicated ArrayBuffer so that
  // File([u8]).arrayBuffer() in the test environment returns exactly the right bytes.
  // Node.js Buffer objects are sub-views of a shared memory pool; if we pass such a
  // Buffer to the File constructor, file.arrayBuffer() returns the FULL pool buffer
  // (up to 8 KB), causing pdf-parse's pdfjs to receive garbage bytes beyond the PDF.
  const buf = Buffer.from(body + xref + trailer, 'binary');
  const ownAb = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  return new Uint8Array(ownAb);
}

async function makeDocx(text: string): Promise<Uint8Array> {
  const zip = new JSZip();
  zip.file('[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  zip.file('_rels/.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  zip.file('word/document.xml', `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${text}</w:t></w:r></w:p></w:body></w:document>`);
  return zip.generateAsync({ type: 'uint8array' });
}

describe('real uploaded-document workflows', () => {
  beforeEach(() => {
    mockedCallGemini.mockReset();
    configureValidAi();
  });

  it('parses real TXT, DOCX, and PDF uploads and detects PII', async () => {
    const txt = await uploadFile('consulting.txt', "Section 6. Termination\nTermination requires 30 days' written notice.\nEmail: person@example.com", 'text/plain');
    const docx = await makeDocx('Section 7. Termination. Either party may terminate with 60 days written notice.');
    const docxResponse = await uploadFile('lease.docx', docx, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    const pdf = await uploadFile('policy.pdf', makePdf('Section 2. Notice. Give 15 days written notice.'), 'application/pdf');

    expect(txt.status).toBe(200);
    expect(docxResponse.status).toBe(200);
    expect(pdf.status).toBe(200);
    const txtBody = await txt.json();
    expect(txtBody.document.fullText).toBeUndefined();
    expect(txtBody.document.pages[0].text).toContain('30 days');
    expect((await docxResponse.json()).document.pages[0].text).toContain('60 days');
    expect((await pdf.json()).document.pages[0].text).toContain('15 days');
    expect(txtBody.document.sensitiveInfoDetected.emails).toHaveLength(1);  // email detected but masked in response
    expect(JSON.stringify(txtBody.document)).not.toContain('person@example.com');
  });

  it('analyzes an uploaded document and downgrades unsupported clause evidence', async () => {
    const uploaded = await uploadFile('agreement.txt', 'Section 6. Termination. Termination requires 30 days written notice.', 'text/plain');
    const documentId = (await uploaded.json()).documentId;
    mockedCallGemini.mockImplementation(async (systemInstruction: string) => {
      if (systemInstruction.includes('Extract key clauses')) return JSON.stringify({ clauses: [{ id: 'bad', title: 'Invented', category: 'Other', riskLevel: 'LOW', plainLanguageExplanation: 'Unsupported.', potentialImplication: 'Unsupported.', sourcePage: 9, sourceSection: 'Section 99', sourceClauseText: 'This quote is not in the upload.' }] });
      if (systemInstruction.includes('classify it')) return JSON.stringify({ documentType: 'other', confidence: 0.8, title: 'Agreement', primaryParties: [], governingJurisdiction: 'Unknown' });
      if (systemInstruction.includes('comprehensive, plain-language')) return JSON.stringify(validSummary());
      if (systemInstruction.includes('rigorous risk audit')) return JSON.stringify({ attentionScore: { overallLevel: 'LOW', overallScore: 10, breakdown: { financial: 0, termination: 0, liability: 0, restrictions: 0, deadlines: 0, disputeResolution: 0 }, summary: 'No supported risk.' }, risks: [] });
      if (systemInstruction.includes('actionable checklist')) return JSON.stringify(validActionPlan());
      return JSON.stringify(validLawyerBrief());
    });
    const response = await analyze(makeRequest('/api/documents/analyze', { method: 'POST', body: JSON.stringify({ documentId }) }, cookieFrom(uploaded)));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.document.analysisStatus).toBe('COMPLETED');
    expect(body.document.actionPlan).toBeDefined();
    expect(body.document.lawyerBrief).toBeDefined();
    expect(body.document.clauses.some((clause: { claimClassification: string; evidenceVerified: boolean }) => clause.claimClassification === 'UNKNOWN' && clause.evidenceVerified === false)).toBe(true);
  });

  it('sends redacted text to the analysis provider', async () => {
    const uploaded = await uploadFile('private.txt', 'Section 1. Contact person@example.com for the agreement.', 'text/plain');
    const documentId = (await uploaded.json()).documentId;
    const prompts: string[] = [];
    const implementation = mockedCallGemini.getMockImplementation();
    mockedCallGemini.mockImplementation(async (systemInstruction, userPrompt, options) => {
      prompts.push(userPrompt);
      return implementation!(systemInstruction, userPrompt, options);
    });

    const response = await analyze(makeRequest('/api/documents/analyze', { method: 'POST', body: JSON.stringify({ documentId }) }, cookieFrom(uploaded)));
    expect(response.status).toBe(200);
    expect(prompts.length).toBe(6);
    expect(prompts.every(prompt => !prompt.includes('person@example.com'))).toBe(true);
    expect(prompts.some(prompt => prompt.includes('[EMAIL REDACTED]'))).toBe(true);
  });

  it('answers uploaded-document Q&A with evidence and rejects unsupported quotes', async () => {
    const uploaded = await uploadFile('qa.txt', 'Section 6. Termination. Termination requires 30 days written notice.', 'text/plain');
    const documentId = (await uploaded.json()).documentId;
    mockedCallGemini.mockResolvedValue(JSON.stringify({ answer: 'The notice period is 30 days.', basedOnDocument: 'Section 6 states the notice period.', evidence: [{ sourceType: 'document', page: 1, section: 'Section 6', evidenceText: 'Not present in the document.' }], legalContext: '', whatRemainsUncertain: '', considerAskingLawyer: [], isHighRisk: false, highRiskCategory: 'None' }));
    const response = await ask(makeRequest('/api/ask', { method: 'POST', body: JSON.stringify({ documentId, question: 'What is the notice period?' }) }, cookieFrom(uploaded)));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.message.evidence.some((item: { verified: boolean }) => item.verified === false)).toBe(true);
  });

  it('compares two uploaded documents and removes invalid model quotes', async () => {
    const a = await uploadFile('a.txt', 'Section 1. Notice is 30 days.', 'text/plain');
    const aCookie = cookieFrom(a);
    const b = await uploadFile('b.txt', 'Section 1. Notice is 60 days.', 'text/plain', aCookie);
    const docAId = (await a.json()).documentId;
    const docBId = (await b.json()).documentId;
    mockedCallGemini.mockResolvedValue(JSON.stringify({ executiveSummary: 'The notice period changed.', keyDifferencesCount: 1, highRiskShifts: [], recommendedQuestions: [], differences: [{ id: 'd1', clauseName: 'Notice', changeType: 'modified', docAText: 'Invented A quote', docBText: 'Section 1. Notice is 60 days.', docAPage: 99, docBPage: 1, whatChanged: 'The period changed.', whyItMatters: 'Timing differs.', potentialImpact: 'Different timing.', questionToAsk: 'Why?', riskShift: 'neutral' }] }));
    const response = await compare(makeRequest('/api/compare', { method: 'POST', body: JSON.stringify({ docAId, docBId }) }, aCookie));
    const comparisonBody = await response.json();
    const difference = comparisonBody.comparison.differences[0];
    expect(response.status).toBe(200);
    expect(difference.docAText).toBeUndefined();
    expect(difference.evidenceVerified).toBe(false);
    expect(difference.docBText).toContain('60 days');
  });

  it('enforces authorization between two upload sessions', async () => {
    const userAUpload = await uploadFile('a.txt', 'Private A document.', 'text/plain');
    const userACookie = cookieFrom(userAUpload);
    const userBUpload = await uploadFile('b.txt', 'Private B document.', 'text/plain');
    const userBDocumentId = (await userBUpload.json()).documentId;
    const userBRequestCookie = cookieFrom(userBUpload);
    expect(userACookie).not.toBe(userBRequestCookie);

    const getB = await fetchDocument(userBDocumentId, userACookie);
    const askB = await ask(makeRequest('/api/ask', { method: 'POST', body: JSON.stringify({ documentId: userBDocumentId, question: 'What is this?' }) }, userACookie));
    const compareB = await compare(makeRequest('/api/compare', { method: 'POST', body: JSON.stringify({ docAId: userBDocumentId, docBId: userBDocumentId }) }, userACookie));
    expect(getB.status).toBe(404);
    expect(askB.status).toBe(404);
    expect(compareB.status).toBe(404);
    expect(userBRequestCookie).toContain('legallens_session=');
  });

  it('returns errors for malformed uploads and invalid checklist requests', async () => {
    const noFile = await upload(makeRequest('/api/documents/upload', { method: 'POST', body: new FormData() }));
    const unsupported = await uploadFile('script.exe', 'not a document', 'application/octet-stream');
    const missingAnalysisId = await analyze(makeRequest('/api/documents/analyze', { method: 'POST', body: JSON.stringify({}) }));
    const invalidToggle = await toggleChecklist(makeRequest('/api/action-plan/toggle', { method: 'POST', body: JSON.stringify({ documentId: 'missing', itemId: 'x', completed: 'yes' }) }));
    expect(noFile.status).toBe(400);
    expect(unsupported.status).toBe(415);
    expect(missingAnalysisId.status).toBe(400);
    expect(invalidToggle.status).toBe(400);
  });

  it('rejects oversized requests and filename/content mismatches before parsing', async () => {
    const oversized = await upload(makeRequest('/api/documents/upload', {
      method: 'POST',
      headers: { 'content-length': String(25 * 1024 * 1024 + 1) },
      body: 'rejected before multipart parsing',
    }));
    const mismatched = await uploadFile('not-a-pdf.pdf', 'plain text', 'application/pdf');
    expect(oversized.status).toBe(413);
    expect(mismatched.status).toBe(415);
  });

  it('redacts translation input and does not expose provider errors', async () => {
    let providerPrompt = '';
    mockedCallGemini.mockImplementation(async (_system, prompt) => {
      providerPrompt = prompt;
      return 'अनुवाद person@example.com';
    });
    const translated = await translate(makeRequest('/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text: 'Email person@example.com', targetLanguage: 'hi' }),
    }));
    expect(translated.status).toBe(200);
    expect(providerPrompt).not.toContain('person@example.com');
    expect((await translated.json()).translatedText).not.toContain('person@example.com');

    mockedCallGemini.mockRejectedValue(new Error('SECRET_PROVIDER_ERROR'));
    const failed = await translate(makeRequest('/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text: 'hello', targetLanguage: 'hi' }),
    }));
    const failedBody = await failed.json();
    expect(failed.status).toBe(500);
    expect(JSON.stringify(failedBody)).not.toContain('SECRET_PROVIDER_ERROR');
  });

  it('falls back safely when every AI response is malformed JSON', async () => {
    mockedCallGemini.mockResolvedValue('not-json');
    const uploaded = await uploadFile('malformed-ai.txt', 'A plain uploaded agreement.', 'text/plain');
    const documentId = (await uploaded.json()).documentId;
    const response = await analyze(makeRequest('/api/documents/analyze', { method: 'POST', body: JSON.stringify({ documentId }) }, cookieFrom(uploaded)));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.document.analysisStatus).toBe('COMPLETED');
    expect(body.document.summary.executiveSummary).toBeTruthy();
    expect(body.document.risks).toEqual([]);
  });

  async function fetchDocument(documentId: string, cookie: string) {
    const { GET } = await import('@/app/api/documents/[id]/route');
    return GET(makeRequest(`/api/documents/${documentId}`, {}, cookie), { params: Promise.resolve({ id: documentId }) });
  }
});
