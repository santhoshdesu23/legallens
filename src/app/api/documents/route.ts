import { NextRequest, NextResponse } from 'next/server';
import { documentStore } from '@/lib/store';
import { getSessionId, setSessionCookie } from '@/lib/session';
import { toPublicDocument } from '@/lib/security/public-document';

export async function GET(req: NextRequest) {
  const session = getSessionId(req);
  const docs = documentStore.getAll()
    .filter(doc => documentStore.canAccess(doc, session.id))
    .map(toPublicDocument);
  const response = NextResponse.json({ documents: docs });
  if (session.isNew) setSessionCookie(response, session.id);
  return response;
}
