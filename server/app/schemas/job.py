from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.user import UserResponse

class JobBase(BaseModel):
    title: str
    role_category: str # 'Video Editor', 'Social Media Manager', 'Creator Manager'
    description: str
    budget: str
    work_type: str # 'Retainer', 'Project', 'Full-time', 'Part-time'
    availability: str
    platforms: List[str] = []

class JobCreate(JobBase):
    creator_id: int

class JobResponse(JobBase):
    id: int
    creator_id: int
    status: str
    created_at: datetime
    creator: Optional[UserResponse] = None
    applications_count: Optional[int] = 0

    class Config:
        from_attributes = True
