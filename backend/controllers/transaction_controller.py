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
             response_model=transaction_schema.TransactionSchema,
             status_code=201)
async def create_transaction(
        transaction: transaction_schema.TransactionCreateSchema,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    try:
        return await transaction_service.create_transaction(user=user, db=db, transaction=transaction)
    except Exception as e:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e))


@router.get("/api/transactions",
            response_model=List[transaction_schema.TransactionSchema])
async def get_transactions(
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
    description: str = fastapi.Query(None),
    type: str = fastapi.Query(None),
    value: float = fastapi.Query(None),
    start_date: str = fastapi.Query(None),
    end_date: str = fastapi.Query(None),
):
    filters = {}
    if description:
        filters["description"] = description
    if type:
        filters["type"] = type
    if value is not None:
        filters["value"] = value
    if start_date is not None:
        filters["start_date"] = start_date
    if end_date is not None:
        filters["end_date"] = end_date

    return await transaction_service.get_transactions(user=user, db=db, filters=filters)


@router.get("/api/transactions/{transaction_id}",
            status_code=200,
            response_model=transaction_schema.TransactionSchema)
async def get_transaction_by_id(
        transaction_id: int,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
        db: orm.Session = fastapi.Depends(get_db)
):
    return await transaction_service.get_transaction_by_id(db, user, transaction_id)


@router.delete("/api/transactions/{transaction_id}", status_code=204)
async def delete_transaction(
        transaction_id: int,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await transaction_service.delete_transaction(transaction_id, user, db)


@router.put("/api/transactions/{transaction_id}", status_code=204)
async def update_transaction(
        transaction_id: int,
        transaction: transaction_schema.TransactionCreateSchema,
        user: user_schema.UserSchema = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await transaction_service.update_transaction(db, user, transaction_id, transaction)
