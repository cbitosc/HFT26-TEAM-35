import uuid
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from ..database.connection import get_db
from ..database.models import User, Resume, ResumeAnalysis
from ..schemas.analysis_schema import ReviewRequest, AnalysisResponse
from ..services.resume_parser import resume_parser_service
from ..services.jd_parser import jd_parser_service
from ..services.score_engine import score_engine
from ..services.evidence_map import evidence_map_service
from ..services.gemini_service import gemini_central_service
from ..services.resume_service import resume_db_service
from .deps import get_current_user_optional

router = APIRouter(prefix="/analysis", tags=["Analysis & Scoring Engine"])


@router.post("/upload")
async def upload_resume_file(file: UploadFile = File(...)):
    """Uploads PDF or DOCX file, extracts text and parsed structure."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected.")

    ext = file.filename.lower().split(".")[-1]
    if ext not in ["pdf", "docx", "txt"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF, DOCX, or TXT file.")

    contents = await file.read()
    if len(contents) > 15 * 1024 * 1024:  # 15 MB limit
        raise HTTPException(status_code=400, detail="File size exceeds the 15MB limit.")

    raw_text = ""
    try:
        if ext == "pdf":
            raw_text = resume_parser_service.extract_text_from_pdf(contents)
        elif ext == "docx":
            raw_text = resume_parser_service.extract_text_from_docx(contents)
        else:
            raw_text = contents.decode("utf-8", errors="ignore")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract document contents: {str(e)}")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Uploaded file is empty or could not be parsed.")

    structured_data = resume_parser_service.parse_raw_text_to_structure(raw_text)

    return {
        "filename": file.filename,
        "charCount": len(raw_text),
        "rawText": raw_text,
        "structuredData": structured_data
    }


@router.post("/review", response_model=AnalysisResponse)
def review_resume(
    payload: ReviewRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Core Evaluation Endpoint:
    Executes independent Resume Score Engine (deterministic weights),
    generates EvidenceMap, and validates against job description.
    """
    if not payload.target_job_description or len(payload.target_job_description.strip()) < 10:
        raise HTTPException(status_code=400, detail="Job description is required and must contain at least 10 characters.")

    resume_data = payload.resume_data or {}
    raw_text = payload.raw_resume_text or ""

    # If resume_id is provided and user is authenticated, load resume
    target_resume = None
    if payload.resume_id and current_user:
        target_resume = resume_db_service.get_resume_by_id(db, payload.resume_id, current_user.id)
        if target_resume:
            resume_data = target_resume.resume_data

    # Optional semantic enrichment from Gemini (does not dictate numerical score)
    semantic_review = gemini_central_service.review_resume(raw_text, payload.target_job_description)

    # Deterministic Score Engine Execution
    score_result = score_engine.calculate_score(
        resume_data=resume_data,
        raw_resume_text=raw_text,
        job_description=payload.target_job_description,
        semantic_evidence=semantic_review
    )

    # EvidenceMap Generation
    evidence_items = evidence_map_service.generate_evidence_map(
        resume_data=resume_data,
        raw_text=raw_text,
        matched_skills=score_result.get("matched_skills", []),
        unmatched_skills=score_result.get("unmatched_skills", []),
        semantic_evidence=semantic_review
    )

    analysis_id = f"eval_{uuid.uuid4().hex[:12]}"
    now = datetime.utcnow()

    # Save to SQLite DB if user is authenticated and resume is linked
    if current_user and target_resume:
        analysis_record = ResumeAnalysis(
            id=analysis_id,
            resume_id=target_resume.id,
            target_role=payload.target_role or target_resume.target_role,
            target_job_description=payload.target_job_description,
            overall_score=score_result["overall_score"],
            category_scores=score_result["category_scores"],
            matched_requirements=score_result["matched_requirements"],
            partially_matched=score_result["partially_matched"],
            unmentioned_requirements=score_result["unmentioned_requirements"],
            evidence_map=evidence_items,
            recommendations=score_result["recommendations"],
            scoring_explanation=score_result["scoring_explanation"],
            analysis_date=now
        )
        db.add(analysis_record)
        target_resume.latest_score = score_result["overall_score"]
        resume_db_service.log_activity(
            db,
            user_id=current_user.id,
            activity_type="RESUME_ANALYZED",
            description=f"Evaluated '{target_resume.title}' (Score: {score_result['overall_score']}%)"
        )
        db.commit()

    return AnalysisResponse(
        id=analysis_id,
        resume_id=payload.resume_id,
        target_role=payload.target_role,
        overall_score=score_result["overall_score"],
        category_scores=score_result["category_scores"],
        matched_requirements=score_result["matched_requirements"],
        partially_matched=score_result["partially_matched"],
        unmentioned_requirements=score_result["unmentioned_requirements"],
        evidence_map=evidence_items,
        recommendations=score_result["recommendations"],
        scoring_explanation=score_result["scoring_explanation"],
        analyzed_at=now
    )


@router.get("/{analysis_id}")
def get_analysis_by_id(
    analysis_id: str,
    db: Session = Depends(get_db)
):
    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return {
        "id": analysis.id,
        "resume_id": analysis.resume_id,
        "target_role": analysis.target_role,
        "overall_score": analysis.overall_score,
        "category_scores": analysis.category_scores,
        "matched_requirements": analysis.matched_requirements,
        "partially_matched": analysis.partially_matched,
        "unmentioned_requirements": analysis.unmentioned_requirements,
        "evidence_map": analysis.evidence_map,
        "recommendations": analysis.recommendations,
        "scoring_explanation": analysis.scoring_explanation,
        "analyzed_at": analysis.analysis_date
    }
