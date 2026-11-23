"""Verify validation and the replaceable provider boundary.
검증과 교체 가능한 제공자 경계를 확인합니다.
"""
import pytest

from app.schemas.weather import WeatherResponse
from app.services.weather_service import WeatherService


class EmptyProvider:
    # A fake provider lets the test choose the response without network access.
    # 가짜 제공자로 네트워크 없이 테스트 응답을 선택합니다.
    def get_weather(self, area):
        return WeatherResponse(area=area, status="no_data", message="No example")


class BrokenProvider:
    def get_weather(self, area):
        raise TimeoutError("internal provider detail")


def test_normalizes_area():
    assert WeatherService().get_weather(" 서울 ").area == "서울"


@pytest.mark.parametrize("area", ["", "   ", "a" * 81])
def test_rejects_invalid_area(area):
    with pytest.raises(ValueError):
        WeatherService().get_weather(area)


def test_accepts_an_alternative_provider():
    assert WeatherService(EmptyProvider()).get_weather("서울").status == "no_data"


def test_outage_is_sanitized():
    result = WeatherService(BrokenProvider()).get_weather("서울")
    assert result.status == "provider_error"
    assert result.condition is None
    assert "internal" not in result.message

