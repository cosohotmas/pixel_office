// Start both servers so browser tests exercise a real HTTP pipeline.
// 브라우저 테스트가 실제 HTTP 파이프라인을 검사하도록 두 서버를 시작합니다.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://127.0.0.1:5173" },
  webServer: [
    { command: "python -m uvicorn app.main:app --app-dir ../backend --host 127.0.0.1 --port 8000",
      url: "http://127.0.0.1:8000/docs", reuseExistingServer: false },
    { command: "npm run dev", url: "http://127.0.0.1:5173", reuseExistingServer: false },
  ],
});
