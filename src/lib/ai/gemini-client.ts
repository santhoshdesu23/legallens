import { GoogleGenerativeAI } from '@google/generative-ai';

const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-120b';
const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

export interface GenerationOptions {
  model?: string;
  temperature?: number;
  jsonMode?: boolean;
}

function resolveGeminiModel(customModel?: string): string {
  const modelName = customModel || process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  if (modelName === 'gemini-1.5-flash' || modelName === 'gemini-2.0-flash' || modelName === 'gemini-2.5-flash') {
    return DEFAULT_GEMINI_MODEL;
  }
  return modelName;
}

const GROQ_FETCH_TIMEOUT_MS = 30_000;

async function callGroq(
  groqKey: string,
  systemInstruction: string,
  userPrompt: string,
  options: GenerationOptions
): Promise<string> {
  const model = options.model || process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL;
  console.log(`[AI] Using Groq -> ${model}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GROQ_FETCH_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt }
        ],
        temperature: options.temperature ?? 0.2,
        response_format: options.jsonMode ? { type: 'json_object' } : undefined
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API Error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Groq API returned no message content.');
  }
  return content;
}

async function callGeminiProvider(
  geminiKey: string,
  systemInstruction: string,
  userPrompt: string,
  options: GenerationOptions
): Promise<string> {
  const modelName = resolveGeminiModel(options.model);
  console.log(`[AI] Using Gemini -> ${modelName}`);
  const geminiClient = new GoogleGenerativeAI(geminiKey);
  const model = geminiClient.getGenerativeModel({
    model: modelName,
    systemInstruction,
    generationConfig: {
      temperature: options.temperature ?? 0.2,
      responseMimeType: options.jsonMode ? 'application/json' : undefined,
    },
  });

  const response = await model.generateContent(userPrompt);
  return response.response.text();
}

function isTransientProviderError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /\b(?:404|429|5\d{2})\b|service unavailable|temporarily unavailable|high demand|not found|no longer available|fetch failed|network|timeout|econnreset|enotfound/i.test(message);
}

export async function callGemini(
  systemInstruction: string,
  userPrompt: string,
  options: GenerationOptions = {}
): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY || '';
  const geminiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '';
  const hasGroq = Boolean(groqKey && groqKey !== 'your_groq_api_key_here');
  const hasGemini = Boolean(geminiKey && geminiKey !== 'your_gemini_api_key_here');
  // Gemini is primary whenever configured.
  if (hasGemini) {
    try {
      return await callGeminiProvider(geminiKey, systemInstruction, userPrompt, options);
    } catch (error) {
      console.warn('[AI] Gemini failed:', error instanceof Error ? error.message : error);

      if (hasGroq && isTransientProviderError(error)) {
        console.warn('[AI] Gemini → Groq fallback');
        return callGroq(groqKey, systemInstruction, userPrompt, options);
      }
      throw error;
    }
  }

  if (hasGroq) {
    return callGroq(groqKey, systemInstruction, userPrompt, options);
  }

  throw new Error('No AI API key is configured. Please add GROQ_API_KEY or GEMINI_API_KEY to your environment variables.');
}

export function parseJsonSafe<T>(rawText: string, fallback: T): T {
  try {
    // Strip markdown code blocks like ```json ... ```
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    }
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.warn('JSON parse failed for response:', rawText.substring(0, 200), err);
    return fallback;
  }
}

// NOTE: fallbackEngine was removed — it contained hardcoded PII (real-sounding names, financial
// figures) and was never called. Its presence created a risk of accidentally bypassing the real
// AI pipeline and returning fabricated data without any indication to the user.