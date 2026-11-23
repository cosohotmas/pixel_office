// Submit a complete area instead of requesting on every keystroke.
// 글자마다 요청하지 않고 완성된 지역을 제출합니다.
import { useId, useState } from "react";
import { AREA_INPUT_HELP, AREA_INPUT_MAX_LENGTH, areaInputMessage, evaluateAreaInput } from "../services/areaInput";

export function AreaSelector({ onSelect }: { onSelect: (area: string) => void }) {
  const [area, setArea] = useState("");
  const [error, setError] = useState("");
  // Associate help and errors with this field, including multiple instances.
  // 여러 입력창에서도 각 입력에 맞는 도움말·오류를 연결합니다.
  const id = useId(), helpId = `${id}-help`, errorId = `${id}-error`;
  return <form onSubmit={event => {
    event.preventDefault();
    const result = evaluateAreaInput(area);
    if (!result.ok) { setError(areaInputMessage(result.reason)); return; }
    setError("");
    // Keep the raw value so the hook can enforce the original input budget too.
    // 훅도 원래 입력 예산을 검사할 수 있도록 원문을 전달합니다.
    onSelect(area);
  }}>
    <label htmlFor={id}>지역 직접 입력</label>{" "}
    <input id={id} value={area} maxLength={AREA_INPUT_MAX_LENGTH}
      aria-describedby={error ? `${helpId} ${errorId}` : helpId} aria-invalid={!!error}
      onChange={event => { setArea(event.target.value); setError(""); }} />
    <p id={helpId}>{AREA_INPUT_HELP}</p>
    {error && <p id={errorId} role="alert">{error}</p>}
    <button type="submit" disabled={!area.trim()}>날씨 조회</button>
  </form>;
}

