import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.investment_model import InvestmentModel
import schemas.investment_schema as investment_schema
import schemas.user_schema as user_schema

async def create_investment(db: Session, user: user_schema.UserSchema, investment: investment_schema.InvestmentCreateSchema):
    investment_db = InvestmentModel(**investment.dict(), owner=user)
    db.add(investment_db)
    db.commit()
    db.refresh(investment_db)
    return investment_db

async def get_investments(db: Session, user: user_schema.UserSchema, filters: dict = None):
    query = db.query(InvestmentModel).filter_by(owner_id=user.id)

    if filters:
        for field, value in filters.items():
            query = query.filter(getattr(InvestmentModel, field) == value)

    return query.all()

async def get_investment_by_id(db: Session, user: user_schema.UserSchema, investment_id: int):
    investment = (
        db.query(InvestmentModel)
        .filter_by(owner=user, id=investment_id)
        .first()
    )
    
    return investment

async def delete_investment(db: Session, user: user_schema.UserSchema, investment_id: int):
    investment = await get_investment_by_id(db, user, investment_id)
    db.delete(investment)
    db.commit()

async def update_investment(db: Session, user: user_schema.UserSchema, investment_id: int, investment: investment_schema.InvestmentSchema):
    investment_db = await get_investment_by_id(db, user, investment_id)
    
    for field in investment.dict():
        if hasattr(investment, field):
            setattr(investment_db, field, getattr(investment, field))

    investment_db.date_last_updated = datetime.datetime.now()
    db.commit()
    db.refresh(investment_db)
    return investment_db
