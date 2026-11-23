# Mermaid diagram priorities — third review
# Mermaid 다이어그램 우선순위 — 3차 검토

2026-11-21 KST · Rollout stage 1 remains partially verified.
2026-11-21 KST · 도입 1단계 부분 검증 상태 유지.

## Agenda / 의제

Review the proposed ordering 6→5→2→1→4, defer item 3 until stage 3, resolve the legend mismatch and clarify the canonical repository path before deciding whether to modify documents.
6→5→2→1→4 순서와 3단계 전까지 3번 보류 제안, 범례 불일치, 문서 수정 전 정본 경로를 검토합니다.

## Facts and constraints / 사실·제약

- Fact: the active Git checkout is the recovered repository on branch `codex/actions-comment-review-slack-test`, with remote `cosohotmas/weather-conversation-app`.
  사실: 현재 Git 작업 저장소는 복구된 저장소이며 브랜치는 `codex/actions-comment-review-slack-test`, 원격은 `cosohotmas/weather-conversation-app`입니다.
- Fact: the user-facing project folder is a separate workspace mirror, not the Git repository root. Documentation changes in the recovered checkout were mirrored there for visibility.
  사실: 사용자 화면의 프로젝트 폴더는 Git 저장소 루트가 아닌 별도 작업공간 사본입니다. 복구 checkout의 문서 변경을 해당 사본에 동기화해 보이게 했습니다.
- Fact: stage 1 has observed GitHub→Slack issue/PR notification evidence, but end-to-end Actions→Gemini→COMMENT review testing remains unimplemented/unverified.
  사실: 1단계에는 GitHub→Slack Issue/PR 알림 관찰 근거가 있으나 Actions→Gemini→COMMENT 리뷰 종단 시험은 미구현/미검증입니다.
- Fact: stage 2 Slack→Supabase has not started; stage 3 Supabase→dashboard has not been implemented or verified.
  사실: 2단계 Slack→Supabase는 미착수이며 3단계 Supabase→현황판은 미구현/미검증입니다.
- Fact: GitHub natively renders Mermaid in Markdown. A local Mermaid CLI could render blocks, but `mmdc` or a configured Mermaid dependency was not found in this repository inspection. Do not install a new dependency without a separate implementation plan.
  사실: GitHub Markdown은 Mermaid를 기본 렌더링합니다. Mermaid CLI로 로컬 렌더가 가능하지만 저장소에서 `mmdc` 또는 설정된 Mermaid 의존성을 찾지 못했습니다. 별도 구현 계획 없이 새 의존성을 설치하지 않습니다.
- Constraint: user recommendations are proposals. Only explicit user adoption makes them project policy; this meeting does not edit source diagrams.
  제약: 사용자 권고는 제안입니다. 명시적 채택 후에만 프로젝트 정책이 됩니다. 이번 회의는 기존 그림 소스를 수정하지 않습니다.

## Role discussion / 역할별 회의

These are assistant-authored role perspectives, not independent-agent outputs. All required fields are explicit.
독립 에이전트 결과가 아닌 어시스턴트의 역할별 관점이며 필수 항목을 모두 명시합니다.

| Who / 역할 | What / 제안 | Why / 이유 | How / 방법 | Goal / 목표 | Conviction / 소신 |
|---|---|---|---|---|---|
| Tech Lead / 기술 리드 | Adopt the proposed sequencing with a corrected edge legend; do not change diagrams until Curtain adopts. / 범례를 바로잡아 제안 순서를 권고하되 채택 전 그림 수정 금지 | Evidence makes some links verified and others still planned. / 연결별 검증 상태가 다름 | Separate authoring, renderer inspection, diagram correction and deferred policy decision. / 작성·렌더러 확인·그림 보완·후속 정책 결정을 분리 | Clear staged documentation without premature integration claims. / 성급한 연동 주장 없는 단계별 문서 | The test sequence is first because it is actionable and unblocks later review. / 즉시 작성 가능하고 후속 검토 기준이 되는 시험 시퀀스 우선 |
| Full-stack / 풀스택 | Accept item 6 first as a proposed sequence, with quota and bot-retrigger failure/stop branches. / 한도·봇 재트리거 실패/중단 분기를 둔 6번을 제안 초안으로 우선 | Existing test steps are known but not end-to-end verified. / 시험 순서는 제안됐지만 종단 검증은 안 됨 | Mark each event and branch proposed/unverified; do not invent retry counts or assert runtime behavior. / 이벤트·분기를 제안/미검증으로 표시하고 재시도 수치·실행 결과를 만들지 않음 | A testable, honest sequence. / 시험 가능하고 정직한 시퀀스 | Drafting a sequence is safe before choosing schema/state policies. / 스키마·상태 정책 결정 전에 초안 작성 가능 |
| SecOps / 보안 | Preserve least-privilege review before any write scope or model secret; distinguish notification integration evidence from AI workflow permissions. / 쓰기 권한·모델 secret 설정 전 최소권한 검토, 알림 근거와 AI 워크플로 권한 구분 | Existing GitHub→Slack delivery does not prove the separate Actions/Gemini write path. / GitHub→Slack 전달 근거가 별도 Actions/Gemini 권한을 증명하지 않음 | Show only actual observed permission evidence; use planned style for unverified paths. / 실제 관찰 권한만 표시하고 미검증 경로는 계획선 | Avoid overclaiming authority. / 권한 과장 방지 | A verified notification link must not imply a verified review submission link. / 검증된 알림을 리뷰 제출 검증으로 오해시키지 않음 |
| Art Director / 아트 디렉터 | Define solid as verified active relation and dashed as planned/unverified, with a legend inside the diagram. / 실선=검증된 활성 관계, 점선=계획·미검증으로 그림 내부 범례 정의 | “Documented” and “verified active” are not equivalent, and a legend must match line styling. / 문서화와 활성 검증은 다르고 범례는 실제 선과 일치해야 함 | Apply dashed styling to Slack→Supabase and Supabase→dashboard until those integrations are observed; use a distinct unresolved marker/text for GitHub→Supabase. / 관찰 전 Slack→Supabase·Supabase→현황판 점선, GitHub→Supabase는 별도 미결정 표기 | Diagram status can be read without prose. / 문단 없이 상태 해석 가능 | Do not use solid arrows just because a flow is written in a document. / 문서에 적혔다는 이유만으로 실선을 쓰지 않음 |
| Researcher / 연구 | Separate GitHub-native rendering from local CLI rendering evidence. / GitHub 기본 렌더와 로컬 CLI 렌더 근거 분리 | No renderer command/configuration is presently recorded in the repository. / 저장소에 현재 렌더 도구 설정이 없음 | First use GitHub Markdown rendering by updating/previewing the relevant page after approval; optionally evaluate pinned `mmdc` only if a local reproducible export is needed. / 승인 후 GitHub Markdown 미리보기로 우선 확인, 재현 가능한 로컬 출력이 필요할 때만 버전 고정 `mmdc` 검토 | Minimal reproducible validation. / 최소한의 재현 가능한 검증 | Do not install CLI as a “one time” fix until need and version are agreed. / 필요·버전 합의 전 일회성 설치 금지 |
| Trend Analyst / 동향 분석 | Defer GitHub→Supabase inclusion until stage 3 scope asks whether PR/Issue state belongs on the dashboard. / GitHub→Supabase는 3단계 현황판 범위 결정까지 보류 | The current system-of-record policy does not define a sync integration. / 현재 원본 기록 정책은 동기화 연동을 정하지 않음 | Record the open product question before selecting webhooks, fields or idempotency. / webhook·필드·중복방지 선정 전 제품 질문 기록 | Avoid premature architecture and duplicate state. / 성급한 구조·중복 상태 방지 | A dashed arrow can still imply an approved plan; annotate this path as undecided rather than ordinary planned flow. / 점선도 계획 승인으로 오해될 수 있으므로 일반 계획선이 아닌 미결정 표기 |
| Legal / 법무 | Keep data transfer and retention undecided until dashboard need and data ownership are adopted. / 현황판 필요·데이터 주체 채택 전 데이터 전송·보존 미결정 유지 | PR/Issue metadata copied to Supabase creates purpose and retention questions. / PR·Issue 메타데이터 복제는 목적·보존 질문을 발생 | If later adopted, define fields, lawful purpose/terms, retention and source-of-truth before drawing a concrete sync line. / 채택 후 구체 동기화 전에 필드·목적/조건·보존·원본 기준 정의 | Traceable and limited data handling. / 추적 가능하고 제한된 데이터 처리 | Defer item 3 is reasonable, but its unresolved status should remain explicit. / 3번 보류는 타당하나 미결정 상태를 명시 |
| End User / 사용자 관점 | Keep the current task view focused on who acts/verifies and human approval; show event order and failures in item 6. / 작업 그림은 실행·확인 담당과 사람 승인, 6번은 이벤트 순서·실패에 집중 | Two linear diagrams otherwise repeat the same steps. / 선형 그림 둘은 중복될 수 있음 | Retain numbered handoffs in text and a concise task gate view; link the task-specific sequence for event details. / 번호 인계는 텍스트·간결한 작업 게이트에 두고 시퀀스 연결 | Clear next action without duplicate charts. / 중복 없이 다음 행동 명확화 | Item 4 is adopted as a distinction recommendation, not removal of the required current-task view. / 4번은 구분 권고이지 필수 현재 작업 그림 제거가 아님 |

## Findings / 취합 판단

1. **Item 6 — recommend adopt first:** Draft the test sequence with PR→Actions→diff→Gemini→COMMENT→Slack and explicit quota/retrigger branches. Mark paths and failure responses as proposed/unverified until actually tested. This is a diagram draft, not workflow implementation or test authorization.
   **6번 — 첫 채택 권고:** PR→Actions→diff→Gemini→COMMENT→Slack 시퀀스와 한도/재트리거 분기를 초안으로 작성합니다. 실제 시험 전까지 경로·실패 응답은 제안/미검증으로 표시합니다. 이는 그림 초안이며 워크플로 구현·시험 승인이 아닙니다.
2. **Item 5 — adopt GitHub-native render verification; hold local CLI installation:** GitHub renders Mermaid in Markdown. Since there is no repo-configured `mmdc`, do not add a CLI dependency just to render once. After diagram adoption, use GitHub Markdown preview/render as the primary check and record the observed result. Reconsider pinned `mmdc` only if reproducible local image export becomes a requirement.
   **5번 — GitHub 기본 렌더 확인 채택, 로컬 CLI 설치 보류:** GitHub Markdown은 Mermaid를 렌더링합니다. 저장소에 설정된 `mmdc`가 없으므로 한 번 렌더하려고 CLI 의존성을 추가하지 않습니다. 그림 채택 후 GitHub Markdown 미리보기/렌더로 우선 확인하고 관찰 결과를 기록합니다. 재현 가능한 로컬 이미지 출력이 요구될 때만 버전 고정 `mmdc`를 재검토합니다.
3. **Item 2 — correct then adopt:** Legend is “solid = verified active relation; dashed = planned/unverified.” Current stage evidence: GitHub→Slack Issue/PR notification is observed and may be solid with the accurate label “notification event.” Slack→Supabase and Supabase→dashboard are not started/verified and must be dashed. GitHub→Supabase is not merely planned: whether it should exist is undecided, so render it as an explicit open question or omit it with a note until adopted. Do not use “policy record” as the GitHub→Slack edge label.
   **2번 — 정의 수정 후 채택 권고:** 범례는 “실선=검증된 활성 관계, 점선=계획/미검증”으로 통일합니다. 현재 근거상 GitHub→Slack Issue/PR 알림은 관찰됐으므로 “알림 이벤트”라는 정확한 라벨로 실선 가능. Slack→Supabase와 Supabase→현황판은 미착수/미검증이므로 점선입니다. GitHub→Supabase는 존재 여부가 미결정이므로 채택 전 일반 계획선 대신 명시적 질문으로 그리거나 주석과 함께 생략합니다. GitHub→Slack 라벨에 “정책상 공식 기록”을 쓰지 않습니다.
4. **Item 1 — adopt concise rollout gates:** Add one-line exit criteria per stage and identify human approval gates. Stage 1 must show its existing observed event evidence separately from the unverified AI review path. Dates/evidence references should link to records, not fabricate dates.
   **1번 — 간결한 도입 게이트 채택 권고:** 단계별 한 줄 완료 조건과 사람 승인 게이트를 표시합니다. 1단계의 기존 알림 관찰 근거와 미검증 AI 리뷰 경로를 구분하고 날짜/근거는 임의 생성하지 말고 기록에 연결합니다.
5. **Item 4 — adopt the distinction, preserve required view:** Keep the required task-detail report, but use numbered Executes/Verifies handoffs and human approval gates there. Put timed messages, success/failure branches and stop points in the task-specific sequence. Remove duplicate linear event narration from the task diagram.
   **4번 — 역할 구분 채택, 필수 그림 유지:** 필수 작업 상세 보고는 유지하되 번호별 Executes/Verifies와 사람 승인 지점 중심으로 씁니다. 시간순 메시지·성공/실패 분기·중단 지점은 작업별 시퀀스에 둡니다. 작업 그림의 중복 선형 이벤트 설명은 줄입니다.
6. **Item 3 — defer:** At stage 3 design, decide whether PR/Issue status belongs on the dashboard. If yes, then evaluate webhook/event path, selected fields, ownership, retention and idempotency; if no, omit the sync path. Do not select a specific webhook design now.
   **3번 — 보류:** 3단계 설계 때 PR·Issue 상태가 현황판에 필요한지 결정합니다. 필요하면 webhook/이벤트 경로·필드·주체·보존·중복 방지를 검토하고, 불필요하면 동기화 경로를 두지 않습니다. 지금 특정 webhook 구조를 선택하지 않습니다.

## Mermaid — proposed sequence draft / 제안 시퀀스 초안

```mermaid
sequenceDiagram
  participant U as Human author / 사용자
  participant GH as GitHub PR
  participant A as Actions (proposed)
  participant M as Gemini (proposed)
  participant C as GitHub COMMENT
  participant S as Slack
  U->>GH: Open test PR with synthetic code
  GH-->>A: pull_request event (unverified)
  A->>GH: Read diff (permission not verified)
  A->>M: Send bounded diff (not implemented)
  alt Quota exhausted
    M-->>A: Limit/error (response behavior unverified)
    A-->>GH: Stop without review; report failure (proposed)
  else Model returns review text
    M-->>A: Review text (unverified)
    A->>GH: Submit COMMENT only (not implemented)
    GH-->>A: Review/comment event may retrigger workflow (unverified)
    A-->>A: Ignore bot actor / stop recursion (proposed guard)
    GH-->>S: Review notification (subscription/delivery for this event unverified)
  end
```

## Curtain's adoption / 커튼 뒤 채택 결정

On 2026-11-21 KST, Curtain adopted items 1–5 as recommended and deferred item 6 (GitHub→Supabase sync decision) until stage 3 design. This is an explicit user decision, not merely a meeting recommendation.
2026-11-21 KST 커튼 뒤가 권고대로 1~5번을 채택하고 6번(GitHub→Supabase 동기화 여부)은 3단계 설계까지 보류했습니다. 이는 회의 권고가 아니라 사용자의 명시적 결정입니다.

## Implementation report / 반영 보고

The adopted items 1–5 were applied to `docs/office/workflow.md`: stage-specific exit criteria and human gates; a test-specific sequence with Gemini quota and bot-retrigger branches explicitly unverified; current-task versus timed-sequence responsibilities; the solid/dashed/question semantics; and GitHub-native Mermaid rendering as the planned check method. Item 6 remains deferred and GitHub→Supabase remains an open question, not an integration edge. No external test, new CLI dependency, commit, Push or PR was authorized or performed.
채택된 1~5번을 `docs/office/workflow.md`에 반영했습니다: 단계별 완료 조건·사람 승인 지점, Gemini 한도·봇 재트리거를 미검증 분기로 표시한 시험 시퀀스, 작업 상세와 시간순 시퀀스의 역할 구분, 실선/점선/질문 의미, GitHub 기본 Mermaid 렌더를 검증 방법으로 기록했습니다. 6번은 보류이며 GitHub→Supabase는 연동선이 아닌 미결정 질문입니다. 외부 시험·새 CLI 의존성·커밋·Push·PR은 승인되거나 실행되지 않았습니다.

## Open decisions and next actions / 미결정·다음 단계

- Adopted scope: items 1–5. Deferred: item 6 until stage 3 design. The adoption authorizes documentation changes for the adopted items, not an external Actions/Gemini test, new dependency installation, commit, Push or PR.
  채택 범위: 1~5번. 보류: 6번은 3단계 설계까지. 채택은 1~5번 문서 변경을 허용하지만 외부 Actions/Gemini 시험·새 의존성 설치·커밋·Push·PR 승인은 아닙니다.
- The Git checkout is the recovered repository; the user-facing project folder is a separate mirror. Preserve this distinction in reports and sync approved document edits to the mirror. Do not assume the mirror is the Git remote checkout.
  Git checkout은 복구된 저장소이며 사용자 화면의 프로젝트 폴더는 별도 사본입니다. 보고에서 구분하고 승인된 문서 변경은 사본에 동기화합니다. 사본을 원격 Git checkout으로 추정하지 않습니다.
- Next: apply the adopted documentation scope to workflow.md and add the approved task-specific sequence, then validate and report the result. Item 6 remains deferred.
  다음: 채택된 문서 범위를 workflow.md에 반영하고 승인된 작업별 시퀀스를 추가한 뒤 검증·보고합니다. 6번은 보류 상태를 유지합니다.

## Sources / 출처

- User-provided prioritization and observations in the current conversation.
- `docs/office/workflow.md`
- `docs/office/stage1-notifications.md`
- `docs/office/meetings/2026-11-21-mermaid-diagram-evidence-review.md`
- `docs/office/meetings/2026-11-21-mermaid-diagram-needs-second-review.md`
