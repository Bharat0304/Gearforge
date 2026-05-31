from sqlalchemy.ext.asyncio import create_async_engine

DATABASE_URL = "postgresql://admin:password123@localhost:5432/mydb"

engine = create_async_engine(DATABASE_URL)
