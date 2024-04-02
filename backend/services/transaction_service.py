from sqlalchemy.orm import Session

import repositories.transaction_repository as transaction_repository

from fastapi import HTTPException

from repositories.expense_repository import get_expense_by_id

from repositories.investment_repository import get_investment_by_id

from repositories.revenue_repository import get_revenue_by_id

import schemas.transaction_schema as transaction_schema, schemas.user_schema as user_schema

async def create_transaction(db: Session, user: user_schema.UserSchema, transaction: transaction_schema.TransactionCreateSchema):
    await check_transaction_categories(db, user, transaction)    
    return await transaction_repository.create_transaction(db, user, transaction)

async def get_transactions(db: Session, user: user_schema.UserSchema, filters: dict = None):
    return await transaction_repository.get_transactions(db, user, filters)

async def get_transaction_by_id(db: Session, user: user_schema.UserSchema, transaction_id: int):
    return await transaction_repository.get_transaction_by_id(db, user, transaction_id)

async def delete_transaction(db: Session, user: user_schema.UserSchema, transaction_id: int):
    return await transaction_repository.delete_transaction(db, user, transaction_id)

async def update_transaction(db: Session, user: user_schema.UserSchema, transaction_id: int, transaction: transaction_schema.TransactionCreateSchema):
    return await transaction_repository.update_transaction(db, user, transaction_id, transaction)


async def check_transaction_categories(db: Session, user: user_schema.UserSchema, transaction: transaction_schema.TransactionCreateSchema):
    if transaction.category_expense_id is not None:
        if transaction.category_revenue_id is not None or transaction.category_investment_id is not None:
            raise HTTPException(status_code=422, detail="Cannot set category_revenue_id or category_investment_id when category_expense_id is set")
        expense = await get_expense_by_id(db, user, transaction.category_expense_id)
        if not expense:
            raise HTTPException(status_code=404, detail="Category Expense not found")
        return expense
    if transaction.category_revenue_id is not None:
        if transaction.category_expense_id is not None or transaction.category_investment_id is not None:
            raise HTTPException(status_code=422, detail="Cannot set category_expense_id or category_investment_id when category_revenue_id is set")
        revenue = await get_revenue_by_id(db, user, transaction.category_revenue_id)
        if not revenue:
            raise HTTPException(status_code=404, detail="Category Revenue not found")
        return revenue
    if transaction.category_investment_id is not None:
        if transaction.category_expense_id is not None or transaction.category_revenue_id is not None:
            raise HTTPException(status_code=422, detail="Cannot set category_expense_id or category_revenue_id when category_investment_id is set")
        investment = await get_investment_by_id(db, user, transaction.category_investment_id)
        if not investment:
            raise HTTPException(status_code=404, detail="Category Investment not found")
        return investment