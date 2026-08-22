# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    role_category = Column(String, nullable=False) # 'Video Editor', 'Social Media Manager', 'Creator Manager'
    description = Column(Text, nullable=False)
    budget = Column(String, nullable=False) # e.g. "₹30,000 - ₹50,000 / month"
    work_type = Column(String, nullable=False) # 'Retainer', 'Project', 'Full-time', 'Part-time'
    availability = Column(String, nullable=False) # e.g. '15-20 hrs/week'
    platforms = Column(JSON, default=list) # e.g. ["YouTube", "Instagram Reels"]
    status = Column(String, default="open") # 'open', 'closed'
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User", back_populates="posted_jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
