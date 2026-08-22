from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.profile import Profile
from app.models.user import User
from app.schemas.profile import ProfileCreate, ProfileResponse

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

@router.get("/{profile_id}", response_model=ProfileResponse)
def get_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
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
