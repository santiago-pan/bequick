import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
