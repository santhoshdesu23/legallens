import { NextRequest, NextResponse } from 'next/server';
import { documentStore } from '@/lib/store';
import { getSessionId } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { documentId, itemId, completed } = await req.json();

    if (!documentId || !itemId || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'documentId and itemId are required' }, { status: 400 });
    }

    const session = getSessionId(req);
    if (!documentStore.canAccess(documentStore.getById(documentId), session.id)) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const updated = documentStore.updateChecklistItem(documentId, itemId, completed);
    if (!updated) {
      return NextResponse.json({ error: 'Checklist item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: updated });
  } catch (error: unknown) {
    console.error('Checklist update error:', error);
    return NextResponse.json({ error: 'The checklist item could not be updated.' }, { status: 500 });
  }
}
