// Share the server's discriminated response contract with the UI.
// 서버의 상태별 응답 계약을 화면과 공유합니다.
export type WeatherCondition = "rain" | "snow" | "clear" | "cloudy";
export type WeatherStatus = "available" | "no_data" | "provider_error";
type Base = { area: string; source: "mock" };
export type AvailableWeather = Base & {
  status: "available";
  condition: WeatherCondition;
  temperature: number | null;
  precipitation_probability: number | null;
  observed_at: string;
  message: string | null;
};
// Empty and failed responses cannot carry weather measurements.
// 데이터 없음·실패 응답에는 날씨 측정값을 넣을 수 없습니다.
export type UnavailableWeather = Base & {
  status: "no_data" | "provider_error";
  condition: null;
  temperature: null;
  precipitation_probability: null;
  observed_at: null;
  message: string;
};
export type WeatherResponse = AvailableWeather | UnavailableWeather;

