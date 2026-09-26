export interface SensitiveDataReport {
  names: string[];
  emails: string[];
  phones: string[];
  ids: string[];
  financials: string[];
}

export function detectSensitiveInfo(text: string): SensitiveDataReport {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phoneRegex = /(?:\+91[\s-]?)?[6-9]\d{9}|\b(?:\+1[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
  const panAadhaarRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b|\b\d{4}\s\d{4}\s\d{4}\b/g;
  const currencyRegex = /(?:₹|Rs\.?|INR|\$|USD)\s?[\d,]+(?:\.\d{2})?(?:\s?(?:Lakh|Crore|Million|Billion))?/gi;
  
  const emails = Array.from(new Set(text.match(emailRegex) || []));
  const phones = Array.from(new Set(text.match(phoneRegex) || []));
  const ids = Array.from(new Set(text.match(panAadhaarRegex) || []));
  const financials = Array.from(new Set(text.match(currencyRegex) || []));

  // Common entity detector heuristic for names
  const nameMatches: string[] = [];
  const namePatterns = [
    /(?:between|represented by|Mr\.|Ms\.|Dr\.|Shri|Smt\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g,
    /(?:Employee|Tenant|Consultant|Party of the First Part|Party of the Second Part):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g
  ];

  for (const pattern of namePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && !nameMatches.includes(match[1])) {
        nameMatches.push(match[1]);
      }
    }
  }

  return {
    names: nameMatches.slice(0, 8),
    emails: emails.slice(0, 10),
    phones: phones.slice(0, 10),
    ids: ids.slice(0, 10),
    financials: financials.slice(0, 15)
  };
}

export function redactText(text: string, options: {
  redactEmails?: boolean;
  redactPhones?: boolean;
  redactIds?: boolean;
  redactFinancials?: boolean;
} = { redactEmails: true, redactPhones: true, redactIds: true, redactFinancials: false }): string {
  let output = text;
  
  if (options.redactEmails) {
    output = output.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REDACTED]');
  }
  if (options.redactPhones) {
    output = output.replace(/(?:\+91[\s-]?)?[6-9]\d{9}|\b(?:\+1[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, '[PHONE REDACTED]');
  }
  if (options.redactIds) {
    output = output.replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g, '[PAN REDACTED]');
    output = output.replace(/\b\d{4}\s\d{4}\s\d{4}\b/g, '[AADHAAR REDACTED]');
  }
  if (options.redactFinancials) {
    output = output.replace(/(?:₹|Rs\.?|INR|\$|USD)\s?[\d,]+(?:\.\d{2})?(?:\s?(?:Lakh|Crore|Million|Billion))?/gi, '[FINANCIAL FIGURE REDACTED]');
  }

  return output;
}
