import sqlalchemy as sql
import sqlalchemy.orm as orm

import database.database as database
import datetime


class ExpenseModel(database.Base):
    __tablename__ = "expenses"

    id = sql.Column(sql.Integer, primary_key=True, index=True)
    name = sql.Column(sql.String, index=True)
    description = sql.Column(sql.String, nullable=True)
    date_created = sql.Column(sql.DateTime, default=datetime.datetime.now)
    date_last_updated = sql.Column(sql.DateTime, default=datetime.datetime.now)
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))

    owner = orm.relationship("UserModel", back_populates="expenses")
    transactions = orm.relationship(
        "TransactionModel",
        back_populates="category_expense")

    class Config:
        orm_mode = True
        from_attributes = True

    @classmethod
    def __create_table__(cls, engine):
        """Create table if it doesn't exist"""
        with engine.connect() as conn:
            cls.metadata.create_all(bind=engine)
