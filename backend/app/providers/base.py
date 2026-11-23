"""Define the replaceable data-source block.
교체 가능한 데이터 출처 블록을 정의합니다.
"""
from typing import Protocol

from app.schemas.weather import WeatherResponse


class WeatherProvider(Protocol):
    # Each provider accepts one area and returns the same response shape.
    # 각 제공자는 지역 하나를 받고 동일한 응답 형식을 반환합니다.
    def get_weather(self, area: str) -> WeatherResponse: ...

