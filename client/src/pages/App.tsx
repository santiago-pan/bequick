import { Box, Container } from "@mui/material";
import { useContext, useEffect, useMemo, useReducer } from "react";
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
  DEFAULT_NUM_PLAYERS,
  DEFAULT_NUM_ROUNDS,
  GameAction,
  GameState,
  GAME_ACTION,
  SCREEN_NAME,
} from "./AppTypes";
import Game from "./screens/Game";
import { JoinGame, JoinGameWait } from "./screens/JoinGame";
import NewGameCreate from "./screens/NewGameCreate";
import NewGameShare from "./screens/NewGameShare";
import StartScreen from "./screens/StartScreen";

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case GAME_ACTION.START_SCREEN:
      return {
        ...state,
        screen: {
          screen: SCREEN_NAME.START_SCREEN,
          newGame: action.payload.newGame,
        },
      };
    case GAME_ACTION.NEW_GAME_CREATE:
      return {
        ...state,
        screen: {
          screen: SCREEN_NAME.NEW_GAME_CREATE,
          createGame: action.payload.createGame,
        },
      };
    case GAME_ACTION.NEW_GAME_SHARE:
      return {
        ...state,
        screen: {
          screen: SCREEN_NAME.NEW_GAME_SHARE,
          gameId: action.payload.gameId,
          playerId: action.payload.playerId,
          playersCount: state.playersCount,
          startGame: action.payload.startGame,
        },
      };
    case GAME_ACTION.PLAYER_IN:
      if (state.screen?.screen === SCREEN_NAME.NEW_GAME_SHARE) {
        const newPlayersCount = {
          playersIn: action.payload.playersIn,
          totalPlayers: action.payload.totalPlayers,
        };
        return {
          ...state,
          screen: {
            ...state.screen,
            playersCount: newPlayersCount,
          },
          playersCount: newPlayersCount,
        };
      }
      return state;
    case GAME_ACTION.JOIN_GAME:
      return {
        ...state,
        screen: {
          screen: SCREEN_NAME.JOIN_GAME,
          gameId: action.payload.gameId,
          joinGame: action.payload.joinGame,
        },
      };
    case GAME_ACTION.JOIN_GAME_WAIT:
      return {
        ...state,
        playersCount: action.payload.playersCount,
        screen: {
          screen: SCREEN_NAME.JOIN_GAME_WAIT,
          gameId: action.payload.gameId,
          playerId: action.payload.playerId,
          playersCount: action.payload.playersCount,
        },
      };
    case GAME_ACTION.GAME:
      return {
        ...state,
        screen: {
          screen: SCREEN_NAME.GAME,
          gameId: action.payload.gameId,
          playerId: action.payload.playerId,
          wins: action.payload.wins,
          gameIsOver: action.payload.gameIsOver,
          clicker: action.payload.clicker,
          itemClick: action.payload.itemClick,
        },
      };
    case GAME_ACTION.NEW_CLICKER:
      if (state.screen?.screen === "game") {
        return {
          ...state,
          clicker: action.payload.clicker,
          screen: {
            ...state.screen,
            clicker: action.payload.clicker,
          },
        };
      }
      return state;
    case GAME_ACTION.UPDATE_WINS:
      if (state.screen?.screen === "game") {
        return {
          ...state,
          wins: state.wins + 1,
          screen: {
            ...state.screen,
            wins: state.wins + 1,
          },
        };
      }
      return state;
    case GAME_ACTION.GAME_OVER:
      if (state.screen?.screen === "game") {
        return {
          ...state,
          gameIsOver: true,
          screen: {
            ...state.screen,
            gameIsOver: true,
          },
        };
      }
      return state;
    default:
      return state;
  }
}

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

function joinGame(socket: Socket, gameId: string) {
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

function gameItemClick(socket: Socket, gameId: string, time: number) {
  const action: ClientEvent = {
    action: ClientAction.Click,
    payload: { gameId, time },
  };
  socket.emit(socket.id, action);
}

const initialState: GameState = {
  screen: null,
  gameId: null,
  clicker: null,
  gameIsOver: false,
  wins: 0,
  playersCount: null,
};

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);
  const { socket } = useContext(SocketContext);
  const queryGameId = useQuery().get("id");

  function newGame(socket: Socket) {
    dispatch({
      type: GAME_ACTION.NEW_GAME_CREATE,
      payload: {
        createGame: (numPlayers, numRounds) =>
          createGame(socket, numPlayers, numRounds),
      },
    });
  }

  // Initial game screen (start or join)
  useEffect(() => {
    if (!socket) {
      return;
    }
    if (state.gameId === null && state.screen === null) {
      dispatch({
        type: GAME_ACTION.START_SCREEN,
        payload: {
          newGame: () => newGame(socket),
        },
      });
    }
    if (state.gameId === null && state.screen === null && queryGameId) {
      dispatch({
        type: GAME_ACTION.JOIN_GAME,
        payload: {
          gameId: queryGameId,
          joinGame: (gameId) => joinGame(socket, gameId),
        },
      });
    }
  }, [state.gameId, state.screen, queryGameId, socket]);

  // Socket messages
  useEffect(() => {
    if (socket) {
      socket.on(MSG_TYPE.EMIT_ALL, (arg: ServerEvent) => {
        if (arg.action === ServerAction.GameIsOver) {
          dispatch({ type: GAME_ACTION.GAME_OVER });
        }
        if (arg.action === ServerAction.PlayersIn) {
          dispatch({
            type: GAME_ACTION.PLAYER_IN,
            payload: {
              totalPlayers: arg.payload.totalPlayers,
              playersIn: arg.payload.playersIn,
            },
          });
        }
        if (arg.action === ServerAction.GameStartAck) {
          dispatch({
            type: GAME_ACTION.GAME,
            payload: {
              gameId: arg.payload.gameId,
              playerId: socket.id,
              gameIsOver: false,
              wins: 0,
              clicker: { x: arg.payload.x, y: arg.payload.y },
              itemClick: (gameId, time) => gameItemClick(socket, gameId, time),
            },
          });
        }
        if (arg.action === ServerAction.NewClicker) {
          dispatch({
            type: GAME_ACTION.NEW_CLICKER,
            payload: {
              clicker: { x: arg.payload.x, y: arg.payload.y },
            },
          });
        }
      });
      socket.on(MSG_TYPE.EMIT_ONE, (arg: ServerEvent) => {
        if (arg.action === ServerAction.NewGameAck) {
          console.log(arg.payload.gameId);
          dispatch({
            type: GAME_ACTION.NEW_GAME_SHARE,
            payload: {
              gameId: arg.payload.gameId,
              playerId: socket.id,
              startGame: (gameId: string) => startGame(socket, gameId),
            },
          });
        }
        if (arg.action === ServerAction.RoundWinner) {
          dispatch({
            type: GAME_ACTION.UPDATE_WINS,
          });
        }
        if (arg.action === ServerAction.JoinGameAck) {
          dispatch({
            type: GAME_ACTION.JOIN_GAME_WAIT,
            payload: {
              gameId: arg.payload.gameId,
              playerId: socket.id,
              playersCount: {
                totalPlayers: arg.payload.totalPlayers,
                playersIn: arg.payload.playersIn,
              },
            },
          });
        }
      });
    }
  }, [socket]);

  if (!socket) {
    return <div>Waiting for socket connection...</div>;
  }

  const screen = ScreenSelector(state);

  if (!screen) {
    return <></>;
  }

  if (state.screen?.screen === SCREEN_NAME.GAME) {
    return screen;
  } else {
    return <>{AppContainer(screen)}</>;
  }
}

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function ScreenSelector(state: GameState) {
  const gameScreen = state.screen;
  if (!gameScreen) {
    return null;
  }
  switch (gameScreen.screen) {
    case SCREEN_NAME.START_SCREEN:
      return <StartScreen {...gameScreen} />;
    case SCREEN_NAME.NEW_GAME_CREATE:
      return <NewGameCreate {...gameScreen} />;
    case SCREEN_NAME.NEW_GAME_SHARE:
      return <NewGameShare {...gameScreen} />;
    case SCREEN_NAME.JOIN_GAME:
      return <JoinGame {...gameScreen} />;
    case SCREEN_NAME.JOIN_GAME_WAIT:
      return <JoinGameWait {...gameScreen} />;
    case SCREEN_NAME.GAME:
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
