import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/ai/gemini-client';
import { redactText } from '@/lib/document-processor/pii-detector';
import { getSessionId } from '@/lib/session';

const SUPPORTED_LANGUAGES: Record<string, string> = {
  hi: 'Hindi',
  te: 'Telugu',
};

const MAX_TRANSLATE_CHARS = 10_000;

export async function POST(req: NextRequest) {
  try {
    // Require a valid session — prevents unauthenticated API-key abuse
    const session = getSessionId(req);
    if (!session.id) {
      return NextResponse.json({ error: 'Translation is temporarily unavailable.' }, { status: 503 });
    }

    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Text and targetLanguage are required' }, { status: 400 });
    }

    // Enforce text length cap before any processing
    if (typeof text !== 'string' || text.length > MAX_TRANSLATE_CHARS) {
      return NextResponse.json(
        { error: `Text exceeds the ${MAX_TRANSLATE_CHARS.toLocaleString()}-character translation limit.` },
        { status: 400 }
      );
    }

    if (targetLanguage === 'en' || targetLanguage === 'English') {
      return NextResponse.json({ translatedText: text });
    }

    // Strict whitelist — targetLanguage must be a known code, never interpolated raw into the prompt
    const langName = SUPPORTED_LANGUAGES[targetLanguage as string];
    if (!langName) {
      return NextResponse.json(
        { error: 'Unsupported target language. Supported values: hi, te.' },
        { status: 400 }
      );
    }

    const safeText = redactText(text);

    // langName comes from our own map, never from user input
    const systemPrompt = `You are a certified legal translation engine for Indian jurisdictions.
Translate the following legal explanation accurately into ${langName}.
CRITICAL:
1. Preserve technical precision and statutory terms.
2. If translating to Hindi or Telugu, use formal and accessible vernacular script (Devanagari / Telugu script).
3. Do not alter dates, monetary amounts (e.g. ₹5,00,000), percentages, or clause numbers.
4. Output ONLY the translated text without commentary.`;

    const result = await callGemini(systemPrompt, `Text to translate:\n${safeText}`, { temperature: 0.1 });

    return NextResponse.json({
      translatedText: redactText(result.trim() || safeText)
    });
  } catch (error: unknown) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'The text could not be translated.' }, { status: 500 });
  }
}
