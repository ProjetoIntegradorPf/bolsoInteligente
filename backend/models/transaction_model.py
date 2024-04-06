import sqlalchemy as sql
import sqlalchemy.orm as orm

import database

import datetime


class TransactionModel(database.Base):
    __tablename__ = "transactions"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    owner_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    description = sql.Column(sql.String, index=True)
    type = sql.Column(sql.String, index=True)
    value = sql.Column(sql.Float, index=True)
    date_created = sql.Column(sql.DateTime, default=datetime.datetime.now)
    date_last_updated = sql.Column(sql.DateTime, default=datetime.datetime.now)
    owner = orm.relationship("UserModel", back_populates="transactions")
    category_expense_id = sql.Column(
        sql.Integer, sql.ForeignKey("expenses.id"), nullable=True)
    category_revenue_id = sql.Column(
        sql.Integer, sql.ForeignKey("revenues.id"), nullable=True)
    category_investment_id = sql.Column(
        sql.Integer, sql.ForeignKey("investments.id"), nullable=True)

    # Adicionando os nomes das categorias
    category_expense_name = sql.Column(sql.String)
    category_revenue_name = sql.Column(sql.String)
    category_investment_name = sql.Column(sql.String)

    # Relacionamentos com as categorias
    category_expense = orm.relationship(
        "ExpenseModel", back_populates="transactions", cascade="all, delete")
    category_revenue = orm.relationship(
        "RevenueModel", back_populates="transactions", cascade="all, delete")
    category_investment = orm.relationship(
        "InvestmentModel", back_populates="transactions", cascade="all, delete")

    class Config:
        orm_mode = True
        from_attributes = True

    @classmethod
    def __create_table__(cls, engine):
        """Create table if it doesn't exist"""
        with engine.connect() as conn:
            cls.metadata.create_all(bind=engine)
