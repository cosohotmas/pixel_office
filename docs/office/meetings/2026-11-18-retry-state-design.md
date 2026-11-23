# Retry State Design Review
# 재시도 상태 설계 재검토

Subsequent adoption: the user explicitly selected an adjustable 30-minute lifetime as a user-adopted initial assumption. This does not itself adopt corrupt-record recovery, unknown-result lifetime trigger, or first implementation scope. Subsequent decisions adopted recovery, unknown-result expiry and module/storage/test scope; see the linked specification and provider merge decision.
후속 채택: 사용자가 조정 가능한 30분 유효기간을 사용자 채택 초기 가정으로 명시했습니다. 이로써 손상 복구·결과 불명 만료 기준·첫 구현 범위까지 채택한 것은 아닙니다. 후속 결정으로 복구·결과 불명 만료·모듈/저장/테스트 범위도 채택됐으며 연결된 명세와 제공자 병합 결정 기록을 따릅니다.

Implementation proposal: [record format, bounds, and tests](../../specs/weather-retry-state-implementation.md).
구현 제안: [저장 형식·상한·검증 목록](../../specs/weather-retry-state-implementation.md).

Date: 2026-11-18, Asia/Seoul. This record preserves simulated role perspectives and subsequent user direction to proceed with the recommendation.
날짜: 2026-11-18 한국 시각. 역할별 모의 관점과 권장안으로 진행하라는 후속 사용자 지시를 기록합니다.

## Discussion
## 논의

Tech Lead — Who: scope owner. What: same-tab persistence and memory fallback. Why: storage failure should not disable weather lookup. How: clarify reload limits. Goal: achievable guarantees. Conviction: never claim persistence when storage fails.
Tech Lead — Who: 범위 책임. What: 탭 유지·메모리 대체. Why: 저장 실패가 조회 전체를 막을 필요는 없습니다. How: 재진입 한계 안내. Goal: 보장 가능한 범위. 소신: 저장 실패 중 유지 보장을 주장하지 않습니다.

Full-stack — Who: flow owner. What: distinguish spent retries from failed results. Why: reload loses outcomes, not dispatched requests. How: retain spent retries after dispatch. Goal: consistent restoration. Conviction: this supplements the prior cancellation policy.
Full-stack — Who: 흐름 책임. What: 사용 횟수·실패 결과 구분. Why: 재진입은 결과를 잃지만 발송 사실은 남습니다. How: 발송 후 횟수 유지. Goal: 일관된 복원. 소신: 기존 취소 정책의 보완입니다.

SecOps — Who: request control. What: no immediate redispatch after reload. Why: server work may continue. How: preserve deadline and provider restrictions. Goal: limit duplicate work. Conviction: browser cancellation does not prove upstream cancellation.
SecOps — Who: 요청 통제. What: 재진입 즉시 재발송 금지. Why: 서버 처리가 계속될 수 있습니다. How: 대기·제공자 제한 보존. Goal: 중복 감소. 소신: 브라우저 취소는 외부 취소 보장이 아닙니다.

Researcher — Who: semantics reviewer. What: unknown result is a client state. Why: lost result proves neither outage nor absence. How: label unknown without invented timestamps. Goal: accurate evidence. Conviction: never map unknown directly to no_data.
Researcher — Who: 의미 검토. What: 결과 불명은 클라이언트 상태. Why: 결과 유실은 장애·없음 증거가 아닙니다. How: 시각 생성 없이 불명 표시. Goal: 정확한 근거. 소신: 불명을 no_data로 바꾸지 않습니다.

Art Director — Who: presentation. What: distinguish storage limits and unknown results. Why: causes differ. How: explain consequences and next action. Goal: understandable waits. Conviction: avoid storage technology jargon in the UI.
Art Director — Who: 표시. What: 저장 한계·결과 불명 구분. Why: 원인이 다릅니다. How: 영향·다음 행동 안내. Goal: 이해 가능한 대기. 소신: 화면에 저장 기술 용어를 쓰지 않습니다.

Legal — Who: retention reviewer. What: minimal tab state. Why: restoration does not justify tracking. How: exclude credentials/raw coordinates; specify deletion. Goal: purpose-limited storage. Conviction: do not add cross-device identifiers for this scope.
Legal — Who: 보존 검토. What: 최소 탭 상태. Why: 복원이 추적 근거는 아닙니다. How: 인증·원본 좌표 제외·삭제 명세. Goal: 목적별 저장. 소신: 이번 범위에 기기 간 식별자를 추가하지 않습니다.

Trend Analyst — Who: lifecycle reviewer. What: explicitly test supported browser behavior. Why: tab duplication/restoration varies. How: document test coverage. Goal: evidence-based support. Conviction: tab scope does not settle all lifecycle cases.
Trend Analyst — Who: 생명주기 검토. What: 지원 브라우저 동작 검증. Why: 복제·복원이 다릅니다. How: 검증 범위 기록. Goal: 근거 기반 지원. 소신: 탭 범위가 모든 생명주기 해결은 아닙니다.

End User — Who: user perspective. What: explain spent requests and release time. Why: unknown outcomes can feel unfair. How: show remaining wait. Goal: predictable recovery. Conviction: never leave the user indefinitely blocked.
End User — Who: 사용자. What: 사용 시도·해제 시각 설명. Why: 결과 불명 차감은 불합리하게 느껴질 수 있습니다. How: 잔여 대기 표시. Goal: 예측 가능한 복구. 소신: 무기한 차단하지 않습니다.

## Observer conclusion
## 관찰자 결론

User accepted memory fallback, spent-retry retention after dispatch, and unknown-result eligibility based on dispatch + current 10-second client timeout + stage wait (5/15/60 seconds). Preserve longer known provider waits. Implementation details remain open. See the [design and Mermaid](../../specs/weather-retry-state-design.md).
사용자가 메모리 대체·발송 후 재시도 횟수 유지·발송 시각+현재 클라이언트 제한 10초+단계별 대기 5/15/60초의 결과 불명 복원 기준으로 진행하도록 지시했습니다. 확인된 더 긴 제공자 대기를 보존하며 구현 세부는 미결정입니다. 설계·Mermaid는 위 링크를 참고합니다.

Next: review documentation, then report a concrete implementation plan. Source: this conversation and the local weatherApi.ts timeout, not provider availability guarantees.
다음: 문서 검토 후 구체적 구현 계획 보고. 출처는 대화와 로컬 weatherApi.ts의 제한이며 제공자 가동 보장값이 아닙니다.
