# Clinical Ethics & AI Safety Framework

## AI-Powered Health Information Intelligence & Credibility Assessment System

---

## 1. Ethical AI Principles

1. **Non-Diagnostic Imperative**: The system operates exclusively as an information intelligence and credibility assessment tool. It does not output medical diagnoses, suggest differential diagnostic probabilities, or establish care plans.
2. **Physician-Centered Care**: The platform actively reinforces the physician-patient relationship. All inconsistency findings conclude with:
   > *"Potential inconsistency detected. Please verify with a qualified healthcare professional."*
3. **Absence of Adversarial Accusation**: The system never states *"The doctor made an error"* or *"The prescription is wrong."* Instead, it neutrally highlights discrepancies across documents for professional clinical reconciliation.
4. **Transparent Source Attribution**: Every extracted entity and credibility verdict cites exact source files, page numbers, and peer-reviewed DOI references.

---

## 2. Uncertainty Communication Framework

When biomedical literature is sparse or conflicting:
- The system defaults to **"Insufficient Evidence"** or **"Partially Supported"** rather than forcing a binary True/False verdict.
- **AI Confidence Score** (algorithmic certainty) is explicitly separated from **Evidence Strength** (the quality of published scientific trials).
- Visual warning banners appear prominently if a user enters claims suggesting cessation of life-critical treatments (insulin, antihypertensives, chemotherapy).
