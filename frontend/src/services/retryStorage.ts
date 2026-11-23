// Validate untrusted stored records before returning policy state.
// 신뢰하지 않는 저장 기록을 검증한 뒤 정책 상태를 반환합니다.
import { LIMITS, addRestriction, emptySnapshot, keyText, prune, safeTime, textValid, validKey, validateConfig, type Config, type Flow, type Snapshot } from "../state/retryState";
export type StoragePort = Pick<Storage, "getItem" | "setItem">;
export type RestoreResult = { snapshot: Snapshot; mode: "persistent" | "memory"; issues: string[] };
const bytes = (s: string) => new TextEncoder().encode(s).length;
const fields = (v: object, names: string[]) => Object.keys(v).sort().join() === [...names].sort().join();
export function decode(raw: string, now: number, config: Config): RestoreResult {
  validateConfig(config);
  if (!safeTime(now)) throw Error("Invalid restore time");
  const bad = (issue: string): RestoreResult => ({ snapshot: emptySnapshot(), mode: "persistent", issues: [issue] });
  if (raw.length > LIMITS.bytes || bytes(raw) > LIMITS.bytes) return bad("sizeExceeded");
  let value: any;
  try { value = JSON.parse(raw); } catch { return bad("invalidEnvelope"); }
  if (!value || typeof value !== "object" || !fields(value, ["version", "flows", "restrictions"]) || value.version !== 1 || !Array.isArray(value.flows) || !Array.isArray(value.restrictions)) return bad("invalidEnvelope");
  const issues: string[] = [], flows: Flow[] = [];
  let restrictionState = emptySnapshot();
  // Reject the overflowing flow section without discarding independent limits.
  // 초과한 흐름 영역은 거부하되 독립 제한을 버리지 않습니다.
  if (value.flows.length > LIMITS.flows) issues.push("flowCapacityExceeded");
  for (const f of value.flows.length > LIMITS.flows ? [] : value.flows) {
    const valid = f && typeof f === "object" && fields(f, ["key", "phase", "spentRetries", "nextEligibleAt", "expiresAt", "requestId", "dispatchedAt", "timeoutMs"]) &&
      validKey(f.key, config) && ["pending", "waiting", "exhausted"].includes(f.phase) && Number.isInteger(f.spentRetries) && f.spentRetries >= 0 && f.spentRetries <= 2 &&
      textValid(f.requestId, LIMITS.id) && f.requestId.length > 0 && [f.nextEligibleAt, f.expiresAt, f.dispatchedAt, f.timeoutMs].every(safeTime) && f.timeoutMs > 0 &&
      f.dispatchedAt <= now && f.dispatchedAt <= f.nextEligibleAt && f.nextEligibleAt <= f.expiresAt &&
      (f.phase === "pending" || (f.phase === "exhausted") === (f.spentRetries === 2)) &&
      (f.phase !== "pending" || (f.nextEligibleAt === f.dispatchedAt + f.timeoutMs + [5000,15000,60000][f.spentRetries] &&
        f.expiresAt === f.dispatchedAt + f.timeoutMs + (f.spentRetries === 2 ? 60000 : config.lifetimeMs)));
    if (!valid || flows.some(x => keyText(x.key) === keyText(f.key))) { issues.push("invalidFlow"); continue; }
    flows.push({ ...f, phase: f.phase === "pending" ? (f.spentRetries === 2 ? "exhausted" : "waiting") : f.phase });
  }
  for (const r of value.restrictions) {
    let validScope = r?.scope === null;
    if (typeof r?.scope === "string" && textValid(r.scope, LIMITS.key)) {
      try { const [provider, area, kind, conditions] = JSON.parse(r.scope); const k = { provider, area, kind, conditions }; validScope = validKey(k, config) && provider === r.provider && keyText(k) === r.scope; } catch { /* Invalid scope remains false. / 잘못된 범위는 거짓을 유지합니다. */ }
    }
    if (!r || typeof r !== "object" || !fields(r, ["provider", "scope", "receivedAt", "blockedUntil", "merged"]) || !config.providers.includes(r.provider) || !validScope || !safeTime(r.receivedAt) || !safeTime(r.blockedUntil) || r.blockedUntil < r.receivedAt || typeof r.merged !== "boolean") { issues.push("invalidRestriction"); continue; }
    // Reuse the policy merger: order cannot shorten a known deadline.
    // 정책 병합을 재사용해 입력 순서가 알려진 제한을 줄이지 못하게 합니다.
    restrictionState = addRestriction(restrictionState, r, now, config);
  }
  if (value.restrictions.length > LIMITS.restrictions) issues.push("restrictionCapacityCompacted");
  return { snapshot: prune({ version: 1, flows, restrictions: restrictionState.restrictions }, now), mode: "persistent", issues };
}
export function createRetryStorage(port: StoragePort | undefined, config: Config, storageKey = "weather.retry.v1") {
  validateConfig(config);
  let memory = emptySnapshot(), unavailable = !port;
  return {
    restore(now: number): RestoreResult {
      if (unavailable) return { snapshot: prune(memory, now), mode: "memory", issues: ["storageUnavailable"] };
      try {
        const raw = port!.getItem(storageKey);
        const result = raw === null ? { snapshot: emptySnapshot(), mode: "persistent" as const, issues: [] } : decode(raw, now, config);
        memory = result.snapshot;
        return result;
      } catch { unavailable = true; return { snapshot: prune(memory, now), mode: "memory", issues: ["storageUnavailable"] }; }
    },
    save(snapshot: Snapshot, now: number): RestoreResult {
      const raw = JSON.stringify(prune(snapshot, now));
      const checked = decode(raw, now, config);
      if (checked.issues.length) return { snapshot: memory, mode: unavailable ? "memory" : "persistent", issues: checked.issues };
      // Keep pending records on write; conversion to unknown happens only on restore.
      // 저장 시 진행 상태를 유지하고 복원할 때만 결과 불명으로 변환합니다.
      memory = prune(snapshot, now);
      if (!unavailable) { try { port!.setItem(storageKey, JSON.stringify(memory)); } catch { unavailable = true; } }
      return { snapshot: memory, mode: unavailable ? "memory" : "persistent", issues: unavailable ? ["storageUnavailable"] : [] };
    },
  };
}
