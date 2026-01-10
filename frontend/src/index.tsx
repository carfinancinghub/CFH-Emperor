// @ai-generated (patched Wave-23)
// Entry point for the React application.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/components/App";
import "@/index.css";
import "@/i18n/i18n";
import { AuthProvider } from "@/contexts/AuthContext";

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root container with id="root" not found in index.html');
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
