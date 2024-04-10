from database.database import get_db
from models.user_model import UserModel
import schemas.user_schema as user_schemas
import services.user_service as user_service
import fastapi
import jwt as jwt
import sqlalchemy.orm as orm

from datetime import datetime


oauth2schema = fastapi.security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "myjwtsecret"


router = fastapi.APIRouter()


@router.post("/api/users")
async def create_user(
        user: user_schemas.UserCreateSchema,
        db: orm.Session = fastapi.Depends(get_db)):
    db_user = await user_service.get_user_by_email(user.email, db)
    if db_user:
        raise fastapi.HTTPException(
            status_code=400, detail="Email already in use")

    new_user = await user_service.create_user(user, db)

    return await user_service.create_token(new_user)


@router.post("/api/token")
async def generate_token(
    form_data: fastapi.security.OAuth2PasswordRequestForm = fastapi.Depends(),
    db: orm.Session = fastapi.Depends(get_db),
):
    user = await user_service.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise fastapi.HTTPException(
            status_code=401, detail="Invalid Credentials")

    return await user_service.create_token(user)


async def get_current_user(
    db: orm.Session = fastapi.Depends(get_db),
    token: str = fastapi.Depends(oauth2schema),
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(UserModel).get(payload["id"])
    except BaseException:
        raise fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return user_schemas.UserSchema.fromorm(user)


@router.get("/api/users/me", response_model=user_schemas.UserSchema)
async def get_user(
    user: user_schemas.UserSchema = fastapi.Depends(
        user_service.get_current_user)):
    return user
