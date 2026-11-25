# Agent Instructions

<!-- This file explains repository rules in plain English. -->
<!-- 이 파일은 저장소 규칙을 쉬운 영어로 설명합니다. -->

## Project Scope

<!-- This project plans a location-aware weather service. -->
<!-- 이 프로젝트는 위치 기반 날씨 서비스를 기획합니다. -->
- Treat `docs/기획서.md` as the short product brief.
  <!-- `docs/기획서.md`를 제품 기획 요약본으로 사용합니다. -->
- Treat `docs/weather-service/PRD.md` as the detailed requirements document.
  <!-- `docs/weather-service/PRD.md`를 상세 요구사항 문서로 사용합니다. -->

## Rollout Stage Reporting

<!-- Report the office rollout stage separately from an individual feature's progress. -->
<!-- 사무실 도입 단계와 개별 기능의 작업 진행을 구분하여 보고합니다. -->
- At every task start, meaningful progress update, and final report, state the current rollout stage from `docs/office/workflow.md`.
  <!-- 매 작업 시작·의미 있는 중간 진행·최종 보고에 `docs/office/workflow.md`의 현재 도입 단계를 표시합니다. -->
- Include the rollout stage, supporting evidence or unverified status, the current task state, and the next rollout action.
  <!-- 도입 단계·근거 또는 미검증 상태·현재 작업 상태·다음 도입 작업을 포함합니다. -->
- Use `Preparation — before stage 1` when the first integration has not started; identify started-but-unverified work separately from completed work.
  <!-- 첫 연동 착수 전에는 `준비 — 1단계 착수 전`으로 표시하고 착수/미검증과 완료를 구분합니다. -->
- Do not advance rollout stages because a feature, meeting, document, test, commit, or PR is complete. Mark a stage complete only with evidence that its integration works end to end.
  <!-- 기능·회의·문서·테스트·커밋·PR 완료만으로 도입 단계를 올리지 않으며 해당 연동이 끝까지 작동한 근거가 있을 때만 완료로 표시합니다. -->
- If the stage is unchanged, report it as unchanged. Local source inspection does not establish external Slack/Supabase service configuration.
  <!-- 단계가 그대로면 그대로 보고하며 로컬 소스 확인을 외부 Slack/Supabase 설정 확인으로 주장하지 않습니다. -->
- Use the reporting format in `docs/office/workflow.md`; reporting the next action does not authorize executing or publishing it.
  <!-- 보고 형식은 `docs/office/workflow.md`를 따르며 다음 작업 보고가 실행·공개 승인은 아닙니다. -->
- In every task-start, progress, and final report, show three Mermaid diagrams: the complete office rollout, the current task's detailed steps with the current node highlighted, and the target product architecture. Keep evidence and completion status accurate in each diagram.
  <!-- 모든 작업 시작·진행·최종 보고에 전체 사무실 도입 흐름, 현재 세부 단계를 강조한 작업 흐름, 목표 제품 아키텍처 Mermaid를 표시합니다. 다이어그램마다 근거와 완료 상태를 정확히 반영합니다. -->
- In the chat window, render Mermaid as a visible diagram rather than presenting only the Mermaid source code. If the chat cannot render Mermaid, state that limitation and provide the source together with a plain-language diagram summary; never describe a code block alone as a displayed diagram.
  <!-- 채팅창에서는 Mermaid 소스 코드만 보여주지 말고 보이는 다이어그램으로 렌더링합니다. 채팅창이 Mermaid를 렌더링하지 못하면 그 한계를 밝히고 소스와 쉬운 말의 다이어그램 설명을 함께 제공하며, 코드 블록만 표시한 것을 다이어그램 표시로 설명하지 않습니다. -->

## Numbered Work Handoffs

- In every task-start, progress, and final report, use a Markdown table with exactly these columns: `순서`, `커튼 뒤가 할 일`, and `제가 할 일`. Put each step in execution order and mark its state in `순서` (for example, `1. 완료`, `2. 현재`, `3. 대기`). Use plain language a beginner can follow. In both responsibility columns, state the exact action or write `없음(이 단계에서는 불필요)`; include who checks the result and what evidence the check provides. Name the next actor after the table. Ask Curtain to do or approve only steps requiring the user's access, judgment, or authorization; continue all other authorized work yourself. Do not treat a report or check as approval to publish or change external systems.
  <!-- 모든 작업 시작·진행·최종 보고에서 다음 세 열만 있는 Markdown 표를 사용합니다: `순서`, `커튼 뒤가 할 일`, `제가 할 일`. 각 단계를 실행 순서로 쓰고 `순서`에 상태를 표시합니다(예: `1. 완료`, `2. 현재`, `3. 대기`). 초보자도 이해할 쉬운 말을 씁니다. 두 담당 칸 모두 정확한 할 일을 적고, 할 일이 없으면 `없음(이 단계에서는 불필요)`이라고 씁니다. 결과 확인자와 확인 근거도 포함합니다. 표 아래에 다음 실행자를 밝힙니다. 사용자 권한·판단·승인이 필요한 단계만 커튼 뒤에게 요청하고, 이미 허가된 나머지는 어시스턴트가 계속합니다. 보고나 확인을 외부 공개·시스템 변경 승인으로 취급하지 않습니다. -->

## Beginner-Friendly User Guidance

- When Curtain must use a website or app, guide one current stage at a time: state the goal, link the official page, give simple numbered click/type steps using visible button names, and explain any cost, privacy, permission, or security caution before the action.
- Show later stages as a brief preview marked `다음 진행 예정`; do not ask Curtain to do those later steps yet. End with the exact phrase Curtain can send when finished and ask for a screenshot with secrets and personal details hidden if the screen differs.
- Never ask Curtain to share passwords, one-time codes, API keys, tokens, or recovery codes in chat. Do not claim an account, permission, or setup is complete until its result is observed.
  <!-- 커튼 뒤가 웹사이트나 앱에서 직접 작업해야 하면 현재 단계 하나씩 안내합니다. 목표를 말하고 공식 페이지 링크를 제공한 뒤, 화면에 보이는 버튼 이름으로 쉬운 번호 절차를 씁니다. 실행 전에 비용·개인정보·권한·보안 주의점을 설명합니다. -->
  <!-- 뒤 단계는 `다음 진행 예정`으로 짧게 미리 보여주되 지금 실행하라고 하지 않습니다. 마지막에는 완료 후 보낼 정확한 문구를 제시하고, 화면이 다르면 비밀값·개인정보를 가린 캡처를 요청합니다. -->
  <!-- 비밀번호·일회용 코드·API 키·토큰·복구 코드를 채팅으로 보내 달라고 하지 않습니다. 실제 결과를 관찰하기 전에는 계정·권한·설정이 완료됐다고 말하지 않습니다. -->

## Documentation Rules

<!-- Put each decision in the document that owns that topic. -->
<!-- 각 결정은 해당 주제를 담당하는 문서에 기록합니다. -->
- Put product decisions in `docs/기획서.md`.
  <!-- 제품 결정은 `docs/기획서.md`에 기록합니다. -->
- Update related journey, emotion, and Why·What·How documents when a decision changes.
  <!-- 결정이 바뀌면 관련 여정·감정·Why·What·How 문서도 갱신합니다. -->
- Mark unknown API, privacy, and platform behavior as open decisions.
  <!-- 모르는 API·개인정보·플랫폼 동작은 미결정 사항으로 표시합니다. -->

## Source Comments

<!-- Explain source code in execution order so a beginner can follow it. -->
<!-- 초보자도 따라올 수 있도록 소스를 실행 순서대로 설명합니다. -->
- Write source comments in simple English.
  <!-- 소스 주석은 쉬운 영어로 작성합니다. -->
- Add a Korean translation immediately after each explanatory comment.
  <!-- 설명 주석 바로 뒤에 한글 번역을 추가합니다. -->
- Explain what starts first, what runs next, and what each step changes.
  <!-- 무엇이 먼저 시작되고 다음에 무엇이 실행되며 각 단계가 무엇을 바꾸는지 설명합니다. -->

## Git Rules

<!-- Keep changes reviewable and never publish without permission. -->
<!-- 변경을 검토 가능하게 유지하고 허가 없이 공개하지 않습니다. -->
- Create a feature branch before editing.
  <!-- 수정하기 전에 feature 브랜치를 만듭니다. -->
- Ask for permission before pushing a branch or opening a Pull Request.
  <!-- 브랜치 push나 Pull Request 생성 전에 허가를 요청합니다. -->
- Never commit directly to `main`.
  <!-- `main`에 직접 커밋하지 않습니다. -->
- Never commit API keys, tokens, location data, or `.env` files.
  <!-- API 키·토큰·위치 데이터·`.env` 파일을 커밋하지 않습니다. -->

## Pull Request Rules

Curtain is the actual user receiving the report, not a separate approver or simulated speaker.
<!-- 커튼 뒤는 보고를 받는 실제 사용자이며 별도 승인자나 대신 발언시키는 역할이 아닙니다. -->

<!-- Every Pull Request must explain the change in three short lines: what, how, and why. -->
<!-- 모든 Pull Request는 무엇을, 어떻게, 왜 바꿨는지 세 줄로 설명해야 합니다. -->
- Summarize what changed, how it changed, and why it changed in three lines.
  <!-- 무엇을 바꿨는지, 어떻게 바꿨는지, 왜 바꿨는지를 세 줄로 요약합니다. -->
- State whether sources were checked and disclosed.
  <!-- 출처를 확인하고 공개했는지 표시합니다. -->
- Under `Checks / 확인 사항`, separately confirm that data sources are explicitly cited and licenses are stated; include source links, license names/links, and required attribution or a repository-relative record link.
  <!-- `Checks / 확인 사항`에서 자료 출처 명시와 라이선스 표기 여부를 각각 확인하고 출처 링크·라이선스 이름/링크·필수 출처 표시 또는 저장소 내 기록 링크를 포함합니다. -->
- Leave unverified items unchecked and explain why; if no external material is used, state `Not applicable` with the reason instead of claiming a verified license.
  <!-- 미확인 항목은 체크하지 않고 이유를 적으며 외부 자료를 사용하지 않으면 라이선스 확인 완료로 주장하지 말고 `해당 없음`과 근거를 적습니다. -->
- State whether the change was implemented and checked locally.
  <!-- 로컬에서 구현하고 확인했는지 표시합니다. -->
- State whether the change received an approval.
  <!-- 변경이 승인을 받았는지 표시합니다. -->
- Before creating a Pull Request, show the complete proposed title and body to Curtain (the actual user).
  <!-- Pull Request를 만들기 전에 제안할 제목과 본문 전체를 커튼 뒤(실제 사용자)에게 보여줍니다. -->
- Create the Pull Request only after Curtain (the actual user) approves the shown content.
  <!-- 커튼 뒤(실제 사용자)가 제시된 내용을 승인한 뒤에만 Pull Request를 생성합니다. -->
- If the approved content changes, show the complete revised content and request approval again before creating or updating the Pull Request.
  <!-- 승인된 내용이 바뀌면 Pull Request를 만들거나 수정하기 전에 수정된 전체 내용을 다시 보여주고 재승인을 받습니다. -->

### Pull Request Template

<!-- Use this small checklist in every Pull Request description. -->
<!-- 모든 Pull Request 설명에 이 간단한 체크리스트를 사용합니다. -->

```text
What: 무엇을 수정했는가?
How: 어떻게 수정했는가?
Why: 왜 수정했는가?
Sources checked and disclosed: Yes / No
Implemented and checked locally: Yes / No
Approved: Yes / No

## Checks / 확인 사항

- [ ] Data sources explicitly cited: source names and links or a repository record.
      자료 출처 명시: 출처 이름·링크 또는 저장소 내 기록.
- [ ] Licenses stated: license names, links and required attribution or a repository record.
      라이선스 표기: 라이선스 이름·링크·필수 출처 표시 또는 저장소 내 기록.
```

## Curtain Workflow

<!-- Curtain confirms a merge before branch cleanup starts. -->
<!-- 커튼 뒤는 merge를 확인한 뒤 브랜치 정리를 시작합니다. -->
- Do not delete or reuse a feature branch until Curtain sends a `merge confirmed` message.
  <!-- 커튼 뒤가 `merge confirmed` 메시지를 보내기 전에는 feature 브랜치를 삭제하거나 재사용하지 않습니다. -->
- After `merge confirmed`, clean up the merged branch and create a new branch for the next task.
  <!-- `merge confirmed` 후 병합된 브랜치를 정리하고 다음 작업용 새 브랜치를 만듭니다. -->
- Never treat an open Pull Request as merged.
  <!-- 열린 Pull Request를 merge된 것으로 간주하지 않습니다. -->

## Review

<!-- Use the checklist before requesting review. -->
<!-- 리뷰를 요청하기 전에 체크리스트를 사용합니다. -->
- Check `docs/REVIEW_CHECKLIST.md` before asking for Pull Request review.
  <!-- Pull Request 리뷰를 요청하기 전에 `docs/REVIEW_CHECKLIST.md`를 확인합니다. -->

## Change Documentation

<!-- Every file creation, edit, or deletion must explain its purpose and behavior. -->
<!-- 모든 파일 생성·수정·삭제는 목적과 작동 방식을 설명해야 합니다. -->
- Before changing a file, state why the file is needed and what role it has.
  <!-- 파일을 바꾸기 전에 왜 필요한 파일인지와 어떤 역할을 하는지 설명합니다. -->
- After changing a file, state how the file works and how the change was checked.
  <!-- 파일을 바꾼 뒤 어떻게 작동하는지와 어떻게 확인했는지 설명합니다. -->
- For a new file, explain what starts first, what runs next, and what output it creates.
  <!-- 새 파일은 무엇이 먼저 시작되고, 다음에 무엇이 실행되며, 어떤 결과를 만드는지 설명합니다. -->
- For an edited file, explain the old behavior, the new behavior, and the reason for the change.
  <!-- 수정 파일은 이전 동작, 새 동작, 수정 이유를 설명합니다. -->
- For a deleted file, explain what replaced it and why deletion is safe.
  <!-- 삭제 파일은 무엇으로 대체했는지와 왜 삭제해도 안전한지 설명합니다. -->
- Use [`docs/office/change-report.md`](./docs/office/change-report.md) for the report format.
  <!-- 보고서 형식은 [`docs/office/change-report.md`](./docs/office/change-report.md)를 사용합니다. -->

## Workspace and Skills

<!-- Check the workspace root before making a project-level decision. -->
<!-- 프로젝트 단위 결정을 하기 전에 워크스페이스 루트를 확인합니다. -->
- Read the workspace root `AGENTS.md` and inspect the workspace root when the task crosses project boundaries.
  <!-- 작업이 여러 프로젝트에 걸치면 워크스페이스 루트의 `AGENTS.md`를 읽고 워크스페이스 루트를 확인합니다. -->
- Read the target project's `AGENTS.md`, `README.md`, and relevant specs before changing shared behavior.
  <!-- 공유 동작을 바꾸기 전에 대상 프로젝트의 `AGENTS.md`, `README.md`, 관련 Spec을 읽습니다. -->
- Check the workspace `.agents/skills/` directory and the available skill registry before choosing a skill.
  <!-- 스킬을 선택하기 전에 워크스페이스의 `.agents/skills/` 디렉터리와 사용 가능한 스킬 레지스트리를 확인합니다. -->
- Use every relevant skill available for the task; do not install or invoke unrelated skills.
  <!-- 작업에 관련된 모든 사용 가능한 스킬을 활용하고, 관련 없는 스킬은 설치하거나 실행하지 않습니다. -->
- Record which skill was used and what it changed in the change report.
  <!-- 어떤 스킬을 사용했고 무엇이 바뀌었는지 변경 보고서에 기록합니다. -->

## Meeting Records

<!-- Keep one Markdown record for every formal meeting. -->
<!-- 모든 공식 회의를 하나의 Markdown 회의록으로 기록합니다. -->
- Store each meeting record under `docs/office/meetings/`.
  <!-- 각 회의록은 `docs/office/meetings/` 아래에 저장합니다. -->
- Write meeting-record prose in simple English and place its Korean translation immediately after it, following the source-comment language rule. Apply this to summaries, role opinions, facts, decisions, open questions, next actions, and verification notes; keep technical identifiers and links unchanged.
  <!-- 회의록 본문은 쉬운 영어로 작성하고 소스 주석 언어 규칙처럼 바로 뒤에 한국어 번역을 둡니다. 요약·역할별 의견·사실·결정·미결정 질문·다음 작업·검증 기록에 적용하며 기술 식별자와 링크는 그대로 둡니다. -->
- Use the meeting date and topic in the filename.
  <!-- 파일명에는 회의 날짜와 주제를 사용합니다. -->
- Record participants, agenda, role-based opinions, facts, assumptions, decisions, unresolved questions, and next actions.
  <!-- 참석 역할·의제·역할별 의견·사실·가정·결정·미결정 질문·다음 작업을 기록합니다. -->
- For every role in a meeting, record all six fields explicitly in a table: Who, What, Why, How, Goal, and Conviction (소신). Do not replace the per-role fields with a short summary paragraph. Label facts, assumptions, proposals, and questions; the assistant must not invent Curtain's view or decision.
  <!-- 회의의 모든 역할은 Who·What·Why·How·Goal·소신 여섯 항목을 표에 빠짐없이 기록합니다. 역할별 항목을 짧은 요약 문단으로 대체하지 않습니다. 사실·가정·제안·질문을 구분하며 커튼 뒤의 의견이나 결정을 만들어내지 않습니다. -->
- Add a Mermaid diagram when the meeting contains a workflow, decision flow, system relationship, or data flow.
  <!-- 회의에 업무 흐름·의사결정 흐름·시스템 관계·데이터 흐름이 있으면 Mermaid 다이어그램을 추가합니다. -->
- Do not treat discussion as a final decision until the meeting record is approved and linked from the owning document.
  <!-- 회의록이 승인되고 담당 문서에서 연결되기 전에는 토론을 최종 결정으로 취급하지 않습니다. -->
