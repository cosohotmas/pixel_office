// Verify permission states without calling a real browser geolocation API.
// 실제 브라우저 위치 API를 호출하지 않고 권한 상태를 검증합니다.
import { render, screen, waitFor, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { App } from "../app/App";
import type { LocationProvider, LocationResult } from "../services/locationProvider";
import type { AvailableWeather } from "../types/weather";

const weather = (area: string): AvailableWeather => ({
  area, status: "available", source: "mock", condition: "clear", temperature: 20,
  precipitation_probability: null, observed_at: "2026-01-01T00:00:00Z", message: null,
});
const provider = (result: LocationResult): LocationProvider => ({ requestLocation: vi.fn(async () => result) });
const loader = vi.fn(async (area: string) => weather(area));

afterEach(() => { cleanup(); sessionStorage.clear(); vi.clearAllMocks(); });

it("requests Mock location once and selects the granted area", async () => {
  const locationProvider = provider({ status: "granted", area: "부산" });
  render(<App loadWeather={loader} locationProvider={locationProvider} />);
  await userEvent.click(screen.getByRole("button", { name: "위치 사용 허용" }));
  expect(await screen.findByText(/위치 사용이 허용되었습니다/)).toBeTruthy();
  expect(await screen.findByRole("heading", { name: "부산" })).toBeTruthy();
  expect(locationProvider.requestLocation).toHaveBeenCalledTimes(1);
  // Selection forwards cancellation and the coordinator clock to the adapter.
  // 지역 선택은 취소 신호와 조정자 시계를 어댑터에 전달합니다.
  expect(loader).toHaveBeenCalledWith("부산", expect.any(AbortSignal), expect.any(Function));
});

// Location values bypass the field, so the hook must enforce both boundaries.
// 위치 값은 입력창을 거치지 않으므로 훅이 두 경계를 모두 검사해야 합니다.
it.each([
  [" ".repeat(15)+"가".repeat(64),true],
  [" ".repeat(16)+"가".repeat(64),true],
  [" ".repeat(17)+"가".repeat(64),false],
  ["가".repeat(65),false],
  ["서\n울",false],
] as const)("validates an injected location area %j, allowed=%s",async(raw,allowed)=>{
  const locationProvider=provider({status:"granted",area:raw});
  render(<App loadWeather={loader} locationProvider={locationProvider}/>);
  await waitFor(()=>expect(loader).toHaveBeenCalledTimes(6));
  const before=sessionStorage.getItem("weather.retry.v1");
  await userEvent.click(screen.getByRole("button",{name:"위치 사용 허용"}));
  const result=within(screen.getByRole("region",{name:"선택 지역 결과"}));
  if(allowed){
    expect(await result.findByRole("heading",{name:"가".repeat(64)})).toBeTruthy();
    expect(loader).toHaveBeenCalledTimes(7);
    expect(loader).toHaveBeenLastCalledWith("가".repeat(64),expect.any(AbortSignal),expect.any(Function));
    expect(sessionStorage.getItem("weather.retry.v1")).not.toContain(raw);
  }else{
    await waitFor(()=>expect(result.getByRole("status", { name: "" }).textContent).toMatch(/최대|제어문자/));
    expect(loader).toHaveBeenCalledTimes(6);
    expect(sessionStorage.getItem("weather.retry.v1")).toBe(before);
  }
});

it("keeps manual selection available after denial and does not retry automatically", async () => {
  const locationProvider = provider({ status: "denied", message: "사용자가 위치 권한을 거부했습니다." });
  render(<App loadWeather={loader} locationProvider={locationProvider} />);
  await userEvent.click(screen.getByRole("button", { name: "위치 사용 허용" }));
  expect(await screen.findByText(/사용자가 위치 권한을 거부했습니다/)).toBeTruthy();
  expect(screen.queryByRole("button", { name: "위치 사용 허용" })).toBeNull();
  const input = screen.getByLabelText("지역 직접 입력");
  await userEvent.type(input, "대전");
  await userEvent.click(screen.getByRole("button", { name: "날씨 조회" }));
  expect(await within(screen.getByRole("region", { name: "선택 지역 결과" })).findByRole("heading", { name: "대전" })).toBeTruthy();
});

it("shows provider errors without claiming location was granted", async () => {
  const locationProvider = provider({ status: "error", message: "Mock 위치 제공자 오류" });
  render(<App loadWeather={loader} locationProvider={locationProvider} />);
  await userEvent.click(screen.getByRole("button", { name: "위치 사용 허용" }));
  expect(await screen.findByText(/Mock 위치 제공자 오류/)).toBeTruthy();
  expect(screen.queryByText(/위치 사용이 허용되었습니다/)).toBeNull();
});

it("supports an injected initial denied state without requesting again", async () => {
  const locationProvider = provider({ status: "granted", area: "서울" });
  render(<App loadWeather={loader} locationStatus="denied" locationProvider={locationProvider} />);
  await waitFor(() => expect(screen.getByText(/위치 권한이 거부되었습니다/)).toBeTruthy());
  expect(screen.queryByRole("button", { name: "위치 사용 허용" })).toBeNull();
  expect(locationProvider.requestLocation).not.toHaveBeenCalled();
});

it("passes cancellation to the provider and ignores a late location result", async () => {
  let resolveLocation!: (result: LocationResult) => void;
  let receivedSignal!: AbortSignal;
  const locationProvider: LocationProvider = {
    requestLocation: vi.fn(signal => {
      receivedSignal = signal!;
      return new Promise<LocationResult>(resolve => { resolveLocation = resolve; });
    }),
  };
  const { unmount } = render(<App loadWeather={loader} locationProvider={locationProvider} />);
  await userEvent.click(screen.getByRole("button", { name: "위치 사용 허용" }));
  expect(receivedSignal.aborted).toBe(false);
  unmount();
  expect(receivedSignal.aborted).toBe(true);
  resolveLocation({ status: "granted", area: "서울" });
  await waitFor(() => expect(locationProvider.requestLocation).toHaveBeenCalledTimes(1));
});

it("cancels a pending location request when the user chooses an area manually", async () => {
  let resolveLocation!: (result: LocationResult) => void;
  let receivedSignal!: AbortSignal;
  const locationProvider: LocationProvider = {
    requestLocation: vi.fn(signal => {
      receivedSignal = signal!;
      return new Promise<LocationResult>(resolve => { resolveLocation = resolve; });
    }),
  };
  render(<App loadWeather={loader} locationProvider={locationProvider} />);
  await userEvent.click(screen.getByRole("button", { name: "위치 사용 허용" }));
  const input = screen.getByLabelText("지역 직접 입력");
  await userEvent.type(input, "대전");
  await userEvent.click(screen.getByRole("button", { name: "날씨 조회" }));
  expect(receivedSignal.aborted).toBe(true);
  expect(await within(screen.getByRole("region", { name: "선택 지역 결과" })).findByRole("heading", { name: "대전" })).toBeTruthy();
  resolveLocation({ status: "granted", area: "서울" });
  expect(screen.queryByRole("heading", { name: "서울" })).toBeNull();
});
