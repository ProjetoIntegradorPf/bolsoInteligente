import fastapi

from sqlalchemy.orm import Session

import schemas.expense_schema as expense_schema
import schemas.user_schema as user_schema

import repositories.expense_repository as expense_repository

from repositories.transaction_repository import get_transactions


async def create_expense(
        db: Session,
        user: user_schema.UserSchema,
        expense: expense_schema.ExpenseCreateSchema):
    return await expense_repository.create_expense(db, user, expense)


async def get_expenses(
        db: Session,
        user: user_schema.UserSchema,
        filters: dict = None):
    return await expense_repository.get_expenses(db, user, filters)


async def get_expense_by_id(
        db: Session,
        user: user_schema.UserSchema,
        expense_id: int):
    expense = await expense_repository.get_expense_by_id(db, user, expense_id)

    if expense is None:
        raise fastapi.HTTPException(
            status_code=404, detail="Expense not found")

    return expense


async def delete_expense(
        db: Session,
        user: user_schema.UserSchema,
        expense_id: int):
    print(await get_transactions(db, user, {"category_expense_id": expense_id}))
    transactions = await get_transactions(db, user, {"category_expense_id": expense_id})
    if transactions:
        raise fastapi.HTTPException(
            status_code=400,
            detail="This expense is in use and cannot be deleted")
    return await expense_repository.delete_expense(db, user, expense_id)


async def update_expense(
    db: Session,
    user: user_schema.UserSchema,
    expense: expense_schema.ExpenseCreateSchema,
    expense_id: int,
):
    return await expense_repository.update_expense(db, user, expense, expense_id)
