// Label the timestamp as an example, not a current observation.
// 시각을 현재 관측값이 아닌 예시 시각으로 표시합니다.
import type { AvailableWeather } from "../types/weather";

export function SourceNotice({ weather }: { weather: AvailableWeather }) {
  return <p>출처: 자체 제작 Mock 예시 · 실제 기상청 관측자료가 아닙니다.<br />
    예시 기준 시각: <time dateTime={weather.observed_at}>{weather.observed_at}</time>
  </p>;
}

