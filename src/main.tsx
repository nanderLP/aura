import { domAnimation, LazyMotion } from "framer-motion";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// <3 is the id of the body element
ReactDOM.createRoot(document.getElementById("💜")!).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation}>
      <App />
    </LazyMotion>
  </React.StrictMode>
);
