// Separate the editing budget from the name used for requests and storage.
// 편집 원문의 예산과 요청·저장 이름의 상한을 구분합니다.
export const AREA_INPUT_MAX_LENGTH = 80;
export const AREA_NAME_MAX_LENGTH = 64;

// String.length counts UTF-16 units, not bytes or visible character groups.
// String.length는 바이트나 보이는 글자 묶음이 아닌 UTF-16 단위를 셉니다.
export type AreaInputReason = "raw_too_long" | "empty" | "name_too_long" | "control";
export type AreaInputResult =
  | { ok: true; area: string }
  | { ok: false; reason: AreaInputReason };

export const AREA_INPUT_HELP =
  `앞뒤 공백은 제거합니다. 지역 이름은 최대 ${AREA_NAME_MAX_LENGTH}단위, 입력 전체는 공백 포함 최대 ${AREA_INPUT_MAX_LENGTH}단위입니다. 이모지 등 일부 문자는 여러 단위로 계산됩니다.`;

export function evaluateAreaInput(raw: string): AreaInputResult {
  // First bound the original value; never slice it into a different identity.
  // 먼저 원문 길이를 제한하며 다른 식별자가 되도록 잘라내지 않습니다.
  if (raw.length > AREA_INPUT_MAX_LENGTH) return { ok: false, reason: "raw_too_long" };
  const trimmed = raw.trim();
  // Preserve the existing alias without lowercasing every other place name.
  // 다른 지명 전체를 소문자로 바꾸지 않고 기존 별칭만 유지합니다.
  const area = trimmed.toLowerCase() === "seoul" ? "서울" : trimmed;
  if (!area) return { ok: false, reason: "empty" };
  if (area.length > AREA_NAME_MAX_LENGTH) return { ok: false, reason: "name_too_long" };
  // Retain post-trim validation instead of adopting a stricter raw-control policy.
  // 더 엄격한 원문 제어 정책 대신 trim 후 검증을 유지합니다.
  if (/[\u0000-\u001f\u007f]/.test(area)) return { ok: false, reason: "control" };
  return { ok: true, area };
}

export function areaInputMessage(reason: AreaInputReason): string {
  // Both callers explain the same rejection in the same way.
  // 두 호출자는 같은 거부 사유에 같은 안내를 사용합니다.
  const messages: Record<AreaInputReason, string> = {
    raw_too_long: `입력 전체는 공백 포함 최대 ${AREA_INPUT_MAX_LENGTH}단위입니다.`,
    empty: "지역 이름을 입력하세요.",
    name_too_long: `앞뒤 공백을 제거한 지역 이름은 최대 ${AREA_NAME_MAX_LENGTH}단위입니다.`,
    control: "지역 이름에는 제어문자를 사용할 수 없습니다.",
  };
  return messages[reason];
}
