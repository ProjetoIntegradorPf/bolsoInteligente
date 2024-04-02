from fastapi import FastAPI, APIRouter

router = APIRouter()

@router.get("/api", tags=["API Information"])
async def root():
    return {"message": "Bolso Inteligente"}
