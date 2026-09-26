const PDF_MAGIC = Buffer.from('%PDF-');
const ZIP_MAGIC = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const allowedMimeTypes: Record<string, string[]> = {
  pdf: [
    'application/pdf',
    'application/x-pdf',
    'application/acrobat',
    'applications/vnd.pdf',
    'text/pdf',
  ],
  docx: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-zip',
    'application/msword',
  ],
  txt: [
    'text/plain',
    'text/x-plain',
  ],
  md: [
    'text/markdown',
    'text/plain',
    'text/x-markdown',
    'text/x-web-markdown',
    'application/x-markdown',
  ],
};

export function maxUploadBytes(): number {
  return MAX_UPLOAD_BYTES;
}

function isUtf8Text(buffer: Buffer): boolean {
  // Reject binary files that contain null bytes
  if (buffer.includes(0)) return false;
  return true;
}

function hasDocxStructure(buffer: Buffer): boolean {
  return buffer.subarray(0, 4).equals(ZIP_MAGIC)
    && buffer.includes(Buffer.from('[Content_Types].xml'))
    && buffer.includes(Buffer.from('word/document.xml'));
}

export function validateUploadedFile(fileName: string, mimeType: string, buffer: Buffer): string | null {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  if (!['pdf', 'docx', 'txt', 'md'].includes(extension)) {
    return 'Unsupported file type. Upload a PDF, DOCX, TXT, or Markdown file.';
  }

  const normalizedMime = mimeType.toLowerCase().split(';')[0].trim();
  const compatibleMimes = allowedMimeTypes[extension];
  if (normalizedMime !== 'application/octet-stream' && normalizedMime && !compatibleMimes.includes(normalizedMime)) {
    return 'The file name and declared content type do not match.';
  }

  if (extension === 'pdf' && !buffer.subarray(0, PDF_MAGIC.length).equals(PDF_MAGIC)) {
    return 'The uploaded file is not a valid PDF.';
  }
  if (extension === 'docx' && !hasDocxStructure(buffer)) {
    return 'The uploaded file is not a valid DOCX document.';
  }
  if ((extension === 'txt' || extension === 'md') && !isUtf8Text(buffer)) {
    return 'The uploaded text file is not valid UTF-8 text.';
  }

  return null;
}
