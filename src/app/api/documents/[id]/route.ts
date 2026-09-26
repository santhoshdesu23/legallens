import { NextRequest, NextResponse } from 'next/server';
import { documentStore } from '@/lib/store';
import { getSessionId } from '@/lib/session';
import { toPublicDocument } from '@/lib/security/public-document';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const doc = documentStore.getById(id);
  const session = getSessionId(req);

  if (!documentStore.canAccess(doc, session.id)) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  return NextResponse.json({ document: toPublicDocument(doc!) });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getSessionId(req);
  const doc = documentStore.getById(id);
  if (!documentStore.canAccess(doc, session.id)) {
    return NextResponse.json({ error: 'Document not found or cannot be deleted' }, { status: 404 });
  }
  const success = documentStore.delete(id);

  if (!success) {
    return NextResponse.json({ error: 'Document not found or cannot be deleted' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Document deleted successfully' });
}
