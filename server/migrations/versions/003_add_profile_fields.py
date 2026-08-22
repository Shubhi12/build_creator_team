"""Add brand_name, instagram_handle, and education to profiles table

Revision ID: 003_add_profile_fields
Revises: 002_add_hashed_password
Create Date: 2026-08-23 00:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '003_add_profile_fields'
down_revision: Union[str, None] = '002_add_hashed_password'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('profiles', sa.Column('brand_name', sa.String(), nullable=True))
    op.add_column('profiles', sa.Column('instagram_handle', sa.String(), nullable=True))
    op.add_column('profiles', sa.Column('education', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('profiles', 'brand_name')
    op.drop_column('profiles', 'instagram_handle')
    op.drop_column('profiles', 'education')
