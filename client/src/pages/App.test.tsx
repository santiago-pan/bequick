import { render, screen } from "@testing-library/react";
import App from "./App";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

test("renders learn react link", () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
      </Routes>
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/Waiting for socket connection.../i);
  expect(linkElement).toBeInTheDocument();
});
