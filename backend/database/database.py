from sqlalchemy import create_engine
import sqlalchemy.orm as orm
import sqlalchemy.ext.declarative as declarative

url = "postgresql://pmmfljbx:OTDswvWNrLAucNZRmEBXJRtndjdnbJlF@chunee.db.elephantsql.com/pmmfljbx"

engine = create_engine(url)

SessionLocal = orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative.declarative_base()


def create_database():
    from models.user_model import UserModel
    from models.transaction_model import TransactionModel
    from models.revenue_model import RevenueModel
    from models.expense_model import ExpenseModel
    from models.investment_model import InvestmentModel
    return Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
