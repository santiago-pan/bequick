import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SocketProvider from "../context/SocketProvider";
import App from "./App";

function renderApp() {
  return render(
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}></Route>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

test("renders start screen", async () => {
  renderApp();

  const titleElement = await screen.findByText(/BeQuick/i);
  expect(titleElement).toBeInTheDocument();
});

test("clicks start screen button", async () => {
  renderApp();

  const buttonStart = await screen.findByTestId("create-game-button");
  expect(buttonStart).toBeInTheDocument();

  userEvent.click(buttonStart);

  const playersElement = await screen.findByTestId("num-players-input");
  const roundsElement = await screen.findByTestId("num-rounds-input");

  expect(playersElement).toBeInTheDocument();
  expect(roundsElement).toBeInTheDocument();
});
