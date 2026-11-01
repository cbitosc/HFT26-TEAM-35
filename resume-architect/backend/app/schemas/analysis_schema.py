from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class CategoryScoreItem(BaseModel):
    id: str
    name: str
    score: int
    weight: float
    status: str
    feedback: str
    metrics: Dict[str, Any]


class EvidenceMapItem(BaseModel):
    id: str
    requirement: str
    category: str
    status: str  # MATCHED | PARTIALLY MATCHED | NOT FOUND
    resumeEvidence: str
    location: str
    explanation: str


class RequirementItem(BaseModel):
    name: str
    category: str
    status: str
    evidence: Optional[str] = None


class ReviewRequest(BaseModel):
    resume_id: Optional[str] = None
    resume_data: Optional[Dict[str, Any]] = None
    raw_resume_text: Optional[str] = None
    target_role: Optional[str] = "Software Engineer"
    target_job_description: str = Field(..., description="Target Job Description text")


class AnalysisResponse(BaseModel):
    id: str
    resume_id: Optional[str] = None
    target_role: Optional[str] = None
    overall_score: int
    category_scores: List[CategoryScoreItem]
    matched_requirements: List[Dict[str, Any]]
    partially_matched: List[Dict[str, Any]]
    unmentioned_requirements: List[Dict[str, Any]]
    evidence_map: List[EvidenceMapItem]
    recommendations: List[str]
    scoring_explanation: str
    analyzed_at: datetime


class ImprovementRequest(BaseModel):
    resume_id: str
    job_description: Optional[str] = None
    weakness_categories: Optional[List[str]] = None


class ImprovementBullet(BaseModel):
    id: str
    section: str
    original: str
    suggested: str
    truthguard_status: str  # SUPPORTED | NEEDS_CONFIRMATION | UNSUPPORTED
    verification_rationale: str
    approved: bool = False


class ImprovementResponse(BaseModel):
    resume_id: str
    improvements: List[ImprovementBullet]
    summary_suggestion: Optional[str] = None
    truthguard_summary: Dict[str, Any]
