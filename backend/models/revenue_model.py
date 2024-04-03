import sqlalchemy as sql
import sqlalchemy.orm as orm

import database

import datetime


class RevenueModel(database.Base):
    __tablename__ = "revenues"

    id = sql.Column(sql.Integer, primary_key=True, index=True)
    name = sql.Column(sql.String, index=True)
    description = sql.Column(sql.String)
    date_created = sql.Column(sql.DateTime, default=datetime.datetime.now)
    date_last_updated = sql.Column(sql.DateTime, default=datetime.datetime.now)
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))

    owner = orm.relationship("UserModel", back_populates="revenues")
    transactions = orm.relationship(
        "TransactionModel",
        back_populates="category_revenue")

    class Config:
        orm_mode = True
        from_attributes = True

    @classmethod
    def __create_table__(cls, engine):
        """Create table if it doesn't exist"""
        with engine.connect() as conn:
            cls.metadata.create_all(bind=engine)
