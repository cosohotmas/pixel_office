// Drive the hook with virtual time, without a live weather provider.
// 실제 날씨 제공자 없이 가상 시간으로 훅을 실행합니다.
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useWeatherRequest } from "../hooks/useWeatherRequest";
import { WeatherRequestError, fetchWeather } from "../services/weatherApi";
import type { WeatherResponse } from "../types/weather";
const good = (area: string): WeatherResponse => ({area,source:"mock",status:"available",condition:"rain",temperature:18,precipitation_probability:null,observed_at:"2026-01-01T00:00:00Z",message:null});
beforeEach(()=>{sessionStorage.clear();vi.useFakeTimers();});
afterEach(()=>{cleanup();sessionStorage.clear();vi.useRealTimers();vi.unstubAllGlobals();});
it("waits 5 then 15 then 60 seconds and never dispatches automatically",async()=>{
  const loader=vi.fn(async()=>{throw new WeatherRequestError("network");});
  const {result}=renderHook(()=>useWeatherRequest(loader));
  await act(async()=>{await result.current.select("서울");});
  for(const wait of [5000,15000,60000]){
    const calls=loader.mock.calls.length;
    await act(async()=>{await result.current.select("서울");});
    expect(loader).toHaveBeenCalledTimes(calls);
    await act(async()=>{await vi.advanceTimersByTimeAsync(wait);});
    expect(loader).toHaveBeenCalledTimes(calls);
    await act(async()=>{await result.current.select("서울");});
  }
  expect(loader).toHaveBeenCalledTimes(4);
});
it("restores waits without restoring a selected area or issuing a request",async()=>{
  const loader=vi.fn(async()=>{throw new WeatherRequestError("network");});
  const first=renderHook(()=>useWeatherRequest(loader));
  await act(async()=>{await first.result.current.select("서울");});first.unmount();
  const next=renderHook(()=>useWeatherRequest(loader));
  expect(next.result.current.area).toBe("");expect(loader).toHaveBeenCalledTimes(1);
  await act(async()=>{await next.result.current.select("seoul");});
  expect(loader).toHaveBeenCalledTimes(1);
  await act(async()=>{await vi.advanceTimersByTimeAsync(5000);await next.result.current.select("서울");});
  expect(loader).toHaveBeenCalledTimes(2);
});
it("suppresses duplicate pending requests and preserves unknown-result deadlines",async()=>{
  const loader=vi.fn(()=>new Promise<WeatherResponse>(()=>{}));
  const first=renderHook(()=>useWeatherRequest(loader));
  let pending:Promise<void>;
  act(()=>{pending=first.result.current.select("서울");});
  await act(async()=>{await first.result.current.select("seoul");});
  expect(loader).toHaveBeenCalledTimes(1);first.unmount();
  const next=renderHook(()=>useWeatherRequest(loader));
  await act(async()=>{await next.result.current.select("서울");});
  expect(loader).toHaveBeenCalledTimes(1);
  await act(async()=>{await vi.advanceTimersByTimeAsync(15000);});
  expect(next.result.current.remaining).toBe(0);
  expect(loader).toHaveBeenCalledTimes(1);
});
it("keeps a request-scoped rate limit after reload without blocking another area",async()=>{
  const until=Date.now()+30000;
  const loader=vi.fn(async(area:string)=>{if(area==="테스트")throw new WeatherRequestError("rate",until);return good(area);});
  const first=renderHook(()=>useWeatherRequest(loader));
  await act(async()=>{await first.result.current.select("테스트");});first.unmount();
  const next=renderHook(()=>useWeatherRequest(loader));
  await act(async()=>{await next.result.current.select("테스트");});
  expect(loader).toHaveBeenCalledTimes(1);
  await act(async()=>{await next.result.current.select("부산");});
  expect(loader).toHaveBeenCalledTimes(2);
});
it("continues in memory when session storage is inaccessible",async()=>{
  vi.spyOn(Storage.prototype,"setItem").mockImplementation(()=>{throw Error("quota");});
  const loader=vi.fn(async()=>{throw new WeatherRequestError("network");});
  const {result}=renderHook(()=>useWeatherRequest(loader));
  await act(async()=>{await result.current.select("서울");await result.current.select("서울");});
  expect(loader).toHaveBeenCalledTimes(1);expect(result.current.notice).toContain("유지되지 않을");
});
it("ends no-data and authentication failures without a failure retry",async()=>{
  const loader=async(area:string):Promise<WeatherResponse>=>{
    if(area==="인증")throw new WeatherRequestError("auth");
    return {area,source:"mock",status:"no_data",condition:null,temperature:null,precipitation_probability:null,observed_at:null,message:"none"};
  };
  const {result}=renderHook(()=>useWeatherRequest(loader));
  await act(async()=>{await result.current.select("서울");});expect(result.current.retryable).toBe(false);
  await act(async()=>{await result.current.select("인증");});expect(result.current.retryable).toBe(false);
  expect(JSON.parse(sessionStorage.getItem("weather.retry.v1")!).flows).toEqual([]);
});
it("times out a stalled request and starts the first wait from its completion",async()=>{
  let signal:AbortSignal|undefined;
  const loader=vi.fn((_area:string,s?:AbortSignal)=>{signal=s;return new Promise<WeatherResponse>(()=>{});});
  const {result}=renderHook(()=>useWeatherRequest(loader));
  act(()=>{void result.current.select("서울");});
  await act(async()=>{await vi.advanceTimersByTimeAsync(10000);});
  expect(signal?.aborted).toBe(true);
  expect(result.current.retryable).toBe(true);expect(result.current.remaining).toBe(5);
  await act(async()=>{await vi.advanceTimersByTimeAsync(5000);});
  expect(result.current.remaining).toBe(0);expect(loader).toHaveBeenCalledTimes(1);
});
it("classifies HTTP errors and accepts only valid future Retry-After values",async()=>{
  for(const [status,header,kind] of [[429,"30","rate"],[429,"bad","rate"],[401,null,"auth"],[500,null,"server"],[400,null,"input"]] as const){
    vi.stubGlobal("fetch",vi.fn(async()=>new Response("{}",{status,headers:header?{"Retry-After":header}:{}})));
    try{await fetchWeather("서울");throw Error("expected rejection");}catch(e){
      expect(e).toBeInstanceOf(WeatherRequestError);
      expect((e as WeatherRequestError).kind).toBe(kind);
      expect((e as WeatherRequestError).retryAt).toBe(header==="30"?Date.now()+30000:undefined);
    }
  }
});
