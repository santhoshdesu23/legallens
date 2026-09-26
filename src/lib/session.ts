import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { getSessionSecret } from './security/session';

const SESSION_COOKIE = 'legallens_session';
function sign(sessionId: string): string {
  const secret = getSessionSecret();
  if (!secret) throw new Error('Session security is not configured');
  return createHmac('sha256', secret).update(sessionId).digest('hex');
}

function isValid(value: string): boolean {
  const [sessionId, signature] = value.split('.');
  if (!sessionId || !signature || !/^[0-9a-f-]{36}$/.test(sessionId) || !/^[0-9a-f]{64}$/.test(signature)) return false;
  const expected = Buffer.from(sign(sessionId), 'hex');
  const actual = Buffer.from(signature, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function getSessionId(req: NextRequest): { id: string; isNew: boolean } {
  if (!getSessionSecret()) return { id: '', isNew: false };
  const existing = req.cookies.get(SESSION_COOKIE)?.value;
  if (existing && isValid(existing)) return { id: existing.split('.')[0], isNew: false };
  return { id: crypto.randomUUID(), isNew: true };
}

export function setSessionCookie(response: NextResponse, sessionId: string): void {
  if (!getSessionSecret()) return;
  response.cookies.set(SESSION_COOKIE, `${sessionId}.${sign(sessionId)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}