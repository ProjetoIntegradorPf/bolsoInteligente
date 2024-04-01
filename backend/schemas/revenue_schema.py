from pydantic import BaseModel


class RevenueBase(BaseModel):
    name: str
    description: str


class RevenueCreateSchema(RevenueBase):
    pass


class RevenueSchema(RevenueBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
        from_attributes=True