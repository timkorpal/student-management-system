import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

"""
Database configuration for the Students API.

This module configures the SQLAlchemy connection to the PostgreSQL
database, creates the database session factory, defines the declarative
base used by ORM models, and provides a FastAPI dependency for managing
database sessions.
"""


# ---------------------------------------------------------
# Load environment variables
# ---------------------------------------------------------

# Loads variables from the .env file into the environment.
load_dotenv()

# Retrieve the PostgreSQL connection string from .env.
DATABASE_URL = os.getenv("DATABASE_URL")

# Make sure DATABASE_URL exists before attempting to connect.
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the .env file.")


# ---------------------------------------------------------
# Create SQLAlchemy engine
# ---------------------------------------------------------

# The engine manages connections between SQLAlchemy and PostgreSQL.
engine = create_engine(DATABASE_URL)


# ---------------------------------------------------------
# Create database session
# ---------------------------------------------------------

# SessionLocal will be used whenever the application needs
# to communicate with the database.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ---------------------------------------------------------
# Create SQLAlchemy Base
# ---------------------------------------------------------

# All SQLAlchemy database models will inherit from Base.
Base = declarative_base()


# ---------------------------------------------------------
# FastAPI database dependency
# ---------------------------------------------------------

def get_db():
    """
    Creates a database session for a request.

    The session is automatically closed when the request
    has finished processing.
    """
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()