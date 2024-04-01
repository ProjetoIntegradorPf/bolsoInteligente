import datetime
import fastapi
import sqlalchemy.orm as orm

from models.transaction_model import TransactionModel

import schemas.transaction_schema as transaction_schema, schemas.user_schema as user_schema

oauth2schema = fastapi.security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "myjwtsecret"

async def create_transaction(user: user_schema.UserSchema, db: orm.Session, transaction: transaction_schema.TransactionCreateSchema):
    transaction = TransactionModel(**transaction.dict(), owner_id=user.id)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction_schema.TransactionSchema.from_orm(transaction)


async def get_transactions(user: user_schema.UserSchema, db: orm.Session, filters: dict = None):
    query = db.query(TransactionModel).filter_by(owner_id=user.id)

    if filters:
        for field, value in filters.items():
            query = query.filter(getattr(TransactionModel, field) == value)

    transactions = query.all()

    return list(map(transaction_schema.TransactionSchema.from_orm, transactions))


async def _transaction_selector(transaction_id: int, user: user_schema.UserSchema, db: orm.Session):
    transaction = (
        db.query(TransactionModel)
        .filter_by(owner_id=user.id)
        .filter(TransactionModel.id == transaction_id)
        .first()
    )

    if transaction is None:
        raise fastapi.HTTPException(status_code=404, detail="Transaction does not exist")

    return transaction


async def get_transaction(transaction_id: int, user: user_schema.UserSchema, db: orm.Session):
    transaction = await _transaction_selector(transaction_id=transaction_id, user=user, db=db)

    return transaction_schema.TransactionSchema.from_orm(transaction)


async def delete_transaction(transaction_id: int, user: user_schema.UserSchema, db: orm.Session):
    transaction = await _transaction_selector(transaction_id, user, db)

    db.delete(transaction)
    db.commit()

async def update_transaction(transaction_id: int, transaction: transaction_schema.TransactionCreateSchema, user: user_schema.UserSchema, db: orm.Session):
    transaction_db = await _transaction_selector(transaction_id, user, db)

    transaction_db.description = transaction.description
    transaction_db.type = transaction.type
    transaction_db.value = transaction.value
    transaction_db.date_last_updated = datetime.datetime.now()

    db.commit()
    db.refresh(transaction_db)

    return transaction_schema.TransactionSchema.from_orm(transaction_db)

