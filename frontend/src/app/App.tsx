// Connect selection, the HTTP client, and the display blocks.
// 지역 선택·HTTP 클라이언트·화면 블록을 연결합니다.
import { useEffect, useRef, useState } from "react";
import { AreaSelector } from "../components/AreaSelector";
import { WeatherCard } from "../components/WeatherCard";
import { WeatherStatus } from "../components/WeatherStatus";
import { SourceNotice } from "../components/SourceNotice";
import { fetchWeather } from "../services/weatherApi";
import { mockLocationProvider } from "../services/locationProvider";
import type { LocationProvider } from "../services/locationProvider";
import { useWeatherRequest } from "../hooks/useWeatherRequest";
import { WeatherRequestError } from "../services/weatherApi";
import type { LocationStatus, WeatherState } from "../state/weatherState";
import type { WeatherResponse } from "../types/weather";

type Loader = (area: string, signal?: AbortSignal) => Promise<WeatherResponse>;
const regions = ["서울", "부산", "대전", "광주", "강릉", "제주"];

export function App({ loadWeather = fetchWeather, locationStatus: initialLocationStatus = "not_requested", locationProvider = mockLocationProvider }: {
  loadWeather?: Loader; locationStatus?: LocationStatus; locationProvider?: LocationProvider;
}) {
  const retry = useWeatherRequest(loadWeather);
  const { state, gatedLoad } = retry;
  const [locationStatus, setLocationStatus] = useState<LocationStatus>(initialLocationStatus);
  const [locationMessage, setLocationMessage] = useState("");
  const [overview, setOverview] = useState<WeatherState[]>(regions.map(() => ({ status: "loading" })));
  const [overviewAttempt, setOverviewAttempt] = useState(0);
  const locationRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    // Load representative regions through the same API used for manual lookup.
    // 수동 조회와 같은 API로 대표 지역을 불러옵니다.
    const controller = new AbortController();
    setOverview(regions.map(() => ({ status: "loading" })));
    void (async () => {
      for (const [index, area] of regions.entries()) {
        if (controller.signal.aborted) return;
        try {
          const weather = await gatedLoad(area, controller.signal);
          if (!controller.signal.aborted) setOverview(previous =>
            previous.map((item, position) => position === index ? { status: "result", weather } : item));
        } catch (error) {
          if (controller.signal.aborted) return;
          const limited = error instanceof WeatherRequestError && error.kind === "rate";
          setOverview(previous => previous.map((item, position) =>
            position === index || (limited && position > index) ? { status: "error", message: "예시를 불러오지 못했습니다." } : item));
          if (limited) return;
        }
      }
    })();
    return () => controller.abort();
  }, [gatedLoad, overviewAttempt]);

  useEffect(() => () => {
    locationRequest.current?.abort();
  }, []);

  async function requestLocation() {
    // Ask once, then keep the result visible so a denied request does not repeat.
    // 한 번 요청한 뒤 결과를 표시하여 거부 시 권한 요청을 반복하지 않습니다.
    locationRequest.current?.abort();
    const controller = new AbortController();
    locationRequest.current = controller;
    setLocationStatus("requesting");
    setLocationMessage("");
    try {
      const result = await locationProvider.requestLocation(controller.signal);
      if (controller.signal.aborted) return;
      if (result.status === "granted") {
        setLocationStatus("granted");
        locationRequest.current = null;
        await selectArea(result.area);
      } else {
        setLocationStatus(result.status);
        setLocationMessage(result.message);
      }
    } catch (error) {
      if (controller.signal.aborted || (error instanceof DOMException && error.name === "AbortError")) return;
      setLocationStatus("error");
      setLocationMessage("위치를 확인하지 못했습니다. 지역을 직접 선택하세요.");
    } finally {
      if (locationRequest.current === controller) locationRequest.current = null;
    }
  }

  async function selectArea(area: string) {
    // Cancel the older request and clear its card before loading new data.
    // 새 데이터를 불러오기 전에 이전 요청을 취소하고 이전 카드를 지웁니다.
    locationRequest.current?.abort();
    locationRequest.current = null;
    await retry.select(area);
  }

  return <main style={{ maxWidth: 880, margin: "auto", padding: 24, fontFamily: "system-ui", lineHeight: 1.7 }}>
    <h1>날씨 예시 보기</h1>
    <p>Mock 데모 · 모든 값은 개발용 예시이며 실제 현재 날씨가 아닙니다.</p>
    <section aria-label="위치 권한 상태">
      <h2>현재 위치</h2>
      {locationStatus === "not_requested" && <>
        <p>위치를 사용하면 대표 지역 날씨를 자동으로 선택합니다. 위치는 Mock 흐름에서만 사용합니다.</p>
        <button onClick={() => void requestLocation()}>위치 사용 허용</button>
      </>}
      {locationStatus === "requesting" && <p role="status">위치를 확인하는 중입니다.</p>}
      {locationStatus === "granted" && <p role="status">위치 사용이 허용되었습니다. 선택한 지역의 예시를 표시합니다.</p>}
      {(locationStatus === "denied" || locationStatus === "error") && <p role="status">
        {locationMessage || (locationStatus === "denied" ? "위치 권한이 거부되었습니다." : "위치를 확인하지 못했습니다.")}
        대표 지역을 보거나 지역을 직접 선택할 수 있습니다.
      </p>}
    </section>
    <section aria-label="전국 대표 지역 예시">
      <h2>전국 대표 지역 예시</h2>
      <p>6개 지역의 예시 목록입니다. 전국 전체 관측자료가 아닙니다.</p>
      <ul>{regions.map((area, index) => {
        const item = overview[index];
        // Keep each example's source and time beside its value, including missing temperatures.
        // 기온이 없는 경우에도 각 예시 값 옆에 출처와 시각을 함께 표시합니다.
        return <li key={area}><button onClick={() => void selectArea(area)}>{area}</button>{" "}
          {item.status === "loading" ? "불러오는 중" :
            item.status === "result" && item.weather.status === "available"
              ? <>{item.weather.temperature === null ? "기온 정보 없음" : `${item.weather.temperature}°C`}
                  <SourceNotice weather={item.weather} /></> : "데이터를 불러올 수 없습니다."}</li>;
      })}</ul>
      <button onClick={() => setOverviewAttempt(value => value + 1)}>대표 지역 다시 불러오기</button>
    </section>
    <AreaSelector onSelect={area => void selectArea(area)} />
    <section aria-label="선택 지역 결과" aria-busy={state.status === "loading"}>
      <WeatherStatus state={state} />
      {state.status === "result" && state.weather.status === "available" && <>
        <WeatherCard weather={state.weather} /><SourceNotice weather={state.weather} />
      </>}
      {retry.notice && <p role="note">{retry.notice}</p>}
      {/* Keep the countdown outside the live region so only readiness is announced.
          가능 상태만 알리도록 초읽기는 실시간 알림 영역 밖에 둡니다. */}
      {retry.retryable && retry.remaining > 0 && (
        <p>{retry.area} 날씨 다시 시도까지 {retry.remaining}초</p>
      )}
      <p aria-live="polite">{retry.retryable && retry.remaining === 0
        ? `${retry.area} 날씨를 다시 조회할 수 있습니다.`
        : null}</p>
      {retry.retryable && (
        <button disabled={retry.remaining > 0} onClick={() => void selectArea(retry.area)}>
          같은 지역으로 다시 조회
        </button>
      )}
    </section>
  </main>;
}

