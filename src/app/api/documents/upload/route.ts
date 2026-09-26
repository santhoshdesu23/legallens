import { NextRequest, NextResponse } from 'next/server';
import { documentStore } from '@/lib/store';
import { parseFileToText, chunkDocumentPages } from '@/lib/document-processor/parser';
import { detectSensitiveInfo } from '@/lib/document-processor/pii-detector';
import { LegalDocument } from '@/lib/types';
import { getSessionId, setSessionCookie } from '@/lib/session';
import { maxUploadBytes, validateUploadedFile } from '@/lib/security/file-validation';
import { toPublicDocument } from '@/lib/security/public-document';

export async function POST(req: NextRequest) {
  try {
    const session = getSessionId(req);
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > maxUploadBytes()) {
      return NextResponse.json({ error: 'File exceeds the 25MB upload limit.' }, { status: 413 });
    }
    if (!session.id) {
      return NextResponse.json({ error: 'Document upload is temporarily unavailable.' }, { status: 503 });
    }
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name
      // Strip any path components an attacker might embed in the filename
      .replace(/[/\\]/g, '_')
      // Collapse sequences of dots that could confuse path traversal checks
      .replace(/\.{2,}/g, '.')
      .trim() || 'upload';
    const fileSize = file.size;
    const mimeType = file.type || 'application/octet-stream';
    if (fileSize > maxUploadBytes()) {
      return NextResponse.json({ error: 'File exceeds the 25MB upload limit.' }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const validationError = validateUploadedFile(fileName, mimeType, buffer);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 415 });
    }

    // Parse pages and extract full text
    let pages: DocumentPage[] = [];
    let fullText = '';
    try {
      const parsed = await parseFileToText(buffer, fileName, mimeType);
      pages = parsed.pages;
      fullText = parsed.fullText;
    } catch (parseError: unknown) {
      console.warn('Document parse error:', parseError);
      const msg = parseError instanceof Error ? parseError.message : 'We couldn\'t reliably extract text from this document. Try uploading a clearer PDF, DOCX, or text file.';
      return NextResponse.json({ error: msg }, { status: 422 });
    }

    if (!fullText || fullText.trim().length === 0) {
      return NextResponse.json({
        error: 'We couldn\'t reliably extract text from this document. Try uploading a clearer PDF, DOCX, or text file.'
      }, { status: 422 });
    }

    const docId = 'doc_' + crypto.randomUUID();
    const chunks = chunkDocumentPages(docId, pages);
    const sensitiveInfo = detectSensitiveInfo(fullText);

    // Initial draft document object
    const newDoc: LegalDocument = {
      id: docId,
      ownerId: session.id,
      title: fileName.replace(/\.[^/.]+$/, '').replace(/[_ -]+/g, ' '),
      fileName,
      fileSize,
      uploadedAt: new Date().toISOString(),
      documentType: 'other',
      pages,
      fullText,
      chunks,
      sensitiveInfoDetected: sensitiveInfo,
      isSyntheticDemo: false,
      analysisStatus: 'PENDING'
    };

    documentStore.save(newDoc);

    const response = NextResponse.json({
      success: true,
      documentId: docId,
      document: toPublicDocument(newDoc),
      message: 'Document successfully parsed, pages detected, and indexed.'
    });
    if (session.isNew) setSessionCookie(response, session.id);
    return response;
  } catch (error: unknown) {
    console.error('Document upload error:', error);
    return NextResponse.json({
      error: 'The document could not be uploaded or processed.'
    }, { status: 500 });
  }
}
