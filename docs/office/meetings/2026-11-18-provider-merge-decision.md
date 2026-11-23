# Provider Merge Decision
# 제공자 병합 결정

Date: 2026-11-18, Asia/Seoul. The user explicitly finalized the proposed algorithm after review.
날짜: 2026-11-18 한국 시각. 사용자가 검토된 알고리즘을 결정안으로 확정했습니다.

What: provider-scoped merging at capacity. Why: preserve valid deadlines without blocking unrelated providers. How: expire, merge same scope, insert if possible, otherwise compact the incoming provider or another multi-entry provider. Goal: bounded storage and preserved restrictions. Observer conviction: no all-provider overflow block.
What: 포화 시 제공자 단위 병합. Why: 무관한 제공자 차단 없이 유효 제한 보존. How: 만료·동일 범위 병합·여유 시 추가·포화 시 해당 또는 다른 다중 항목 제공자 압축. Goal: 유한 저장·제한 보존. 관찰자 소신: 모든 제공자 전역 차단을 쓰지 않습니다.

Reasoning: when capacity is 20 and supported providers are at most 20, a new supported provider absent from a full set implies another provider has multiple entries. Compaction can free space. This relies on validation of supported IDs and excludes arbitrary unknown providers.
근거: 상한 20·지원 제공자 최대 20에서 기록 없는 지원 제공자가 포화 집합에 들어오면 다른 제공자에 다중 항목이 존재합니다. 압축으로 공간을 확보할 수 있습니다. 지원 ID 검증을 전제로 하며 임의 미지원 제공자는 제외합니다.

See the [adopted specification and Mermaid](../../specs/weather-retry-state-implementation.md). Source: this conversation and finite-set reasoning, not an external provider requirement. Next: final documentation review; implementation remains separately approved.
[채택 명세·Mermaid](../../specs/weather-retry-state-implementation.md)를 참고합니다. 출처는 이 대화와 유한 집합 논리이며 외부 제공자 요구가 아닙니다. 다음은 문서 최종 검토이며 구현 승인은 별도입니다.
