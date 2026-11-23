"""Check the provider contract with deterministic data.
결정적인 데이터로 제공자 계약을 확인합니다.
"""

from app.providers.base import WeatherProvider
from app.providers.mock_weather import MockWeatherProvider


def test_mock_provider_satisfies_weather_provider_contract() -> None:
    # Assigning the concrete provider to the protocol documents the boundary.
    # 구체 제공자를 프로토콜 변수에 대입해 경계를 문서화합니다.
    provider: WeatherProvider = MockWeatherProvider()
    response = provider.get_weather("서울")

    # Known data must return a validated, available response.
    # 알려진 데이터는 검증된 available 응답을 반환해야 합니다.
    assert response.status == "available"
    assert response.area == "서울"
    assert response.source == "mock"
    assert response.observed_at is not None
