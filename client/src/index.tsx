import "normalize.css";
import React from "react";
import ReactDOM from "react-dom/client";
import SocketProvider from "./context/SocketProvider";
import "./index.css";
import AppRoutes from "./pages/AppRoutes";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <SocketProvider>
      <AppRoutes />
    </SocketProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
