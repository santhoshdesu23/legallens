import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { parseFileToText } from '@/lib/document-processor/parser';
import { redactText } from '@/lib/document-processor/pii-detector';
import { getSessionSecret } from '@/lib/security/session';

describe('document parsing and PII processing', () => {
  it('parses plain text with explicit page boundaries', async () => {
    const result = await parseFileToText(Buffer.from('Page one\fPage two'), 'contract.txt', 'text/plain');
    expect(result.pages).toHaveLength(2);
    expect(result.pages[1].text).toBe('Page two');
  });

  it('rejects unsupported scanned-PDF-like input when no text is extracted', async () => {
    await expect(parseFileToText(Buffer.from('%PDF-not-valid'), 'scan.pdf', 'application/pdf')).rejects.toThrow();
  });

  it('redacts provider-bound identifiers while retaining legal financial context by default', () => {
    const result = redactText('Email person@example.com, phone +919876543210, PAN ABCDE1234F, amount INR 50000');
    expect(result).not.toContain('person@example.com');
    expect(result).not.toContain('+919876543210');
    expect(result).not.toContain('ABCDE1234F');
    expect(result).toContain('INR 50000');
  });

  it('parses text with UTF-8 BOM and Windows-1252 characters without failing', async () => {
    // UTF-8 BOM followed by text with em-dash or smart quotes
    const bomBuffer = Buffer.concat([Buffer.from([0xEF, 0xBB, 0xBF]), Buffer.from('Contract with BOM')]);
    const bomResult = await parseFileToText(bomBuffer, 'contract.txt', 'text/plain');
    expect(bomResult.fullText).toBe('Contract with BOM');

    // Windows-1252 text with non-UTF8 single byte (0x93 = left double quote in CP1252)
    const win1252Buffer = Buffer.from([0x93, 0x4C, 0x65, 0x61, 0x73, 0x65, 0x94]);
    const winResult = await parseFileToText(win1252Buffer, 'lease.txt', 'text/plain');
    expect(winResult.fullText.length).toBeGreaterThan(0);
  });
});

describe('AI provider fallback', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.AI_API_KEY = 'test-gemini-key';
    process.env.GROQ_API_KEY = 'test-groq-key';
  });

  afterEach(() => {
    delete process.env.AI_API_KEY;
    delete process.env.GROQ_API_KEY;
    vi.unmock('@google/generative-ai');
  });

  it('uses Groq after a transient Gemini provider failure', async () => {
    vi.doMock('@google/generative-ai', () => ({
      GoogleGenerativeAI: class {
        getGenerativeModel() {
          return { generateContent: vi.fn().mockRejectedValue(new Error('429 Too Many Requests')) };
        }
      },
    }));
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '{"ok":true}' } }] }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const { callGemini } = await import('@/lib/ai/gemini-client');
    await expect(callGemini('system', 'prompt', { jsonMode: true })).resolves.toBe('{"ok":true}');
    expect(fetchMock).toHaveBeenCalledWith('https://api.groq.com/openai/v1/chat/completions', expect.anything());
    vi.unstubAllGlobals();
  });

  it('does not fallback for a non-transient provider failure', async () => {
    vi.doMock('@google/generative-ai', () => ({
      GoogleGenerativeAI: class {
        getGenerativeModel() {
          return { generateContent: vi.fn().mockRejectedValue(new Error('401 Unauthorized')) };
        }
      },
    }));
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { callGemini } = await import('@/lib/ai/gemini-client');
    await expect(callGemini('system', 'prompt')).rejects.toThrow('401 Unauthorized');
    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('uses Groq after a 404 model not found Gemini provider failure', async () => {
    vi.doMock('@google/generative-ai', () => ({
      GoogleGenerativeAI: class {
        getGenerativeModel() {
          return { generateContent: vi.fn().mockRejectedValue(new Error('404 Not Found: model is no longer available')) };
        }
      },
    }));
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '{"ok":true}' } }] }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const { callGemini } = await import('@/lib/ai/gemini-client');
    await expect(callGemini('system', 'prompt', { jsonMode: true })).resolves.toBe('{"ok":true}');
    expect(fetchMock).toHaveBeenCalledWith('https://api.groq.com/openai/v1/chat/completions', expect.anything());
    vi.unstubAllGlobals();
  });
});

describe('file validation', () => {
  it('accepts docx files with Windows zip mime types and pdf with x-pdf', async () => {
    const { validateUploadedFile } = await import('@/lib/security/file-validation');
    const zipMagic = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
    const docxBody = Buffer.concat([zipMagic, Buffer.from('[Content_Types].xml word/document.xml')]);
    expect(validateUploadedFile('document.docx', 'application/x-zip-compressed', docxBody)).toBeNull();
    expect(validateUploadedFile('document.pdf', 'application/x-pdf', Buffer.from('%PDF-1.4 sample'))).toBeNull();
  });
});

describe('production session configuration', () => {
  it('fails closed when AUTH_SECRET is missing or too short in production', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalAuthSecret = process.env.AUTH_SECRET;
    vi.stubEnv('NODE_ENV', 'production');
    delete process.env.AUTH_SECRET;
    expect(getSessionSecret()).toBeNull();
    process.env.AUTH_SECRET = 'short';
    expect(getSessionSecret()).toBeNull();
    vi.stubEnv('NODE_ENV', originalNodeEnv || 'test');
    if (originalAuthSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = originalAuthSecret;
  });

  it('keeps the development session secret stable across module reloads', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalAuthSecret = process.env.AUTH_SECRET;
    vi.stubEnv('NODE_ENV', 'test');
    delete process.env.AUTH_SECRET;

    vi.resetModules();
    const reloadedSession = await import('@/lib/security/session');
    expect(reloadedSession.getSessionSecret()).toBe(getSessionSecret());

    vi.stubEnv('NODE_ENV', originalNodeEnv || 'test');
    if (originalAuthSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = originalAuthSecret;
  });

  it('reuses one document store across API route module reloads', async () => {
    vi.resetModules();
    const firstStoreModule = await import('@/lib/store');
    vi.resetModules();
    const secondStoreModule = await import('@/lib/store');

    expect(secondStoreModule.documentStore).toBe(firstStoreModule.documentStore);
  });
});
