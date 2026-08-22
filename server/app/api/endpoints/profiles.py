from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.profile import Profile
from app.models.user import User
from app.models.application import Application
from app.models.job import Job
from app.schemas.profile import ProfileCreate, ProfileResponse, ProfilePageResponse, WorkingPartnerResponse
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ProfileResponse])
def list_profiles(
    role: Optional[str] = Query(None, description="Filter by role e.g. Video Editor, Social Media Manager, Creator Manager"),
    verified_only: Optional[bool] = Query(False),
    db: Session = Depends(get_db)
):
    query = db.query(Profile).join(User).filter(User.user_type == "professional")
    if role:
        query = query.filter(Profile.primary_role.ilike(f"%{role}%"))
    if verified_only:
        query = query.filter(Profile.verified == True)
    
    return query.all()

@router.get("/user/{user_id}", response_model=ProfilePageResponse)
def get_user_profile_page(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    
    # Query hired working partner relationships
    working_partners = []
    if user.user_type == "creator":
        # Get professionals working with this creator
        hired_apps = db.query(Application).join(Job).filter(
            Job.creator_id == user_id,
            Application.status == "hired"
        ).all()
        for app in hired_apps:
            working_partners.append({
                "user_id": app.applicant.id,
                "full_name": app.applicant.full_name,
                "avatar_url": app.applicant.avatar_url,
                "role": app.applicant.profile.primary_role if app.applicant.profile else "Professional",
                "job_title": app.job.title
            })
    else:
        # Get creators this professional is working with
        hired_apps = db.query(Application).filter(
            Application.applicant_id == user_id,
            Application.status == "hired"
        ).all()
        for app in hired_apps:
            working_partners.append({
                "user_id": app.job.creator.id,
                "full_name": app.job.creator.full_name,
                "avatar_url": app.job.creator.avatar_url,
                "role": "Creator / Hirer",
                "job_title": app.job.title
            })

    return {
        "profile": profile,
        "user": user,
        "working_partners": working_partners
    }

@router.get("/{profile_id}", response_model=ProfileResponse)
def get_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me", response_model=ProfileResponse)
def update_my_profile(
    profile_in: ProfileCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if profile_in.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this profile")

    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if profile:
        for key, value in profile_in.dict(exclude_unset=True).items():
            setattr(profile, key, value)
    else:
        profile = Profile(**profile_in.dict())
        db.add(profile)
        
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/", response_model=ProfileResponse)
def create_or_update_profile(profile_in: ProfileCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == profile_in.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = db.query(Profile).filter(Profile.user_id == profile_in.user_id).first()
    if profile:
        for key, value in profile_in.dict(exclude_unset=True).items():
            setattr(profile, key, value)
    else:
        profile = Profile(**profile_in.dict())
        db.add(profile)
        
    db.commit()
    db.refresh(profile)
    return profile
