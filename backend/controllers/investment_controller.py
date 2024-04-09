from typing import List

import fastapi

import sqlalchemy.orm as orm

from database import get_db

import schemas.investment_schema as investment_schema

import services.investment_service as investment_service

import models.user_model as user_model

import services.user_service as user_service

router = fastapi.APIRouter()


@router.post("/api/investments",
             response_model=investment_schema.InvestmentSchema, status_code=201)
async def cretae_investment(
        investment: investment_schema.InvestmentCreateSchema,
        user: user_model.UserModel = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await investment_service.create_investment(user=user, db=db, investment=investment)


@router.get("/api/investments",
            response_model=List[investment_schema.InvestmentSchema], status_code=200)
async def get_investments(
        user: user_model.UserModel = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
    description: str = fastapi.Query(None),
):
    filters = {}
    if description:
        filters["description"] = description

    return await investment_service.get_investments(user=user, db=db, filters=filters)


@router.get("/api/investments/{investment_id}", status_code=200, response_model=investment_schema.InvestmentSchema)
async def get_investment_by_id(
        investment_id: int,
        user: user_model.UserModel = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await investment_service.get_investment_by_id(investment_id, user, db)


@router.delete("/api/investments/{investment_id}", status_code=204)
async def delete_investment(
        investment_id: int,
        user: user_model.UserModel = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await investment_service.delete_investment(investment_id, user, db)

@router.put("/api/investments/{investment_id}", status_code=204)
async def update_investment(
        investment_id: int,
        investment: investment_schema.InvestmentCreateSchema,
        user: user_model.UserModel = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await investment_service.update_investment(investment_id, investment, user, db)