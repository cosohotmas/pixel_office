// Announce state changes so screen readers can follow the request.
// 화면 읽기 도구도 요청 흐름을 알 수 있도록 상태 변경을 알립니다.
import type { WeatherState } from "../state/weatherState";

export function WeatherStatus({ state }: { state: WeatherState }) {
  let message = "지역을 선택하면 예시 날씨를 보여드립니다.";
  if (state.status === "loading") message = "날씨를 불러오는 중입니다.";
  if (state.status === "error") message = state.message;
  if (state.status === "result") {
    message = state.weather.status === "available" ? "예시 날씨를 불러왔습니다."
      : state.weather.status === "no_data" ? "이 지역의 예시 데이터가 없습니다."
      : "날씨 제공자 오류로 자료를 가져오지 못했습니다.";
  }
  return <p role="status">{message}</p>;
}

