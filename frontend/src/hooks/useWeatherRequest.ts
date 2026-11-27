// One coordinator shares restrictions between overview and individual requests.
// 하나의 조정자가 대표 목록·개별 요청 사이 제한을 공유합니다.
import { useCallback, useEffect, useRef, useState } from "react";
import { begin, settle, addRestriction, createClock, emptySnapshot, FLOW_LIFETIME, keyText, eligibleAt, type Snapshot, type Config, type RequestKey } from "../state/retryState";
import { createRetryStorage, type StoragePort } from "../services/retryStorage";
import { WEATHER_TIMEOUT_MS, WeatherRequestError } from "../services/weatherApi";
import { AREA_NAME_MAX_LENGTH, areaInputMessage, evaluateAreaInput } from "../services/areaInput";
import type { WeatherResponse } from "../types/weather";
import type { WeatherState } from "../state/weatherState";
// Adapters receive this page's clock so their deadlines use the coordinator's epoch.
// 어댑터 마감 시각이 조정자의 기준과 같도록 화면 시계를 전달합니다.
export type WeatherLoader = (area: string, signal?: AbortSignal, now?: () => number) => Promise<WeatherResponse>;
// Explain the failure separately from the current retry action.
// 현재 재시도 동작과 별도로 실패 이유를 설명합니다.
const errorMessages: Record<WeatherRequestError["kind"], string> = {
  network: "네트워크 문제로 날씨를 불러오지 못했습니다.",
  timeout: "날씨 응답을 기다리는 시간이 초과됐습니다.",
  server: "날씨 서비스에 문제가 발생했습니다.",
  rate: "요청이 너무 많아 날씨를 불러오지 못했습니다.",
  auth: "인증 또는 권한 문제로 날씨를 조회할 수 없습니다.",
  input: "지역 입력을 확인해 주세요.",
  invalid: "날씨 응답을 확인할 수 없습니다.",
};
const STORAGE_KEY = "weather.retry.v1";
const config = (areas: string[]): Config => ({ providers:["mock"], areas:[...new Set(["서울","부산","대전","광주","강릉","제주",...areas])], kinds:["current"], lifetimeMs:FLOW_LIFETIME });
// Callers use an already evaluated selection or a fixed representative region.
// 호출자는 이미 평가한 선택값 또는 고정 대표 지역을 사용합니다.
const keyFor = (area: string): RequestKey => ({provider:"mock",area,kind:"current",conditions:""});
// Discover bounded area identifiers only; the decoder still validates every record.
// 크기가 제한된 지역 식별자만 추출하며 각 항목의 유효성은 디코더가 검증합니다.
function areasIn(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  const data = value as Record<string, unknown>, names: unknown[] = [];
  if (Array.isArray(data.flows) && data.flows.length <= 20)
    for (const flow of data.flows) names.push(flow?.key?.area);
  if (Array.isArray(data.restrictions) && data.restrictions.length <= 98304)
    for (const row of data.restrictions) {
      try { if (typeof row?.scope === "string" && row.scope.length <= 256) names.push(JSON.parse(row.scope)[1]); } catch { /* Ignore invalid scope. / 잘못된 범위는 건너뜁니다. */ }
    }
  return names.filter((a): a is string => typeof a === "string" && a.length > 0 && a.length <= AREA_NAME_MAX_LENGTH && !/[\u0000-\u001f\u007f]/.test(a));
}
export function useWeatherRequest(loader: WeatherLoader) {
  const [state,setState]=useState<WeatherState>({status:"idle"});
  const [area,setArea]=useState(""); const [notice,setNotice]=useState("");
  const [remaining,setRemaining]=useState(0);const [retryable,setRetryable]=useState(false);
  const snapshot=useRef<Snapshot>(emptySnapshot());const port=useRef<StoragePort|undefined>(undefined);
  const selected=useRef("");const active=useRef<{controller:AbortController;id:string;key:RequestKey;timer?:ReturnType<typeof setTimeout>}|null>(null);
  const clock=useRef<()=>number>(()=>Date.now());
  const alive=useRef(true);
  // Step 1: write only validated state; retain the live snapshot if storage fails.
  // 1단계: 검증된 상태만 저장하며 저장 실패 시 실행 중 상태를 유지합니다.
  const save=()=>{
    const c=config(areasIn(snapshot.current));
    const store=createRetryStorage(port.current,c,STORAGE_KEY);
    const result=store.save(snapshot.current,Math.floor(clock.current()));
    if(result.issues.length && alive.current)setNotice("일부 재시도 기록을 저장하지 못했습니다. 현재 화면의 대기는 유지됩니다.");
    if(result.mode==="memory") {port.current=undefined;if(alive.current)setNotice("이 화면을 다시 열면 재시도 대기가 유지되지 않을 수 있습니다.");}
  };
  // Step 2: restore on mount, but do not select an area or dispatch a request.
  // 2단계: 화면 시작 시 복원하되 지역 선택이나 요청 발송은 하지 않습니다.
  useEffect(()=>{
    alive.current=true;clock.current=createClock(()=>Date.now(),()=>performance.now());
    try {
      port.current=window.sessionStorage;
      // Bound untrusted input before deriving the permitted user-entered area names.
      // 사용자가 입력한 지역 이름을 추출하기 전에 비신뢰 입력 크기를 제한합니다.
      const raw=port.current.getItem(STORAGE_KEY);let areas:string[]=[];
      if(raw && raw.length<=98304 && new TextEncoder().encode(raw).length<=98304){
        try{areas=areasIn(JSON.parse(raw));}catch{/* Decoder reports corruption. / 디코더가 손상을 보고합니다. */}
      }
      const r=createRetryStorage(port.current,config(areas),STORAGE_KEY).restore(Math.floor(clock.current()));snapshot.current=r.snapshot;
      if(r.issues.length)setNotice("이전 조회 상태 일부를 복원하지 못했습니다. 검증된 기록만 복원했습니다.");
      save();
    }catch{port.current=undefined;setNotice("이 화면을 다시 열면 재시도 대기가 유지되지 않을 수 있습니다.");}
    // A timer only refreshes text; reaching zero never calls the loader.
    // 타이머는 문구만 갱신하며 0초가 되어도 로더를 호출하지 않습니다.
    const timer=window.setInterval(()=>{
      if(selected.current)setRemaining(Math.max(0,Math.ceil((eligibleAt(snapshot.current,keyFor(selected.current))-clock.current())/1000)));
    },250);
    return ()=>{alive.current=false;window.clearInterval(timer);const a=active.current;if(a){snapshot.current=settle(snapshot.current,a.key,a.id,"cancelled",Math.floor(clock.current()),config(snapshot.current.flows.map(f=>f.key.area)));save();clearTimeout(a.timer);a.controller.abort();active.current=null;}};
  },[]);
  // Step 3: both overview and individual requests pass the same restriction gate.
  // 3단계: 대표 목록과 개별 조회는 같은 제한 검사를 통과합니다.
  const gatedLoad=useCallback(async(area:string,signal?:AbortSignal)=>{
    const key=keyFor(area), now=Math.floor(clock.current()), until=eligibleAt({...snapshot.current,flows:[]},key);
    if(until>now)throw new WeatherRequestError("rate",until);
    try{return await loader(area,signal,clock.current);}catch(e){
      if(e instanceof WeatherRequestError && e.kind==="rate" && e.retryAt){
        // An HTTP rate response establishes only this request's scope.
        // HTTP 제한 응답은 이 요청 범위만 확인하며 외부 제공자 전체로 단정하지 않습니다.
        // Receipt is recorded after response arrival, never at dispatch.
        // 수신 시각은 발송 시점이 아닌 응답 도착 후에 기록합니다.
        const receivedAt=e.receivedAt ?? Math.floor(clock.current());
        snapshot.current=addRestriction(snapshot.current,{provider:"mock",scope:keyText(key),receivedAt,blockedUntil:e.retryAt,merged:false},Math.floor(clock.current()),config([...snapshot.current.flows.map(f=>f.key.area),key.area]));save();
      }throw e;
    }
  },[loader]);
  // Step 4: explicit selection normalizes the key and rejects duplicate dispatch.
  // 4단계: 명시적 선택은 키를 정규화하고 중복 발송을 막습니다.
  const select=async(raw:string)=>{
    const result=evaluateAreaInput(raw);
    if(!result.ok){setState({status:"error",message:areaInputMessage(result.reason)});setRetryable(false);return;}
    const name=result.area,key=keyFor(name),now=Math.floor(clock.current());
    if(active.current && keyText(active.current.key)===keyText(key))return;
    const c=config([...snapshot.current.flows.map(f=>f.key.area),name]);
    if(active.current){const a=active.current;snapshot.current=settle(snapshot.current,a.key,a.id,"cancelled",now,c);clearTimeout(a.timer);a.controller.abort();active.current=null;save();}
    selected.current=name;setArea(name);
    const id=crypto.randomUUID(),b=begin(snapshot.current,key,id,now,WEATHER_TIMEOUT_MS,c);snapshot.current=b.snapshot;
    if(b.status!=="allowed"){
      setRemaining(Math.max(0,Math.ceil(((b.nextEligibleAt??now)-now)/1000)));setRetryable(b.status==="waiting");
      save();setState({status:"error",message:b.status==="capacityBlocked"?"보관 가능한 지역 수의 상한에 도달했습니다. 만료 후 다시 시도하세요.":"이전 조회의 대기 시간이 남아 있습니다. 이전 요청 결과가 확인되지 않을 수 있습니다."});return;
    }
    // Step 5: save pending state before starting HTTP, so reload cannot erase dispatch.
    // 5단계: HTTP 전에 진행 상태를 저장해 재진입이 발송 기록을 지우지 못하게 합니다.
    save();const controller=new AbortController();active.current={controller,id,key};setState({status:"loading"});setRetryable(false);setRemaining(0);
    const finish=(result:"available"|"no_data"|"failure"|"terminal")=>{snapshot.current=settle(snapshot.current,key,id,result,Math.floor(clock.current()),c);save();};
    let timer:ReturnType<typeof setTimeout>;
    try{
      const timeout=new Promise<never>((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new WeatherRequestError("timeout"));},WEATHER_TIMEOUT_MS);});
      active.current.timer=timer!;
      const weather=await Promise.race([gatedLoad(name,controller.signal),timeout]);
      if(active.current?.id!==id||!alive.current)return;
      // Step 6: only the current request may settle state or replace the result.
      // 6단계: 현재 요청만 상태를 확정하거나 결과를 바꿀 수 있습니다.
      finish(weather.status==="provider_error"?"failure":weather.status);setState({status:"result",weather});setRetryable(weather.status==="provider_error");
    }catch(e){
      if(active.current?.id!==id||!alive.current)return;
      const err=e instanceof WeatherRequestError?e:new WeatherRequestError("network");
      const retry=["network","timeout","server","rate"].includes(err.kind);finish(retry?"failure":"terminal");setRetryable(retry);
      setState({status:"error",message:errorMessages[err.kind]});
    }finally{
      clearTimeout(timer!);if(active.current?.id===id){active.current=null;setRemaining(Math.max(0,Math.ceil((eligibleAt(snapshot.current,key)-clock.current())/1000)));}
    }
  };
  return {state,area,notice,remaining,retryable,select,gatedLoad};
}
