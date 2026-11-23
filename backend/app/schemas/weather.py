"""Validate weather data without inventing values for failures.
실패 상태에 값을 만들어 넣지 않고 날씨 데이터를 검증합니다.
"""
from datetime import datetime
from typing import Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

# Define the allowed weather words before building a response.
# 응답을 만들기 전에 허용되는 날씨 단어를 정의합니다.
WeatherCondition = Literal["rain", "snow", "clear", "cloudy"]
WeatherStatus = Literal["available", "no_data", "provider_error"]


class WeatherResponse(BaseModel):
    # Reject unexpected fields so the API contract stays explicit.
    # 예상하지 못한 필드를 거부해 API 계약을 명확하게 유지합니다.
    model_config = ConfigDict(extra="forbid")
    area: str = Field(min_length=1, max_length=80)
    status: WeatherStatus
    source: Literal["mock"] = "mock"
    condition: WeatherCondition | None = None
    temperature: float | None = Field(default=None, allow_inf_nan=False)
    precipitation_probability: int | None = Field(default=None, ge=0, le=100)
    observed_at: datetime | None = None
    message: str | None = None

    @model_validator(mode="after")
    def check_state(self) -> Self:
        # Success needs a condition and a timezone-aware example time.
        # 성공 응답에는 날씨 상태와 시간대가 있는 예시 시각이 필요합니다.
        if self.status == "available":
            if self.condition is None or self.observed_at is None:
                raise ValueError("available data needs condition and example time")
            if self.observed_at.utcoffset() is None:
                raise ValueError("example time needs a timezone")
        # Failed responses must contain no measurements or observation time.
        # 실패 응답에는 측정값이나 관측 시각을 넣지 않습니다.
        elif any(value is not None for value in (
            self.condition, self.temperature, self.precipitation_probability, self.observed_at,
        )):
            raise ValueError("unavailable data must not contain weather values")
        elif not self.message:
            raise ValueError("unavailable data needs an explanation")
        return self

