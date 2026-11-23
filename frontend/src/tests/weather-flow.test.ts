// Test the real HTTP adapter and reject malformed response data.
// 실제 HTTP 어댑터를 테스트하고 잘못된 응답 데이터를 거부합니다.
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWeather, parseWeather } from "../services/weatherApi";

const good = { area: "서울", status: "available", source: "mock", condition: "rain",
  temperature: 18, precipitation_probability: null, observed_at: "2026-01-01T00:00:00Z", message: null };
const empty = { ...good, status: "no_data", condition: null, temperature: null,
  observed_at: null, message: "No data" };

afterEach(() => vi.unstubAllGlobals());
describe("weather HTTP boundary", () => {
  it("encodes an area and forwards cancellation", async () => {
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify(good)));
    vi.stubGlobal("fetch", request);
    const controller = new AbortController();
    const signal = controller.signal;
    expect(await fetchWeather("서울 & 부산", signal)).toEqual(good);
    expect(request.mock.calls[0][0]).toBe("/api/weather?area=" + encodeURIComponent("서울 & 부산"));
    controller.abort();
    expect(request.mock.calls[0][1].signal.aborted).toBe(true);
  });
  it("accepts empty data without weather facts", () => expect(parseWeather(empty)).toEqual(empty));
  // Reject malformed types and dates without rejecting valid leap days or timezone offsets.
  // 정상 윤일·시간대는 허용하면서 잘못된 타입과 날짜를 거부합니다.
  it.each([["rain"], { toString: () => "rain" }, null, 1])("rejects a non-string condition: %j", condition => {
    expect(() => parseWeather({ ...good, condition })).toThrow();
  });
  it.each([
    "2026-02-30T00:00:00Z", "2026-02-29T00:00:00Z", "1900-02-29T00:00:00Z",
    "2026-04-31T00:00:00Z", "2026-13-01T00:00:00Z", "2026-00-01T00:00:00Z",
    "2026-01-00T00:00:00Z", "0000-01-01T00:00:00Z", "2026-01-01T24:00:00Z",
    "2026-01-01T00:60:00Z", "2026-01-01T00:00:60Z", "2026-01-01T00:00:00+24:00",
    "2026-01-01T00:00:00+09:60", "2026-01-01T00:00:00", "2026-01-01Z",
  ])("rejects an invalid timestamp: %s", observed_at => {
    expect(() => parseWeather({ ...good, observed_at })).toThrow();
  });
  it.each([
    "2024-02-29T00:00:00Z", "2000-02-29T00:00:00Z", "2026-01-01T09:00:00+09:00",
    "2025-12-31T19:00:00-05:00", "2026-01-01T00:00:00.123456Z",
  ])("preserves a valid timestamp: %s", observed_at => {
    expect(parseWeather({ ...good, observed_at }).observed_at).toBe(observed_at);
  });
  it.each([
    { ...good, temperature: "18" }, { ...good, source: "kma" },
    { ...good, observed_at: "yesterday" }, { ...good, precipitation_probability: 101 },
    { ...empty, condition: "rain" }, { ...good, status: "location_denied" },
  ])("rejects invalid JSON fields", data => expect(() => parseWeather(data)).toThrow());
  it("accepts the provider-error contract on 503", async () => {
    const outage = { ...empty, status: "provider_error" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(outage), { status: 503 })));
    expect((await fetchWeather("서울")).status).toBe("provider_error");
  });
  it("rejects generic server failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("failure", { status: 500 })));
    await expect(fetchWeather("서울")).rejects.toThrow();
  });
  it("does not turn a success body on 503 into valid weather", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(good), { status: 503 })));
    await expect(fetchWeather("서울")).rejects.toThrow();
  });
});

