import datetime
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException

from models.expense_model import ExpenseModel
import schemas.expense_schema as expense_schema, schemas.user_schema as user_schema

import models.user_model as user_model
async def create_expense(db: Session, user: user_schema.UserSchema, expense: expense_schema.ExpenseCreateSchema):
    print(ExpenseModel(**expense.dict())) 
    expense_db = ExpenseModel(**expense.dict(), owner=user)
    db.add(expense_db)
    db.commit()
    db.refresh(expense_db)
    return expense_db

async def get_expenses(db: Session, user: user_schema.UserSchema, filters: dict = None):

    query = (
        db.query(ExpenseModel)
        .filter(ExpenseModel.user_id == user.id)
    )

    if filters:
        for field, value in filters.items():
            query = query.filter(getattr(ExpenseModel, field) == value)

    query = query.options(
        joinedload(ExpenseModel.owner),
    )

    return query.all()

async def get_expense_by_id(db: Session, user: user_schema.UserSchema, expense_id: int):
    expense = (
        db.query(ExpenseModel)
        .filter(ExpenseModel.user_id == user.id, ExpenseModel.id == expense_id)
        .first()
    )
    return expense

async def delete_expense(db: Session, user: user_schema.UserSchema, expense_id: int):
    expense = await get_expense_by_id(db, user, expense_id)
    db.delete(expense)
    db.commit()

async def update_expense(db: Session, user: user_schema.UserSchema, expense: expense_schema.ExpenseCreateSchema, expense_id: int,):
    expense_db = await get_expense_by_id(db, user, expense_id)
    expense_db.name = expense.name
    expense_db.description = expense.description
    expense_db.date_last_updated = datetime.datetime.now()
    db.commit()
    db.refresh(expense_db)
    return expense_db
