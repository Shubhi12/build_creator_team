from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.user import UserResponse
from app.schemas.job import JobResponse

class ApplicationBase(BaseModel):
    cover_note: str
    portfolio_link: Optional[str] = None
    proposed_rate: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    job_id: int
    applicant_id: int

class ApplicationResponse(ApplicationBase):
    id: int
    job_id: int
    applicant_id: int
    status: str
    created_at: datetime
    applicant: Optional[UserResponse] = None
    job: Optional[JobResponse] = None

    class Config:
        from_attributes = True
