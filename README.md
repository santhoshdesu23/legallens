# ⚖️ LegalLens

### AI-Powered Legal Document Understanding & Assistance

LegalLens is a GenAI-powered legal document assistant designed to make complex legal information easier to understand and navigate.

It helps users **simplify, compare, analyze, question, and act on legal documents** while keeping the user in control and clearly distinguishing document facts from AI interpretation.

> **Important:** LegalLens provides informational assistance and is not a replacement for professional legal advice.

---

## 🚀 What LegalLens Does

LegalLens turns complex legal documents into actionable information through a single workspace.

### 🧠 1. Document Simplification

Upload a legal document and receive:

* Executive summary
* Key facts and important clauses
* Multiple reading levels

  * Simple
  * Detailed
  * Professional
* Multilingual support

  * English
  * Hindi
  * Telugu

---

### ⚖️ 2. Contract Comparison

Compare two legal documents and identify:

* Added clauses
* Removed clauses
* Modified clauses
* Changed obligations
* Changed financial terms
* Termination differences
* Liability changes
* Important risk shifts
* Questions worth discussing with a lawyer

---

### 🚨 3. Risk Analysis

LegalLens analyzes documents for important risk areas, including:

* Financial exposure
* Termination asymmetry
* Liability & indemnity
* Restrictive covenants
* Deadlines & notices
* Dispute resolution

It also provides an overall **Document Attention Score** to help users identify areas that deserve closer review.

> The Attention Score is an AI review indicator, not a determination of legal validity.

---

### 💬 4. Document-Grounded Q&A

Ask questions about an uploaded document in natural language.

LegalLens attempts to provide:

* Direct answers
* Supporting document evidence
* Page/section information where available
* Verified/unverified evidence status
* Unknown responses when information is not sufficiently supported
* Relevant legal information sources where implemented

Example:

```text
What is the termination notice period?

Who owns the intellectual property?

What happens if confidential information is disclosed?

Does this agreement contain an automatic renewal clause?
```

---

### 🧭 5. Options & Next Steps

LegalLens can help users understand potential next steps by organizing:

* Available options
* Advantages
* Considerations
* Required actions
* Situations where professional legal advice may be appropriate

---

### 📋 6. Action Plans & Checklists

Convert document information into actionable tasks.

Includes:

* Interactive checklist
* Task completion tracking
* Progress indicator
* Important deadlines
* Required documents
* Extracted milestones

---

### 👨‍⚖️ 7. Lawyer Preparation

LegalLens helps users prepare for a conversation with a legal professional.

The Lawyer Prep workspace can organize:

* Parties
* Timeline
* Important clauses
* Potential issues
* Questions to ask
* Documents to bring

This helps users have a more structured discussion with their lawyer.

---

## 🔒 Privacy & Security

Legal documents can contain sensitive information, so LegalLens includes multiple security controls.

Implemented protections include:

* Session-based document ownership
* Authorization checks
* HttpOnly session cookies
* Security headers
* Server-side upload validation
* File validation
* PII detection and redaction
* Protected document retrieval
* Protected Q&A access
* Protected comparison access
* Protected checklist operations
* AI-provider error sanitization
* Input-size limits
* AI-facing PII protection

Sensitive information such as email addresses, phone numbers, PAN and Aadhaar patterns can be detected and protected before external AI processing.

---

## 🧪 Testing & Reliability

LegalLens includes automated testing using **Vitest**.

The test suite covers areas including:

* TXT document processing
* DOCX document processing
* PDF document processing
* Document authorization
* Cross-session access protection
* PII redaction
* Malformed AI responses
* Empty evidence
* Evidence validation
* AI provider fallback
* Checklist validation
* API error handling

Run the test suite:

```bash
npm test
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Create a production build:

```bash
npm run build
```

---

## 🏗️ Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js App Router
* Next.js Route Handlers
* In-memory document/session storage

### AI

LegalLens supports configured AI providers with fallback behavior.

Current integrations include:

* Google Gemini
* Groq

The AI provider and model are configured through environment variables.

### Document Processing

Supported document formats include:

* PDF
* DOCX
* TXT
* Markdown

PDF text extraction preserves page information where supported.

---

## 🧠 LegalLens Architecture

High-level workflow:

```text
                 ┌───────────────────┐
                 │   User Uploads    │
                 │  Legal Document   │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Document Parser   │
                 │ PDF/DOCX/TXT/MD   │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ PII Detection &   │
                 │ Protection        │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Document Chunking │
                 │ & Retrieval       │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ AI Analysis       │
                 │ Summary / Clauses │
                 │ Risks / Actions   │
                 └─────────┬─────────┘
                           │
                           ▼
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   Simplify             Q&A              Compare
        │                  │                  │
        ▼                  ▼                  ▼
    Risks            Evidence          Risk Changes
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                 ┌───────────────────┐
                 │ Action Plan /     │
                 │ Lawyer Preparation│
                 └───────────────────┘
```

---

## 📂 Main Application Areas

| Area              | Purpose                           |
| ----------------- | --------------------------------- |
| `/`               | LegalLens landing page            |
| `/dashboard`      | Document overview                 |
| `/documents`      | Uploaded document repository      |
| `/documents/[id]` | Complete document workspace       |
| `/compare`        | Compare legal documents           |
| `/ask`            | Document-grounded Q&A             |
| `/risks`          | Risk analysis                     |
| `/action-plan`    | Actionable checklist              |
| `/lawyer-prep`    | Lawyer consultation preparation   |
| `/settings`       | Language and application settings |

---

## 🔌 API Areas

The application uses Next.js API route handlers for operations such as:

```text
Document Upload
Document Analysis
Document Retrieval
Document Deletion
Document Comparison
Grounded Q&A
Checklist Updates
Translation
```

API access is protected using session ownership checks where applicable.

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd legallens
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env.local
```

Add the required AI configuration.

Example:

```env
AI_PROVIDER=gemini

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

GROQ_API_KEY=your_groq_api_key

AUTH_SECRET=your_secure_random_secret
```

> Never commit `.env.local` or expose API keys publicly.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🧪 Example Demo Workflow

For a quick demonstration:

### Step 1

Upload a legal agreement.

### Step 2

Review the generated:

* Summary
* Clauses
* Risks
* Deadlines

### Step 3

Ask:

```text
What is the termination notice period?
```

### Step 4

Ask a question whose answer is **not present** in the document:

```text
Does this agreement provide health insurance?
```

LegalLens should avoid inventing unsupported information.

### Step 5

Generate:

* Action plan
* Lawyer preparation questions

### Step 6

Upload a second agreement and compare the two documents.

---

## ⚠️ Legal Safety

LegalLens follows an **assistance-first** approach.

The system is intended to:

* Explain legal documents
* Surface important information
* Help users identify questions
* Organize document information
* Prepare users for conversations with legal professionals

It is **not intended to**:

* Replace a lawyer
* Establish legal validity
* Guarantee a legal outcome
* Provide definitive legal advice
* Make decisions on behalf of the user

Users should consult a qualified legal professional for advice about their specific situation.

---

## 🎯 Project Goal

Legal information can be difficult to understand without professional assistance.

LegalLens aims to make the first layer of legal document understanding more accessible by helping users move from:

```text
Complex Legal Document
        ↓
Understand
        ↓
Verify
        ↓
Identify Risks
        ↓
Ask Better Questions
        ↓
Take Informed Next Steps
```

---

## 📌 Project Status

LegalLens is an active development project.

Core functionality includes:

* Document ingestion
* AI analysis
* Document simplification
* Clause extraction
* Risk analysis
* Grounded Q&A
* Document comparison
* Action plans
* Lawyer preparation
* PII protection
* Session authorization
* Automated testing
* AI provider fallback

Some capabilities depend on external AI provider availability and configuration.

---

## 👥 Disclaimer

This project is intended for educational, demonstration, and informational purposes.

**LegalLens is not a law firm and does not provide professional legal advice.**
