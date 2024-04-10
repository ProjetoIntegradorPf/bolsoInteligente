from typing import List

import fastapi

import sqlalchemy.orm as orm

from database.database import get_db

import schemas.expense_schema as expense_schema

import services.expense_service as expense_service

import schemas.user_schema as user_schema
import services.user_service as user_service

router = fastapi.APIRouter()


@router.post("/api/expenses",
             response_model=expense_schema.ExpenseSchema,
             status_code=201)
async def cretae_expense(
        expense: expense_schema.ExpenseCreateSchema,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await expense_service.create_expense(user=user, db=db, expense=expense)


@router.get("/api/expenses",
            response_model=List[expense_schema.ExpenseSchema],
            status_code=200)
async def get_expenses(
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
    description: str = fastapi.Query(None),
):
    filters = {}
    if description:
        filters["description"] = description

    return await expense_service.get_expenses(user=user, db=db, filters=filters)


@router.get("/api/expenses/{expense_id}",
            status_code=200,
            response_model=expense_schema.ExpenseSchema)
async def get_expense_by_id(
        expense_id: int,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await expense_service.get_expense_by_id(db, user, expense_id)


@router.delete("/api/expenses/{expense_id}", status_code=204)
async def delete_expense(
        expense_id: int,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await expense_service.delete_expense(db, user, expense_id)


@router.put("/api/expenses/{expense_id}", status_code=204)
async def update_expense(
        expense_id: int,
        expense: expense_schema.ExpenseCreateSchema,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await expense_service.update_expense(db, user, expense, expense_id)
