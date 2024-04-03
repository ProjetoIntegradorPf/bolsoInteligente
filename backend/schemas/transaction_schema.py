from pydantic import BaseModel
from enum import Enum
from datetime import datetime
from typing import Optional


class TransactionType(str, Enum):
    expense = "DESPESA"
    revenue = "RECEITA"
    investment = "INVESTIMENTO"


class TransactionCreateSchema(BaseModel):
    description: str
    type: TransactionType
    value: float
    category_expense_id: Optional[int] = None
    category_revenue_id: Optional[int] = None
    category_investment_id: Optional[int] = None


class TransactionSchema(TransactionCreateSchema):
    id: int
    date_created: datetime
    date_last_updated: datetime

    class Config:
        orm_mode = True
        from_attributes = True
