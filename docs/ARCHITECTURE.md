# System Architecture & Technical Specification

## AI-Powered Health Information Intelligence & Credibility Assessment System
**Final-Year Engineering Capstone Project**

---

## 1. Architectural Overview

The platform implements a resilient, multi-tiered architecture that integrates a client-side React SPA, an Express / Node.js full-stack gateway, a FastAPI Python service layer, and a Gemini 3.8 Flash RAG inference engine.

```
+-----------------------------------------------------------------------+
|                           User Touchpoints                            |
|    General User (Claims)  |  Caregiver (Docs)  |  Clinician (Audit)   |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                    Client Application (React 19 + Vite)               |
| - Role-Based Access Control (RBAC) Switcher                           |
| - Interactive Multi-Stage Claim Pipeline Visualizer                   |
| - Drag-and-Drop Medical Document & OCR Interface                      |
| - Patient Reconciliation & Cross-Document Inconsistency View          |
| - High-Density Clinician Discrepancy Desk & Action Log                |
| - RAG Evidence Explorer & Analysis History Audit Trail                |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                       Application Gateway (Express)                   |
| - Port 3000 Ingress / Reverse Proxy                                   |
| - Vite Middleware Development Injection                               |
| - In-Memory Multer Document Stream Processing                         |
| - Cross-Document Discrepancy & Missing Info Engine                    |
+-----------------------------------------------------------------------+
                                  |
            +---------------------+---------------------+
            v                                           v
+-----------------------------+             +---------------------------+
|    RAG Clinical Corpus      |             |   Gemini 3.8 Flash SDK    |
| - Cochrane Systematic Revs  |             | - Clinical Extraction     |
| - ADA & ACC/AHA Guidelines  |             | - Multi-Factor Credibility|
| - FDA & CDC Advisories      |             | - Deterministic Safety    |
| - NCI Oncology Studies      |             |   Hazard Interceptor      |
+-----------------------------+             +---------------------------+
```

---

## 2. Multi-Stage Health Claim Credibility Pipeline

The system enforces a strict 8-stage verification pipeline:

1. **Claim Normalization**: Strips colloquialisms, corrects common misspellings, and isolates the functional physiological assertion.
2. **Clinical Entity Extraction**: Identifies interventions (e.g., *Vitamin C*, *Cinnamon*), diseases/targets (*Common Cold*, *Type 2 Diabetes*), and proposed outcome verbs (*Cure*, *Prevent*, *Substitute*).
3. **RAG Evidence Retrieval**: Queries the curated peer-reviewed corpus using weighted token matching and semantic relevance scoring.
4. **Evidence Quality Assessment**: Evaluates publication hierarchy (Systematic Review > RCT > Observational > Advisory).
5. **Claim vs Evidence Comparison**: Analyzes concordance, partial support, conflicting findings, or complete absence of clinical proof.
6. **Multi-Factor Classification**: Maps finding to one of 7 standardized verdicts:
   - *Supported*
   - *Partially Supported*
   - *Misleading*
   - *Unsupported*
   - *False*
   - *Insufficient Evidence*
   - *Potentially Dangerous*
7. **Clinical Risk Stratification**: Computes patient harm potential (*Low*, *Medium*, *High*, *Critical*).
8. **Explainable Synthesis**: Generates plain-language explanation, evidence synthesis, recommended clinical action, and verified DOI citations.

---

## 3. Cross-Document Inconsistency Detection Algorithm

For multi-document patient charts, the system cross-references extracted entities to detect:

1. **Medication Dosage Discrepancies**:
   $$\text{Discrepancy}(m_A, m_B) = (\text{NormName}(m_A) == \text{NormName}(m_B)) \land (\text{Dosage}(m_A) \neq \text{Dosage}(m_B))$$
   - Example: Clinic Prescription ($500\text{ mg}$) vs Discharge Summary ($1000\text{ mg}$).

2. **Allergy vs Prescribed Medication Conflict**:
   $$\text{Contraindication}(a, m) = \text{CrossReactive}(a.\text{allergen}, m.\text{drugClass})$$
   - Example: Documented *Penicillin* allergy vs prescribed *Amoxicillin-Clavulanate* ($\beta$-lactam cross-reactivity).

3. **Demographic Concordance**:
   - Compares Date of Birth (DOB) and MRN across documents to flag accidental chart mixing.

---

## 4. Missing Information Detection Audit

The audit inspects the extracted clinical schema for high-consequence omissions:
- **Allergy History Missing**: High Severity ($\rightarrow$ acute hypersensitivity risk).
- **Medication Dosage Missing**: High Severity ($\rightarrow$ dosing ambiguity).
- **Symptom Duration Missing**: Medium Severity ($\rightarrow$ acute vs chronic differentiation).
- **Follow-up Timeframe Missing**: Medium Severity ($\rightarrow$ continuity of care gap).
