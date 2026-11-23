// Check policy behavior at boundaries, not elapsed real waiting.
// 실제 대기 대신 경계 시각에서 정책 동작을 확인합니다.
import { describe, it, expect } from "vitest";
import { addRestriction, begin, createClock, emptySnapshot, FLOW_LIFETIME, keyText, prune, settle, validateConfig, type Config, type RequestKey } from "../state/retryState";
const config: Config = { providers: ["mock", "other"], areas: Array.from({length: 21}, (_,i)=>String(i)), kinds: ["current"], lifetimeMs: FLOW_LIFETIME };
const key = (area="0", provider="mock"): RequestKey => ({provider,area,kind:"current",conditions:""});
describe("retry state",()=>{
 it.each([63,64,65])("keeps the stored area boundary at %s units",length=>{
  const area="가".repeat(length),cfg={...config,areas:[area]};
  if(length<=64){
   expect(()=>validateConfig(cfg)).not.toThrow();
   expect(begin(emptySnapshot(),key(area),"id",0,10000,cfg).status).toBe("allowed");
  }else expect(()=>validateConfig(cfg)).toThrow();
 });
 it("allows two explicit retries at 5/15 seconds and restarts after 60 seconds",()=>{
  let s=begin(emptySnapshot(),key(),"a",0,10000,config).snapshot;
  s=settle(s,key(),"a","failure",1000,config);
  expect(begin(s,key(),"b",5999,10000,config).status).toBe("waiting");
  s=begin(s,key(),"b",6000,10000,config).snapshot;
  expect(s.flows[0].spentRetries).toBe(1);
  s=settle(s,key(),"b","failure",7000,config);
  expect(begin(s,key(),"c",21999,10000,config).status).toBe("waiting");
  s=begin(s,key(),"c",22000,10000,config).snapshot;
  s=settle(s,key(),"c","failure",23000,config);
  expect(begin(s,key(),"d",82999,10000,config).status).toBe("waiting");
  expect(begin(s,key(),"d",83000,10000,config).snapshot.flows[0].spentRetries).toBe(0);
 });
 it("preserves spent retries on cancellation, ignores late results and ends no_data",()=>{
  let s=begin(emptySnapshot(),key(),"a",0,10000,config).snapshot;
  expect(settle(s,key(),"old","available",1,config)).toBe(s);
  s=settle(s,key(),"a","cancelled",1,config);
  s=begin(s,key(),"b",15000,10000,config).snapshot;
  s=settle(s,key(),"b","cancelled",15001,config);
  expect(s.flows[0].spentRetries).toBe(1);
  s=begin(s,key(),"c",40000,10000,config).snapshot;
  expect(settle(s,key(),"c","no_data",40001,config).flows).toHaveLength(0);
 });
 it("honors capacity, configurable expiry and independent restrictions",()=>{
  let s=emptySnapshot();
  for(let i=0;i<20;i++)s=begin(s,key(String(i)),String(i),0,10000,config).snapshot;
  expect(begin(s,key("20"),"new",0,10000,config).status).toBe("capacityBlocked");
  expect(begin(s,key(),"existing",15000,10000,config).status).toBe("allowed");
  s=addRestriction(s,{provider:"mock",scope:null,receivedAt:0,blockedUntil:9_000_000,merged:false},0,config);
  expect(prune(s,2_000_000).restrictions).toHaveLength(1);
  expect(begin(prune(s,2_000_000),key(),"x",2_000_000,10000,config).status).toBe("waiting");
  const short={...config,lifetimeMs:60000};
  const t=settle(begin(emptySnapshot(),key(),"a",0,10000,short).snapshot,key(),"a","failure",1000,short);
  expect(prune(t,60999).flows).toHaveLength(1);expect(prune(t,61000).flows).toHaveLength(0);
 });
 it("compacts a provider without blocking another and keeps maximum deadline",()=>{
  let s=emptySnapshot();
  for(let i=0;i<20;i++)s=addRestriction(s,{provider:"mock",scope:keyText(key(String(i))),receivedAt:0,blockedUntil:100+i,merged:false},0,config);
  s=addRestriction(s,{provider:"other",scope:keyText(key("0","other")),receivedAt:0,blockedUntil:200,merged:false},0,config);
  expect(s.restrictions).toHaveLength(2);
  expect(s.restrictions.find(r=>r.provider==="mock")).toMatchObject({scope:null,blockedUntil:119,merged:true});
  expect(begin(s,key("1","other"),"a",0,10000,config).status).toBe("allowed");
  s=addRestriction(s,{provider:"mock",scope:keyText(key()),receivedAt:1,blockedUntil:500,merged:false},1,config);
  expect(s.restrictions.find(r=>r.provider==="mock")?.blockedUntil).toBe(500);
 });
 it("rejects invalid configuration and uses monotonic time despite wall changes",()=>{
  expect(()=>validateConfig({...config,providers:["mock","mock"]})).toThrow();
  expect(()=>validateConfig({...config,providers:Array.from({length:21},(_,i)=>String(i))})).toThrow();
  let wall=1000, mono=10;const clock=createClock(()=>wall,()=>mono);wall=999999;mono=15;expect(clock()).toBe(1005);
 });
});
