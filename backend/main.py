from fastapi import FastAPI
from controllers.transaction_controller import router as transaction_router
from controllers.user_controller import router as user_router
from controllers.expense_controller import router as expense_router
from controllers.revenue_controller import router as revenue_router
from database import create_database

app = FastAPI()

app.include_router(transaction_router)
app.include_router(user_router)
app.include_router(expense_router)
app.include_router(revenue_router)
create_database()