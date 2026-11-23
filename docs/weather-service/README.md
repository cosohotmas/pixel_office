# 현재 위치 기반 대화형 날씨 서비스

이 디렉터리는 현재 위치와 자연어 질문을 이용해 날씨를 안내하는 서비스의 초기 기획 문서입니다.

## 문서 순서

1. [PRD](./PRD.md) — 무엇을 만들고, 누구의 어떤 문제를 해결하는가
2. [사용자 여정 지도](./USER_JOURNEY_MAP.md) — 사용자의 행동과 접점을 어떻게 설계하는가
3. [감정 그래프](./EMOTION_GRAPH.md) — 여정 단계별 사용자의 감정 변화를 어떻게 개선하는가
4. [Why What How](./WHY_WHAT_HOW.md) — 서비스의 존재 이유와 구현 방향

## GitHub 시작 작업

```bash
git checkout -b feat/weather-service-planning
git add docs/weather-service
git commit -m "docs: add weather service product planning"
git push -u origin feat/weather-service-planning
```

이후 GitHub에서 Pull Request를 만들고, 문서 리뷰가 끝난 뒤 `main`에 병합합니다.

## MVP 범위

- 현재 위치 확인
- 기상청 데이터 기반 현재 날씨와 오늘 예보
- 자연어 입력(텍스트 우선, 음성 확장)
- 지도와 날씨 카드 표시
- 우산·외투 등 생활 안내

실제 API 키, 위치 권한, 음성 인식은 구현 단계에서 별도 결정합니다.
