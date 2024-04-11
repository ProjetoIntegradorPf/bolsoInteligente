import sqlalchemy as sql
import sqlalchemy.orm as orm

import database.database as database
import datetime


class InvestmentModel(database.Base):
    __tablename__ = "investments"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    description = sql.Column(sql.String, nullable=True)
    type = sql.Column(sql.String)
    investment_amount = sql.Column(sql.Float)
    start_date = sql.Column(sql.Date)
    end_date = sql.Column(sql.Date)
    annual_return_rate = sql.Column(sql.Float)
    monthly_return_rate = sql.Column(sql.Float)
    date_created = sql.Column(sql.DateTime, default=datetime.datetime.now)
    date_last_updated = sql.Column(sql.DateTime, default=datetime.datetime.now)

    owner = orm.relationship("UserModel", back_populates="investments")
    transactions = orm.relationship(
        "TransactionModel",
        back_populates="category_investment")

    class Config:
        orm_mode = True
        from_attributes = True

    @classmethod
    def __create_table__(cls, engine):
        """Create table if it doesn't exist"""
        with engine.connect() as conn:
            cls.metadata.create_all(bind=engine)
