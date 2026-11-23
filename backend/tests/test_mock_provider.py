"""Check fixed examples and honest missing-data responses.
고정 예시와 정확한 데이터 없음 응답을 확인합니다.
"""
import pytest
from pydantic import ValidationError

from app.providers.mock_weather import MockWeatherProvider
from app.schemas.weather import WeatherResponse


def test_fixed_example():
    # Repeated lookups must keep the same example time and source.
    # 반복 조회에서도 예시 시각과 출처가 같아야 합니다.
    first = MockWeatherProvider().get_weather("서울")
    assert first == MockWeatherProvider().get_weather("서울")
    assert first.source == "mock"
    assert first.observed_at.isoformat() == "2026-01-01T00:00:00+00:00"
    assert first.precipitation_probability is None


def test_unknown_area_has_no_invented_values():
    result = MockWeatherProvider().get_weather("없는 지역")
    assert result.status == "no_data"
    assert result.condition is None
    assert result.observed_at is None


@pytest.mark.parametrize("status", ["no_data", "provider_error"])
def test_failure_cannot_contain_weather(status):
    # Reject invented weather values even when a caller labels them as an error.
    # 호출자가 오류라고 표시해도 만들어 넣은 날씨 값은 거부합니다.
    with pytest.raises(ValidationError):
        WeatherResponse(area="서울", status=status, condition="rain", message="failure")


def test_available_requires_condition_and_time():
    with pytest.raises(ValidationError):
        WeatherResponse(area="서울", status="available")

