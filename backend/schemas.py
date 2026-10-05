"""
Pydantic Schemas for Request & Response Data Validation
"""

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class HealthClaimRequest(BaseModel):
    claim: str = Field(..., min_length=3, description="Health or medical claim to verify")
    user_id: Optional[str] = "user-gen-01"

class EvidenceSourceSchema(BaseModel):
    id: str
    title: str
    organization: str
    journal: Optional[str] = None
    publication_date: str
    evidence_type: str
    doi_or_url: str
    summary: str
    relevance_score: float
    is_peer_reviewed: bool

class ClaimAnalysisResponse(BaseModel):
    id: str
    claim: str
    normalized_claim: str
    entities_extracted: List[str]
    verdict: str
    confidence: float
    evidence_strength: str
    risk_level: str
    is_dangerous_request: bool
    explanation: str
    what_evidence_says: str
    recommended_action: str
    sources: List[EvidenceSourceSchema]

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

class LoginRequest(BaseModel):
    email: str
    role: Optional[str] = "general_user"

class InconsistencyItemSchema(BaseModel):
    id: str
    category: str
    title: str
    description: str
    severity: str
    source_a: Dict[str, Any]
    source_b: Dict[str, Any]
    verification_recommendation: str

class MissingInfoItemSchema(BaseModel):
    id: str
    category: str
    item: str
    severity: str
    rationale: str
    recommended_query: str

class DoctorQuestionSchema(BaseModel):
    id: str
    category: str
    question: str
    context: str
    priority: str
