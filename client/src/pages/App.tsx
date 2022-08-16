import { Box, Container } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";
import { SocketContext } from "../context/SocketProvider";
import { assertNever } from "../tools/tools";
import {
  ClientAction,
  ClientEvent,
  MSG_TYPE,
  ServerAction,
  ServerEvent,
} from "../types";

import "./App.css";
import {
  ClickerPosition,
  DEFAULT_NUM_PLAYERS,
  DEFAULT_NUM_ROUNDS,
  GameScreen,
  PlayersCount,
} from "./AppTypes";
import Game from "./screens/Game";
import { JoinGame, JoinGameWait } from "./screens/JoinGame";
import NewGameCreate from "./screens/NewGameCreate";
import NewGameShare from "./screens/NewGameShare";
import StartScreen from "./screens/StartScreen";

function createGame(
  socket: Socket,
  numPlayers: string = DEFAULT_NUM_PLAYERS,
  numRounds: string = DEFAULT_NUM_ROUNDS
) {
  const action: ClientEvent = {
    action: ClientAction.NewGame,
    payload: {
      numPlayers: parseInt(numPlayers),
      numRounds: parseInt(numRounds),
      playerId: socket.id,
    },
  };
  socket.emit(socket.id, action);
}

function joinGame(socket: Socket, gameId: string | null) {
  if (!gameId) {
    alert("No game id provided");
    return;
  }

  const action: ClientEvent = {
    action: ClientAction.JoinGame,
    payload: {
      gameId,
    },
  };
  socket.emit(socket.id, action);
}

function startGame(socket: Socket, gameId: string) {
  const action: ClientEvent = {
    action: ClientAction.GameStart,
    payload: {
      gameId,
    },
  };
  socket.emit(socket.id, action);
}

function App() {
  const queryGameId = useQuery().get("id");
  const [gameId, setGameId] = useState<string | null>(queryGameId);
  const [clicker, setClicker] = useState<ClickerPosition | null>(null);
  const [gameIsOver, setGameIsOver] = useState<boolean>(false);
  const [wins, setWins] = useState<number>(0);
  const [playersCount, setPlayersCount] = useState<PlayersCount | null>(null);

  const { socket } = useContext(SocketContext);

  const [gameScreen, setGameScreen] = useState<GameScreen | null>(null);

  // Socket messages
  useEffect(() => {
    if (socket) {
      socket.on(MSG_TYPE.EMIT_ALL, (arg: ServerEvent) => {
        if (arg.action === ServerAction.GameIsOver) {
          setGameIsOver(true);
        }
        if (arg.action === ServerAction.PlayersIn) {
          console.log("player in: ", arg);

          setPlayersCount({
            totalPlayers: arg.payload.totalPlayers,
            playersIn: arg.payload.playersIn,
          });
        }
        if (arg.action === ServerAction.GameStartAck) {
          setGameScreen({
            screen: "game",
            socket,
            gameId: arg.payload.gameId,
            playerId: socket.id,
            gameIsOver: false,
            wins: 0,
            clicker: {
              x: arg.payload.x,
              y: arg.payload.y,
            },
          });
        }
        if (arg.action === ServerAction.NewClicker) {
          setClicker(arg.payload);
        }
      });
      socket.on(MSG_TYPE.EMIT_ONE, (arg: ServerEvent) => {
        if (arg.action === ServerAction.NewGameAck) {
          setGameId(arg.payload.gameId);
        }
        if (arg.action === ServerAction.RoundWinner) {
          setWins((w) => w + 1);
        }
        if (arg.action === ServerAction.JoinGameAck) {
          setGameScreen({
            screen: "join_game_wait",
            gameId: arg.payload.gameId,
            playerId: socket.id,
            playersCount: {
              totalPlayers: arg.payload.totalPlayers,
              playersIn: arg.payload.playersIn,
            },
          });
        }
      });
    }
  }, [socket]);

  // Screen changes
  useEffect(() => {
    if (!socket) {
      return;
    }
    if (gameId === null && gameScreen === null) {
      setGameScreen({
        screen: "start_screen",
        newGame: () => {
          if (socket) {
            setGameScreen({
              screen: "new_game_create",
              socket,
              createGame,
            });
          }
        },
      });
    }
    if (gameId && gameScreen && gameScreen.screen === "new_game_create") {
      setGameScreen({
        screen: "new_game_share",
        gameId,
        playerId: socket.id,
        playersCount,
        socket,
        startGame,
      });
    }
    // Update players in / total players counter
    if (
      gameId &&
      gameScreen &&
      gameScreen.screen === "new_game_share" &&
      playersCount
    ) {
      if (
        gameScreen.playersCount?.playersIn !== playersCount.playersIn ||
        gameScreen.playersCount?.totalPlayers !== playersCount.totalPlayers
      ) {
        setGameScreen({
          screen: "new_game_share",
          gameId,
          playerId: socket.id,
          playersCount,
          socket,
          startGame,
        });
      }
    }
    if (gameId && gameScreen === null) {
      setGameScreen({
        screen: "join_game",
        gameId,
        socket,
        joinGame,
      });
    }
    if (
      gameId &&
      gameScreen &&
      gameScreen.screen === "join_game_wait" &&
      playersCount
    ) {
      if (
        gameScreen.playersCount?.playersIn !== playersCount.playersIn ||
        gameScreen.playersCount?.totalPlayers !== playersCount.totalPlayers
      ) {
        setGameScreen({
          screen: "join_game_wait",
          gameId,
          playerId: socket.id,
          playersCount,
        });
      }
    }
    if (gameId && gameScreen && gameScreen.screen === "start_screen") {
      setGameScreen({
        screen: "new_game_create",
        socket,
        createGame,
      });
    }
    if (gameId && gameScreen && gameScreen.screen === "game" && clicker) {
      if (
        gameScreen.clicker.x !== clicker.x ||
        gameScreen.clicker.y !== clicker.y ||
        gameScreen.wins !== wins ||
        gameScreen.gameIsOver !== gameIsOver
      ) {
        setGameScreen({
          screen: "game",
          socket,
          gameId,
          playerId: socket.id,
          gameIsOver,
          wins,
          clicker,
        });
      }
    }
  }, [gameId, gameScreen, socket, playersCount, clicker, wins, gameIsOver]);

  if (!socket) {
    return <div>Waiting for socket connection...</div>;
  }

  const screen = gameScreen && ScreenSelector(gameScreen);

  if (!screen) {
    return <></>;
  }

  if (gameScreen.screen === "game") {
    return screen;
  }

  return <>{AppContainer(screen)}</>;
}

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function ScreenSelector(gameScreen: GameScreen) {
  switch (gameScreen.screen) {
    case "start_screen":
      return <StartScreen {...gameScreen} />;
    case "new_game_create":
      return <NewGameCreate {...gameScreen} />;
    case "new_game_share":
      return <NewGameShare {...gameScreen} />;
    case "join_game":
      return <JoinGame {...gameScreen} />;
    case "join_game_wait":
      return <JoinGameWait {...gameScreen} />;
    case "game":
      return <Game {...gameScreen} />;
    default:
      assertNever(gameScreen);
  }
}

function AppContainer(screen: JSX.Element) {
  return (
    <Container
      sx={{
        height: "100vh",
        textAlign: "center",
        paddingTop: 0,
      }}
      maxWidth="md"
    >
      <img
        alt="logo"
        src={`qc-logo.png`}
        width={64}
        height={64}
        style={{ padding: "5vh" }}
      />

      <Box
        textAlign="center"
        sx={{
          borderRadius: 1,
          maxWidth: "md",
          justifyContent: "center",
        }}
      >
        {screen}
      </Box>
    </Container>
  );
}

export default App;
