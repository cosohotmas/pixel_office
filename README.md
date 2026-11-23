# Pixel Office 운영 문서

이 폴더는 에이전트 사무실의 역할, 대화, 기록, 자동화 규칙을 설명합니다.

## 문서 읽는 순서

1. [`roles.md`](./roles.md) — 누가 무엇을 담당하는가
2. [`workflow.md`](./workflow.md) — 업무와 회의가 어떻게 진행되는가
3. `meetings/` — 회의 기록
4. `decisions/` — 최종 결정

## Numbered work handoffs / 번호별 실행·확인 안내

Every task-start, progress, and final report uses exactly this three-column table: `순서 | 커튼 뒤가 할 일 | 제가 할 일`. Number the steps in order, mark each step 완료/현재/대기, explain both owners' actions simply, include the verifier and evidence, and name the next actor after the table. If an owner has no action, write `없음(이 단계에서는 불필요)`. Curtain handles user-only access, judgment, or approval; the Assistant does the other authorized work. See [workflow.md](workflow.md) for the template. This format does not authorize external changes or publication.
모든 작업 시작·진행·최종 보고에서 정확히 다음 세 열을 가진 표를 씁니다: `순서 | 커튼 뒤가 할 일 | 제가 할 일`. 단계를 순서대로 번호 매기고 완료·현재·대기를 표시하며, 두 담당자의 할 일을 쉬운 말로 설명하고 확인자·근거를 넣은 뒤 표 아래에 다음 실행자를 씁니다. 담당자의 할 일이 없으면 `없음(이 단계에서는 불필요)`이라고 씁니다. 사용자만 할 수 있는 접근·판단·승인은 커튼 뒤가, 나머지 허가된 작업은 어시스턴트가 맡습니다. 표 양식은 [workflow.md](workflow.md)를 참고합니다. 이 형식은 외부 변경이나 공개를 허가하지 않습니다.

In overall rollout diagrams, highlight the current rollout stage with a bright cyan border (`#22d3ee`); use amber (`#f59e0b`) for the current step in the task-detail diagram. These colors indicate focus only, not error, approval, or completion. Keep the highlighted rollout stage synchronized with the evidence in `workflow.md`.
전체 도입 흐름에서는 현재 도입 단계를 밝은 청록색 테두리(`#22d3ee`)로 표시하고, 세부 작업 그림의 현재 단계는 주황색(`#f59e0b`)으로 표시합니다. 색은 강조만 뜻하며 오류·승인·완료를 뜻하지 않습니다. 강조 단계는 `workflow.md`의 근거 상태와 일치시킵니다.

## Beginner-friendly website guidance / 초보자용 웹 안내

When Curtain must act in a website or app, give a beginner-friendly guide for the current stage: an official link, numbered actions using visible button names, cautions before action, a short preview of later stages, and an exact phrase to report completion. Give detailed steps for the next stage only after the current stage is confirmed. Never ask for secrets in chat; if the screen differs, request a screenshot with private details hidden. See [workflow.md](workflow.md).
커튼 뒤가 웹사이트나 앱에서 직접 작업할 때는 현재 단계만 초보자용으로 안내합니다. 공식 링크, 화면 버튼 이름을 쓴 번호 절차, 실행 전 주의점, 다음 단계 미리보기, 완료 보고 문구를 제공합니다. 현재 단계 완료를 확인한 뒤에 다음 단계의 자세한 절차를 안내합니다. 채팅으로 비밀값을 요청하지 않으며 화면이 다르면 개인정보를 가린 캡처를 요청합니다. [workflow.md](workflow.md)를 참조합니다.

## Meeting record format
## 회의록 형식

Each formal meeting gets one Markdown file under `meetings/`. The record must include the agenda, role-based discussion, facts, assumptions, decisions, open questions, next actions, sources, and a Mermaid diagram when a flow or relationship is discussed.
모든 공식 회의는 `meetings/` 아래에 Markdown 파일 하나로 기록합니다. 회의록에는 의제·역할별 논의·사실·가정·결정·미결정 질문·다음 작업·출처를 포함하며 흐름이나 관계를 논의했으면 Mermaid 다이어그램을 추가합니다.

Write meeting-record prose in simple English and put the Korean translation immediately after each paragraph or item, following the bilingual source-comment rule. In role tables, include both languages in each field. Keep technical identifiers, code, and links unchanged. This is a new documentation rule; it does not imply that older minutes had the same requirement.
회의록 본문은 쉬운 영어로 작성하고, 소스 주석의 이중 언어 규칙처럼 각 문단·항목 바로 뒤에 한국어 번역을 둡니다. 역할 표는 각 칸에 두 언어를 모두 씁니다. 기술 식별자·코드·링크는 그대로 둡니다. 이번에 추가한 문서 규칙이며 과거 회의록에도 이미 같은 요구가 있었다는 뜻은 아닙니다.

[Workspace folder-name review / 작업공간 폴더명 검토](meetings/2026-11-21-pixel-office-folder-rename-review.md): Curtain adopted the rename; the directory move and Codex project-path update are verified. All 108 files matched the pre-move SHA-256 manifest at move time.
[작업공간 폴더명 검토 회의록](meetings/2026-11-21-pixel-office-folder-rename-review.md): 커튼 뒤가 이름 변경을 채택했으며 폴더 이동과 Codex 프로젝트 경로 갱신을 확인했습니다. 이동 시점에 파일 108개가 이동 전 SHA-256 목록과 일치했습니다.

For each working role, use a table with explicit Who, What, Why, How, Goal, and Conviction (소신) columns. Fill every field for every role. A combined summary does not replace this table. Curtain receives the compiled report and is not a simulated role.
각 작업 역할은 Who·What·Why·How·Goal·소신 열이 명시된 표로 기록하고 모든 역할의 모든 칸을 채웁니다. 서술형·취합 요약으로 표를 대체하지 않습니다. 사실·가정·제안·질문을 구분하고, 실제 사용자인 커튼 뒤에게 취합 보고를 제출하며 역할 발언을 대신 만들지 않습니다.

## Mermaid report diagram review / Mermaid 보고 그림 검토

[2026-11-21 meeting](meetings/2026-11-21-mermaid-diagram-needs.md) reviews whether additional diagrams are needed beyond the recurring three. Its recommendations are pending Curtain's decision.
[2026-11-21 회의록](meetings/2026-11-21-mermaid-diagram-needs.md)에서 상시 다이어그램 세 가지 외에 추가 그림이 필요한지 검토했습니다. 권고는 커튼 뒤 결정 대기입니다.

[Second meeting / 2차 회의](meetings/2026-11-21-mermaid-diagram-needs-second-review.md) evaluates the seven proposed additions by rollout stage. Priorities and permission examples remain pending adoption/verification.
[2차 회의록](meetings/2026-11-21-mermaid-diagram-needs-second-review.md)은 사용자 제안 7종을 도입 단계별로 검토합니다. 우선순위와 권한 예시는 채택·검증 대기입니다.

[Evidence comparison meeting / 근거 대조 회의](meetings/2026-11-21-mermaid-diagram-evidence-review.md) reviews five follow-up observations. Diagram corrections and test sequence are recommendations pending Curtain's decision; GitHub-to-Supabase synchronization remains undecided, and Mermaid rendering has not been verified.
[근거 대조 회의록](meetings/2026-11-21-mermaid-diagram-evidence-review.md)은 후속 지적 다섯 가지를 검토합니다. 그림 보완과 시험 시퀀스는 커튼 뒤 결정 대기이며 GitHub→Supabase 동기화는 미결정, Mermaid 렌더링은 미검증입니다.

[Priority review / 우선순위 검토](meetings/2026-11-21-mermaid-priorities-third-review.md) assesses the suggested 6→5→2→1→4 order. The meeting recommends GitHub-native rendering first, defers local CLI installation, and keeps GitHub→Supabase undecided until stage 3.
[우선순위 검토 회의록](meetings/2026-11-21-mermaid-priorities-third-review.md)은 제안된 6→5→2→1→4 순서를 검토합니다. GitHub 기본 렌더 확인을 우선하고 로컬 CLI 설치는 보류하며 GitHub→Supabase는 3단계까지 미결정으로 둡니다.

Curtain adopted items 1–5 and deferred item 6. See the adoption entry in the [priority review](meetings/2026-11-21-mermaid-priorities-third-review.md) and the updated [workflow diagrams and rollout gates](workflow.md). GitHub→Supabase synchronization remains undecided until stage 3 design.
커튼 뒤가 1~5번을 채택하고 6번을 보류했습니다. [우선순위 회의록의 채택 기록](meetings/2026-11-21-mermaid-priorities-third-review.md)과 수정된 [workflow 그림·도입 게이트](workflow.md)를 참조합니다. GitHub→Supabase 동기화는 3단계 설계까지 미결정입니다.

## 시스템의 역할

> GitHub는 기억, Supabase는 상태, Slack은 대화, 픽셀 현황판은 시각화입니다.

| 시스템 | 역할 | 기록의 기준 |
|---|---|---|
| GitHub | PR·Issue·문서·결정 | 공식 기억 |
| Supabase | 에이전트·회의·지식 지도 상태 | 실시간 상태 |
| Slack | 회의·알림·질문 | 대화 공간 |
| 픽셀 현황판 | 에이전트 상태와 지식 연결 시각화 | 관찰 화면 |
| LangGraph | 회의 진행·기록 자동화 | 후순위 자동화 |

## Service admin dashboard / 서비스 관리자 대시보드

The service admin dashboard is deferred until the Pixel dashboard is complete. This is a sequencing decision only; scope, completion criteria and integration between the two dashboards remain open. See the [brainstorm and decision record](meetings/2026-11-21-service-admin-dashboard-brainstorm.md) and stage-3 rule in [workflow.md](workflow.md).
서비스 관리자 대시보드 작업은 픽셀 현황판 완성 후로 미룹니다. 이는 진행 순서 결정이며 기능 범위·완료 기준·두 대시보드 통합 여부는 미결정입니다. [브레인스토밍·결정 회의록](meetings/2026-11-21-service-admin-dashboard-brainstorm.md)과 [workflow.md](workflow.md)의 3단계 규칙을 참조합니다.

## 운영 원칙

- Slack의 중요한 결정은 GitHub 문서로 옮깁니다.
- Supabase는 상태를 저장하지만 공식 결정의 원본이 아닙니다.
- 현황판은 확인된 상태만 표시합니다.
- LangGraph는 실제 반복 절차가 확인된 뒤 도입합니다.

## Stage 1 notification preparation / 1단계 알림 준비

Read the [setup and verification guide](stage1-notifications.md), [first meeting](meetings/2026-11-19-stage1-notification-planning.md), and [second meeting](meetings/2026-11-19-stage1-notification-second-planning.md). The adopted mandatory events are Issue opened/closed, PR opened/merged, Actions-submitted `COMMENT`, review requested, independent `APPROVE`, and independent `REQUEST_CHANGES`. Stage 1 remains partially verified until evidence for every adopted event is reconciled and Curtain accepts the result.
[설정·검증 지침](stage1-notifications.md)·[1차 회의](meetings/2026-11-19-stage1-notification-planning.md)·[2차 회의](meetings/2026-11-19-stage1-notification-second-planning.md)를 확인합니다. 채택된 필수 기본 범위는 Issue 생성/종료와 PR 생성/병합이며 리뷰어 의존 이벤트는 보류입니다. 근거 대조와 결과 수락 전까지 1단계는 부분 검증입니다.

[Adopted Stage 1 event scope / 채택된 1단계 이벤트 범위](meetings/2026-11-22-review-notification-scope-adoption.md): Curtain expanded the mandatory scope to eight events on 2026-11-22. The earlier four-event decision remains historical. See the [owning guide](stage1-notifications.md) and [rollout gates](workflow.md). Adoption does not claim all event tests are complete.
[채택된 1단계 이벤트 범위](meetings/2026-11-22-review-notification-scope-adoption.md): 2026-11-22 커튼 뒤가 필수 범위를 여덟 이벤트로 확대했습니다. 이전 네 이벤트 결정은 과거 이력으로 남습니다. [담당 지침](stage1-notifications.md)과 [도입 게이트](workflow.md)를 참조합니다. 채택 자체가 모든 이벤트 시험 완료를 뜻하지 않습니다.

[Review automation, OpenRouter models and Hermes Agent meeting / 리뷰 자동화·OpenRouter 모델·Hermes Agent 회의](meetings/2026-11-23-review-automation-and-independent-reviewer-meeting.md): Curtain selected Particle-1 (`particle-ai/particle-1:free`) for further $0-capped synthetic evaluation with Hermes. This is not approval for GitHub/Slack integration or a live PR. The small comparison and its limits are recorded in the meeting. The documented PR conversation comments do not prove the required Actions-submitted review `COMMENT` or Slack delivery.
[리뷰 자동화·OpenRouter 모델·Hermes Agent 회의](meetings/2026-11-23-review-automation-and-independent-reviewer-meeting.md): 커튼 뒤는 Hermes를 이용한 지출 상한 0원의 추가 합성 평가 모델로 Particle-1 (`particle-ai/particle-1:free`)을 선택했습니다. GitHub/Slack 연동이나 실제 PR 승인으로 보지 않습니다. 소규모 비교와 한계를 회의록에 기록했습니다. 문서화된 PR 대화 코멘트는 필수 Actions 제출 리뷰 `COMMENT`나 Slack 전달을 입증하지 않습니다.

## Online-first scheduling / 온라인 기반 예약 실행

The project uses an online-first operating principle. Production schedules must run in the selected hosted environment, not rely on a user's local machine. The scheduler/provider remains undecided until its use case and operational requirements are defined. See the [accepted meeting record](meetings/2026-11-21-online-scheduling-runtime-meeting.md) and [workflow rule](workflow.md).
프로젝트는 온라인 기반 운영 원칙을 채택했습니다. 운영 예약은 사용자 로컬 컴퓨터에 의존하지 않고 선택된 호스팅 환경에서 실행해야 합니다. 사용 목적과 운영 요건을 정하기 전까지 스케줄러/제공자는 미결정입니다. [수락된 회의록](meetings/2026-11-21-online-scheduling-runtime-meeting.md)과 [운영 규칙](workflow.md)을 참조합니다.

### Issue notification verification / Issue 알림 검증

[Adopted test meeting](meetings/2026-11-19-stage1-issue-notification-test.md) and [dated evidence](stage1-notifications.md) record one successful create/close test. Stage 1 remains partial.
[채택 테스트 회의](meetings/2026-11-19-stage1-issue-notification-test.md)·[날짜별 근거](stage1-notifications.md)에 생성/종료 단일 성공을 기록했습니다. 1단계는 부분 검증입니다.

## Issue-use discussion / Issue 사용 논의

[Meeting 2 / 2차 회의](meetings/2026-11-19-issue-use-second-meeting.md) · [Meeting 3 / 3차 회의](meetings/2026-11-19-issue-use-third-meeting.md). Recommendations remain distinct from adopted policy; current evidence is at the top of [the guide](stage1-notifications.md).
권고와 채택 정책을 구분하며 현재 근거는 [지침](stage1-notifications.md) 상단에 표시합니다.

## Review-notification investigation / 리뷰 알림 조사

[Meeting and findings / 회의·조사](meetings/2026-11-19-review-notification-planning.md) · [Current evidence / 현행 근거](stage1-notifications.md). Existing COMMENTED notification observed; reviewer requests and approvals remain unverified.
기존 COMMENTED 알림 관찰·리뷰 요청/승인 미검증.

## Execution approval waiting / 실행 승인 대기

[Discussion / 회의](meetings/2026-11-19-execution-approval-waiting-discussion.md): reviewer-dependent tests deferred; execution-approval kind, recipient and record location proposed, not adopted.
별도 리뷰어 필요 시험 보류·실행 승인 종류/수신자/기록 위치는 제안·미채택.

## Adopted manual approval baseline / 수동 승인 알림 채택 기준

[Adoption meeting / 채택 회의](meetings/2026-11-19-manual-approval-notification-adoption.md). Method adopted; final sending approval pending.
방식 채택·최종 발송 승인 대기.
