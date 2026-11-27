# Stage 2 meeting storage verification / 2단계 회의 저장 검증

## Decision / 결정

On November 28, 2026 (KST), Curtain adopted a dedicated GitHub decision record for the Stage 2 test and approved preparing this local draft. After publication, use the verified commit permalink as the decision link in the Supabase meeting row.
2026년 11월 28일(한국 시각), 커튼 뒤는 2단계 시험용 GitHub 결정 문서안과 로컬 초안 작성을 승인했습니다. 게시 후 검증한 커밋 고정 링크를 Supabase 회의 행의 결정 링크로 사용합니다.

## Scope and evidence / 범위와 검증 근거

The approved trial uses one designated thread in a private Slack test channel and a dedicated schema in the shared Supabase project. The test confirmed that one actual Slack reply arrived with its original permalink.
승인된 시험은 비공개 Slack 시험 채널의 지정 스레드 한 개와 공유 Supabase 프로젝트의 전용 스키마를 사용합니다. 실제 Slack 답글 한 건과 원문 링크가 저장된 것을 확인했습니다.

The remote database function returned false for a repeated call with the same message and for a synthetic message targeting another thread. The stored count was one. The detailed Slack evidence is kept in the restricted meeting record.
원격 DB 저장 함수는 같은 메시지를 다시 전달했을 때와 다른 스레드를 대상으로 합성 메시지를 전달했을 때 모두 false를 반환했습니다. 저장 건수는 한 건이었습니다. Slack 상세 근거는 접근이 제한된 회의 기록에 보관합니다.

## Closure check / 종료 검증

After the approved document is published, open its commit permalink, use it to close the test meeting, then read back `closed` and the matching `decision_url` from Supabase. The closure check is pending.
승인된 문서가 게시되면 커밋 고정 링크를 열고, 그 링크로 시험 회의를 종료한 뒤 Supabase에서 `closed`와 일치하는 `decision_url`을 조회합니다. 종료 검증은 대기 중입니다.

See the [role meeting](../meetings/2026-11-28-stage2-github-decision-link.md) and [office workflow](../workflow.md#2단계--slack-회의--supabase-회의-기록).
[역할 회의록](../meetings/2026-11-28-stage2-github-decision-link.md)과 [운영 흐름](../workflow.md#2단계--slack-회의--supabase-회의-기록)을 참고하세요.
