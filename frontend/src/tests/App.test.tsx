// Exercise user actions against the actual React components.
// 실제 React 컴포넌트에서 사용자 행동을 검증합니다.
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { App } from "../app/App";
import { AreaSelector } from "../components/AreaSelector";
import { WeatherRequestError } from "../services/weatherApi";
import type { AvailableWeather, WeatherResponse } from "../types/weather";

const available = (area: string): AvailableWeather => ({
  area, status: "available", source: "mock", condition: "rain", temperature: 18,
  precipitation_probability: null, observed_at: "2026-01-01T00:00:00Z", message: null,
});
const unavailable = (status: "no_data" | "provider_error"): WeatherResponse => ({
  area: "테스트", status, source: "mock", condition: null, temperature: null,
  precipitation_probability: null, observed_at: null, message: "Unavailable",
});
const results = () => within(screen.getByRole("region", { name: "선택 지역 결과" }));
afterEach(() => { cleanup(); sessionStorage.clear(); vi.useRealTimers(); });

// Check every initial row before selection, using different times to detect shared or invented timestamps.
// 선택 전에 모든 행을 검사하며 서로 다른 시각으로 공통값·임의 시각 사용을 탐지합니다.
it("shows each overview source and example time, with no unit for a missing temperature", async () => {
  const timestamp = (area: string) => area === "서울" ? "2026-01-01T00:00:00Z" : "2026-01-02T03:00:00+09:00";
  render(<App loadWeather={async area => ({ ...available(area),
    temperature: area === "서울" ? null : 18, observed_at: timestamp(area) })} />);
  const overview = within(screen.getByRole("region", { name: "전국 대표 지역 예시" }));
  await waitFor(() => expect(overview.getAllByText(/출처: 자체 제작 Mock/)).toHaveLength(6));
  for (const row of overview.getAllByRole("listitem")) {
    const area = within(row).getByRole("button").textContent!;
    expect(within(row).getByText(/예시 기준 시각/)).toBeTruthy();
    expect(row.querySelector("time")?.getAttribute("datetime")).toBe(timestamp(area));
    expect(within(row).getByText(timestamp(area))).toBeTruthy();
    expect(row.textContent).toContain(area === "서울" ? "기온 정보 없음" : "18°C");
    if (area === "서울") expect(row.textContent).not.toContain("°C");
  }
  expect(results().queryByRole("heading")).toBeNull();
});

it("shows representative data and supports manual selection after location denial", async () => {
  const loader = vi.fn(async (area: string) => available(area));
  render(<App loadWeather={loader} locationStatus="denied" />);
  expect(screen.getByText(/위치 권한이 거부/)).toBeTruthy();
  await waitFor(() => expect(loader).toHaveBeenCalledTimes(6));
  await userEvent.type(screen.getByLabelText("지역 직접 입력"), "서울");
  await userEvent.click(screen.getByRole("button", { name: "날씨 조회" }));
  expect(await results().findByRole("heading", { name: "서울" })).toBeTruthy();
  expect(results().getByText(/실제 기상청 관측자료가 아닙니다/)).toBeTruthy();
  expect(results().getByText("2026-01-01T00:00:00Z")).toBeTruthy();
});

it.each(["no_data", "provider_error"] as const)("shows %s without a weather card", async status => {
  render(<App loadWeather={async area => area === "테스트" ? unavailable(status) : available(area)} />);
  await userEvent.type(screen.getByLabelText("지역 직접 입력"), "테스트");
  await userEvent.click(screen.getByRole("button", { name: "날씨 조회" }));
  await waitFor(() => expect(results().getByRole("status").textContent).not.toContain("불러오는 중"));
  expect(!!results().queryByRole("button", { name: "같은 지역으로 다시 조회" })).toBe(status === "provider_error");
  expect(results().queryByRole("heading")).toBeNull();
  expect(results().queryByText(/기온:/)).toBeNull();
});

it("recovers from a network error by retrying the same area", async () => {
  let failures = 0;
  const loader = async (area: string) => {
    if (area === "테스트" && failures++ === 0) throw new Error("offline");
    return available(area);
  };
  vi.useFakeTimers();
  render(<App loadWeather={loader} />);
  const input = screen.getByLabelText("지역 직접 입력");
  fireEvent.change(input, { target: { value: "테스트" } });
  await act(async () => { fireEvent.submit(input.closest("form")!); });
  expect((results().getByRole("button", { name: "같은 지역으로 다시 조회" }) as HTMLButtonElement).disabled).toBe(true);
  const countdown = results().getByText("테스트 날씨 다시 시도까지 5초");
  expect(countdown.closest('[role="status"], [aria-live]')).toBeNull();
  expect(results().queryByText("테스트 날씨를 다시 조회할 수 있습니다.")).toBeNull();
  await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
  expect(results().getByText("테스트 날씨를 다시 조회할 수 있습니다.").getAttribute("aria-live")).toBe("polite");
  await act(async () => { fireEvent.click(results().getByRole("button", { name: "같은 지역으로 다시 조회" })); });
  expect(results().getByRole("heading", { name: "테스트" })).toBeTruthy();
});

it.each([
  ["invalid", "날씨 응답을 확인할 수 없습니다."],
  ["auth", "인증 또는 권한 문제로 날씨를 조회할 수 없습니다."],
] as const)("explains %s without offering a retry", async (kind, message) => {
  const loader = async (area: string) => {
    if (area === "테스트") throw new WeatherRequestError(kind);
    return available(area);
  };
  render(<App loadWeather={loader} />);
  const input = screen.getByLabelText("지역 직접 입력");
  fireEvent.change(input, { target: { value: "테스트" } });
  await act(async () => { fireEvent.submit(input.closest("form")!); });
  expect(results().getByText(message)).toBeTruthy();
  expect(results().queryByRole("button", { name: "같은 지역으로 다시 조회" })).toBeNull();
});

it("shows loading and ignores an older response that arrives last", async () => {
  let finishOld!: (value: WeatherResponse) => void;
  const loader = (area: string) => area === "이전" ?
    new Promise<WeatherResponse>(resolve => { finishOld = resolve; }) : Promise.resolve(available(area));
  render(<App loadWeather={loader} />);
  const input = screen.getByLabelText("지역 직접 입력");
  fireEvent.change(input, { target: { value: "이전" } });
  fireEvent.submit(input.closest("form")!);
  expect(results().getByText(/불러오는 중/)).toBeTruthy();
  fireEvent.change(input, { target: { value: "새지역" } });
  fireEvent.submit(input.closest("form")!);
  await results().findByRole("heading", { name: "새지역" });
  await act(async () => finishOld(available("이전")));
  expect(results().queryByRole("heading", { name: "이전" })).toBeNull();
});

it("keeps a blank input from making a manual request", async () => {
  const loader = vi.fn(async (area: string) => available(area));
  render(<App loadWeather={loader} />);
  await waitFor(() => expect(loader).toHaveBeenCalledTimes(6));
  expect((screen.getByRole("button", { name: "날씨 조회" }) as HTMLButtonElement).disabled).toBe(true);
});

// The form retains rejected text and never turns it into a shorter request.
// 폼은 거부된 원문을 유지하며 짧게 바꿔 요청하지 않습니다.
it("rejects an effective name over 64 without dispatch or retry-state mutation", async()=>{
  const loader=vi.fn(async(area:string)=>available(area));
  render(<App loadWeather={loader}/>);
  await waitFor(()=>expect(loader).toHaveBeenCalledTimes(6));
  const before=sessionStorage.getItem("weather.retry.v1");
  const input=screen.getByLabelText("지역 직접 입력") as HTMLInputElement;
  const raw="가".repeat(65);
  fireEvent.change(input,{target:{value:raw}});
  expect(loader).toHaveBeenCalledTimes(6);
  fireEvent.submit(input.closest("form")!);
  expect(screen.getByRole("alert").textContent).toContain("최대 64단위");
  expect(input.value).toBe(raw);
  expect(input.getAttribute("aria-invalid")).toBe("true");
  for(const id of input.getAttribute("aria-describedby")!.split(" "))expect(document.getElementById(id)).toBeTruthy();
  expect(loader).toHaveBeenCalledTimes(6);
  expect(sessionStorage.getItem("weather.retry.v1")).toBe(before);
});

it("forwards a valid raw80 value unchanged and rejects synthetic raw81 input",()=>{
  const select=vi.fn();
  render(<AreaSelector onSelect={select}/>);
  const input=screen.getByLabelText("지역 직접 입력") as HTMLInputElement;
  const raw=" ".repeat(16)+"가".repeat(64);
  expect(input.maxLength).toBe(80);
  expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toContain("앞뒤 공백은 제거");
  fireEvent.change(input,{target:{value:raw}});
  fireEvent.submit(input.closest("form")!);
  expect(select).toHaveBeenCalledWith(raw);
  fireEvent.change(input,{target:{value:" "+raw}});
  fireEvent.submit(input.closest("form")!);
  expect(screen.getByRole("alert").textContent).toContain("최대 80단위");
  expect(select).toHaveBeenCalledTimes(1);
  expect(input.value).toBe(" "+raw);
});

// Stop a rate-limited overview without charging an individual retry flow.
// 대표 목록이 제한되면 개별 재시도 횟수를 쓰지 않고 목록 발송을 멈춥니다.
it("stops the sequential overview on 429 and permits a different area", async () => {
  const loader = vi.fn(async (area:string) => {
    if (area === "서울") throw new WeatherRequestError("rate", Date.now()+30000);
    return available(area);
  });
  render(<App loadWeather={loader} />);
  await waitFor(() => expect(screen.queryAllByText("불러오는 중")).toHaveLength(0));
  expect(loader).toHaveBeenCalledTimes(1);
  expect(JSON.parse(sessionStorage.getItem("weather.retry.v1")!).flows).toEqual([]);
  fireEvent.click(screen.getByRole("button", {name:"서울"}));
  expect(loader).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", {name:"부산"}));
  expect(await results().findByRole("heading", {name:"부산"})).toBeTruthy();
});
