import fastapi
import jwt as _jwt
import sqlalchemy.orm as orm
import passlib.hash as hash

from models.user_model import UserModel

import schemas.user_schema as user_schema
import database
from datetime import datetime
oauth2schema = fastapi.security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "myjwtsecret"

async def get_user_by_email(email: str, db: orm.Session):
    return db.query(UserModel).filter(UserModel.email == email).first()


async def create_user(user: user_schema.UserCreateSchema, db: orm.Session):
    user_obj = UserModel(
        first_name=user.first_name,
        last_name=user.last_name,
        date_of_birth=user.date_of_birth,
        email=user.email,
        hashed_password=hash.bcrypt.hash(user.hashed_password)
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

async def authenticate_user(email: str, password: str, db: orm.Session):
    user = await get_user_by_email(db=db, email=email)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    return user


async def create_token(user: UserModel):
    user_obj = user_schema.UserSchema.from_orm(user)
    token = _jwt.encode(user_obj.dict(exclude={"date_of_birth"}), JWT_SECRET)
    return dict(access_token=token, token_type="bearer")

async def get_current_user(
    db: orm.Session = fastapi.Depends(database.get_db),
    token: str = fastapi.Depends(oauth2schema),
):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(UserModel).get(payload["id"])
    except:
        raise fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return user