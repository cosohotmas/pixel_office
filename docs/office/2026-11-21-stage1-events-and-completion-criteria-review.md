# 2026-11-21 Stage 1 event coverage and completion criteria meeting
# 2026-11-21 1단계 이벤트 범위·완료 조건 회의

## Meeting purpose / 회의 목적

Organize remaining Stage 1 events, evidence, and candidate completion criteria by role. This is a recommendation to Curtain, not a decision made on the user's behalf.
남은 1단계 이벤트·근거·완료 조건 후보를 역할별로 정리합니다. 커튼 뒤에게 제출하는 권고이며 사용자를 대신한 결정이 아닙니다.

## Rollout status / 도입 단계

- **Stage:** Stage 1, GitHub PR·Issue → Slack; partially verified.
  **단계:** GitHub PR·Issue → Slack 1단계, 부분 검증입니다.
- **Evidence:** Issue #23 create/close and PR #24 open/merge are recorded in the guide. The user's screenshot adds one observed Slack message each for PR #26 opened and merged. PR #24 `COMMENTED` delivery was observed once; the reviewer was the PR author.
  **근거:** Issue #23 생성·종료와 PR #24 생성·병합은 가이드에 기록되어 있습니다. 사용자 화면에서 PR #26 생성·병합 Slack 메시지를 각각 한 번 확인했습니다. PR #24의 `COMMENTED` 전달도 한 번 관찰했으며 리뷰 작성자는 PR 작성자 본인입니다.
- **Unverified:** Review-request delivery and independent `APPROVE` / `REQUEST_CHANGES` remain deferred because no separate reviewer is available. Automated approval-waiting notification, device push, read status, latency/SLA, and repeat reliability are unverified.
  **미검증:** 별도 리뷰어가 없어 리뷰 요청 전달과 독립 `APPROVE` / `REQUEST_CHANGES`는 보류입니다. 자동 승인 대기 알림·기기 푸시·읽음·지연/SLA·반복 신뢰성도 미검증입니다.
- **Next rollout action:** Curtain adopts the required event list and evidence threshold; then update the owning policy and plan any separately approved test.
  **다음 도입 작업:** 커튼 뒤가 필수 이벤트와 근거 기준을 채택하면 담당 정책을 갱신하고 별도 승인된 시험을 계획합니다.

## Event and evidence inventory / 이벤트·근거 목록

| Event / 이벤트 | Status / 상태 | Evidence and limit / 근거와 한계 |
|---|---|---|
| Issue opened / created<br>Issue 생성 | Passed once; user accepted<br>1회 통과·사용자 수락 | Issue #23 and Slack creation message match; one observation does not prove reliability.<br>Issue #23과 Slack 생성 알림이 일치합니다. 1회 관찰로 신뢰성이 입증되지는 않습니다. |
| Issue closed<br>Issue 종료 | Passed once; user accepted<br>1회 통과·사용자 수락 | Issue #23 closure thread matches the closed Issue.<br>Issue #23 종료 스레드가 실제 종료 상태와 일치합니다. |
| PR opened<br>PR 생성 | Observed; PR #24 record plus PR #26 screenshot<br>관찰됨·PR #24 기록과 PR #26 화면 | Number/title/repository match; PR #26 screenshot lacks exact timestamp and permalink.<br>번호·제목·저장소가 일치합니다. PR #26 화면에는 정확한 시각과 permalink가 없습니다. |
| PR merged<br>PR 병합 | Observed; PR #24 record plus PR #26 screenshot<br>관찰됨·PR #24 기록과 PR #26 화면 | Merge state/message match; no latency or reliability claim.<br>병합 상태와 메시지가 일치합니다. 지연·신뢰성 수치는 주장하지 않습니다. |
| Review comment (`COMMENTED`)<br>리뷰 댓글 | Observed once<br>1회 관찰 | PR #24 review and Slack message match; author reviewed own PR, so this is not independent review or approval.<br>PR #24 리뷰와 Slack 메시지가 일치하지만 작성자의 자기 PR 댓글이며 독립 리뷰·승인이 아닙니다. |
| Review requested<br>리뷰 요청 | Deferred / unverified<br>보류·미검증 | No separate reviewer is available; channel delivery is unverified.<br>별도 리뷰어가 없어 채널 전달을 확인하지 못했습니다. |
| `APPROVE` decision<br>`APPROVE` 판정 | Deferred / unverified<br>보류·미검증 | Requires a legitimate separate reviewer; none was submitted or inferred.<br>정당한 별도 리뷰어가 필요하며 제출·추정하지 않았습니다. |
| `REQUEST_CHANGES` decision<br>`REQUEST_CHANGES` 판정 | Deferred / unverified<br>보류·미검증 | Requires a legitimate separate reviewer; none was submitted or inferred.<br>정당한 별도 리뷰어가 필요하며 제출·추정하지 않았습니다. |
| User execution-approval waiting<br>사용자 실행 승인 대기 | Manual baseline accepted; automation unverified<br>수동 기준 수락·자동화 미검증 | Manual notification and Codex response are recorded separately; they do not prove automatic delivery.<br>수동 알림과 Codex 응답은 별도로 기록되어 있으며 자동 전달의 증거가 아닙니다. |
| Device push / read / latency / repeat reliability<br>기기 푸시·읽음·지연·반복 신뢰성 | Unverified<br>미검증 | Existing records establish none of these measurements; no numeric thresholds are invented.<br>기존 기록으로는 어느 항목도 측정되지 않았으며 숫자 기준을 임의로 만들지 않습니다. |

## Role-based discussion / 역할별 회의

| Who | What · 제안 | Why · 이유 | How · 방법 | Goal · 목표 | Conviction · 소신 |
|---|---|---|---|---|---|
| Tech Lead | Keep Stage 1 partial until required events and evidence are adopted.<br>필수 이벤트와 근거를 채택할 때까지 1단계를 부분 상태로 둡니다. | Event observations do not equal end-to-end completion.<br>이벤트 관찰은 종단 완료와 다릅니다. | Separate observed, accepted, deferred, and unverified; keep `COMMENTED` separate from approval.<br>관찰·수락·보류·미검증을 나누고 `COMMENTED`와 승인을 구분합니다. | Evidence-based completion decision.<br>근거에 따른 완료 판정입니다. | One screenshot or delivery cannot prove the whole integration or reliability.<br>화면 한 장이나 전달 한 번으로 전체 연동·신뢰성을 입증할 수 없습니다. |
| Full-stack | Track each GitHub event and Slack counterpart separately.<br>GitHub 이벤트와 Slack 대응 메시지를 각각 기록합니다. | Issue, PR, comment, request, and decision are distinct events.<br>Issue·PR·댓글·요청·판정은 서로 다른 이벤트입니다. | Match number, status, title, repository and visible link; note missing evidence.<br>번호·상태·제목·저장소·보이는 링크를 대조하고 근거 누락을 씁니다. | Reproducible event-to-message evidence.<br>재현 가능한 이벤트-메시지 근거입니다. | An existing comment is not a new test or a submitted review request.<br>기존 댓글은 신규 시험이나 리뷰 요청 제출이 아닙니다. |
| SecOps | Keep current channel and permissions unchanged.<br>현재 채널과 권한을 그대로 둡니다. | This review does not authorize installation, invitations, or broader access.<br>이번 검토는 설치·초대·권한 확대를 승인하지 않습니다. | Use existing records; seek separate authorization before access changes or external tests.<br>기존 기록을 사용하고 권한 변경·외부 시험은 별도 승인을 받습니다. | Least-change handling of access.<br>접근 범위를 최소 변경합니다. | Reviewer absence is not permission to bypass review protections.<br>리뷰어 부재가 보호 절차 우회를 허가하지 않습니다. |
| Art Director | Label states as observed once, accepted, deferred, or unverified.<br>상태를 1회 관찰·수락·보류·미검증으로 표시합니다. | “Done” can make partial coverage look complete.<br>‘완료’ 표시는 부분 검증을 전체 완료처럼 보이게 할 수 있습니다. | Put the state next to each event and its evidence limit.<br>이벤트별 상태와 근거 한계를 나란히 표시합니다. | Clear status reporting.<br>명확한 상태 보고입니다. | Do not mark unresolved coverage as complete.<br>미해결 범위를 완료로 표시하지 않습니다. |
| Researcher | Cite the owning guide, GitHub/Slack records, or user's screenshot.<br>담당 가이드·GitHub/Slack 기록·사용자 화면을 출처로 표시합니다. | Claim precision depends on evidence provenance.<br>주장의 정밀도는 근거 출처에 달려 있습니다. | Use exact links when available; state that PR #26 time/permalink are absent.<br>가능하면 정확한 링크를 쓰고 PR #26 시각·permalink 누락을 밝힙니다. | Traceable claims with clear limits.<br>한계가 분명하고 추적 가능한 주장입니다. | Do not infer latency, SLA, or repeat reliability.<br>지연·SLA·반복 신뢰성을 추정하지 않습니다. |
| Trend Analyst | Ask whether reviewer-dependent events are required now or deferred.<br>리뷰어 의존 이벤트를 지금 필수로 할지 보류할지 묻습니다. | This scope choice determines whether reviewer absence blocks Stage 1.<br>범위 결정에 따라 리뷰어 부재가 1단계를 막는지가 달라집니다. | Present the coverage benefit and the need for a legitimate reviewer to Curtain.<br>검토 범위의 이점과 정당한 리뷰어 필요성을 커튼 뒤에게 제시합니다. | Feasible, explicit acceptance scope.<br>실행 가능하고 명시적인 수락 범위입니다. | Industry practice must not silently set this project's criteria.<br>업계 관행이 이 프로젝트의 기준을 대신 정하면 안 됩니다. |
| Legal | Keep only necessary evidence and do not duplicate screenshot identities.<br>필요한 근거만 남기고 화면의 식별 정보를 복제하지 않습니다. | Screenshots may contain identifying details; no external material is added.<br>화면에는 식별 정보가 있을 수 있고 외부 자료는 추가되지 않습니다. | Link to records; mark new-material license review not applicable.<br>기록을 링크하고 신규 자료 라이선스 검토는 해당 없음으로 표시합니다. | Minimize unnecessary personal/license claims.<br>불필요한 개인정보·라이선스 주장을 줄입니다. | Do not claim legal verification that did not occur.<br>실제로 하지 않은 법률 검증을 주장하지 않습니다. |
| End User | Define completion by whether the intended recipient gets a usable alert.<br>수신자가 실제로 활용할 알림을 받는지를 완료 기준 후보로 둡니다. | The message should identify the GitHub item and its status.<br>메시지는 GitHub 항목과 상태를 식별해야 합니다. | Match channel message to source; label manual approval notices separately.<br>채널 메시지를 원본과 대조하고 수동 승인 알림은 별도 표시합니다. | User can find and follow the event in Slack.<br>사용자가 Slack에서 이벤트를 확인하고 원본을 따라갈 수 있습니다. | Receiving an alert is not approving, reviewing, or reading it.<br>알림 수신은 승인·리뷰·읽음과 다릅니다. |

## Combined findings submitted to Curtain / 커튼 뒤에게 제출하는 취합 결과

1. **Observed:** Issue create/close, PR open/merge, and one author-created `COMMENTED` event have evidence; PR #26 adds one screenshot observation each for open and merge.
   **관찰:** Issue 생성·종료, PR 생성·병합, 작성자의 `COMMENTED` 1회 근거가 있습니다. PR #26 화면에서 생성·병합 메시지를 각각 한 번 더 관찰했습니다.
2. **Deferred:** Review request and independent `APPROVE` / `REQUEST_CHANGES` remain deferred because a separate reviewer is unavailable. This is not pass, failure, waiver, or completion.
   **보류:** 별도 리뷰어가 없어 리뷰 요청과 독립 `APPROVE` / `REQUEST_CHANGES`는 보류입니다. 통과·실패·면제·완료를 뜻하지 않습니다.
3. **Not established:** Automated approval notification, device push, read status, exact latency, and repeat reliability.
   **미확인:** 자동 승인 알림·기기 푸시·읽음·정확한 지연·반복 신뢰성입니다.
4. **Recommendation:** Curtain should adopt the required event rows and evidence threshold before Stage 1 can be declared complete. Match each required GitHub event to Slack evidence; keep manual and automated paths distinct. Do not invent numeric latency or repetition thresholds.
   **권고:** 1단계 완료 판정 전에 커튼 뒤가 필수 이벤트와 근거 기준을 채택해야 합니다. 필수 GitHub 이벤트마다 Slack 근거를 대조하고 수동·자동 흐름을 구분합니다. 지연·반복 횟수 기준을 임의로 정하지 않습니다.
5. **Decision status:** Pending Curtain's adoption; the existing partial-verification rule remains in force.
   **결정 상태:** 커튼 뒤 채택 대기이며 기존 부분 검증 규칙을 유지합니다.

## Mermaid views / Mermaid 시각화

### Overall rollout / 전체 도입 흐름

```mermaid
flowchart LR
  S0["Preparation<br/>준비"] --> S1["Stage 1: GitHub → Slack<br/>1단계: 부분 검증"]
  S1 --> S2["Stage 2: Slack → Supabase<br/>2단계: 미착수"]
  S2 --> S3["Stage 3: Supabase → Pixel dashboard<br/>3단계: 미착수"]
  S3 --> S4["Stage 4: LangGraph automation<br/>4단계: 계획"]
  style S1 stroke:#22d3ee,stroke-width:4px
```

### Stage 1 evidence flow / 1단계 근거 흐름

```mermaid
flowchart TD
  GH["GitHub events<br/>GitHub 이벤트"] -->|"Issue·PR observed / 관찰"| SL["Slack messages match / 메시지 일치"]
  GH -->|"COMMENTED once / 1회"| C["Author's own review / 작성자 자기 리뷰"]
  GH -.->|"Reviewer unavailable / 리뷰어 부재"| R["Request and decisions deferred<br/>요청·판정 보류"]
  M["Manual approval notice / 수동 승인 알림"] -->|"not automation evidence / 자동화 근거 아님"| A["Automatic event unverified / 자동 이벤트 미검증"]
```

### Target architecture status / 목표 아키텍처 상태

```mermaid
flowchart LR
  GH["GitHub<br/>Official record / 공식 기록"] -->|"Observed alerts / 알림 관찰"| SL["Slack<br/>Conversation / 대화"]
  SL -.->|"Planned meeting capture / 회의 기록 계획"| SB["Supabase<br/>State / 상태"]
  SB -.->|"Planned display / 현황 표시 계획"| PX["Pixel dashboard / 픽셀 현황판"]
  LG["LangGraph<br/>Future / 후순위"] -.->|"Planned automation / 자동화 계획"| SB
  Q["GitHub → Supabase?<br/>Undecided / 미결정"]
  L["Solid = observed; dashed = planned/unverified<br/>실선=관찰, 점선=계획·미검증"]
```

## Open questions / 미결정 질문

- Which event rows are mandatory for initial Stage 1 completion?
  1단계 최초 완료에 어떤 이벤트가 필수인가요?
- Are reviewer-dependent events mandatory now or deferred until a legitimate reviewer is available?
  리뷰어 의존 이벤트는 지금 필수인가요, 정당한 리뷰어가 생길 때까지 보류하나요?
- Is manual approval notification part of the event matrix or a separate procedure?
  수동 승인 알림은 이벤트 표에 포함하나요, 별도 절차로 두나요?
- Does Curtain require repeat observations or a latency target? No numeric threshold is proposed here.
  반복 관찰이나 지연 목표가 필요한가요? 이 회의에서 숫자 기준을 제안하지 않습니다.

## Next actions / 다음 작업

1. **Assistant:** Submit this recommendation; keep Stage 1 partial.
   **어시스턴트:** 이 권고를 제출하고 1단계 부분 상태를 유지합니다.
2. **Curtain (user):** Adopt, revise, or reject the required events and evidence threshold.
   **커튼 뒤(사용자):** 필수 이벤트와 근거 기준을 채택·수정·반려합니다.
3. **Assistant:** If adopted, update the owning guide and workflow; separately seek applicable authorization for external tests.
   **어시스턴트:** 채택되면 담당 가이드와 workflow를 갱신하고 외부 시험에는 별도 승인을 받습니다.

## Sources and verification / 출처·검증

- [Stage 1 notification guide](../stage1-notifications.md): Issue #23, PR #24, and reviewer investigation.
  [1단계 알림 가이드](../stage1-notifications.md): Issue #23·PR #24·리뷰어 조사 기록입니다.
- [PR #26 evidence review](./2026-11-21-pr26-slack-evidence-review.md): screenshot evidence and limitations.
  [PR #26 근거 검토](./2026-11-21-pr26-slack-evidence-review.md): 화면 근거와 한계입니다.
- User-provided screenshot in this conversation shows PR #26 opened and merged notifications.
  현재 대화의 사용자 제공 화면에 PR #26 생성·병합 알림이 보입니다.
- No external material, code, dependency, or data was added. License review for new material is not applicable. Mermaid rendering and application tests were not run. No external test, permission change, commit, Push, or PR was performed.
  외부 자료·코드·의존성·데이터는 추가하지 않았습니다. 신규 자료 라이선스 검토는 해당 없음입니다. Mermaid 렌더링·앱 테스트는 하지 않았고 외부 시험·권한 변경·커밋·Push·PR도 진행하지 않았습니다.
