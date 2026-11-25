# Cline Instructions

<!-- Use one shared source of truth for repository rules. -->
<!-- 저장소 규칙은 하나의 기준 문서로 관리합니다. -->
Read [`AGENTS.md`](./AGENTS.md) before editing files.
<!-- 파일을 수정하기 전에 [`AGENTS.md`](./AGENTS.md)를 읽습니다. -->

Report the rollout stage, evidence, current task state and next rollout action at task start, meaningful updates and final reporting, following `AGENTS.md` and `docs/office/workflow.md`.
<!-- 작업 시작·의미 있는 중간 진행·최종 보고에 `AGENTS.md`·`docs/office/workflow.md`에 따라 도입 단계·근거·현재 작업 상태·다음 도입 작업을 표시합니다. -->

Show the complete rollout, current task detail with its node highlighted, and target product architecture as Mermaid diagrams in every task-start, progress and final report, following `AGENTS.md`.
<!-- `AGENTS.md`에 따라 매 작업 시작·진행·최종 보고에 전체 도입 흐름, 현재 단계를 강조한 세부 흐름, 목표 제품 아키텍처 Mermaid를 표시합니다. -->
Render Mermaid in the chat window as an actual visible diagram, not only as a source-code block. When the chat cannot render it, disclose the limitation and show the source with a plain-language diagram summary.
<!-- Mermaid는 채팅창에서 소스 코드 블록만이 아니라 실제 보이는 다이어그램으로 표시합니다. 채팅창이 렌더링하지 못하면 그 한계를 밝히고 소스와 쉬운 말의 다이어그램 요약을 함께 보여줍니다. -->

In every task-start, progress, and final report, use the fixed three-column Markdown handoff table required by `AGENTS.md`: `순서`, `커튼 뒤가 할 일`, `제가 할 일`. Number steps in execution order, show each step's state, explain both owners' actions in beginner-friendly language, identify the verifier and evidence, and name the next actor after the table. Write `없음(이 단계에서는 불필요)` when an owner has no action. Ask Curtain only for user-side access, judgment, or authorization; continue all other authorized work yourself.
<!-- 모든 작업 시작·진행·최종 보고에서 `AGENTS.md`의 고정 3열 인계 표를 사용합니다: `순서`, `커튼 뒤가 할 일`, `제가 할 일`. 단계를 실행 순서로 번호 매기고 상태를 표시하며, 두 담당자의 할 일을 쉬운 말로 설명하고 확인자·근거를 적은 뒤 표 아래에 다음 실행자를 밝힙니다. 담당자의 할 일이 없으면 `없음(이 단계에서는 불필요)`이라고 씁니다. 사용자 접근·판단·승인만 커튼 뒤에게 요청하고 나머지 허가된 작업은 계속 수행합니다. -->

When guiding Curtain through a website or app, follow the beginner-friendly, one-stage-at-a-time guidance rule in `AGENTS.md`: link the official page, give numbered steps with visible control names, state cautions before action, preview later stages without asking the user to do them yet, and give an exact completion phrase. Never request secrets in chat.
<!-- 웹사이트·앱 작업을 안내할 때는 `AGENTS.md`의 초보자용 단계별 안내 규칙을 따릅니다. 공식 링크와 화면 버튼 이름이 있는 번호 절차를 주고 실행 전 주의점을 말하며, 뒤 단계는 미리보기만 하고 지금 실행시키지 않습니다. 완료 후 보낼 정확한 문구를 제시하고 채팅으로 비밀값을 요청하지 않습니다. -->

<!-- Follow product documents before changing requirements. -->
<!-- 요구사항을 바꾸기 전에 제품 문서를 확인합니다. -->
Read `docs/기획서.md` and `docs/weather-service/PRD.md` first.
<!-- 먼저 `docs/기획서.md`와 `docs/weather-service/PRD.md`를 읽습니다. -->

<!-- Teach execution order to beginners through source comments. -->
<!-- 초보자에게 실행 순서를 가르치는 방식으로 소스 주석을 작성합니다. -->
Write simple English comments and place the Korean translation after each comment.
<!-- 쉬운 영어 주석을 작성하고 각 주석 뒤에 한글 번역을 붙입니다. -->

<!-- Publishing is a separate approval step. -->
<!-- 외부에 올리는 작업은 별도의 허가 단계입니다. -->
Create a feature branch, then ask before pushing or opening a Pull Request.
<!-- feature 브랜치를 만든 뒤 push나 Pull Request 전에 허가를 요청합니다. -->

<!-- The Pull Request must explain what, how, and why in three lines. -->
<!-- Pull Request는 무엇을, 어떻게, 왜 바꿨는지 세 줄로 설명해야 합니다. -->
Confirm source disclosure, local verification, and approval status before publishing.
<!-- 공개하기 전에 출처 공개, 로컬 검증, 승인 상태를 확인합니다. -->
Under `Checks / 확인 사항`, separately check explicit data-source citation and license labeling using the evidence and unchecked/Not applicable rules in `AGENTS.md`.
<!-- `Checks / 확인 사항`에서 자료 출처 명시·라이선스 표기를 각각 확인하고 근거·미체크·해당 없음 처리는 `AGENTS.md`를 따릅니다. -->

<!-- Pull Request content needs approval before the Pull Request is created. -->
<!-- Pull Request 내용은 Pull Request 생성 전에 승인을 받아야 합니다. -->
Show the complete proposed title and body to Curtain (the actual user), and create the Pull Request only after approval.
<!-- 제안할 제목과 본문 전체를 커튼 뒤(실제 사용자)에게 보여주고 승인 후에만 Pull Request를 생성합니다. -->

<!-- Any change to approved Pull Request content requires another approval. -->
<!-- 승인된 Pull Request 내용이 바뀌면 다시 승인을 받아야 합니다. -->
Show the complete revised content and request approval again before creating or updating the Pull Request.
<!-- 수정된 전체 내용을 보여주고 Pull Request를 만들거나 수정하기 전에 재승인을 요청합니다. -->

<!-- Branch cleanup starts only after Curtain confirms the merge. -->
<!-- 브랜치 정리는 커튼 뒤가 merge를 확인한 뒤에만 시작합니다. -->
After `merge confirmed`, clean the old branch and create a new branch for the next task.
<!-- `merge confirmed` 후 이전 브랜치를 정리하고 다음 작업용 새 브랜치를 만듭니다. -->
