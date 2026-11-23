"""Start the FastAPI application.
FastAPI 애플리케이션을 시작합니다.
"""

from fastapi import FastAPI

from app.routes.weather import router as weather_router

app = FastAPI(title="Weather Conversation API")
app.include_router(weather_router, prefix="/api")

