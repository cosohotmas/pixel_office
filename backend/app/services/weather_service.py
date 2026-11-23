"""Validate input, then ask a replaceable provider.
입력을 검증한 다음 교체 가능한 제공자에 요청합니다.
"""
from app.providers.base import WeatherProvider
from app.providers.mock_weather import MockWeatherProvider
from app.schemas.weather import WeatherResponse


class WeatherService:
    def __init__(self, provider: WeatherProvider | None = None) -> None:
        # Tests can pass a different provider without changing production code.
        # 테스트는 실제 코드를 바꾸지 않고 다른 제공자를 전달할 수 있습니다.
        self.provider = provider if provider is not None else MockWeatherProvider()

    def get_weather(self, area: str) -> WeatherResponse:
        # Trim accidental spaces before checking and forwarding the area.
        # 지역을 검사하고 전달하기 전에 실수로 입력된 공백을 제거합니다.
        normalized = area.strip()
        if not normalized or len(normalized) > 80:
            raise ValueError("Area must contain 1–80 characters.")
        try:
            return self.provider.get_weather(normalized)
        except (TimeoutError, ConnectionError):
            # Return a safe explanation without exposing provider internals.
            # 제공자 내부 정보를 노출하지 않고 안전한 설명을 반환합니다.
            return WeatherResponse(
                area=normalized, status="provider_error",
                message="Provider unavailable. Retry. 제공자 오류입니다. 다시 시도하세요.",
            )

