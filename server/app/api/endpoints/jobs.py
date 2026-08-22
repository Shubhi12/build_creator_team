from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.job import Job
from app.models.application import Application
from app.schemas.job import JobCreate, JobResponse

router = APIRouter()

@router.get("/", response_model=List[JobResponse])
def list_jobs(
    category: Optional[str] = Query(None, description="Filter by role category e.g. Video Editor, Social Media Manager, Creator Manager"),
    work_type: Optional[str] = Query(None, description="Filter by work type e.g. Retainer, Project, Full-time"),
    search: Optional[str] = Query(None, description="Search keyword in title or description"),
    db: Session = Depends(get_db)
):
    query = db.query(Job).filter(Job.status == "open")
    if category:
        query = query.filter(Job.role_category.ilike(f"%{category}%"))
    if work_type:
        query = query.filter(Job.work_type.ilike(f"%{work_type}%"))
    if search:
        query = query.filter(
            (Job.title.ilike(f"%{search}%")) | (Job.description.ilike(f"%{search}%"))
        )
    
    jobs = query.order_by(Job.created_at.desc()).all()
    
    # Calculate application count dynamically
    result = []
    for job in jobs:
        app_count = db.query(Application).filter(Application.job_id == job.id).count()
        job_resp = JobResponse.from_orm(job)
        job_resp.applications_count = app_count
        result.append(job_resp)
        
    return result

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    app_count = db.query(Application).filter(Application.job_id == job.id).count()
    job_resp = JobResponse.from_orm(job)
    job_resp.applications_count = app_count
    return job_resp

@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(job_in: JobCreate, db: Session = Depends(get_db)):
    job = Job(**job_in.dict())
    db.add(job)
    db.commit()
    db.refresh(job)
    job_resp = JobResponse.from_orm(job)
    job_resp.applications_count = 0
    return job_resp
