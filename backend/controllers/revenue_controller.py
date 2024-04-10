from typing import List

import fastapi

import sqlalchemy.orm as orm

from database.database import get_db

import schemas.revenue_schema as revenue_schema

import services.revenue_service as revenue_service

import models.user_model as user_model

import services.user_service as user_service

router = fastapi.APIRouter()


@router.post("/api/revenues",
             response_model=revenue_schema.RevenueSchema,
             status_code=201)
async def cretae_revenue(
        revenue: revenue_schema.RevenueCreateSchema,
        user: user_model.UserModel = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await revenue_service.create_revenue(user=user, db=db, revenue=revenue)


@router.get("/api/revenues",
            response_model=List[revenue_schema.RevenueSchema],
            status_code=200)
async def get_revenues(
        user: user_model.UserModel = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
    description: str = fastapi.Query(None),
):
    filters = {}
    if description:
        filters["description"] = description

    return await revenue_service.get_revenues(user=user, db=db, filters=filters)


@router.get("/api/revenues/{revenue_id}",
            status_code=200,
            response_model=revenue_schema.RevenueSchema)
async def get_revenue_by_id(
        revenue_id: int,
        user: user_model.UserModel = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await revenue_service.get_revenue_by_id(db, user, revenue_id)


@router.delete("/api/revenues/{revenue_id}", status_code=204)
async def delete_revenue(
        revenue_id: int,
        user: user_model.UserModel = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await revenue_service.delete_revenue(db, user, revenue_id)


@router.put("/api/revenues/{revenue_id}", status_code=204)
async def update_revenue(
        revenue_id: int,
        revenue: revenue_schema.RevenueCreateSchema,
        user: user_model.UserModel = fastapi.Depends(
            user_service.get_current_user),
    db: orm.Session = fastapi.Depends(get_db),
):
    return await revenue_service.update_revenue(db, user, revenue, revenue_id)
