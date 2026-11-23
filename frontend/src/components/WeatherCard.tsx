// Only a successful response can enter this display block.
// 성공 응답만 이 표시 블록에 들어올 수 있습니다.
import type { AvailableWeather } from "../types/weather";

const conditions = { rain: "☔ 비", snow: "❄ 눈", clear: "☀ 맑음", cloudy: "☁ 흐림" };
export function WeatherCard({ weather }: { weather: AvailableWeather }) {
  return <section aria-label={weather.area + " 예시 날씨"}>
    <h2>{weather.area}</h2>
    <p>{conditions[weather.condition]}</p>
    <p>기온: {weather.temperature === null ? "정보 없음" : weather.temperature + "°C"}</p>
    <p>강수확률: {weather.precipitation_probability === null ? "정보 없음" : weather.precipitation_probability + "%"}</p>
  </section>;
}

