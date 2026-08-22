from pydantic import BaseModel
from typing import Optional, List
from app.schemas.user import UserResponse

class ProfileBase(BaseModel):
    bio: Optional[str] = None
    primary_role: Optional[str] = None
    location: Optional[str] = None
    experience_years: Optional[int] = 1
    skills: List[str] = []
    portfolio_links: List[str] = []
    rate_range: Optional[str] = None
    rating: Optional[float] = 5.0
    completed_projects: Optional[int] = 0
    verified: Optional[bool] = True
    niche: Optional[str] = None
    subscriber_count: Optional[str] = None
    brand_name: Optional[str] = None
    instagram_handle: Optional[str] = None
    education: Optional[str] = None

class ProfileCreate(ProfileBase):
    user_id: int

class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class WorkingPartnerResponse(BaseModel):
    user_id: int
    full_name: str
    avatar_url: Optional[str] = None
    role: str
    job_title: str

class ProfilePageResponse(BaseModel):
    profile: Optional[ProfileResponse] = None
    user: UserResponse
    working_partners: List[WorkingPartnerResponse] = []
