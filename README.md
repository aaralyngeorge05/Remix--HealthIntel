# AI-Powered Health Information Intelligence & Credibility Assessment System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)]()
[![React](https://img.shields.io/badge/React-19-cyan)]()
[![Gemini](https://img.shields.io/badge/Gemini-3.8_Flash-orange)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-teal)]()
[![License](https://img.shields.io/badge/License-Apache_2.0-lightgrey)]()

A full-stack, production-grade final-year engineering capstone project designed to analyze the credibility of online health information, extract structured clinical data from medical records, identify cross-document inconsistencies (such as conflicting medication dosages or allergy contraindications), audit missing clinical data, and generate actionable, evidence-based consultation questions for healthcare professionals.

---

## 🏥 Key Capabilities

1. **Health Claim Credibility Assessment & Explainable AI**:
   - 8-stage verification pipeline: Normalization $\rightarrow$ Entity Extraction $\rightarrow$ RAG Retrieval $\rightarrow$ Quality Assessment $\rightarrow$ Comparison $\rightarrow$ Classification $\rightarrow$ Risk Stratification $\rightarrow$ Explainable Synthesis.
   - Standardized verdicts: *Supported*, *Partially Supported*, *Misleading*, *Unsupported*, *False*, *Insufficient Evidence*, and *Potentially Dangerous*.
   - Explicit separation of **AI Confidence %** vs **Evidence Strength**.
   - Automatic deterministic interception of high-risk treatment cessation prompts (e.g., stopping insulin).

2. **Medical Document Upload & Extraction**:
   - Accepts multi-format documents (PDF, PNG, JPG, TXT) up to 15MB.
   - Extracts conditions, symptoms, medications (dosage, frequency, route), allergies (reaction, severity), and laboratory tests (flagging HIGH/LOW).
   - Source provenance mapping: Every extracted entity maps to document name and page number.

3. **Cross-Document Inconsistency Detection**:
   - Identifies medication dosage discrepancies across different facilities (e.g., Metformin 500 mg in clinic vs 1000 mg in discharge summary).
   - Flags dangerous allergy-medication contraindications (e.g., documented Penicillin allergy vs prescribed Amoxicillin-Clavulanate).
   - Side-by-side comparison interface showing Source Document A vs Source Document B excerpts.
   - Adheres to ethical guidelines: Uses non-adversarial phrasing (*"Potential inconsistency detected. Please verify with a qualified healthcare professional"*).

4. **Clinical Missing Information Audit**:
   - Audits missing allergy history, omitted medication dosages, missing symptom durations, and absent follow-up instructions.
   - Categorizes severity into LOW, MEDIUM, and HIGH.

5. **Questions for Healthcare Professionals**:
   - Automatically synthesizes patient consultation questions based on detected discrepancies and missing items.
   - Formatted for print or digital export for doctor visits.

6. **Role-Based Access Control (RBAC)**:
   - **General User**: Health claim verification and misinformation debunking.
   - **Caregiver**: Family patient records, missing information tracking, and doctor question generator.
   - **Healthcare Professional**: High-density clinical discrepancy reconciliation desk, active patient registry, and audit logging.

---

## 🚀 Quick Start

### Installation & Launch
```bash
# Install dependencies
npm install

# Run the development full-stack application (Port 3000)
npm run dev

# Run automated academic capstone test suite (17/17 tests)
npm test

# Build for production deployment
npm run build
```

---

## 🔬 System Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js Express Gateway (Reverse Proxy on Port 3000) + FastAPI Python microservice layer.
- **AI / LLM**: Google Gemini 3.8 Flash via `@google/genai` TypeScript SDK.
- **RAG Knowledge Base**: Curated peer-reviewed medical corpus (Cochrane Systematic Reviews, ADA Standards of Care, ACC/AHA Guidelines, FDA, CDC, NCI).
- **Safety Engine**: Hybrid AI reasoning with deterministic clinical hazard overrides.

---

## 📚 Academic Documentation

- [System Architecture Specification](docs/ARCHITECTURE.md)
- [Experimental Evaluation & Benchmarks](docs/EVALUATION_AND_BENCHMARKS.md)
- [Clinical Safety & AI Ethics Framework](docs/ETHICS_AND_SAFETY.md)
- [User Guide & Demonstration Manual](docs/USER_GUIDE.md)

---

## ⚖️ Clinical Safety Boundary

> **IMPORTANT NOTICE**: This system is **NOT an AI doctor**. It does NOT provide medical diagnoses, prescribe medications, or replace qualified medical professionals. It is designed solely as an AI-assisted information credibility intelligence and clinical reconciliation support tool. Users should always consult a licensed physician or pharmacist for clinical decisions.
