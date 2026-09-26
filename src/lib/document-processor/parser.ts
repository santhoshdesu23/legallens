import { DocumentChunk, DocumentPage } from '../types';
import mammoth from 'mammoth';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import { randomUUID } from 'crypto';

const pdfParse: (
  // pdf-parse@1.1.1 with its bundled pdf.js (v1.10.100) has a known incompatibility
  // with Node.js v24+: when given a Buffer object it cannot reliably parse the XRef
  // table ("bad XRef entry"). Passing a file-system path string works correctly
  // because pdf-parse then uses PDFNodeStream which reads the file independently.
  dataBuffer: string,
  options?: { pagerender?: (pageData: any) => Promise<string> }
) => Promise<unknown> = require('pdf-parse/lib/pdf-parse.js');

export async function parseFileToText(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ pages: DocumentPage[]; fullText: string }> {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (ext === 'docx' || mimeType.includes('wordprocessingml')) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const rawText = result.value || '';
      return splitIntoSimulatedPages(rawText);
    } catch (e) {
      console.warn('Mammoth docx parse failed, falling back to string extraction:', e);
      return splitIntoSimulatedPages(buffer.toString('utf-8'));
    }
  }

  // If text file or markdown
  if (ext === 'txt' || ext === 'md' || mimeType.includes('text/plain') || mimeType.includes('text/markdown')) {
    let text = buffer.toString('utf-8');
    if (text.charCodeAt(0) === 0xfeff) {
      text = text.slice(1);
    }
    if (text.includes('\ufffd')) {
      const latin1 = buffer.toString('latin1');
      if (!latin1.includes('\ufffd')) {
        text = latin1;
      }
    }
    return splitIntoSimulatedPages(text);
  }

  if (ext === 'pdf' || mimeType === 'application/pdf') {
    const pageTexts: string[] = [];
    const renderPage = async (pageData: any): Promise<string> => {
      const textContent = await pageData.getTextContent();
      const pageText = textContent.items
        .map((item: { str?: string }) => item.str || '')
        .join(' ')
        .replace(/[ \t]+/g, ' ')
        .trim();
      pageTexts.push(pageText);
      return pageText;
    };

    // Write to a temp file so pdf-parse receives a path string, not a Buffer.
    // pdf-parse@1.1.1's bundled pdf.js (v1.10.100) fails to parse the XRef table
    // when given a Buffer in Node.js v24+. Passing a file path causes it to use
    // PDFNodeStream which reads the file correctly.
    const tmpPath = join(tmpdir(), `legallens-pdf-${randomUUID()}.pdf`);
    try {
      writeFileSync(tmpPath, buffer);
      await pdfParse(tmpPath, { pagerender: renderPage as any });
    } finally {
      try { unlinkSync(tmpPath); } catch { /* best-effort cleanup */ }
    }
    const pages = pageTexts.map((text, index) => ({
      pageNumber: index + 1,
      text,
    })).filter(page => page.text.length > 0);

    if (pages.length === 0) {
      throw new Error('No text could be extracted from this PDF. Scanned PDFs require OCR, which is not enabled.');
    }

    return {
      pages,
      fullText: pages.map(page => page.text).join('\n\n'),
    };
  }

  throw new Error(`Unsupported document type: ${ext || mimeType}. Upload a PDF, DOCX, TXT, or Markdown file.`);
}

export function splitIntoSimulatedPages(fullText: string, charsPerPage = 2200): { pages: DocumentPage[]; fullText: string } {
  // If text contains explicit page delimiters (e.g. --- Page 2 --- or FormFeed \f)
  if (fullText.includes('\f')) {
    const parts = fullText.split('\f');
    const pages: DocumentPage[] = parts.map((pt, idx) => ({
      pageNumber: idx + 1,
      text: pt.trim(),
    })).filter(p => p.text.length > 0);

    if (pages.length > 0) {
      return { pages, fullText };
    }
  }

  const pageMatch = fullText.split(/\n(?=(?:---|\*\*\*)\s*Page\s*\d+)/i);
  if (pageMatch.length > 1) {
    const pages: DocumentPage[] = pageMatch.map((pt, idx) => ({
      pageNumber: idx + 1,
      text: pt.trim(),
    })).filter(p => p.text.length > 0);
    return { pages, fullText };
  }

  // Otherwise, split on paragraph/clause boundaries preserving semantic cohesion
  const paragraphs = fullText.split(/\n\s*\n/);
  const pages: DocumentPage[] = [];
  let currentPageText = '';
  let pageIndex = 1;

  for (const para of paragraphs) {
    if ((currentPageText.length + para.length > charsPerPage) && currentPageText.length > 0) {
      pages.push({
        pageNumber: pageIndex++,
        text: currentPageText.trim(),
      });
      currentPageText = para;
    } else {
      currentPageText += (currentPageText ? '\n\n' : '') + para;
    }
  }

  if (currentPageText.trim().length > 0) {
    pages.push({
      pageNumber: pageIndex,
      text: currentPageText.trim(),
    });
  }

  if (pages.length === 0) {
    pages.push({ pageNumber: 1, text: fullText.trim() });
  }

  return { pages, fullText };
}

export function chunkDocumentPages(
  documentId: string,
  pages: DocumentPage[],
  targetChunkSize = 750
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  let chunkCount = 1;

  for (const page of pages) {
    const lines = page.text.split('\n');
    let currentChunk = '';
    let currentSection = '';
    let currentClause = '';

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Detect section/clause headings (e.g. "1. Term", "Section 4. Termination", "ARTICLE III")
      const headingMatch = trimmed.match(/^(?:Section\s+\d+|ARTICLE\s+[IVXLCDM]+|\d+\.[\d.]*)\s+([A-Za-z\s]+)/i);
      if (headingMatch) {
        currentSection = headingMatch[0];
        currentClause = headingMatch[1] || currentSection;
      }

      if ((currentChunk.length + trimmed.length > targetChunkSize) && currentChunk.length > 0) {
        chunks.push({
          id: `${documentId}_chk_${chunkCount++}`,
          documentId,
          page: page.pageNumber,
          section: currentSection || `Page ${page.pageNumber}`,
          clause: currentClause || undefined,
          content: currentChunk.trim(),
        });
        currentChunk = trimmed;
      } else {
        currentChunk += (currentChunk ? '\n' : '') + trimmed;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push({
        id: `${documentId}_chk_${chunkCount++}`,
        documentId,
        page: page.pageNumber,
        section: currentSection || `Page ${page.pageNumber}`,
        clause: currentClause || undefined,
        content: currentChunk.trim(),
      });
    }
  }

  return chunks;
}
