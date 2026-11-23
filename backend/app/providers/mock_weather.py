"""Supply fixed examples, never current observations.
현재 관측값이 아닌 고정 예시를 제공합니다.
"""
from datetime import UTC, datetime

from app.schemas.weather import WeatherResponse

# These examples cover selected regions, not every area in Korea.
# 이 예시는 전국 모든 지역이 아닌 일부 대표 지역을 다룹니다.
EXAMPLES = {
    "서울": ("rain", 18.0), "부산": ("clear", 22.0),
    "대전": ("cloudy", 19.0), "광주": ("clear", 21.0),
    "강릉": ("cloudy", 17.0), "제주": ("rain", 20.0),
    "Seoul": ("rain", 18.0),
}
EXAMPLE_TIME = datetime(2026, 1, 1, 0, 0, tzinfo=UTC)


class MockWeatherProvider:
    def get_weather(self, area: str) -> WeatherResponse:
        # Unsupported places have no data; do not reuse another area's values.
        # 지원하지 않는 장소는 다른 지역 값을 재사용하지 않고 데이터 없음으로 처리합니다.
        if area not in EXAMPLES:
            return WeatherResponse(
                area=area, status="no_data",
                message="No example data for this area. 이 지역의 예시 데이터가 없습니다.",
            )
        condition, temperature = EXAMPLES[area]
        # Use the same timestamp for repeatable tests and honest example labels.
        # 반복 가능한 테스트와 정확한 예시 표기를 위해 같은 시각을 사용합니다.
        return WeatherResponse(
            area=area, status="available", condition=condition,
            temperature=temperature, observed_at=EXAMPLE_TIME,
        )

