// Validate JSON at the network boundary before trusting its TypeScript type.
// TypeScript 타입을 신뢰하기 전에 네트워크 경계에서 JSON을 검사합니다.
import type { WeatherResponse } from "../types/weather";

export const WEATHER_TIMEOUT_MS = 10000;
// Classify errors without exposing upstream text to the UI.
// 외부 원문을 화면에 노출하지 않고 오류를 분류합니다.
export class WeatherRequestError extends Error {
  constructor(public kind: "network" | "timeout" | "input" | "auth" | "rate" | "server" | "invalid", public retryAt?: number, public receivedAt?: number) {
    super("Weather request failed");
  }
}

function isValidTimestamp(value: unknown): value is string {
  // First require an ISO timestamp with a timezone, as returned by our API.
  // 먼저 API가 반환하는 시간대 포함 ISO 시각 형식인지 검사합니다.
  if (typeof value !== "string") return false;
  const parts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,6})?(Z|[+-](\d{2}):(\d{2}))$/.exec(value);
  if (!parts) return false;
  const [, yearText, monthText, dayText, hourText, minuteText, secondText, zone, offsetHour, offsetMinute] = parts;
  const [year, month, day, hour, minute, second] =
    [yearText, monthText, dayText, hourText, minuteText, secondText].map(Number);
  // Check the original calendar fields so February 30 cannot roll into March.
  // 원래 달력 값을 검사하여 2월 30일이 3월로 바뀌어 통과하지 않게 합니다.
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return year >= 1 && month >= 1 && month <= 12 &&
    day >= 1 && day <= daysInMonth[month - 1] && hour < 24 && minute < 60 && second < 60 &&
    (zone === "Z" || (Number(offsetHour) < 24 && Number(offsetMinute) < 60));
}

export function parseWeather(value: unknown): WeatherResponse {
  if (!value || typeof value !== "object") throw new Error("Invalid response");
  const data = value as Record<string, unknown>;
  if (typeof data.area !== "string" || !data.area.trim() || data.source !== "mock")
    throw new Error("Invalid area or source");
  if (data.status === "available") {
    // Check the type before the allowed values; an array is not a condition string.
    // 허용값보다 타입을 먼저 검사합니다. 배열은 날씨 상태 문자열이 아닙니다.
    if (typeof data.condition !== "string" || !["rain", "snow", "clear", "cloudy"].includes(data.condition) ||
        !isValidTimestamp(data.observed_at) ||
        !(data.temperature === null || (typeof data.temperature === "number" && Number.isFinite(data.temperature))) ||
        !(data.precipitation_probability === null ||
          (typeof data.precipitation_probability === "number" &&
           Number.isInteger(data.precipitation_probability) &&
           data.precipitation_probability >= 0 && data.precipitation_probability <= 100)) ||
        !(data.message === null || typeof data.message === "string"))
      throw new Error("Invalid weather data");
  } else if (data.status === "no_data" || data.status === "provider_error") {
    if ([data.condition, data.temperature, data.precipitation_probability, data.observed_at].some(item => item !== null) ||
        typeof data.message !== "string" || !data.message.trim())
      throw new Error("Invalid unavailable response");
  } else throw new Error("Unknown response state");
  return data as WeatherResponse;
}

export async function fetchWeather(area: string, signal?: AbortSignal, now: () => number = () => Date.now()): Promise<WeatherResponse> {
  // Encode input and pass cancellation through to the browser.
  // 입력을 인코딩하고 취소 신호를 브라우저에 전달합니다.
  const timeout = AbortSignal.timeout(WEATHER_TIMEOUT_MS);
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
  // Use the same classification before headers and while reading the body.
  // 헤더 수신 전과 본문을 읽는 동안 같은 통신 오류 분류를 사용합니다.
  const transportFailure = (error: unknown): never => {
    if (signal?.aborted) throw signal.reason ?? error;
    throw new WeatherRequestError(timeout.aborted ? "timeout" : "network");
  };
  let response: Response;
  try { response = await fetch(`/api/weather?area=${encodeURIComponent(area)}`, { signal: requestSignal }); }
  catch (error) { return transportFailure(error); }
  if (requestSignal.aborted) return transportFailure(requestSignal.reason);
  if (response.status === 429) {
    // The caller supplies an epoch-anchored monotonic clock for this page.
    // 호출자가 이 화면의 절대 시각 기준 단조 시계를 전달합니다.
    // Seconds start at receipt; an HTTP-date already names an absolute epoch time.
    // 초 단위 제한은 수신 시점부터 계산하고 HTTP-date는 절대 시각 그대로 비교합니다.
    const raw = response.headers.get("Retry-After"), receivedAt = Math.floor(now());
    const at = raw && /^\d+$/.test(raw.trim()) ? receivedAt + Number(raw) * 1000 : raw ? Date.parse(raw) : NaN;
    throw new WeatherRequestError("rate", Number.isSafeInteger(at) && at > receivedAt ? at : undefined, receivedAt);
  }
  if (!response.ok && response.status !== 503) throw new WeatherRequestError(
    response.status === 401 || response.status === 403 ? "auth" : response.status >= 500 ? "server" : "input");
  // Read bytes first so an interrupted connection is not mistaken for bad JSON.
  // 연결 중단을 잘못된 JSON으로 오인하지 않도록 먼저 본문을 읽습니다.
  let body: string;
  try { body = await response.text(); }
  catch (error) { return transportFailure(error); }
  if (requestSignal.aborted) return transportFailure(requestSignal.reason);
  // Only syntax and schema failures are terminal validation errors.
  // 문법·스키마 실패만 재시도하지 않는 검증 오류로 분류합니다.
  let data: WeatherResponse;
  try { data = parseWeather(JSON.parse(body)); } catch { throw new WeatherRequestError("invalid"); }
  // A 503 response may explain an outage but must never display success.
  // 503 응답은 장애를 설명할 수 있지만 성공 데이터를 표시해서는 안 됩니다.
  if (response.status === 503 && data.status !== "provider_error") throw new WeatherRequestError("invalid");
  return data;
}

