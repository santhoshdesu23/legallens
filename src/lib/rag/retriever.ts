import { DocumentChunk, EvidenceCitation } from '../types';

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
  matchHighlights: string[];
}

// Authoritative primary statutory and regulatory database for contextual grounding
export const AUTHORITATIVE_LEGAL_SOURCES = [
  {
    title: 'Indian Contract Act, 1872',
    section: 'Section 27 (Agreement in restraint of trade, void)',
    authority: 'Legislative Department, Ministry of Law and Justice, India Code',
    url: 'https://www.indiacode.nic.in/handle/123456789/2187',
    keywords: ['non-compete', 'restraint of trade', 'employment restriction', 'post-employment', 'covenant']
  },
  {
    title: 'Indian Contract Act, 1872',
    section: 'Section 73 & 74 (Compensation for breach of contract / Liquidated Damages)',
    authority: 'Supreme Court of India / India Code',
    url: 'https://www.indiacode.nic.in/handle/123456789/2187',
    keywords: ['penalty', 'liquidated damages', 'breach', 'compensation', 'forfeiture']
  },
  {
    title: 'Arbitration and Conciliation Act, 1996',
    section: 'Section 7 & 11 (Arbitration Agreement & Appointment of Arbitrators)',
    authority: 'Ministry of Law and Justice, India Code',
    url: 'https://www.indiacode.nic.in/handle/123456789/1978',
    keywords: ['arbitration', 'arbitrator', 'dispute resolution', 'sole arbitrator', 'tribunal']
  },
  {
    title: 'Transfer of Property Act, 1882',
    section: 'Section 105 - 111 (Leases of Immovable Property & Determination of Lease)',
    authority: 'India Code / Supreme Court Jurisprudence',
    url: 'https://www.indiacode.nic.in/handle/123456789/2338',
    keywords: ['rent', 'lease', 'tenancy', 'security deposit', 'eviction', 'lock-in']
  },
  {
    title: 'Information Technology Act, 2000 & DPDP Act, 2023',
    section: 'Section 43A & Digital Personal Data Protection Norms',
    authority: 'Ministry of Electronics and Information Technology (MeitY)',
    url: 'https://www.indiacode.nic.in/handle/123456789/1999',
    keywords: ['data privacy', 'confidentiality', 'personal data', 'security breach', 'nda']
  },
  {
    title: 'Specific Relief Act, 1963',
    section: 'Section 14 & 20 (Contracts not specifically enforceable & Substituted performance)',
    authority: 'India Code',
    url: 'https://www.indiacode.nic.in/handle/123456789/2179',
    keywords: ['injunction', 'specific performance', 'damages', 'restraint']
  }
];

export function retrieveRelevantChunks(
  query: string,
  chunks: DocumentChunk[],
  topK = 5
): SearchResult[] {
  if (!chunks || chunks.length === 0) return [];

  const queryTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['what', 'who', 'where', 'when', 'which', 'does', 'can', 'the', 'are', 'is', 'this', 'that', 'for', 'with', 'other'].includes(w));

  const scored: SearchResult[] = chunks.map(chunk => {
    const textLower = chunk.content.toLowerCase();
    const metadataLower = `${chunk.section || ''} ${chunk.clause || ''}`.toLowerCase();
    let score = 0;
    const matchHighlights: string[] = [];

    // Prefer a contiguous match of the question's meaningful terms.
    const normalizedText = textLower.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ');
    const normalizedTerms = queryTerms.join(' ');
    if (normalizedTerms && normalizedText.includes(normalizedTerms)) {
      score += 20.0;
    }

    // Exact section/clause matches are stronger than incidental body matches.
    for (const term of queryTerms) {
      if (metadataLower.includes(term)) {
        score += 8.0;
      }

      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = chunk.content.match(regex);
      if (matches) {
        score += matches.length * 3.0;
        matchHighlights.push(term);
      }
    }

    // Preserve strong matches for exact dates, durations, and contractual terms.
    const numericalTerms = query.match(/\b\d+\b|notice|period|deposit|termination|indemnity|liability|salary|rent/gi);
    if (numericalTerms) {
      for (const num of numericalTerms) {
        if (textLower.includes(num.toLowerCase())) {
          score += 2.0;
        }
      }
    }

    return {
      chunk,
      score,
      matchHighlights: Array.from(new Set(matchHighlights))
    };
  });

  // Sort descending by relevance score
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export function findAuthoritativeSources(query: string, textContext: string) {
  const combined = (query + ' ' + textContext).toLowerCase();
  return AUTHORITATIVE_LEGAL_SOURCES.filter(src => 
    src.keywords.some(kw => combined.includes(kw.toLowerCase()))
  );
}

export function formatEvidenceCitations(
  documentTitle: string,
  documentId: string,
  searchResults: SearchResult[]
): EvidenceCitation[] {
  return searchResults.map(res => ({
    sourceType: 'document',
    documentId,
    documentTitle,
    page: res.chunk.page,
    section: res.chunk.section,
    clause: res.chunk.clause,
    evidenceText: res.chunk.content.substring(0, 300) + (res.chunk.content.length > 300 ? '...' : '')
  }));
}
