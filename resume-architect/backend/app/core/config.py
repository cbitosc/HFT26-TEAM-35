import os

class Settings:
    PROJECT_NAME: str = "Resume Architect Central Backend"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # SQLite Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./resume_architect.db")
    
    # Security & JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "resume_architect_super_secure_jwt_secret_key_2026")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Gemini AI Central Service
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

settings = Settings()
