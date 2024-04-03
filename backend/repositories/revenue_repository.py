import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.revenue_model import RevenueModel
import schemas.revenue_schema as revenue_schema
import schemas.user_schema as user_schema


async def create_revenue(
        db: Session,
        user: user_schema.UserSchema,
        revenue: revenue_schema.RevenueCreateSchema):
    revenue_db = RevenueModel(**revenue.dict(), owner=user)
    db.add(revenue_db)
    db.commit()
    db.refresh(revenue_db)
    return revenue_db


async def get_revenues(
        db: Session,
        user: user_schema.UserSchema,
        filters: dict = None):
    query = db.query(RevenueModel).filter_by(owner=user)

    if filters:
        for field, value in filters.items():
            query = query.filter(getattr(RevenueModel, field) == value)

    return query.all()


async def get_revenue_by_id(
        db: Session,
        user: user_schema.UserSchema,
        revenue_id: int):
    revenue = (
        db.query(RevenueModel)
        .filter_by(id=revenue_id, user_id=user.id)
        .first()
    )

    return revenue


async def delete_revenue(
        db: Session,
        user: user_schema.UserSchema,
        revenue_id: int):
    revenue = await get_revenue_by_id(db, user, revenue_id)
    db.delete(revenue)
    db.commit()


async def update_revenue(
        db: Session,
        user: user_schema.UserSchema,
        revenue: revenue_schema.RevenueCreateSchema,
        revenue_id: int):
    revenue_db = await get_revenue_by_id(db, user, revenue_id)
    revenue_db.name = revenue.name
    revenue_db.description = revenue.description
    revenue_db.date_last_updated = datetime.datetime.now()
    db.commit()
    db.refresh(revenue_db)
    return revenue_db
