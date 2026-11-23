// Reproduce reviewed failures through the real HTTP adapter and coordinator.
// 실제 HTTP 어댑터·조정자를 통해 검토에서 발견한 실패를 재현합니다.
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { fetchWeather } from "../services/weatherApi";
import { useWeatherRequest } from "../hooks/useWeatherRequest";

beforeEach(() => { sessionStorage.clear(); vi.useFakeTimers(); vi.setSystemTime(new Date("2026-11-18T00:00:00Z")); });
afterEach(() => { cleanup(); sessionStorage.clear(); vi.useRealTimers(); vi.unstubAllGlobals(); });

it.each([
  [3600000, "seconds"], [-3600000, "seconds"],
  [3600000, "http-date"], [-3600000, "http-date"],
] as const)("preserves a 30-second rate wait after jump %s with %s", async (jump, format) => {
  const start = Date.now();
  const header = format === "seconds" ? "30" : new Date(start+30000).toUTCString();
  const request = vi.fn(async () => new Response("{}", {status:429, headers:{"Retry-After":header}}));
  vi.stubGlobal("fetch", request);
  const {result} = renderHook(() => useWeatherRequest(fetchWeather));
  vi.setSystemTime(start + jump);
  await act(async () => { await result.current.select("서울"); });
  expect(result.current.remaining).toBe(30);
  const row = JSON.parse(sessionStorage.getItem("weather.retry.v1")!).restrictions[0];
  expect(row.receivedAt).toBe(start);
  expect(row.blockedUntil).toBe(start + 30000);
  await act(async () => { await vi.advanceTimersByTimeAsync(29999); await result.current.select("서울"); });
  expect(request).toHaveBeenCalledTimes(1);
  await act(async () => { await vi.advanceTimersByTimeAsync(1); });
  expect(result.current.remaining).toBe(0);
  expect(request).toHaveBeenCalledTimes(1);
});

it.each(["seconds", "http-date"])("starts %s Retry-After at header receipt in the page clock", async format => {
  const start = Date.now();
  let respond!: (response:Response) => void;
  vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(resolve => { respond = resolve; })));
  const {result} = renderHook(() => useWeatherRequest(fetchWeather));
  let pending!:Promise<void>;
  act(() => { pending = result.current.select("서울"); });
  await act(async () => { await vi.advanceTimersByTimeAsync(4000); });
  vi.setSystemTime(start + 3604000);
  await act(async () => {
    respond(new Response("{}", {status:429,headers:{"Retry-After":format==="seconds" ? "30" : new Date(start+34000).toUTCString()}}));
    await pending;
  });
  expect(result.current.remaining).toBe(30);
  const row=JSON.parse(sessionStorage.getItem("weather.retry.v1")!).restrictions[0];
  expect(row.receivedAt).toBe(start+4000);
  expect(row.blockedUntil).toBe(start+34000);
});

// A failed stream is a transport error even after headers have arrived.
// 헤더를 수신한 뒤에도 스트림 실패는 통신 오류입니다.
it("retains retry after interrupted body transport and permits a manual recovery", async () => {
  let first=true;
  const request=vi.fn(async()=>{
    if(first){first=false;return new Response(new ReadableStream({start(controller){controller.error(new TypeError("terminated"));}}));}
    return new Response(JSON.stringify({area:"서울",source:"mock",status:"no_data",condition:null,temperature:null,precipitation_probability:null,observed_at:null,message:"none"}));
  });
  vi.stubGlobal("fetch",request);
  const {result}=renderHook(()=>useWeatherRequest(fetchWeather));
  await act(async()=>{await result.current.select("서울");});
  expect(result.current.retryable).toBe(true);
  expect(result.current.remaining).toBe(5);
  await act(async()=>{await vi.advanceTimersByTimeAsync(5000);});
  expect(request).toHaveBeenCalledTimes(1);
  await act(async()=>{await result.current.select("서울");});
  expect(request).toHaveBeenCalledTimes(2);
  expect(result.current.state.status).toBe("result");
  expect(result.current.retryable).toBe(false);
});

it("classifies a body-read timeout separately from invalid JSON", async () => {
  const timeout = new AbortController();
  vi.spyOn(AbortSignal,"timeout").mockReturnValue(timeout.signal);
  vi.stubGlobal("fetch",vi.fn(async()=>({
    ok:true,status:200,
    text:()=>new Promise<string>((_,reject)=>timeout.signal.addEventListener("abort",()=>reject(timeout.signal.reason))),
    json:()=>new Promise<never>((_,reject)=>timeout.signal.addEventListener("abort",()=>reject(timeout.signal.reason))),
  })));
  const request=fetchWeather("서울");
  const outcome=expect(request).rejects.toMatchObject({kind:"timeout"});
  await Promise.resolve();
  timeout.abort(new DOMException("Timed out","TimeoutError"));
  await outcome;
});

it("preserves explicit cancellation while reading the body", async()=>{
  const external=new AbortController(), reason=new DOMException("Cancelled","AbortError");
  vi.stubGlobal("fetch",vi.fn(async()=>({
    ok:true,status:200,
    text:async()=>{external.abort(reason);throw reason;},
    json:async()=>{external.abort(reason);throw reason;},
  })));
  await expect(fetchWeather("서울",external.signal)).rejects.toBe(reason);
});

it.each(["{","{}"])("keeps malformed JSON/schema terminal: %s",async body=>{
  vi.stubGlobal("fetch",vi.fn(async()=>new Response(body)));
  const {result}=renderHook(()=>useWeatherRequest(fetchWeather));
  await act(async()=>{await result.current.select("서울");});
  expect(result.current.retryable).toBe(false);
  expect(JSON.parse(sessionStorage.getItem("weather.retry.v1")!).flows).toEqual([]);
  await expect(fetchWeather("서울")).rejects.toMatchObject({kind:"invalid"});
});
