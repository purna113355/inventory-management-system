from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from passlib.context import CryptContext
from jose import jwt, JWTError
import mysql.connector
from dotenv import load_dotenv
import os
load_dotenv()
from mysql.connector import IntegrityError
app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:
            return None

        return username

    except JWTError:
        return None
security = HTTPBearer()
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    username = verify_token(token)

    if username is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return username

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://inventory-management-system-blush-iota.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)



class Product(BaseModel):
    name: str = Field(min_length=1)
    category: str = Field(min_length=1)
    stock: int = Field(ge=0)

class User(BaseModel):
    username: str
    password: str

@app.get("/")
def home():
    return {"message": "Inventory Management System API is running"}

@app.post("/register")
def register_user(user: User):
    cursor = db.cursor()

    try:
        query = """
            INSERT INTO users (username, password)
            VALUES (%s, %s)
        """

        hashed_password = pwd_context.hash(user.password)

        values = (user.username, hashed_password)

        cursor.execute(query, values)

        db.commit()

        return {"message": "User registered successfully"}

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    except mysql.connector.Error:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Database error while registering user"
        )

    finally:
        cursor.close()

    return {"message": "User registered successfully"}

@app.post("/login")
def login_user(user: User):
    cursor = db.cursor(dictionary=True)

    try:
        query = "SELECT * FROM users WHERE username = %s"
        cursor.execute(query, (user.username,))

        existing_user = cursor.fetchone()

        if existing_user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )

        if not pwd_context.verify(user.password, existing_user["password"]):
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )

        token = jwt.encode(
            {"sub": existing_user["username"]},
            SECRET_KEY,
            algorithm=ALGORITHM
        )

        return {
            "message": "Login successful",
            "access_token": token
        }

    except HTTPException:
        raise

    except mysql.connector.Error:
        raise HTTPException(
            status_code=500,
            detail="Database error while logging in"
        )

    finally:
        cursor.close()

@app.get("/products")
def get_products(current_user = Depends(get_current_user)):
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM products")

        products = cursor.fetchall()

        return products

    except mysql.connector.Error:
        raise HTTPException(
            status_code=500,
            detail="Database error while fetching products"
        )

    finally:
        cursor.close()


@app.post("/products")
def add_product(
    product: Product,
    current_user = Depends(get_current_user)
):
    cursor = db.cursor()

    try:
        query = """
            INSERT INTO products (name, category, stock)
            VALUES (%s, %s, %s)
        """

        values = (product.name, product.category, product.stock)

        cursor.execute(query, values)

        db.commit()

        new_id = cursor.lastrowid

        return {
            "id": new_id,
            "name": product.name,
            "category": product.category,
            "stock": product.stock
        }

    except mysql.connector.Error:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Database error while adding product"
        )

    finally:
        cursor.close()

@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: Product,
    current_user = Depends(get_current_user)
):
    cursor = db.cursor()

    try:
        query = """
            UPDATE products
            SET name = %s, category = %s, stock = %s
            WHERE id = %s
        """

        values = (
            product.name,
            product.category,
            product.stock,
            product_id
        )

        cursor.execute(query, values)

        db.commit()

        if cursor.rowcount == 0:
            return {"message": "Product not found"}

        return {
            "id": product_id,
            "name": product.name,
            "category": product.category,
            "stock": product.stock
        }

    except mysql.connector.Error:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Database error while updating product"
        )

    finally:
        cursor.close()

@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_user = Depends(get_current_user)
):
    cursor = db.cursor()

    try:
        query = "DELETE FROM products WHERE id = %s"

        cursor.execute(query, (product_id,))

        db.commit()

        if cursor.rowcount == 0:
            return {"message": "Product not found"}

        return {"message": "Product deleted successfully"}

    except mysql.connector.Error:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Database error while deleting product"
        )

    finally:
        cursor.close()