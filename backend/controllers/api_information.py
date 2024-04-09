from fastapi import FastAPI, APIRouter

router = APIRouter()


@router.get("/api", tags=["API Information"], status_code=200)
async def root():
    return {"message": "Bolso Inteligente"}
