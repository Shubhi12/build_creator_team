from datetime import datetime, timedelta
import hashlib
import os
from typing import Optional
import uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.core.redis import get_redis

security_scheme = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if not hashed_password or ":" not in hashed_password:
            return False
        salt_hex, key_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        # Compute hash
        new_key = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt,
            100000
        )
        return new_key.hex() == key_hex
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100000
    )
    return f"{salt.hex()}:{key.hex()}"

def create_session(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    session_id = str(uuid.uuid4())
    
    if expires_delta:
        expire_seconds = int(expires_delta.total_seconds())
    else:
        expire_seconds = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        
    redis_client = get_redis()
    # Assuming data contains "sub": user.email
    email = data.get("sub")
    
    # Store session in Redis
    redis_client.setex(f"session:{session_id}", expire_seconds, email)
    
    return session_id

def get_current_user(
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(security_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    session_id = token.credentials
    redis_client = get_redis()
    
    email = redis_client.get(f"session:{session_id}")
    if email is None:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
        
    return user
