import pydantic
from datetime import date, datetime

class InvestmentBase(pydantic.BaseModel):
    user_id: int
    description: str
    type: str
    investment_amount: float
    start_date: date
    end_date: date
    annual_return_rate: float
    monthly_return_rate: float

class InvestmentCreateSchema(InvestmentBase):
    pass

class InvestmentSchema(InvestmentBase):
    id: int
    date_created: datetime
    date_last_updated: datetime

    class Config:
        orm_mode = True
        from_attributes=True
