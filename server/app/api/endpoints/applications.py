from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.application import Application
from app.models.job import Job
from app.schemas.application import ApplicationCreate, ApplicationResponse

router = APIRouter()

@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def submit_application(app_in: ApplicationCreate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == app_in.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
        
    existing = db.query(Application).filter(
        Application.job_id == app_in.job_id,
        Application.applicant_id == app_in.applicant_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this role")
        
    application = Application(**app_in.dict())
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
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    if status not in ["submitted", "shortlisted", "hired", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status option")
        
    application.status = status
    db.commit()
    db.refresh(application)
    return application
