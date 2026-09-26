import { LegalDocument } from './types';
import { chunkDocumentPages } from './document-processor/parser';

export const DEMO_DOC_EMPLOYMENT_V1: LegalDocument = {
  id: 'demo_emp_v1',
  title: 'Executive Employment Agreement (v1 - Initial Offer)',
  fileName: 'Employment_Agreement_v1.pdf',
  fileSize: 142000,
  uploadedAt: '2026-09-10T10:00:00.000Z',
  documentType: 'employment_agreement',
  isSyntheticDemo: true,
  analysisStatus: 'COMPLETED',
  sensitiveInfoDetected: {
    names: ['Rohan Sharma', 'Priya Menon'],
    emails: ['rohan.sharma@example.com', 'hr@nexustech.io'],
    phones: ['+91 9876543210'],
    ids: ['ABCDE1234F'],
    financials: ['₹28,00,000', '₹2,50,000', '₹5,00,000']
  },
  pages: [
    {
      pageNumber: 1,
      text: `EMPLOYMENT AGREEMENT (VERSION 1)
This Employment Agreement ("Agreement") is executed on 1st October 2024 between:
1. NEXUS TECHNOLOGIES INDIA PRIVATE LIMITED ("Employer"), having registered office at Embassy Tech Village, Bengaluru, Karnataka; and
2. ROHAN SHARMA ("Employee"), residing at Indiranagar, Bengaluru.

1. APPOINTMENT & TERM
The Employer hereby employs the Employee as Senior Systems Architect starting October 15, 2024. Employment is on a full-time, regular basis.

2. COMPENSATION & BENEFITS
The Employee shall receive a gross annual fixed remuneration of ₹28,00,000 (Rupees Twenty Eight Lakhs only) payable monthly, plus an annual performance incentive up to ₹4,00,000.

3. NOTICE PERIOD & TERMINATION
Either party may terminate this Agreement without cause by giving thirty (30) days' written notice, or payment of gross salary in lieu of notice. The Employer may terminate immediately with cause in events of willful misconduct or material breach after a 15-day cure notice.`
    },
    {
      pageNumber: 2,
      text: `4. CONFIDENTIALITY & PROPRIETARY INFORMATION
The Employee agrees to maintain strict confidentiality of all proprietary source code, customer records, and technical trade secrets during and for a period of twelve (12) months following departure.

5. NON-COMPETE & NON-SOLICITATION
During the term of employment and for six (6) months thereafter within Bengaluru municipal limits, the Employee shall not directly solicit clients of the Employer with whom the Employee had personal contact.

6. LIMITATION OF LIABILITY & INDEMNITY
The Employee's total liability to the Employer for inadvertent errors or omissions shall be capped at a maximum of ₹5,00,000 (Rupees Five Lakhs). Neither party shall be liable for indirect or consequential damages.

7. DISPUTE RESOLUTION & GOVERNING LAW
This Agreement shall be governed by the laws of India. Any unresolved dispute shall be referred to mediation in Bengaluru, and thereafter subject to the jurisdiction of courts in Bengaluru, Karnataka.`
    }
  ],
  fullText: `EMPLOYMENT AGREEMENT (VERSION 1)...`,
  chunks: [],
  attentionScore: {
    overallLevel: 'LOW',
    overallScore: 28,
    breakdown: {
      financial: 20,
      termination: 25,
      liability: 30,
      restrictions: 35,
      deadlines: 20,
      disputeResolution: 25
    },
    summary: 'Standard balanced bilateral employment agreement with reasonable 30-day notice, standard ₹5L liability cap, and reasonable non-solicitation bounds.'
  },
  summary: {
    executiveSummary: 'This is an employment contract offering the role of Senior Systems Architect with ₹28L fixed compensation. It features a standard 30-day notice period, 12-month confidentiality, a 6-month non-solicitation clause, and a ₹5 Lakh liability cap.',
    whatThisDocumentIs: 'This appears to be an initial standard bilateral employment agreement for a senior software engineering professional.',
    readingLevels: {
      simple: 'A standard job contract for a Senior Systems Architect paying ₹28 Lakhs a year, requiring 30 days notice to leave.',
      detailed: 'Comprehensive bilateral employment agreement detailing duties, ₹28,00,000 CTC, 30-day mutual termination notice, and standard IP covenants.',
      professional: 'A balanced employment services contract with mutual termination mechanisms and bounded post-employment restrictive covenants compliant with Indian law.'
    },
    keyPoints: {
      parties: 'Nexus Technologies India Pvt Ltd (Employer) & Rohan Sharma (Employee)',
      purpose: 'Employment as Senior Systems Architect',
      term: 'Commences October 15, 2024 (Regular full-time)',
      payment: '₹28,00,000 per annum + performance bonus',
      obligations: 'Full-time duties, 12-month confidentiality',
      termination: '30 days written notice by either party or pay in lieu',
      disputeResolution: 'Mediation followed by Bengaluru courts jurisdiction'
    }
  },
  clauses: [
    {
      id: 'c_v1_1',
      title: 'Notice Period & Termination',
      category: 'Termination & Default',
      riskLevel: 'LOW',
      plainLanguageExplanation: 'Both you and the company can terminate with 30 days notice or pay in lieu.',
      potentialImplication: 'Fair and standard exit timeline.',
      sourcePage: 1,
      sourceSection: 'Section 3',
      sourceClauseText: 'Either party may terminate this Agreement without cause by giving thirty (30) days\' written notice, or payment of gross salary in lieu of notice.'
    },
    {
      id: 'c_v1_2',
      title: 'Limitation of Liability Cap',
      category: 'Liability & Indemnity',
      riskLevel: 'LOW',
      plainLanguageExplanation: 'Your financial liability for errors is capped at ₹5,00,000.',
      potentialImplication: 'Protects you from open-ended financial lawsuits.',
      sourcePage: 2,
      sourceSection: 'Section 6',
      sourceClauseText: 'The Employee\'s total liability to the Employer for inadvertent errors or omissions shall be capped at a maximum of ₹5,00,000.'
    }
  ],
  risks: [
    {
      id: 'r_v1_1',
      title: 'Post-Termination Non-Solicitation (6 Months)',
      riskLevel: 'LOW',
      category: 'Restrictions',
      whyFlagged: 'Contains a 6-month non-solicitation restriction within Bengaluru.',
      relevantClause: 'Section 5 (Non-Compete & Non-Solicitation)',
      page: 2,
      evidence: 'for six (6) months thereafter within Bengaluru municipal limits, the Employee shall not directly solicit clients',
      potentialImplication: 'Limits contacting previous clients for 6 months after leaving.',
      questionForLawyer: 'Is this non-solicitation clause enforceable under Section 27 of the Indian Contract Act?'
    }
  ],
  deadlines: [
    {
      id: 'd_v1_1',
      date: '2024-10-15',
      event: 'Official Employment Start Date',
      sourceClause: 'Section 1 (Appointment & Term)',
      sourcePage: 1,
      potentialImportance: 'Joining date and vesting schedule commencement.',
      isLegalDeadline: true
    },
    {
      id: 'd_v1_2',
      date: '30 Days Notice',
      event: 'Written notice required for voluntary resignation',
      sourceClause: 'Section 3 (Notice Period)',
      sourcePage: 1,
      potentialImportance: 'Exit handover timeline.',
      isLegalDeadline: true
    }
  ],
  actionPlan: {
    whatAppearsToBeHappening: 'You have received an initial employment offer for Senior Systems Architect.',
    immediateChecklist: [
      { id: 'chk_1', text: 'Confirm start date of October 15, 2024 matches your availability', completed: true, category: 'Immediate', priority: 'HIGH' },
      { id: 'chk_2', text: 'Verify compensation breakdown (Fixed vs Bonus)', completed: true, category: 'Verification', priority: 'HIGH' },
      { id: 'chk_3', text: 'Ensure previous employer relieving letter is secured', completed: false, category: 'Gather Correspondence', priority: 'MEDIUM' }
    ],
    documentsToCollect: [
      'Offer Letter & Annexures',
      'Relieving Letter & Experience Certificate from prior employer',
      'Bank Account details for salary credit'
    ],
    importantDates: [
      { id: 'dt_1', date: '2024-10-15', event: 'Joining Date', sourceClause: 'Section 1', sourcePage: 1, potentialImportance: 'Report to Bengaluru office', isLegalDeadline: true }
    ],
    options: [
      {
        id: 'opt_1',
        title: 'Sign Agreement as Drafted',
        purpose: 'Accept terms and proceed with joining',
        potentialAdvantages: ['Standard terms', 'Low risk exposure', 'Fair notice period'],
        potentialConsiderations: ['Ensure relocation reimbursement is clarified in writing'],
        informationNeeded: ['Tax deduction declaration'],
        whenProfessionalAdviceUseful: 'Only if you have an active competing consultancy'
      }
    ]
  },
  lawyerBrief: {
    situationSummary: 'Prospective employee reviewing standard initial employment agreement with Nexus Technologies.',
    parties: [
      { name: 'Nexus Technologies India Pvt Ltd', role: 'Employer', obligationsSummary: 'Payment of salary and provision of benefits' },
      { name: 'Rohan Sharma', role: 'Employee', obligationsSummary: 'Performance of engineering architecture duties' }
    ],
    relevantDocuments: ['Employment_Agreement_v1.pdf'],
    importantDates: [{ date: '2024-10-15', event: 'Joining Date', page: 1 }],
    importantClauses: [
      { clause: 'Section 3 - Notice Period', page: 1, explanation: '30 days notice period' },
      { clause: 'Section 6 - Liability Cap', page: 2, explanation: '₹5L maximum liability' }
    ],
    potentialIssuesForReview: [
      { issue: '6-Month Non-solicitation scope', severity: 'LOW', notes: 'Reasonable and restricted to municipal limits' }
    ],
    questionsForLawyer: [
      'Does the 6-month non-solicitation clause pose any risk if I transition to another product firm?'
    ],
    missingInformation: ['Specific IP assignment annexure schedule'],
    documentsToBring: ['Signed offer letter copy', 'ID proofs']
  }
};

export const DEMO_DOC_EMPLOYMENT_V2: LegalDocument = {
  id: 'demo_emp_v2',
  title: 'Executive Employment Agreement (v2 - Revised Draft with Critical Clauses)',
  fileName: 'Employment_Agreement_v2_Revised.pdf',
  fileSize: 168000,
  uploadedAt: '2026-09-12T14:30:00.000Z',
  documentType: 'employment_agreement',
  isSyntheticDemo: true,
  analysisStatus: 'COMPLETED',
  sensitiveInfoDetected: {
    names: ['Rohan Sharma', 'Vikramaditya Singhania', 'Priya Menon'],
    emails: ['rohan.sharma@example.com', 'legal@nexustech.io'],
    phones: ['+91 9876543210'],
    ids: ['ABCDE1234F'],
    financials: ['₹32,00,000', '₹50,00,000', 'Uncapped Indemnity']
  },
  pages: [
    {
      pageNumber: 1,
      text: `EMPLOYMENT AGREEMENT (REVISED VERSION 2)
This Revised Agreement is executed on 5th October 2024 between NEXUS TECHNOLOGIES INDIA PRIVATE LIMITED ("Employer") and ROHAN SHARMA ("Employee").

1. APPOINTMENT & TERM
The Employee is appointed Senior Systems Architect. This Agreement shall automatically renew on each anniversary for successive 1-year terms unless Employer terminates with 60 days notice.

2. COMPENSATION
Base salary is increased to ₹32,00,000 per annum with a mandatory 2-year retention clawback of ₹6,00,000 if Employee resigns before 24 months.

3. NOTICE PERIOD & ASYMMETRIC TERMINATION
The Employee must provide ninety (90) days' written notice prior to resignation. Employer may terminate Employee at any time without notice and with zero severance pay during any probationary or project transition window.`
    },
    {
      pageNumber: 2,
      text: `4. PERPETUAL INTELLECTUAL PROPERTY WAIVER
The Employee assigns all prior, present, and future inventions created at any time during employment, whether during office hours or on personal equipment, and waives all moral rights globally.

5. RESTRICTIVE COVENANTS & 24-MONTH PAN-INDIA NON-COMPETE
The Employee agrees that for twenty-four (24) months post-termination, the Employee shall not work for, advise, consult, or invest in any entity operating in cloud computing or software engineering anywhere in the Republic of India.

6. UNCAPPED INDEMNIFICATION & LIQUIDATED DAMAGES
The Employee agrees to fully indemnify and hold harmless Employer against all losses, customer claims, legal expenses, and reputational damages without any monetary cap. Violation of Section 5 incurs automatic liquidated damages of ₹50,00,000.

7. EXCLUSIVE JURISDICTION & ARBITRATION
Any dispute shall be referred to a sole arbitrator appointed exclusively by the Employer. Venue of arbitration shall be New Delhi, and costs shall be borne solely by the Employee.`
    }
  ],
  fullText: `EMPLOYMENT AGREEMENT (REVISED VERSION 2)...`,
  chunks: [],
  attentionScore: {
    overallLevel: 'CRITICAL',
    overallScore: 88,
    breakdown: {
      financial: 85,
      termination: 90,
      liability: 95,
      restrictions: 95,
      deadlines: 75,
      disputeResolution: 90
    },
    summary: 'High attention required: Contains severe one-sided clauses including a 90-day notice period, 24-month non-compete, ₹50L liquidated damages, uncapped indemnification, and unilateral employer-appointed arbitrator.'
  },
  summary: {
    executiveSummary: 'This revised version increases base compensation to ₹32L, but introduces significantly stricter obligations: notice period increased to 90 days, unilateral employer termination rights, an aggressive 24-month nationwide non-compete, uncapped personal liability, and a ₹50 Lakh liquidated damages penalty.',
    whatThisDocumentIs: 'This appears to be a revised employment contract containing multiple heavily employer-favorable terms and post-employment restrictions.',
    readingLevels: {
      simple: 'They offered you more money (₹32 Lakhs), but you now have to give 3 months notice to quit, cannot work for any tech company in India for 2 years after leaving, and could face huge financial penalties.',
      detailed: 'Revised draft increasing fixed pay to ₹32,00,000 while introducing high-risk clauses: 90-day employee notice period, immediate employer termination, broad IP waiver, ₹50,00,000 liquidated damages, and unilateral arbitration venue.',
      professional: 'A highly restrictive employment contract with substantial legal vulnerabilities under Indian jurisprudence, notably Section 27 of the Indian Contract Act, 1872 regarding restraint of trade and asymmetric arbitration clauses.'
    },
    keyPoints: {
      parties: 'Nexus Technologies India Pvt Ltd & Rohan Sharma',
      purpose: 'Senior Systems Architect Appointment (Revised)',
      term: 'Annual automatic renewal with 2-year retention clawback',
      payment: '₹32,00,000 CTC + ₹6,00,000 2-year clawback clause',
      obligations: 'Perpetual worldwide IP assignment on personal & office time',
      termination: '90 days notice for Employee; 0 days notice for Employer',
      disputeResolution: 'Sole arbitrator appointed exclusively by Employer in New Delhi'
    }
  },
  clauses: [
    {
      id: 'c_v2_1',
      title: '90-Day Employee Notice Period & Unilateral Termination',
      category: 'Termination & Default',
      riskLevel: 'HIGH',
      plainLanguageExplanation: 'You must give 90 days notice, but the employer can terminate you with zero notice during transition windows.',
      potentialImplication: 'Makes it difficult to accept new job offers that require 30-day joiners.',
      sourcePage: 1,
      sourceSection: 'Section 3',
      sourceClauseText: 'The Employee must provide ninety (90) days\' written notice prior to resignation. Employer may terminate Employee at any time without notice...'
    },
    {
      id: 'c_v2_2',
      title: '24-Month Pan-India Non-Compete',
      category: 'Non-Compete & Restrictive Covenants',
      riskLevel: 'CRITICAL',
      plainLanguageExplanation: 'Bars you from working in software or cloud computing anywhere in India for 2 years after leaving.',
      potentialImplication: 'Extremely restrictive on your career mobility, although legally questionable under Indian law.',
      sourcePage: 2,
      sourceSection: 'Section 5',
      sourceClauseText: 'for twenty-four (24) months post-termination, the Employee shall not work for, advise, consult, or invest in any entity operating in cloud computing or software engineering anywhere in the Republic of India.'
    },
    {
      id: 'c_v2_3',
      title: 'Uncapped Indemnity & ₹50 Lakh Liquidated Damages',
      category: 'Penalties & Forfeitures',
      riskLevel: 'CRITICAL',
      plainLanguageExplanation: 'You are personally liable for unlimited damages and face a ₹50,00,000 penalty for alleged covenant breach.',
      potentialImplication: 'Exposes your personal assets to immense financial risk.',
      sourcePage: 2,
      sourceSection: 'Section 6',
      sourceClauseText: 'The Employee agrees to fully indemnify and hold harmless Employer against all losses... without any monetary cap. Violation of Section 5 incurs automatic liquidated damages of ₹50,00,000.'
    },
    {
      id: 'c_v2_4',
      title: 'Unilateral Arbitrator Appointment',
      category: 'Dispute Resolution & Jurisdiction',
      riskLevel: 'HIGH',
      plainLanguageExplanation: 'Employer exclusively chooses the arbitrator, and you must pay all arbitration costs.',
      potentialImplication: 'Lacks procedural neutrality and creates severe financial barrier to dispute resolution.',
      sourcePage: 2,
      sourceSection: 'Section 7',
      sourceClauseText: 'Any dispute shall be referred to a sole arbitrator appointed exclusively by the Employer... costs shall be borne solely by the Employee.'
    }
  ],
  risks: [
    {
      id: 'r_v2_1',
      title: 'Extensive 24-Month Restraint of Trade',
      riskLevel: 'CRITICAL',
      category: 'Restrictions',
      whyFlagged: 'Non-compete covenants post-employment are generally void under Section 27 of Indian Contract Act, yet can lead to harassment or injunction threats.',
      relevantClause: 'Section 5 (Restrictive Covenants)',
      page: 2,
      evidence: 'twenty-four (24) months post-termination... anywhere in the Republic of India',
      potentialImplication: 'Employer may attempt to block subsequent employment or send legal notices to future employers.',
      questionForLawyer: 'How can we negotiate the complete removal of this post-termination non-compete clause referencing Indian Supreme Court precedents?'
    },
    {
      id: 'r_v2_2',
      title: 'Uncapped Liability & Severe Liquidated Damages Penalty',
      riskLevel: 'CRITICAL',
      category: 'Liability',
      whyFlagged: 'Previous ₹5,00,000 liability cap was removed and replaced with ₹50,00,000 liquidated damages penalty.',
      relevantClause: 'Section 6 (Uncapped Indemnification)',
      page: 2,
      evidence: 'without any monetary cap. Violation of Section 5 incurs automatic liquidated damages of ₹50,00,000.',
      potentialImplication: 'High personal balance sheet exposure.',
      questionForLawyer: 'Can we reinstate the mutual liability cap from version 1 (capped at ₹5,00,000 or 3 months salary)?'
    },
    {
      id: 'r_v2_3',
      title: 'Asymmetric 90-Day Notice Period',
      riskLevel: 'HIGH',
      category: 'Termination',
      whyFlagged: 'Notice period tripled from 30 days to 90 days, with zero notice obligation on the employer.',
      relevantClause: 'Section 3 (Notice Period)',
      page: 1,
      evidence: 'ninety (90) days\' written notice... Employer may terminate at any time without notice',
      potentialImplication: 'Locks you into long transitions while providing zero job security.',
      questionForLawyer: 'What strategy should be used to request mutual 30-day notice reciprocity?'
    }
  ],
  deadlines: [
    {
      id: 'd_v2_1',
      date: '90 Days Notice',
      event: 'Mandatory Resignation Notice Period',
      sourceClause: 'Section 3',
      sourcePage: 1,
      potentialImportance: 'Notice period required before relieving',
      isLegalDeadline: true
    },
    {
      id: 'd_v2_2',
      date: '24 Months Post-Termination',
      event: 'Purported Non-Compete Period',
      sourceClause: 'Section 5',
      sourcePage: 2,
      potentialImportance: 'Purported restriction window',
      isLegalDeadline: false
    }
  ],
  actionPlan: {
    whatAppearsToBeHappening: 'The employer has submitted a revised version (v2) which provides a compensation bump but injects high-risk covenants and liabilities.',
    immediateChecklist: [
      { id: 'chk_v2_1', text: 'Do NOT sign Version 2 until critical clauses are negotiated', completed: false, category: 'Immediate', priority: 'HIGH' },
      { id: 'chk_v2_2', text: 'Prepare side-by-side redline comparison showing v1 vs v2', completed: true, category: 'Verification', priority: 'HIGH' },
      { id: 'chk_v2_3', text: 'Request redraft of Section 3 (Notice Period) back to 30 days mutual', completed: false, category: 'Immediate', priority: 'HIGH' },
      { id: 'chk_v2_4', text: 'Request removal of ₹50L penalty and 24-month non-compete', completed: false, category: 'Professional Review', priority: 'HIGH' },
      { id: 'chk_v2_5', text: 'Consult an employment attorney with generated Lawyer Brief', completed: false, category: 'Professional Review', priority: 'MEDIUM' }
    ],
    documentsToCollect: [
      'Original Version 1 Offer / Agreement',
      'Version 2 Revised Contract with tracked changes',
      'Email communications regarding the ₹4L salary increment'
    ],
    importantDates: [
      { id: 'dt_v2_1', date: '90 Days Notice', event: 'Employee Exit Notice', sourceClause: 'Section 3', sourcePage: 1, potentialImportance: 'Resignation obligation', isLegalDeadline: true }
    ],
    options: [
      {
        id: 'opt_v2_1',
        title: 'Counter-Propose Version 1 Terms with Version 2 Compensation',
        purpose: 'Retain the ₹32L CTC while reverting notice period and liability caps to balanced v1 levels',
        potentialAdvantages: ['Professional pushback standard in senior hiring', 'Removes severe personal risks'],
        potentialConsiderations: ['May require HR approval cycle'],
        informationNeeded: ['Specific markup clause wording'],
        whenProfessionalAdviceUseful: 'Drafting the counter-proposal email to HR'
      },
      {
        id: 'opt_v2_2',
        title: 'Formally Engage Legal Counsel for Redlining',
        purpose: 'Have an advocate send sanitized revisions citing standard market norms',
        potentialAdvantages: ['Authoritative legal grounding citing Section 27', 'Protects your legal rights'],
        potentialConsiderations: ['Lawyer consultation fee'],
        informationNeeded: ['Exported LegalLens Lawyer Brief'],
        whenProfessionalAdviceUseful: 'Immediately prior to any signing'
      }
    ]
  },
  lawyerBrief: {
    situationSummary: 'Candidate offered Senior Systems Architect role at Nexus Technologies. Version 1 had standard terms. Version 2 increased CTC to ₹32L but introduced 90-day notice, 24-month pan-India non-compete, uncapped liability, ₹50L liquidated damages, and unilateral arbitration.',
    parties: [
      { name: 'Nexus Technologies India Pvt Ltd', role: 'Employer', obligationsSummary: 'Offering employment and compensation' },
      { name: 'Rohan Sharma', role: 'Employee', obligationsSummary: 'Engineering duties' }
    ],
    relevantDocuments: ['Employment_Agreement_v1.pdf', 'Employment_Agreement_v2_Revised.pdf'],
    importantDates: [
      { date: '90 Days Notice', event: 'Resignation requirement', page: 1 },
      { date: '24 Months', event: 'Purported non-compete restriction', page: 2 }
    ],
    importantClauses: [
      { clause: 'Section 3 - Asymmetric Notice', page: 1, explanation: '90 days for employee, 0 days for employer' },
      { clause: 'Section 5 - 24-Month Non-Compete', page: 2, explanation: 'Pan-India restraint on trade' },
      { clause: 'Section 6 - Uncapped Indemnity & ₹50L Penalty', page: 2, explanation: 'Liquidated damages clause' },
      { clause: 'Section 7 - Sole Arbitrator by Employer', page: 2, explanation: 'Perkins Eastman precedent violation' }
    ],
    potentialIssuesForReview: [
      { issue: 'Enforceability of Section 5 Restraint of Trade under Sec 27 Indian Contract Act', severity: 'CRITICAL', notes: 'Well-settled by Supreme Court in Percept D\'Mark that post-service restrictive covenants are void.' },
      { issue: 'Unilateral appointment of arbitrator under Section 12(5) of Arbitration Act', severity: 'HIGH', notes: 'Violates TRF Ltd / Perkins Eastman line of authority.' }
    ],
    questionsForLawyer: [
      '1. How can we most tactfully negotiate the notice period back to 30 days without jeopardizing the offer?',
      '2. What specific clause wording should we propose for replacing the uncapped indemnity with a 3-month salary liability cap?',
      '3. In the event they refuse to remove the 24-month non-compete, does signing it carry realistic injunctive risk in Karnataka courts?'
    ],
    missingInformation: ['Stock option grant terms mentioned in original discussions'],
    documentsToBring: [
      'Both Version 1 and Version 2 draft copies',
      'Email trail containing HR justifications',
      'Draft counter-proposal letter'
    ]
  }
};

export const DEMO_DOC_RENTAL: LegalDocument = {
  id: 'demo_rental_agreement',
  title: 'Residential Tenancy & Lease Agreement',
  fileName: 'Residential_Rental_Agreement.pdf',
  fileSize: 118000,
  uploadedAt: '2026-09-08T09:15:00.000Z',
  documentType: 'residential_lease',
  isSyntheticDemo: true,
  analysisStatus: 'COMPLETED',
  sensitiveInfoDetected: {
    names: ['Suresh Krishnan (Landlord)', 'Ananya Rao (Tenant)'],
    emails: ['suresh.k@example.com', 'ananya.rao@example.com'],
    phones: ['+91 9123456780'],
    ids: ['ZZZZP9876Q'],
    financials: ['₹45,000/month', '₹2,50,000 Security Deposit', '10% Annual Escalation']
  },
  pages: [
    {
      pageNumber: 1,
      text: `RESIDENTIAL LEASE AGREEMENT
Executed on 1st September 2024 between SURESH KRISHNAN ("Lessor/Landlord") and ANANYA RAO ("Lessee/Tenant") for Flat 402, Green Glen Layout, Bellandur, Bengaluru.

1. LEASE TERM & LOCK-IN PERIOD
The lease shall be for eleven (11) months commencing September 15, 2024. Both parties agree to a strict mandatory six (6) month lock-in period during which neither party may terminate the lease. Early vacancy forfeits the entire security deposit.

2. MONTHLY RENT & MAINTENANCE
The Tenant shall pay a monthly rent of ₹45,000 in advance by the 5th of each calendar month. Building society maintenance of ₹4,500 shall be paid directly to the RWA.

3. SECURITY DEPOSIT
The Tenant has deposited an interest-free refundable security deposit of ₹2,50,000 (Rupees Two Lakhs Fifty Thousand). The Landlord shall refund this deposit within seven (7) days of vacant handover, subject to painting charges fixed at one month rent (₹45,000).`
    },
    {
      pageNumber: 2,
      text: `4. MAINTENANCE & REPAIRS
The Landlord is responsible for major structural repairs. The Tenant is responsible for day-to-day minor repairs up to ₹2,500 per incident.

5. INSPECTION & ENTRY
The Landlord or authorized agents may inspect the premises at reasonable hours with a minimum of twenty-four (24) hours prior notice, except in emergencies.

6. TERMINATION & NOTICE
Following the 6-month lock-in, either party may terminate by giving two (2) months' written notice. Failure to vacate upon termination renders Tenant liable for triple rent as unauthorized occupant penalty.`
    }
  ],
  fullText: `RESIDENTIAL LEASE AGREEMENT...`,
  chunks: [],
  attentionScore: {
    overallLevel: 'MEDIUM',
    overallScore: 45,
    breakdown: {
      financial: 50,
      termination: 45,
      liability: 35,
      restrictions: 40,
      deadlines: 50,
      disputeResolution: 30
    },
    summary: 'Standard 11-month tenancy agreement with a 6-month lock-in period and mandatory ₹45,000 painting deduction from the ₹2.5L deposit.'
  },
  summary: {
    executiveSummary: 'This is an 11-month residential rental contract for Flat 402, Bellandur at ₹45,000/month with a ₹2,50,000 security deposit. It includes a 6-month lock-in period, 2-month post-lockin notice, and an automatic ₹45,000 painting deduction upon vacating.',
    whatThisDocumentIs: 'This appears to be a standard 11-month residential leave and license / tenancy agreement.',
    readingLevels: {
      simple: 'Rent is ₹45,000 a month with ₹2.5 Lakh deposit. You cannot leave in the first 6 months without losing your deposit, and ₹45,000 will be cut for painting when you move out.',
      detailed: 'Residential lease establishing an 11-month term from Sept 15, 2024, ₹45,000 monthly rent, ₹2.5L deposit refundable in 7 days minus painting deduction, and 24-hr inspection notice.',
      professional: 'An 11-month residential tenancy instrument under the Transfer of Property Act, 1882 with customary lock-in and liquidated move-out refurbishment covenants.'
    },
    keyPoints: {
      parties: 'Suresh Krishnan (Landlord) & Ananya Rao (Tenant)',
      purpose: 'Lease of Flat 402, Green Glen Layout, Bengaluru',
      term: '11 months from Sept 15, 2024 (6 months lock-in)',
      payment: '₹45,000 monthly rent + ₹4,500 maintenance',
      obligations: 'Minor repairs up to ₹2,500; allow inspection with 24hr notice',
      termination: '2 months notice after lock-in period',
      disputeResolution: 'Civil courts having jurisdiction in Bengaluru'
    }
  },
  clauses: [
    {
      id: 'cr_1',
      title: '6-Month Mandatory Lock-in Period',
      category: 'Termination & Default',
      riskLevel: 'MEDIUM',
      plainLanguageExplanation: 'You cannot move out during the first 6 months without losing your entire ₹2.5 Lakh deposit.',
      potentialImplication: 'Financial loss if your job location changes before March 2025.',
      sourcePage: 1,
      sourceSection: 'Section 1',
      sourceClauseText: 'Both parties agree to a strict mandatory six (6) month lock-in period during which neither party may terminate the lease. Early vacancy forfeits the entire security deposit.'
    },
    {
      id: 'cr_2',
      title: 'Automatic Painting Deduction (1 Month Rent)',
      category: 'Payment & Fees',
      riskLevel: 'MEDIUM',
      plainLanguageExplanation: 'A flat ₹45,000 will be deducted from your deposit regardless of the actual paint condition.',
      potentialImplication: 'Reduces deposit refund amount.',
      sourcePage: 1,
      sourceSection: 'Section 3',
      sourceClauseText: 'subject to painting charges fixed at one month rent (₹45,000).'
    }
  ],
  risks: [
    {
      id: 'rr_1',
      title: 'Total Deposit Forfeiture on Early Exit',
      riskLevel: 'HIGH',
      category: 'Financial',
      whyFlagged: 'Clause imposes full forfeiture of ₹2.5 Lakhs even if a replacement tenant is found.',
      relevantClause: 'Section 1 (Lease Term & Lock-In)',
      page: 1,
      evidence: 'Early vacancy forfeits the entire security deposit.',
      potentialImplication: 'Significant financial loss upon unexpected relocation.',
      questionForLawyer: 'Can a replacement-tenant clause be inserted to mitigate deposit forfeiture?'
    }
  ],
  deadlines: [
    {
      id: 'dr_1',
      date: '2024-09-15',
      event: 'Lease Commencement Date',
      sourceClause: 'Section 1',
      sourcePage: 1,
      potentialImportance: 'Key handover and meter reading date',
      isLegalDeadline: true
    },
    {
      id: 'dr_2',
      date: '5th of Every Month',
      event: 'Monthly Rent Payment Due',
      sourceClause: 'Section 2',
      sourcePage: 1,
      potentialImportance: 'Avoid late penalty charges',
      isLegalDeadline: true
    }
  ],
  actionPlan: {
    whatAppearsToBeHappening: 'You are preparing to execute a residential lease for Flat 402 in Bengaluru.',
    immediateChecklist: [
      { id: 'chkr_1', text: 'Document existing property condition with photos/video prior to move-in', completed: false, category: 'Immediate', priority: 'HIGH' },
      { id: 'chkr_2', text: 'Obtain written receipt for ₹2,50,000 security deposit transfer', completed: true, category: 'Verification', priority: 'HIGH' },
      { id: 'chkr_3', text: 'Check electricity and water meter initial readings on Sept 15', completed: false, category: 'Immediate', priority: 'MEDIUM' }
    ],
    documentsToCollect: [
      'Copy of Landlord Property Tax Receipt / Khata certificate',
      'Bank payment confirmation for deposit',
      'Move-in condition inspection checklist'
    ],
    importantDates: [
      { id: 'dtr_1', date: '2024-09-15', event: 'Move-in & Handover', sourceClause: 'Section 1', sourcePage: 1, potentialImportance: 'Possession date', isLegalDeadline: true }
    ],
    options: [
      {
        id: 'optr_1',
        title: 'Request Mutual Lock-in Proration',
        purpose: 'Add clause allowing deposit return if replacement tenant is provided with 30-day notice',
        potentialAdvantages: ['Eliminates full forfeiture risk'],
        potentialConsiderations: ['Landlord may prefer fixed term'],
        informationNeeded: ['Written amendment clause'],
        whenProfessionalAdviceUseful: 'Drafting amendment addendum'
      }
    ]
  },
  lawyerBrief: {
    situationSummary: 'Tenant entering into 11-month lease seeking clarification on deposit forfeiture and painting deductions.',
    parties: [
      { name: 'Suresh Krishnan', role: 'Landlord', obligationsSummary: 'Handover and structural maintenance' },
      { name: 'Ananya Rao', role: 'Tenant', obligationsSummary: 'Payment of ₹45k rent and minor upkeep' }
    ],
    relevantDocuments: ['Residential_Rental_Agreement.pdf'],
    importantDates: [{ date: '2024-09-15', event: 'Move-in date', page: 1 }],
    importantClauses: [
      { clause: 'Section 1 - Lock-In', page: 1, explanation: '6-month deposit forfeiture' },
      { clause: 'Section 3 - Painting Deduction', page: 1, explanation: 'Flat ₹45k deduction' }
    ],
    potentialIssuesForReview: [
      { issue: 'Deposit forfeiture enforceability without actual damage proof', severity: 'MEDIUM', notes: 'Under Section 74 Indian Contract Act, penalties must reflect reasonable compensation for actual loss.' }
    ],
    questionsForLawyer: [
      'Is a landlord legally entitled to deduct a full month rent for painting if the tenancy lasted only 11 months?'
    ],
    missingInformation: ['Current utility bill clearance certificates'],
    documentsToBring: ['Lease draft', 'Security deposit bank transaction receipt']
  }
};

export const DEMO_DOC_NDA: LegalDocument = {
  id: 'demo_nda',
  title: 'Mutual Non-Disclosure Agreement (Tech Collaboration)',
  fileName: 'Mutual_NDA_Standard.pdf',
  fileSize: 95000,
  uploadedAt: '2026-09-05T16:00:00.000Z',
  documentType: 'nda',
  isSyntheticDemo: true,
  analysisStatus: 'COMPLETED',
  sensitiveInfoDetected: {
    names: ['Apex AI Labs', 'DataSphere Systems'],
    emails: ['legal@apexai.com', 'partners@datasphere.io'],
    phones: ['+1 (555) 019-2834'],
    ids: ['EIN-82-991204'],
    financials: ['$100,000 Injunctive Bond Relief']
  },
  pages: [
    {
      pageNumber: 1,
      text: `MUTUAL NON-DISCLOSURE AGREEMENT
This Agreement is entered into by and between APEX AI LABS INC. ("Party A") and DATASPHERE SYSTEMS LLC ("Party B").

1. PURPOSE
The parties wish to explore a potential strategic API partnership and technology integration ("Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public technical, product roadmap, algorithmic, and financial data disclosed in writing or marked as proprietary.

3. EXCLUSIONS FROM CONFIDENTIALITY
Confidentiality obligations shall not apply to information that: (a) is or becomes publicly known through no fault of Recipient; (b) was already known to Recipient prior to disclosure; (c) is independently developed without reference to Discloser's data.`
    },
    {
      pageNumber: 2,
      text: `4. TERM & DURATION OF OBLIGATIONS
This Agreement shall remain in effect for one (1) year. Confidentiality obligations with respect to disclosed information shall survive for a period of two (2) years following disclosure; provided that Trade Secrets shall remain protected perpetually.

5. REMEDIES & INJUNCTIVE RELIEF
The parties acknowledge that money damages may be inadequate for breach, and Discloser shall be entitled to seek equitable injunctive relief without posting a bond.

6. GOVERNING LAW
Governed by the laws of Delaware, USA, without regard to conflict of law principles.`
    }
  ],
  fullText: `MUTUAL NON-DISCLOSURE AGREEMENT...`,
  chunks: [],
  attentionScore: {
    overallLevel: 'LOW',
    overallScore: 18,
    breakdown: {
      financial: 15,
      termination: 15,
      liability: 20,
      restrictions: 25,
      deadlines: 15,
      disputeResolution: 20
    },
    summary: 'Standard mutual balanced NDA with standard 2-year survival term, trade secret carveout, and mutual standard exclusions.'
  },
  summary: {
    executiveSummary: 'Standard mutual non-disclosure agreement for tech integration discussions. 1-year agreement term with a 2-year confidentiality survival period (perpetual for trade secrets), standard industry exclusions, and mutual injunctive relief.',
    whatThisDocumentIs: 'This appears to be a balanced, standard bilateral non-disclosure agreement between two corporate entities.',
    readingLevels: {
      simple: 'A mutual secret-keeping agreement between two tech companies lasting 2 years.',
      detailed: 'Bilateral NDA protecting proprietary data, source code, and roadmaps for 2 years with perpetual trade secret protections.',
      professional: 'A standard Delaware law mutual non-disclosure agreement incorporating customary carve-outs and equitable relief covenants.'
    },
    keyPoints: {
      parties: 'Apex AI Labs Inc. & DataSphere Systems LLC',
      purpose: 'Explore strategic API integration and partnership',
      term: '1-year active term, 2-year survival (perpetual for trade secrets)',
      payment: 'No monetary exchange; mutual covenant',
      obligations: 'Reasonable degree of care in protecting shared proprietary data',
      termination: 'Automatic expiration after 1 year',
      disputeResolution: 'Delaware state and federal courts'
    }
  },
  clauses: [
    {
      id: 'cnda_1',
      title: 'Confidentiality Survival Period (2 Years)',
      category: 'Confidentiality & IP',
      riskLevel: 'LOW',
      plainLanguageExplanation: 'Secrets must be protected for 2 years after being shared; trade secrets protected forever.',
      potentialImplication: 'Standard market timeline.',
      sourcePage: 2,
      sourceSection: 'Section 4',
      sourceClauseText: 'shall survive for a period of two (2) years following disclosure; provided that Trade Secrets shall remain protected perpetually.'
    }
  ],
  risks: [],
  deadlines: [
    {
      id: 'dnda_1',
      date: '2 Years Post-Disclosure',
      event: 'Expiration of Standard Confidentiality Obligation',
      sourceClause: 'Section 4',
      sourcePage: 2,
      potentialImportance: 'Date when general non-trade secret information enters open status',
      isLegalDeadline: true
    }
  ],
  actionPlan: {
    whatAppearsToBeHappening: 'Two technology companies are exchanging proprietary information to evaluate a product integration.',
    immediateChecklist: [
      { id: 'chkn_1', text: 'Mark all shared technical documentation as "CONFIDENTIAL"', completed: true, category: 'Immediate', priority: 'HIGH' },
      { id: 'chkn_2', text: 'Maintain an internal log of shared repository access tokens and slide decks', completed: false, category: 'Verification', priority: 'MEDIUM' }
    ],
    documentsToCollect: ['List of shared API specifications and proprietary architecture docs'],
    importantDates: [],
    options: [
      {
        id: 'optn_1',
        title: 'Execute Mutual NDA',
        purpose: 'Commence technical API data exchange safely',
        potentialAdvantages: ['Mutual protection', 'Standard market terms'],
        potentialConsiderations: ['Ensure proprietary source code is properly stamped'],
        informationNeeded: ['Authorized corporate signatory'],
        whenProfessionalAdviceUseful: 'If patent-pending inventions are being revealed'
      }
    ]
  },
  lawyerBrief: {
    situationSummary: 'Standard mutual NDA evaluation for cross-company API exploration.',
    parties: [
      { name: 'Apex AI Labs Inc.', role: 'Discloser / Recipient', obligationsSummary: 'Mutual confidentiality' },
      { name: 'DataSphere Systems LLC', role: 'Discloser / Recipient', obligationsSummary: 'Mutual confidentiality' }
    ],
    relevantDocuments: ['Mutual_NDA_Standard.pdf'],
    importantDates: [],
    importantClauses: [{ clause: 'Section 4 - 2 Year Term', page: 2, explanation: 'Standard survival' }],
    potentialIssuesForReview: [],
    questionsForLawyer: ['Does the trade secret definition adequately protect proprietary machine learning weights?'],
    missingInformation: [],
    documentsToBring: ['NDA execution copy']
  }
};

// Generate chunk indices for all demo documents
[DEMO_DOC_EMPLOYMENT_V1, DEMO_DOC_EMPLOYMENT_V2, DEMO_DOC_RENTAL, DEMO_DOC_NDA].forEach(doc => {
  doc.chunks = chunkDocumentPages(doc.id, doc.pages);
});

export const ALL_DEMO_DOCUMENTS: LegalDocument[] = [
  DEMO_DOC_EMPLOYMENT_V1,
  DEMO_DOC_EMPLOYMENT_V2,
  DEMO_DOC_RENTAL,
  DEMO_DOC_NDA
];
