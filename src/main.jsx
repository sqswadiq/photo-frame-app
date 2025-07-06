import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          marginTop:"10px",
          background: "#f9fafb", // Tailwind's gray-50
          color: "#111827", // Tailwind's gray-900
          border: "1px solid #e5e7eb", // Optional border (gray-200)
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // subtle shadow
        },
      }}
    />
  </React.StrictMode>
);
