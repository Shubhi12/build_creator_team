import redis

from app.core.config import settings

# Create a global Redis connection pool
redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)

def get_redis():
    return redis_client
