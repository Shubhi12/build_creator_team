from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.application import Application
from app.models.job import Job
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def submit_application(
    app_in: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.user_type != "professional":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only applicants/professionals can apply for a job"
        )
        
    job = db.query(Job).filter(Job.id == app_in.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
        
    existing = db.query(Application).filter(
        Application.job_id == app_in.job_id,
        Application.applicant_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this role")
        
    app_data = app_in.dict()
    app_data["applicant_id"] = current_user.id
    
    application = Application(**app_data)
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.get("/job/{job_id}", response_model=List[ApplicationResponse])
def get_applications_for_job(job_id: int, db: Session = Depends(get_db)):
    applications = db.query(Application).filter(Application.job_id == job_id).all()
    return applications

@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    # Check if current user is the creator of the job
    if application.job.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the creator who posted the job can update the application status"
        )
        
    if status not in ["submitted", "shortlisted", "hired", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status option")
        
    application.status = status
    db.commit()
    db.refresh(application)
    return application
