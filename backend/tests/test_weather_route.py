"""Test the public HTTP contract, including dependency replacement.
의존성 교체를 포함한 공개 HTTP 계약을 테스트합니다.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.routes.weather import get_service
from app.services.weather_service import WeatherService

client = TestClient(app)


def test_available_response():
    response = client.get("/api/weather", params={"area": "서울"})
    assert response.status_code == 200
    assert response.json()["condition"] == "rain"
    assert response.json()["source"] == "mock"


def test_no_data_response():
    response = client.get("/api/weather", params={"area": "unknown"})
    assert response.status_code == 200
    assert response.json()["status"] == "no_data"
    assert response.json()["observed_at"] is None


@pytest.mark.parametrize("params,code", [({}, 422), ({"area": ""}, 422), ({"area": "   "}, 400), ({"area": "a" * 81}, 422)])
def test_bad_input(params, code):
    assert client.get("/api/weather", params=params).status_code == code


def test_outage_returns_503_without_weather():
    class Offline:
        def get_weather(self, area):
            raise ConnectionError("private detail")

    # Override only this test's dependency and always restore it afterward.
    # 이 테스트의 의존성만 교체하고 끝난 뒤 반드시 복원합니다.
    app.dependency_overrides[get_service] = lambda: WeatherService(Offline())
    try:
        response = client.get("/api/weather", params={"area": "서울"})
        assert response.status_code == 503
        assert response.json()["status"] == "provider_error"
        assert response.json()["temperature"] is None
        assert "private detail" not in response.text
    finally:
        app.dependency_overrides.clear()

