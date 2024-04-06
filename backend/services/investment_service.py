from sqlalchemy.orm import Session

import fastapi

import schemas.investment_schema as investment_schema
import schemas.user_schema as user_schema

import repositories.investment_repository as investment_repository

from repositories.transaction_repository import get_transactions


async def create_investment(
        db: Session,
        user: user_schema.UserSchema,
        investment: investment_schema.InvestmentCreateSchema):
    return await investment_repository.create_investment(db, user, investment)


async def get_investments(
        db: Session,
        user: user_schema.UserSchema,
        filters: dict = None):
    return await investment_repository.get_investments(db, user, filters)


async def get_investment_by_id(
        db: Session,
        user: user_schema.UserSchema,
        investment_id: int):
    investment = await investment_repository.get_investment_by_id(db, user, investment_id)
    if investment is None:
        raise fastapi.HTTPException(
            status_code=404, detail="Investment not found")

    return await investment_repository.get_investment_by_id(db, user, investment_id)


async def delete_investment(
        db: Session,
        user: user_schema.UserSchema,
        investment_id: int):
    transactions = await get_transactions(db, user, {"category_investment_id": investment_id})
    if transactions:
        raise fastapi.HTTPException(
            status_code=400,
            detail="This investment is in use and cannot be deleted")

    return await investment_repository.delete_investment(db, user, investment_id)


async def update_investment(
        db: Session,
        user: user_schema.UserSchema,
        investment_id: int,
        investment: investment_schema.InvestmentSchema):
    return await investment_repository.update_investment(db, user, investment_id, investment)
