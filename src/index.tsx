import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NowakSWebsite } from "./screens/NowakSWebsite/NowakSWebsite";
import "./index.css";

function mount() {
  const appElement = document.getElementById("app");
  if (!appElement) {
    console.error("Index.tsx: #app not found");
    return false;
  }
  const root = createRoot(appElement);
  root.render(
    <StrictMode>
      <NowakSWebsite />
    </StrictMode>
  );
  return true;
}

if (!mount()) {
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", () => {
      mount();
    });
  } else {
    mount();
  }
}
