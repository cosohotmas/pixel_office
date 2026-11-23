// Exercise corruption and storage failure with controlled adapters.
// 통제된 어댑터로 손상·저장 실패를 검증합니다.
import { describe,it,expect } from "vitest";
import { createRetryStorage,decode } from "../services/retryStorage";
import { begin,emptySnapshot,FLOW_LIFETIME,LIMITS,type Config } from "../state/retryState";
const c: Config={providers:["mock"],areas:["seoul"],kinds:["current"],lifetimeMs:FLOW_LIFETIME};
const key={provider:"mock",area:"seoul",kind:"current",conditions:""};
const pending=()=>begin(emptySnapshot(),key,"id",1000,10000,c).snapshot;
describe("retry storage",()=>{
 it("preserves exact existing keys, counts and independent restrictions at the name boundary",()=>{
  // Deliberately keep a legacy non-normalized key; restore must not trim or alias it.
  // 의도적으로 기존 비정규 키를 두며 복원은 trim·별칭 변환하지 않아야 합니다.
  const oldArea=" "+"가".repeat(62)+" ";
  const cfg={...c,areas:[oldArea]},oldKey={...key,area:oldArea};
  const state=begin(emptySnapshot(),oldKey,"old",1000,10000,cfg).snapshot;
  state.restrictions=[{provider:"mock",scope:null,receivedAt:0,blockedUntil:60000,merged:false}];
  const restored=decode(JSON.stringify(state),2000,cfg);
  expect(restored.issues).toEqual([]);
  expect(restored.snapshot.flows[0]).toMatchObject({key:oldKey,spentRetries:0,nextEligibleAt:16000});
  expect(restored.snapshot.restrictions).toEqual(state.restrictions);
  const damaged={...state,flows:[{...state.flows[0],key:{...oldKey,area:oldArea+"x"}}]};
  const checked=decode(JSON.stringify(damaged),2000,cfg);
  expect(checked.issues).toContain("invalidFlow");
  expect(checked.snapshot.flows).toEqual([]);
  expect(checked.snapshot.restrictions).toEqual(state.restrictions);
 });
 it("preserves different scopes and compacts excessive restriction records safely",()=>{
  const cfg={...c,areas:Array.from({length:21},(_,i)=>String(i))};
  const s=emptySnapshot();
  s.restrictions=Array.from({length:21},(_,i)=>({provider:"mock",scope:JSON.stringify(["mock",String(i),"current",""]),receivedAt:0,blockedUntil:10000+i,merged:false}));
  const separate=decode(JSON.stringify({...s,restrictions:s.restrictions.slice(0,2)}),1,cfg);
  expect(separate.snapshot.restrictions).toHaveLength(2);
  const compact=decode(JSON.stringify(s),1,cfg);
  expect(compact.issues).toContain("restrictionCapacityCompacted");
  expect(compact.snapshot.restrictions).toEqual([{provider:"mock",scope:null,receivedAt:0,blockedUntil:10020,merged:true}]);
  expect(begin(compact.snapshot,{...key,area:"0"},"a",10019,10000,cfg).status).toBe("waiting");
  expect(begin(compact.snapshot,{...key,area:"0"},"b",10020,10000,cfg).status).toBe("allowed");
 });
 it.each([[10000,60000],[60000,10000]])("keeps later duplicate restriction regardless of order %j",(first,last)=>{
  const s=emptySnapshot();
  s.restrictions=[first,last].map(blockedUntil=>({provider:"mock",scope:null,receivedAt:0,blockedUntil,merged:false}));
  const restored=decode(JSON.stringify(s),1000,c);
  expect(restored.snapshot.restrictions).toHaveLength(1);
  expect(begin(restored.snapshot,key,"blocked",10000,10000,c).status).toBe("waiting");
  expect(begin(restored.snapshot,key,"allowed",60000,10000,c).status).toBe("allowed");
 });
 it("preserves independent restrictions when flow count exceeds capacity",()=>{
  const s=pending();s.flows=Array.from({length:21},()=>({...s.flows[0]}));
  s.restrictions=[{provider:"mock",scope:null,receivedAt:0,blockedUntil:60000,merged:false}];
  const restored=decode(JSON.stringify(s),2000,c);
  expect(restored.issues).toContain("flowCapacityExceeded");
  expect(restored.snapshot.flows).toHaveLength(0);
  expect(restored.snapshot.restrictions).toHaveLength(1);
  expect(begin(restored.snapshot,key,"a",10000,10000,c).status).toBe("waiting");
  expect(begin(restored.snapshot,key,"b",60000,10000,c).status).toBe("allowed");
 });
 it("measures maximum final records and rejects invalid pending deadlines",()=>{
  const cfg: Config={providers:["mock"],areas:Array.from({length:20},(_,i)=>String(i)),kinds:["current"],lifetimeMs:FLOW_LIFETIME};
  let s=emptySnapshot();
  for(let i=0;i<20;i++)s=begin(s,{provider:"mock",area:String(i),kind:"current",conditions:""},"漢".repeat(64),1000,10000,cfg).snapshot;
  s.restrictions=Array.from({length:20},(_,i)=>({provider:"mock",scope:JSON.stringify(["mock",String(i),"current",""]),receivedAt:1000,blockedUntil:9_000_000,merged:false}));
  const raw=JSON.stringify(s);expect(new TextEncoder().encode(raw).length).toBeLessThan(98304);
  expect(decode(raw,1000,cfg).issues).toEqual([]);
  s.flows[0].nextEligibleAt++;expect(decode(JSON.stringify(s),1000,cfg).issues).toContain("invalidFlow");
 });
 it("restores pending without renewing deadlines or dispatching",()=>{
  const map=new Map<string,string>();const port={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}};
  createRetryStorage(port,c).save(pending(),1000);
  const restored=createRetryStorage(port,c).restore(2000);
  expect(restored.issues).toEqual([]);expect(restored.snapshot.flows[0]).toMatchObject({phase:"waiting",nextEligibleAt:16000,expiresAt:1811000});
  expect(createRetryStorage(port,c).restore(3000).snapshot).toEqual(restored.snapshot);
 });
 it("removes corrupt flows while keeping valid independent restrictions",()=>{
  const s=pending();s.flows[0].spentRetries=3;s.restrictions=[{provider:"mock",scope:null,receivedAt:0,blockedUntil:9999999,merged:false}];
  const result=decode(JSON.stringify(s),2000,c);
  expect(result.issues).toContain("invalidFlow");expect(result.snapshot.flows).toHaveLength(0);expect(result.snapshot.restrictions).toHaveLength(1);
 });
 it("rejects malformed, oversized, unknown and extra fields",()=>{
  expect(decode("{",0,c).issues).toContain("invalidEnvelope");
  expect(decode("x".repeat(LIMITS.bytes+1),0,c).issues).toContain("sizeExceeded");
  expect(decode(JSON.stringify({...emptySnapshot(),version:2}),0,c).issues).toContain("invalidEnvelope");
  expect(decode(JSON.stringify({...emptySnapshot(),extra:true}),0,c).issues).toContain("invalidEnvelope");
  const s=pending();s.flows[0].key.conditions="secret";expect(decode(JSON.stringify(s),0,c).issues).toContain("invalidFlow");
 });
 it("uses memory after quota/access failure and preserves deadlines",()=>{
  const port={getItem:()=>{throw Error("denied");},setItem:()=>{throw Error("quota");}};
  const store=createRetryStorage(port,c);expect(store.save(pending(),1000).mode).toBe("memory");
  expect(store.restore(2000).snapshot.flows[0].nextEligibleAt).toBe(16000);
  expect(createRetryStorage(port,c).restore(0).mode).toBe("memory");
 });
 it("validates final serialized envelope within 96KiB and drops expired records",()=>{
  const s=pending();const raw=JSON.stringify(s);expect(new TextEncoder().encode(raw).length).toBeLessThan(LIMITS.bytes);
  expect(decode(raw,1811000,c).snapshot.flows).toHaveLength(0);
  s.restrictions=[{provider:"mock",scope:null,receivedAt:100,blockedUntil:99,merged:false}];
  expect(decode(JSON.stringify(s),1000,c).issues).toContain("invalidRestriction");
 });
});
