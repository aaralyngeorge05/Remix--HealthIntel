"""
SQLAlchemy Relational Database Models
Implements Users, Patients, Documents, ExtractedEntities, HealthClaims, and Inconsistencies.
"""

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="general_user")  # general_user, caregiver, healthcare_professional
    created_at = Column(DateTime, default=datetime.utcnow)

class PatientModel(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    date_of_birth = Column(String, nullable=False)
    sex = Column(String, nullable=False)
    mrn = Column(String, unique=True, index=True, nullable=False)
    assigned_caregiver_id = Column(String, ForeignKey("users.id"), nullable=True)
    primary_physician = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("DocumentModel", back_populates="patient", cascade="all, delete-orphan")
    entities = relationship("MedicalEntityModel", back_populates="patient", cascade="all, delete-orphan")

class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    category = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    page_count = Column(Integer, default=1)
    extracted_text = Column(Text, nullable=True)
    structured_json = Column(JSON, nullable=True)
    upload_date = Column(DateTime, default=datetime.utcnow)

    patient = relationship("PatientModel", back_populates="documents")

class MedicalEntityModel(Base):
    __tablename__ = "medical_entities"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    document_id = Column(String, ForeignKey("documents.id"), nullable=True)
    entity_type = Column(String, nullable=False)  # condition, medication, allergy, investigation, symptom
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=True)
    frequency = Column(String, nullable=True)
    route = Column(String, nullable=True)
    severity_or_flag = Column(String, nullable=True)
    source_doc = Column(String, nullable=False)
    page_number = Column(Integer, default=1)
    original_text = Column(Text, nullable=False)

    patient = relationship("PatientModel", back_populates="entities")

class HealthClaimAnalysisModel(Base):
    __tablename__ = "claim_analyses"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    claim_text = Column(Text, nullable=False)
    normalized_claim = Column(Text, nullable=False)
    verdict = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    evidence_strength = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    explanation = Column(Text, nullable=False)
    what_evidence_says = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    sources_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
