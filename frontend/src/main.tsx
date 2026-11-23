// Start React inside the HTML root, then render the App.
// HTML 루트에서 React를 시작한 뒤 App을 표시합니다.
import { createRoot } from "react-dom/client";
import { App } from "./app/App";

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");
createRoot(root).render(<App />);
