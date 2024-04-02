from pydantic import BaseModel


class ExpenseBase(BaseModel):
    name: str
    description: str


class ExpenseCreateSchema(ExpenseBase):
    
    pass


class ExpenseSchema(ExpenseBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
        from_attributes=True

