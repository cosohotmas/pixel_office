// Calculate policy transitions without network or browser storage.
// 네트워크·브라우저 저장 없이 정책 전이를 계산합니다.
import { AREA_NAME_MAX_LENGTH } from "../services/areaInput";
export const LIMITS = { flows: 20, restrictions: 20, bytes: 98304, key: 256, id: 64 } as const;
export const FLOW_LIFETIME = 30 * 60_000;
export type RequestKey = { provider: string; area: string; kind: string; conditions: string };
export type Flow = {
  key: RequestKey; phase: "pending" | "waiting" | "exhausted";
  spentRetries: number; nextEligibleAt: number; expiresAt: number;
  requestId: string; dispatchedAt: number; timeoutMs: number;
};
export type Restriction = { provider: string; scope: string | null; receivedAt: number; blockedUntil: number; merged: boolean };
export type Snapshot = { version: 1; flows: Flow[]; restrictions: Restriction[] };
export type Config = { providers: string[]; areas: string[]; kinds: string[]; lifetimeMs: number };
export const emptySnapshot = (): Snapshot => ({ version: 1, flows: [], restrictions: [] });
export const keyText = (key: RequestKey): string => JSON.stringify([key.provider, key.area, key.kind, key.conditions]);
export const safeTime = (n: unknown): n is number => typeof n === "number" && Number.isSafeInteger(n) && n >= 0;
export function textValid(s: unknown, max: number): s is string {
  return typeof s === "string" && s.length <= max && !/[\u0000-\u001f\u007f]/.test(s);
}
export function validateConfig(c: Config): void {
  // Only area identifiers use the area policy; unrelated identifiers keep their cap.
  // 지역 식별자만 지역 정책을 사용하며 무관한 식별자는 기존 상한을 유지합니다.
  for (const [values, max] of [[c.providers, 64], [c.areas, AREA_NAME_MAX_LENGTH], [c.kinds, 64]] as const) {
    if (!values.length || new Set(values).size !== values.length || values.some(v => !textValid(v, max) || !v)) throw Error("Invalid allowlist");
  }
  if (c.providers.length > LIMITS.restrictions || !safeTime(c.lifetimeMs) || c.lifetimeMs < 60000) throw Error("Invalid configuration");
}
export function validKey(k: RequestKey, c: Config): boolean {
  return !!k && Object.keys(k).sort().join() === "area,conditions,kind,provider" &&
    c.providers.includes(k.provider) && c.areas.includes(k.area) && c.kinds.includes(k.kind) &&
    k.conditions === "" && textValid(keyText(k), LIMITS.key);
}
export function prune(s: Snapshot, now: number): Snapshot {
  return { version: 1, flows: s.flows.filter(f => f.expiresAt > now), restrictions: s.restrictions.filter(r => r.blockedUntil > now) };
}
export function eligibleAt(s: Snapshot, key: RequestKey): number {
  return Math.max(0, ...s.flows.filter(f => keyText(f.key) === keyText(key)).map(f => f.nextEligibleAt),
    ...s.restrictions.filter(r => r.provider === key.provider && (r.scope === null || r.scope === keyText(key))).map(r => r.blockedUntil));
}
export type BeginResult = { status: "allowed" | "waiting" | "capacityBlocked"; snapshot: Snapshot; nextEligibleAt: number | null };
export function begin(s: Snapshot, key: RequestKey, requestId: string, now: number, timeoutMs: number, c: Config): BeginResult {
  validateConfig(c);
  if (!validKey(key, c) || !textValid(requestId, LIMITS.id) || !requestId || !safeTime(now) || !safeTime(timeoutMs) || !timeoutMs) throw Error("Invalid dispatch");
  const next = prune(s, now), prior = next.flows.find(f => keyText(f.key) === keyText(key));
  const deadline = eligibleAt(next, key);
  if (deadline > now) return { status: "waiting", snapshot: next, nextEligibleAt: deadline };
  if (!prior && next.flows.length >= LIMITS.flows) return { status: "capacityBlocked", snapshot: next, nextEligibleAt: Math.min(...next.flows.map(f => f.expiresAt)) };
  const spentRetries = prior ? prior.spentRetries + 1 : 0;
  if (spentRetries > 2) return { status: "waiting", snapshot: next, nextEligibleAt: prior!.expiresAt };
  // Persist the conservative unknown-result deadline before the caller dispatches.
  // 호출자가 발송하기 전에 결과 불명용 보수적 허용 시각을 기록합니다.
  const end = now + timeoutMs, wait = [5000, 15000, 60000][spentRetries];
  const expiresAt = end + (spentRetries === 2 ? 60000 : c.lifetimeMs);
  if (![end + wait, expiresAt].every(safeTime)) throw Error("Time overflow");
  const flow: Flow = { key: { ...key }, requestId, spentRetries, phase: "pending", dispatchedAt: now, timeoutMs, nextEligibleAt: end + wait, expiresAt };
  return { status: "allowed", snapshot: { ...next, flows: [...next.flows.filter(f => keyText(f.key) !== keyText(key)), flow] }, nextEligibleAt: null };
}
export function settle(s: Snapshot, key: RequestKey, requestId: string, result: "available" | "no_data" | "failure" | "cancelled" | "terminal", now: number, c: Config): Snapshot {
  const flow = s.flows.find(f => keyText(f.key) === keyText(key));
  if (!flow || flow.requestId !== requestId || flow.phase !== "pending") return s;
  if (!safeTime(now) || now < flow.dispatchedAt) throw Error("Invalid result time");
  if (["available", "no_data", "terminal"].includes(result)) return { ...s, flows: s.flows.filter(f => f !== flow) };
  if (result === "cancelled") return { ...s, flows: s.flows.map(f => f === flow ? { ...f, phase: f.spentRetries === 2 ? "exhausted" : "waiting" } : f) };
  const nextEligibleAt = now + [5000, 15000, 60000][flow.spentRetries];
  const expiresAt = now + (flow.spentRetries === 2 ? 60000 : c.lifetimeMs);
  if (![nextEligibleAt, expiresAt].every(safeTime)) throw Error("Time overflow");
  return { ...s, flows: s.flows.map(f => f === flow ? { ...f, phase: f.spentRetries === 2 ? "exhausted" : "waiting", nextEligibleAt, expiresAt } : f) };
}
export function addRestriction(s: Snapshot, incoming: Restriction, now: number, c: Config): Snapshot {
  validateConfig(c);
  if (!c.providers.includes(incoming.provider) || !safeTime(incoming.receivedAt) || !safeTime(incoming.blockedUntil) || incoming.blockedUntil < incoming.receivedAt) throw Error("Invalid restriction");
  if (incoming.scope !== null) {
    let key: RequestKey;
    try { const [provider, area, kind, conditions] = JSON.parse(incoming.scope); key = { provider, area, kind, conditions }; } catch { throw Error("Invalid scope"); }
    if (!validKey(key, c) || key.provider !== incoming.provider || keyText(key) !== incoming.scope) throw Error("Invalid scope");
  }
  let rows = prune(s, now).restrictions;
  if (incoming.blockedUntil <= now) return { ...s, restrictions: rows };
  const same = rows.find(r => r.provider === incoming.provider && (r.scope === null || r.scope === incoming.scope));
  if (same) rows = rows.map(r => r === same ? { ...r, blockedUntil: Math.max(r.blockedUntil, incoming.blockedUntil), receivedAt: Math.min(r.receivedAt, incoming.receivedAt), merged: r.merged || incoming.merged } : r);
  else rows = [...rows, incoming];
  // A provider-wide record dominates narrower records; overflow never crosses providers.
  // 제공자 전체 항목은 세부 항목을 포함하며 포화 병합은 제공자 경계를 넘지 않습니다.
  const compact = (provider: string) => {
    const group = rows.filter(r => r.provider === provider);
    rows = [...rows.filter(r => r.provider !== provider), { provider, scope: null, receivedAt: Math.min(...group.map(r => r.receivedAt)), blockedUntil: Math.max(...group.map(r => r.blockedUntil)), merged: group.some(r => r.merged) || group.some(r => r.scope !== null) }];
  };
  if (rows.some(r => r.provider === incoming.provider && r.scope === null)) compact(incoming.provider);
  if (rows.length > LIMITS.restrictions) {
    const provider = rows.filter(r => r.provider === incoming.provider).length > 1 ? incoming.provider : [...c.providers].sort().find(p => rows.filter(r => r.provider === p).length > 1);
    if (!provider) throw Error("Restriction capacity invariant");
    compact(provider);
  }
  return { ...s, restrictions: rows };
}
// Use monotonic elapsed time while this page lives; wall time is only the anchor.
// 화면 생존 중에는 단조 경과 시간을 쓰며 벽시계는 최초 기준으로만 사용합니다.
export function createClock(wall: () => number, monotonic: () => number): () => number {
  const anchor = wall(), start = monotonic();
  return () => anchor + Math.max(0, monotonic() - start);
}
