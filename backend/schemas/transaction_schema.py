from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from typing import Optional

class TransactionType(str, Enum):

    expense = "DESPESA"
    revenue = "RECEITA"

class TransactionBase(BaseModel):
    description: str
    type: TransactionType
    value: float


class TransactionCreateSchema(TransactionBase):
    expense_id: Optional[int] = None
    revenue_id: Optional[int] = None


class TransactionSchema(TransactionBase):
    id: int
    owner_id: int
    expense_id: Optional[int] = None
    revenue_id: Optional[int] = None
    date_created: datetime
    date_last_updated: datetime

    class Config:
        orm_mode = True
        from_attributes=True
