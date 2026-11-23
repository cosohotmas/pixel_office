// Keep location permission independent from the weather request.
// 위치 권한을 날씨 요청과 별도로 관리합니다.
import type { WeatherResponse } from "../types/weather";

export type LocationStatus = "not_requested" | "requesting" | "granted" | "denied" | "error";
export type WeatherState =
  | { status: "idle" | "loading" }
  | { status: "result"; weather: WeatherResponse }
  | { status: "error"; message: string };

export const initialWeatherState: WeatherState = { status: "idle" };

