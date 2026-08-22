from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    primary_role = Column(String, nullable=True) # e.g. 'Video Editor', 'Social Media Manager', 'Creator Manager'
    location = Column(String, nullable=True)
    experience_years = Column(Integer, default=1)
    skills = Column(JSON, default=list) # e.g. ["Premiere Pro", "CapCut", "YouTube Analytics", "Thumbnail Design"]
    portfolio_links = Column(JSON, default=list)
    rate_range = Column(String, nullable=True) # e.g. "₹25,000 - ₹45,000 / mo"
    rating = Column(Float, default=5.0)
    completed_projects = Column(Integer, default=0)
    verified = Column(Boolean, default=True)
    
    # Creator specific fields
    niche = Column(String, nullable=True) # e.g. "Tech & Finance", "Fitness & Gaming"
    subscriber_count = Column(String, nullable=True) # e.g. "250K"
    brand_name = Column(String, nullable=True)
    instagram_handle = Column(String, nullable=True)

    # Applicant specific fields
    education = Column(String, nullable=True) # e.g. "B.A. in Filmmaking"

    user = relationship("User", back_populates="profile")
