import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.transaction_model import TransactionModel
import schemas.transaction_schema as transaction_schema
import schemas.user_schema as user_schema


async def create_transaction(
        db: Session,
        user: user_schema.UserSchema,
        transaction: transaction_schema.TransactionCreateSchema):
    transaction_db = TransactionModel(**transaction.dict(), owner_id=user.id)
    db.add(transaction_db)
    db.commit()
    db.refresh(transaction_db)
    return transaction_db


async def get_transactions(
        db: Session,
        user: user_schema.UserSchema,
        filters: dict = None):
    query = db.query(TransactionModel).filter_by(owner_id=user.id)

    if filters:
        for field, value in filters.items():
            query = query.filter(getattr(TransactionModel, field) == value)

    return query.all()


async def get_transaction_by_id(
        db: Session,
        user: user_schema.UserSchema,
        transaction_id: int):
    transaction = (
        db.query(TransactionModel)
        .filter_by(owner_id=user.id, id=transaction_id)
        .first()
    )

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return transaction


async def delete_transaction(
    transaction_id: int,
    user: user_schema.UserSchema,
    db: Session
):
    transaction = await get_transaction_by_id(db, user, transaction_id)
    db.delete(transaction)
    db.commit()


async def update_transaction(
        db: Session,
        user: user_schema.UserSchema,
        transaction_id: int,
        transaction: transaction_schema.TransactionCreateSchema):
    transaction_db = await get_transaction_by_id(db, user, transaction_id)

    transaction_db.description = transaction.description
    transaction_db.type = transaction.type
    transaction_db.value = transaction.value
    transaction_db.date_last_updated = datetime.datetime.now()

    if transaction.category_expense_id:
        transaction_db.category_expense_id = transaction.category_expense_id
    if transaction.category_revenue_id:
        transaction_db.category_revenue_id = transaction.category_revenue_id
    if transaction.category_investment_id:
        transaction_db.category_investment_id = transaction.category_investment_id

    if transaction.category_expense_name:
        transaction_db.category_expense_name = transaction.category_expense_name
    if transaction.category_revenue_name:
        transaction_db.category_revenue_name = transaction.category_revenue_name
    if transaction.category_investment_name:
        transaction_db.category_investment_name = transaction.category_investment_name

    db.commit()
    db.refresh(transaction_db)
    return transaction_db
