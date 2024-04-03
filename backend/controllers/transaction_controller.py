from typing import List

import fastapi

import sqlalchemy.orm as orm

from database import get_db

import schemas.transaction_schema as transaction_schema
import schemas.user_schema as user_schema

import models.user_model as user_model

import services.user_service as user_service

import services.transaction_service as transaction_service

router = fastapi.APIRouter()


@router.post("/api/transactions",
             response_model=transaction_schema.TransactionSchema)
async def create_transaction(
        transaction: transaction_schema.TransactionCreateSchema,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    print(transaction)
    return await transaction_service.create_transaction(user=user, db=db, transaction=transaction)


@router.get("/api/transactions",
            response_model=List[transaction_schema.TransactionSchema])
async def get_transactions(
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
    description: str = fastapi.Query(None),
    type: str = fastapi.Query(None),
    value: float = fastapi.Query(None),
):
    filters = {}
    if description:
        filters["description"] = description
    if type:
        filters["type"] = type
    if value is not None:
        filters["value"] = value

    return await transaction_service.get_transactions(user=user, db=db, filters=filters)


@router.get("/api/transactions/{transaction_id}", status_code=200)
async def get_transaction_by_id(
        transaction_id: int,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await transaction_service.get_transaction_by_id(transaction_id, user, db)


@router.delete("/api/transactions/{transaction_id}", status_code=204)
async def delete_transaction(
        transaction_id: int,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    await transaction_service.delete_transaction(transaction_id, user, db)
    return {"message", "Successfully Deleted"}


@router.put("/api/transactions/{transaction_id}", status_code=200)
async def update_transaction(
        transaction_id: int,
        transaction: transaction_schema.TransactionCreateSchema,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    await transaction_service.update_transaction(transaction_id, transaction, user, db)
    return {"message", "Successfully Updated"}
