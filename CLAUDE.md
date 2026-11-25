# Claude Instructions

<!-- Start by reading the shared rules. -->
<!-- 먼저 공통 규칙을 읽습니다. -->
Read [`AGENTS.md`](./AGENTS.md) before changing this repository.
<!-- 이 저장소를 수정하기 전에 [`AGENTS.md`](./AGENTS.md)를 읽습니다. -->

Report the rollout stage, evidence, current task state and next rollout action at task start, meaningful updates and final reporting, following `AGENTS.md` and `docs/office/workflow.md`.
<!-- 작업 시작·의미 있는 중간 진행·최종 보고에 `AGENTS.md`·`docs/office/workflow.md`에 따라 도입 단계·근거·현재 작업 상태·다음 도입 작업을 표시합니다. -->

Show the complete rollout, current task detail with its node highlighted, and target product architecture as Mermaid diagrams in every task-start, progress and final report, following `AGENTS.md`.
<!-- `AGENTS.md`에 따라 매 작업 시작·진행·최종 보고에 전체 도입 흐름, 현재 단계를 강조한 세부 흐름, 목표 제품 아키텍처 Mermaid를 표시합니다. -->
Render those Mermaid blocks as visible diagrams in the chat window; do not present Mermaid source code alone as the diagram. If rendering is unavailable, explain the limitation and include both the source and a plain-language visual summary.
<!-- Mermaid 블록은 채팅창에서 보이는 다이어그램으로 렌더링하며 Mermaid 소스 코드만 다이어그램으로 제시하지 않습니다. 렌더링이 불가능하면 그 한계를 설명하고 소스와 쉬운 말의 시각적 요약을 함께 제공합니다. -->

In every task-start, progress, and final report, use the fixed three-column Markdown handoff table required by `AGENTS.md`: `순서`, `커튼 뒤가 할 일`, `제가 할 일`. Number steps in execution order, show each step's state, explain both owners' actions in beginner-friendly language, identify the verifier and evidence, and name the next actor after the table. Write `없음(이 단계에서는 불필요)` when an owner has no action. Ask Curtain only for user-side access, judgment, or authorization; continue all other authorized work yourself.
<!-- 모든 작업 시작·진행·최종 보고에서 `AGENTS.md`의 고정 3열 인계 표를 사용합니다: `순서`, `커튼 뒤가 할 일`, `제가 할 일`. 단계를 실행 순서로 번호 매기고 상태를 표시하며, 두 담당자의 할 일을 쉬운 말로 설명하고 확인자·근거를 적은 뒤 표 아래에 다음 실행자를 밝힙니다. 담당자의 할 일이 없으면 `없음(이 단계에서는 불필요)`이라고 씁니다. 사용자 접근·판단·승인만 커튼 뒤에게 요청하고 나머지 허가된 작업은 계속 수행합니다. -->

When guiding Curtain through a website or app, follow the beginner-friendly, one-stage-at-a-time guidance rule in `AGENTS.md`: link the official page, give numbered steps with visible control names, state cautions before action, preview later stages without asking the user to do them yet, and give an exact completion phrase. Never request secrets in chat.
<!-- 웹사이트·앱 작업을 안내할 때는 `AGENTS.md`의 초보자용 단계별 안내 규칙을 따릅니다. 공식 링크와 화면 버튼 이름이 있는 번호 절차를 주고 실행 전 주의점을 말하며, 뒤 단계는 미리보기만 하고 지금 실행시키지 않습니다. 완료 후 보낼 정확한 문구를 제시하고 채팅으로 비밀값을 요청하지 않습니다. -->

<!-- Read product sources before proposing a product change. -->
<!-- 제품 변경을 제안하기 전에 제품 기준 문서를 읽습니다. -->
Read `docs/기획서.md`, `docs/weather-service/PRD.md`, and `docs/REVIEW_CHECKLIST.md`.
<!-- `docs/기획서.md`, `docs/weather-service/PRD.md`, `docs/REVIEW_CHECKLIST.md`를 읽습니다. -->

<!-- Explain code in simple English, then add a Korean translation. -->
<!-- 코드는 쉬운 영어로 설명하고 한글 번역을 덧붙입니다. -->
Use a feature branch and ask before pushing or opening a Pull Request.
<!-- feature 브랜치를 사용하고 push나 Pull Request 전에 허가를 요청합니다. -->

<!-- A Pull Request needs a three-line summary and the shared checks. -->
<!-- Pull Request에는 세 줄 요약과 공통 확인 사항이 필요합니다. -->
Before asking to push, include source disclosure, local verification, and approval status.
<!-- push 허가를 요청하기 전에 출처 공개, 로컬 검증, 승인 상태를 포함합니다. -->
Under `Checks / 확인 사항`, separately check explicit data-source citation and license labeling using the evidence and unchecked/Not applicable rules in `AGENTS.md`.
<!-- `Checks / 확인 사항`에서 자료 출처 명시·라이선스 표기를 각각 확인하고 근거·미체크·해당 없음 처리는 `AGENTS.md`를 따릅니다. -->

<!-- Show the complete Pull Request draft before creating it. -->
<!-- Pull Request를 만들기 전에 전체 초안을 보여줍니다. -->
Show the complete proposed title and body to Curtain (the actual user), then create the Pull Request only after that user's approval.
<!-- 제안할 제목과 본문 전체를 커튼 뒤(실제 사용자)에게 보여주고, 해당 사용자의 승인을 받은 뒤에만 Pull Request를 생성합니다. -->

<!-- Reapproval is required when the Pull Request draft changes. -->
<!-- Pull Request 초안이 바뀌면 재승인이 필요합니다. -->
If the approved title or body changes, show the complete revised content and request approval again before creating or updating the Pull Request.
<!-- 승인된 제목이나 본문이 바뀌면 만들거나 수정하기 전에 수정된 전체 내용을 다시 보여주고 재승인을 요청합니다. -->

<!-- Wait for Curtain's merge confirmation before branch cleanup. -->
<!-- 브랜치 정리 전에는 커튼 뒤의 merge 확인을 기다립니다. -->
After the `merge confirmed` message, clean the old branch and create a new task branch.
<!-- `merge confirmed` 메시지 후 이전 브랜치를 정리하고 새 작업 브랜치를 만듭니다. -->
