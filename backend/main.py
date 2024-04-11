from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import create_database

from controllers.api_information import router as api_router
from controllers.user_controller import router as user_router
from controllers.expense_controller import router as expense_router
from controllers.revenue_controller import router as revenue_router
from controllers.investment_controller import router as investment_router
from controllers.transaction_controller import router as transaction_router

app = FastAPI(title="Bolso Inteligente", version="0.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(api_router, tags=["API Information"])
app.include_router(user_router, tags=["Users"])
app.include_router(expense_router, tags=["Expenses"])
app.include_router(revenue_router, tags=["Revenues"])
app.include_router(investment_router, tags=["Investments"])
app.include_router(transaction_router, tags=["Transactions"])

create_database()
