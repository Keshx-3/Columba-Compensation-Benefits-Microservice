"""Add benefit to componenttypeenum

Revision ID: 31180d054a71
Revises: 
Create Date: 2025-11-22 12:21:52.618756

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '31180d054a71'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE componenttypeenum ADD VALUE IF NOT EXISTS 'benefit'")


def downgrade() -> None:
    """Downgrade schema."""
    pass
