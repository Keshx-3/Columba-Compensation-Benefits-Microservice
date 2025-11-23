"""remove rule_value, created_at, updated_at from compensation_components

Revision ID: a512a274ca50
Revises: 31180d054a71
Create Date: 2025-11-23 15:41:51.506913

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a512a274ca50'
down_revision: Union[str, Sequence[str], None] = '31180d054a71'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("compensation_components") as batch_op:
        batch_op.drop_column("rule_value")
        batch_op.drop_column("created_at")
        batch_op.drop_column("updated_at")



def downgrade() -> None:
    with op.batch_alter_table("compensation_components") as batch_op:
        batch_op.add_column(sa.Column("rule_value", sa.Numeric(), nullable=True))
        batch_op.add_column(
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now())
        )
        batch_op.add_column(
            sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now())
        )

