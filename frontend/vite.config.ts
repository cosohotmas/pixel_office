// Configure JSX, local API forwarding, and browser-like component tests.
// JSX·로컬 API 전달·브라우저와 유사한 컴포넌트 테스트를 설정합니다.
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    // Keep requests on one browser origin during local development.
    // 로컬 개발 중 브라우저 요청을 같은 출처로 유지합니다.
    proxy: { "/api": "http://127.0.0.1:8000" },
  },
  test: { environment: "jsdom", restoreMocks: true, include: ["src/**/*.test.{ts,tsx}"] },
});
