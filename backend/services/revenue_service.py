from sqlalchemy.orm import Session
from fastapi import HTTPException
import repositories.revenue_repository as revenue_repository
import schemas.revenue_schema as revenue_schema
import schemas.user_schema as user_schema
from repositories.transaction_repository import get_transactions


async def create_revenue(
        db: Session,
        user: user_schema.UserSchema,
        revenue: revenue_schema.RevenueCreateSchema):
    return await revenue_repository.create_revenue(db, user, revenue)


async def get_revenues(
        db: Session,
        user: user_schema.UserSchema,
        filters: dict = None):
    return await revenue_repository.get_revenues(db, user, filters)


async def get_revenue_by_id(
        db: Session,
        user: user_schema.UserSchema,
        revenue_id: int):
    revenue = await revenue_repository.get_revenue_by_id(db, user, revenue_id)

    if not revenue:
        raise HTTPException(status_code=404, detail="Revenue not found")

    return revenue


async def delete_revenue(
        db: Session,
        user: user_schema.UserSchema,
        revenue_id: int):
    transactions = await get_transactions(db, user, {"category_revenue_id": revenue_id})
    if transactions:
        raise HTTPException(
            status_code=400,
            detail="This revenue is in use and cannot be deleted")

    return await revenue_repository.delete_revenue(db, user, revenue_id)


async def update_revenue(
        db: Session,
        user: user_schema.UserSchema,
        revenue: revenue_schema.RevenueCreateSchema,
        revenue_id: int):
    return await revenue_repository.update_revenue(db, user, revenue, revenue_id)
