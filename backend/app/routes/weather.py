"""Translate HTTP requests into the weather service contract.
HTTP 요청을 날씨 서비스 계약으로 변환합니다.
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response

from app.schemas.weather import WeatherResponse
from app.services.weather_service import WeatherService

router = APIRouter(tags=["weather"])


def get_service() -> WeatherService:
    # FastAPI calls this dependency; tests may override it safely.
    # FastAPI가 이 의존성을 호출하며 테스트는 이를 교체할 수 있습니다.
    return WeatherService()


@router.get("/weather", response_model=WeatherResponse, responses={503: {"model": WeatherResponse}})
def get_weather(
    response: Response,
    area: Annotated[str, Query(min_length=1, max_length=80)],
    service: Annotated[WeatherService, Depends(get_service)],
) -> WeatherResponse:
    # FastAPI validates the query first; the service then validates trimmed text.
    # FastAPI가 쿼리를 먼저 검사하고 서비스가 공백을 제거한 문장을 검사합니다.
    try:
        result = service.get_weather(area)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    # No-data is a valid lookup; a provider outage is an HTTP service failure.
    # 데이터 없음은 유효한 조회 결과이며 제공자 장애는 HTTP 서비스 실패입니다.
    if result.status == "provider_error":
        response.status_code = 503
    return result

