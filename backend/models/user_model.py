import sqlalchemy as sql
import sqlalchemy.orm as orm
import passlib.hash as hash


import database

import datetime

class UserModel(database.Base):
    __tablename__ = "users"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    first_name = sql.Column(sql.String, index=True)
    last_name = sql.Column(sql.String, index=True)
    email = sql.Column(sql.String, unique=True, index=True)
    date_of_birth = sql.Column(sql.Date)
    date_created = sql.Column(sql.DateTime, default=datetime.datetime.now)
    date_last_updated = sql.Column(sql.DateTime, default=datetime.datetime.now)
    hashed_password = sql.Column(sql.String)

    transactions = orm.relationship("TransactionModel", back_populates="owner", cascade="all, delete")
    expenses = orm.relationship("ExpenseModel", back_populates="owner", cascade="all, delete")
    revenues = orm.relationship("RevenueModel", back_populates="owner", cascade="all, delete")
    investments = orm.relationship("InvestmentModel", back_populates="owner", cascade="all, delete")


    def verify_password(self, password: str):
        return hash.bcrypt.verify(password, self.hashed_password)
    
    class Config:
        orm_mode = True
        from_attributes = True

    @classmethod
    def __create_table__(cls, engine):
        """Create table if it doesn't exist"""
        with engine.connect() as conn:
            cls.metadata.create_all(bind=engine)