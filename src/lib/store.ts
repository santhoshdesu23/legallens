import { LegalDocument, QAMessage } from './types';
import { ALL_DEMO_DOCUMENTS } from './demo-data';

class DocumentStore {
  private documents: Map<string, LegalDocument> = new Map();
  /**
   * QA threads are keyed by `${documentId}:${sessionId}` so that two different
   * sessions asking questions against the same demo document cannot read each
   * other's conversation history.
   */
  private qaThreads: Map<string, QAMessage[]> = new Map();

  constructor() {
    // Preload demo documents into storage
    for (const doc of ALL_DEMO_DOCUMENTS) {
      this.documents.set(doc.id, { ...doc });
    }
  }

  public getAll(): LegalDocument[] {
    return Array.from(this.documents.values());
  }

  public getById(id: string): LegalDocument | undefined {
    return this.documents.get(id);
  }

  public canAccess(doc: LegalDocument | undefined, sessionId: string): boolean {
    return Boolean(doc && (doc.isSyntheticDemo || doc.ownerId === sessionId));
  }

  public save(doc: LegalDocument): void {
    this.documents.set(doc.id, doc);
  }

  public delete(id: string): boolean {
    return this.documents.delete(id);
  }

  private threadKey(documentId: string, sessionId: string): string {
    return `${documentId}:${sessionId}`;
  }

  public getQAThread(documentId: string, sessionId: string): QAMessage[] {
    return this.qaThreads.get(this.threadKey(documentId, sessionId)) || [];
  }

  public addQAMessage(documentId: string, sessionId: string, message: QAMessage): void {
    const key = this.threadKey(documentId, sessionId);
    const thread = this.qaThreads.get(key) || [];
    thread.push(message);
    this.qaThreads.set(key, thread);
  }

  public updateChecklistItem(documentId: string, itemId: string, completed: boolean): boolean {
    const doc = this.getById(documentId);
    if (!doc || !doc.actionPlan) return false;

    const item = doc.actionPlan.immediateChecklist.find(i => i.id === itemId);
    if (item) {
      item.completed = completed;
      return true;
    }
    return false;
  }
}

// Keep one store instance for the lifetime of the server process, including
// across separately loaded API route bundles.
type StoreGlobal = typeof globalThis & {
  __legalLensStore?: DocumentStore;
};

const storeGlobal = globalThis as StoreGlobal;
const globalStore: DocumentStore = storeGlobal.__legalLensStore || new DocumentStore();
storeGlobal.__legalLensStore = globalStore;

export const documentStore = globalStore;
