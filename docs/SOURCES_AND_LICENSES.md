# 정보 출처 및 라이선스 기준

이 문서는 서비스가 사용하는 외부 정보의 출처, 이용 조건, 검증 상태를 기록한다. 라이선스가 확인되지 않은 자료는 제품에 포함하지 않는다.

## 출처 목록

| 정보 | 1차 출처 | 이용 조건 확인 | 적용 원칙 |
|---|---|---|---|
| 현재 날씨·예보·강수확률·기온·바람 | [기상청 날씨누리](https://www.weather.go.kr/w/) | 기상청 저작권 정책 확인 필요 | 출처와 발표 시각을 함께 표시 |
| 기상 관측·통계 | [기상자료개방포털](https://data.kma.go.kr/) | 데이터셋별 이용 조건 확인 | 원자료와 가공값을 구분 |
| 서울 접근성·시설 지도 | [서울 스마트맵](https://map.seoul.go.kr/smgis/webs/main/main.do?menuType=cityLife&mode=seoulMapSearch) | 테마·데이터별 제공 조건 확인 필요 | 확인된 시설 정보만 표시 |
| 공공데이터 일반 | [공공데이터포털](https://www.data.go.kr/) | 개별 데이터셋의 라이선스 우선 | 데이터셋 페이지의 조건을 기록 |
| Korean forecast API / 한국 예보 API | [KMA / 기상청](https://www.data.go.kr/data/15084084/openapi.do) | Free, attribution type 1 listed; recheck dataset terms / 무료·출처표시 제1유형 안내, 데이터셋 조건 재확인 필요 | Korea default candidate / 한국 기본 후보 |
| Global forecast API / 전세계 예보 API | [Open-Meteo](https://open-meteo.com/en/about) | Review free non-commercial service terms and CC BY 4.0 data attribution separately / 무료 비상업 서비스 조건과 CC BY 4.0 데이터 출처표시 별도 검토 | Overseas candidate / 해외 후보 |
| US weather API / 미국 날씨 API | [NOAA/NWS API](https://www.weather.gov/documentation/services-web-api) | Review open-data terms and request limits / 공개 데이터 조건·요청 제한 확인 필요 | US candidate / 미국 후보 |

## 라이선스 운영 원칙

1. 기상청 자료는 공공누리(KOGL) 표시 유형과 개별 이용 조건을 먼저 확인한다.
2. 출처는 기관명, 데이터명, 원문 URL, 조회·발표 시각으로 표시한다.
3. 공공누리 표시가 없거나 제3자 저작권이 포함된 자료는 별도 허가 없이 복제·변경·재배포하지 않는다.
4. 지도 타일, 경로 알고리즘, 장소 데이터는 지도 제공자의 이용약관과 API 조건을 별도로 확인한다.
5. 원자료를 가공한 경우 `원자료`, `가공 방법`, `가공 시각`을 기록한다.
6. 라이선스가 불명확한 사용자 제보는 참고 후보로만 저장하고 공식 사실처럼 표시하지 않는다.

## 제품 표시 형식

```text
출처: 기상청 날씨누리 / 단기예보
발표: YYYY-MM-DD HH:MM
조회: YYYY-MM-DD HH:MM
가공: 위치·시간 기준으로 표시만 변환
```

## 검증 상태

- `verified`: 공식 원문과 이용 조건을 확인함
- `needs-review`: Source identified; verify each provider's dataset and service terms before live integration.
  - `needs-review`: 출처는 찾았지만 데이터셋별 조건 확인이 남았습니다. 특히 KMA·Open-Meteo·NOAA/NWS는 실제 연동 전에 Provider별 조건을 따로 확인합니다.
- `blocked`: 라이선스 또는 출처가 확인되지 않아 사용하지 않음
