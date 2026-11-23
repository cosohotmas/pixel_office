// Define the smallest location contract needed by the screen.
// 화면에 필요한 최소 위치 계약만 정의합니다.
export type LocationResult =
  | { status: "granted"; area: string }
  | { status: "denied"; message: string }
  | { status: "error"; message: string };

export interface LocationProvider {
  // A real browser provider can replace this mock without changing App.
  // 실제 브라우저 제공자는 App을 바꾸지 않고 이 Mock을 교체할 수 있습니다.
  requestLocation(signal?: AbortSignal): Promise<LocationResult>;
}

export class MockLocationProvider implements LocationProvider {
  constructor(private readonly result: LocationResult = { status: "granted", area: "서울" }) {}

  // Return a stable scenario so permission states are testable without GPS.
  // GPS 없이 권한 상태를 테스트할 수 있도록 안정적인 시나리오를 반환합니다.
  async requestLocation(signal?: AbortSignal): Promise<LocationResult> {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    return this.result;
  }
}

export const mockLocationProvider = new MockLocationProvider();
