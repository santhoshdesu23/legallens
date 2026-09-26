import { randomBytes } from 'crypto';

type SessionGlobal = typeof globalThis & {
  __legalLensDevelopmentSessionSecret?: string;
};

const sessionGlobal = globalThis as SessionGlobal;
const developmentSecret =
  sessionGlobal.__legalLensDevelopmentSessionSecret ??
  (sessionGlobal.__legalLensDevelopmentSessionSecret = randomBytes(32).toString('hex'));

export function getSessionSecret(): string | null {
  const configured = process.env.AUTH_SECRET;
  if (configured && configured.length >= 32) return configured;
  if (process.env.NODE_ENV === 'production') return null;
  return developmentSecret;
}

export function hasValidSessionSecret(): boolean {
  return getSessionSecret() !== null;
}
