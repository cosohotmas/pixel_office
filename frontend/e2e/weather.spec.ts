// Verify real browser rendering through Vite's proxy and FastAPI.
// Vite 프록시와 FastAPI를 통과한 실제 브라우저 렌더링을 검증합니다.
import { test, expect } from "@playwright/test";

test("loads regional examples, selected weather, and unavailable data", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "날씨 예시 보기" })).toBeVisible();
  const overview = page.getByRole("region", { name: "전국 대표 지역 예시" });
  await expect(overview).toContainText("18°C");
  // Inspect all initial results before opening a detailed weather card.
  // 상세 날씨 카드를 열기 전에 최초 결과 전체를 검사합니다.
  const rows = overview.getByRole("listitem");
  await expect(rows).toHaveCount(6);
  for (const row of await rows.all()) {
    await expect(row).toContainText("출처: 자체 제작 Mock");
    await expect(row).toContainText("예시 기준 시각:");
    await expect(row.locator("time")).toHaveAttribute("datetime", "2026-01-01T00:00:00Z");
    await expect(row.locator("time")).toBeVisible();
  }
  await overview.getByRole("button", { name: "서울", exact: true }).click();
  const result = page.getByRole("region", { name: "선택 지역 결과" });
  await expect(result.getByRole("heading", { name: "서울" })).toBeVisible();
  await expect(result).toContainText("자체 제작 Mock");
  await expect(result).toContainText("2026-01-01");
  await page.getByLabel("지역 직접 입력").fill("없는지역");
  await page.getByRole("button", { name: "날씨 조회", exact: true }).click();
  await expect(result).toContainText("예시 데이터가 없습니다");
  await expect(result.getByRole("heading")).toHaveCount(0);
});

// Reload the actual page and verify that only an explicit selection resumes a flow.
// 실제 페이지를 새로고침하고 명시적인 지역 선택만 흐름을 재개하는지 검사합니다.
test("preserves retry waits across reload without automatic individual requests", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/weather?area=*", async route => {
    if (new URL(route.request().url()).searchParams.get("area") !== "재시도") return route.continue();
    calls++;
    await route.fulfill({ status: 429, headers: { "Retry-After": "30" }, body: "{}" });
  });
  await page.goto("/");
  await page.getByLabel("지역 직접 입력").fill("재시도");
  await page.getByRole("button", { name: "날씨 조회", exact: true }).click();
  const result = page.getByRole("region", { name: "선택 지역 결과" });
  await expect(result.getByRole("button", { name: "같은 지역으로 다시 조회", exact: true })).toBeDisabled();
  await expect.poll(() => calls).toBe(1);
  await page.reload();
  await expect(page.getByLabel("지역 직접 입력")).toHaveValue("");
  await expect(result.getByRole("button", { name: "같은 지역으로 다시 조회", exact: true })).toHaveCount(0);
  await page.getByLabel("지역 직접 입력").fill("재시도");
  await page.getByRole("button", { name: "날씨 조회", exact: true }).click();
  await expect(result.getByRole("button", { name: "같은 지역으로 다시 조회", exact: true })).toBeDisabled();
  expect(calls).toBe(1);
});

// Change only the wall clock; the page coordinator must keep its original epoch.
// 벽시계만 바꾸며 화면 조정자는 원래 시각 기준을 유지해야 합니다.
for (const jump of [3600000, -3600000]) {
  test(`keeps a 30-second restriction after wall-clock jump ${jump}`, async ({ page }) => {
    await page.route("**/api/weather?area=*", async route => {
      if (new URL(route.request().url()).searchParams.get("area") !== "시계검증") return route.continue();
      await route.fulfill({status:429,headers:{"Retry-After":"30"},body:"{}"});
    });
    await page.goto("/");
    await expect(page.getByRole("heading", {name:"날씨 예시 보기"})).toBeVisible();
    await page.evaluate(delta => { const wall = Date.now; Date.now = () => wall()+delta; }, jump);
    await page.getByLabel("지역 직접 입력").fill("시계검증");
    await page.getByRole("button", {name:"날씨 조회",exact:true}).click();
    const result=page.getByRole("region", {name:"선택 지역 결과"});
    await expect(result).toContainText("다시 시도까지 30초");
    await expect(result.getByRole("button", {name:"같은 지역으로 다시 조회",exact:true})).toBeDisabled();
    expect(await page.evaluate(() => {
      const row=JSON.parse(sessionStorage.getItem("weather.retry.v1")!).restrictions[0];
      return row.blockedUntil-row.receivedAt;
    })).toBe(30000);
  });
}

// Inject a broken body stream while preserving all other real browser requests.
// 나머지 실제 브라우저 요청을 유지하며 끊긴 본문 스트림만 주입합니다.
test("allows manual recovery after a body-stream interruption", async ({page})=>{
  await page.addInitScript(()=>{
    const original=window.fetch.bind(window);let first=true;
    window.fetch=async(input,init)=>{
      const url=new URL(input instanceof Request ? input.url : String(input),location.href);
      if(url.searchParams.get("area")!=="통신중단")return original(input,init);
      if(first){first=false;return new Response(new ReadableStream({start(c){c.error(new TypeError("terminated"));}}));}
      return new Response(JSON.stringify({area:"통신중단",source:"mock",status:"no_data",condition:null,temperature:null,precipitation_probability:null,observed_at:null,message:"none"}));
    };
  });
  await page.goto("/");
  await page.getByLabel("지역 직접 입력").fill("통신중단");
  await page.getByRole("button", {name:"날씨 조회",exact:true}).click();
  const result=page.getByRole("region", {name:"선택 지역 결과"});
  const retry=result.getByRole("button", {name:"같은 지역으로 다시 조회",exact:true});
  await expect(retry).toBeDisabled();
  await expect(retry).toBeEnabled({timeout:7000});
  await expect(result).toContainText("네트워크 문제로 날씨를 불러오지 못했습니다.");
  await retry.click();
  await expect(result).toContainText("예시 데이터가 없습니다");
  await expect(retry).toHaveCount(0);
});

// Exercise native input limiting separately from the shared submission validator.
// 기본 입력 제한과 공유 제출 검증을 구분하여 실제 브라우저에서 확인합니다.
test("enforces N80 and sends only canonical text after explicit submission",async({page})=>{
  const names:string[]=[];
  page.on("request",request=>{
    const area=new URL(request.url()).searchParams.get("area");
    if(area?.startsWith("가"))names.push(area);
  });
  await page.goto("/");
  const input=page.getByLabel("지역 직접 입력");
  await expect(input).toHaveAttribute("maxlength","80");
  const helpId=await input.getAttribute("aria-describedby");
  expect(helpId).toBeTruthy();
  expect(await page.evaluate(id=>document.getElementById(id!)?.textContent,helpId)).toContain("앞뒤 공백은 제거");
  const submit=page.getByRole("button",{name:"날씨 조회",exact:true});
  await input.fill("가".repeat(65));
  await submit.click();
  await expect(page.getByRole("alert")).toContainText("최대 64단위");
  await expect(input).toHaveValue("가".repeat(65));
  expect(names).toEqual([]);
  const canonical="가".repeat(64),raw=" ".repeat(16)+canonical;
  await input.fill(raw);
  expect(names).toEqual([]);
  await submit.click();
  await expect(page.getByRole("region",{name:"선택 지역 결과"})).toContainText("예시 데이터가 없습니다");
  expect(names).toEqual([canonical]);
  await expect(input).toHaveValue(raw);
  await expect(page.getByRole("alert")).toHaveCount(0);
  // Browser text insertion and key events enforce maxLength without app slicing.
  // 앱의 임의 절단 없이 브라우저 텍스트 삽입·키 이벤트가 maxLength를 적용합니다.
  await input.fill("");
  await page.keyboard.insertText("x".repeat(81));
  await expect(input).toHaveValue("x".repeat(80));
  await input.fill("");
  await input.pressSequentially("x".repeat(81));
  await expect(input).toHaveValue("x".repeat(80));
  expect(names).toEqual([canonical]);
});
