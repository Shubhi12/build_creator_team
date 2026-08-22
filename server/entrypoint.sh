#!/bin/sh
set -e

echo "Running database migrations..."
alembic upgrade head || echo "Alembic migration warning: skipped or failed, continuing startup"

exec "$@"
