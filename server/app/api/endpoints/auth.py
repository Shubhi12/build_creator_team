from app.core.security import security_scheme
from app.core.redis import get_redis
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.schemas.user import UserCreate, UserLogin, SessionResponse, UserResponse
from app.core.security import get_password_hash, verify_password, create_session, get_current_user

router = APIRouter()

@router.post("/signup", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )
        
    db_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        user_type=user_in.user_type,
        avatar_url=user_in.avatar_url,
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Automatically create a blank profile for the new user
    profile = Profile(
        user_id=db_user.id,
        verified=True if db_user.user_type == "professional" else False
    )
    if db_user.user_type == "professional":
        profile.primary_role = "Video Editor"  # Default placeholder
        profile.experience_years = 1
        profile.skills = []
        profile.portfolio_links = []
    db.add(profile)
    db.commit()

    # Generate session
    session_id = create_session(data={"sub": db_user.email})
    return {
        "session_id": session_id,
        "token_type": "bearer",
        "user": db_user
    }

@router.post("/login", response_model=SessionResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    session_id = create_session(data={"sub": user.email})
    return {
        "session_id": session_id,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(token: HTTPAuthorizationCredentials = Depends(security_scheme)):
    session_id = token.credentials
    redis_client = get_redis()
    redis_client.delete(f"session:{session_id}")
    return {"message": "Successfully logged out"}

# Keep the old /users endpoints for backward compatibility if needed by the frontend/other files
@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        return existing
    db_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        user_type=user_in.user_type,
        avatar_url=user_in.avatar_url,
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Auto profile creation
    profile = Profile(user_id=db_user.id)
    db.add(profile)
    db.commit()
    
    return db_user

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
