import { domAnimation, LazyMotion } from "framer-motion";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { globalStyles } from "./styles/stitches.config";
// import "./styles/index.css";

const GlobalStyles = () => {
  globalStyles();
  return null;
};

// <3 is the id of the body element
ReactDOM.createRoot(document.getElementById("💜")!).render(
  <React.StrictMode>
    <GlobalStyles />
    <LazyMotion features={domAnimation}>
      <App />
    </LazyMotion>
  </React.StrictMode>
);
