import {
  Box,
  ButtonGroup,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
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
import forest from "./../assets/images/forest1.webp";
import "./App.css";
import { ClickerPosition, GameScreen, PlayersCount } from "./AppTypes";
import Mosquito from "./ui/Mosquito";

// Does actually call the server to create a new game
function createGame(
  socket: Socket,
  numPlayers: string = "2",
  numRounds: string = "2"
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

function App(props: {}) {
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
        screen: "new_game",
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
    if (gameId && gameScreen && gameScreen.screen === "new_game") {
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

  return (
    <>
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
    </>
  );
}

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function resetTimer(timeRef: React.MutableRefObject<number>) {
  const d = new Date();
  timeRef.current = d.getTime();
}

function getTimeDiff(timeRef: React.MutableRefObject<number>) {
  const d = new Date();
  return d.getTime() - timeRef.current;
}

function ScreenSelector(gameScreen: GameScreen) {
  switch (gameScreen.screen) {
    case "new_game":
      return <NewGameScreen {...gameScreen} />;
    case "new_game_create":
      return <NewGameCreate {...gameScreen} />;
    case "new_game_share":
      return <NewGameShare {...gameScreen} />;
    case "new_game_start":
      return <NewGameStart />;
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

function NewGameScreen(props: Extract<GameScreen, { screen: "new_game" }>) {
  return (
    <>
      <ButtonGroup size="large" orientation="vertical">
        <Button
          size="large"
          variant="contained"
          sx={{
            m: 1,
          }}
          onClick={() => props.newGame()}
        >
          Start New Game
        </Button>
      </ButtonGroup>
    </>
  );
}

function NewGameCreate(
  props: Extract<GameScreen, { screen: "new_game_create" }>
) {
  const [players, setPlayers] = useState<string>("2");
  const [rounds, setRounds] = useState<string>("2");
  return (
    <>
      <ButtonGroup size="large" orientation="vertical">
        <TextField
          sx={{
            m: 1,
          }}
          id="outlined-basic"
          label="Players"
          variant="outlined"
          value={players}
          type="number"
          onChange={(v) => setPlayers(v.currentTarget.value)}
        />
        <TextField
          sx={{
            m: 1,
          }}
          id="outlined-basic"
          label="Rounds"
          variant="outlined"
          value={rounds}
          type="number"
          onChange={(v) => setRounds(v.currentTarget.value)}
        />
        <Button
          size="large"
          variant="contained"
          sx={{
            m: 1,
          }}
          onClick={() => props.createGame(props.socket, players, rounds)}
        >
          Create Game
        </Button>
      </ButtonGroup>
    </>
  );
}

function NewGameShare(
  props: Extract<GameScreen, { screen: "new_game_share" }>
) {
  const shareUrl = `https://bequick.pancarneiro.com/?id=${props.gameId}`;
  const title = "";
  const allPlayersIn =
    props.playersCount &&
    props.playersCount.playersIn === props.playersCount.totalPlayers
      ? true
      : false;
  return (
    <>
      <Typography m={2} variant="body1">
        Share with the other player/s.
      </Typography>
      <Box m={2}>
        <QRCode size={120} value={shareUrl} />
      </Box>
      <Box>
        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={48} />
        </WhatsappShareButton>
        <LineShareButton url={shareUrl} title={title}>
          <LineIcon size={48} />
        </LineShareButton>
        <FacebookShareButton url={shareUrl} quote={title}>
          <FacebookIcon size={48} />
        </FacebookShareButton>
        <EmailShareButton
          url={shareUrl}
          subject={"Quick click game"}
          body={shareUrl}
        >
          <EmailIcon size={48} />
        </EmailShareButton>
      </Box>
      {!allPlayersIn && (
        <>
          <Typography m={2} variant="body1">
            Waiting for players to join.
          </Typography>
          <Typography m={2} variant="body1">
            {`${props.playersCount?.playersIn ?? 0} of ${
              props.playersCount?.totalPlayers ?? 0
            }`}
          </Typography>
        </>
      )}
      {allPlayersIn && (
        <>
          <Typography m={2} variant="body1">
            All players in.
          </Typography>
          <Button
            size="large"
            variant="contained"
            sx={{
              m: 1,
            }}
            onClick={() => props.startGame(props.socket, props.gameId)}
          >
            Start Game
          </Button>
        </>
      )}
    </>
  );
}

function NewGameStart() {
  return <>NewGameStart</>;
}

function JoinGame(props: Extract<GameScreen, { screen: "join_game" }>) {
  return (
    <>
      <ButtonGroup size="large" orientation="vertical">
        <Typography m={2} variant="body1">
          {`Joing game with ID`}
          <br />
          {`${props.gameId}`}
        </Typography>
        <Button
          size="large"
          variant="contained"
          sx={{
            m: 1,
          }}
          onClick={() => props.joinGame(props.socket, props.gameId)}
        >
          Join Game
        </Button>
      </ButtonGroup>
    </>
  );
}

function JoinGameWait(
  props: Extract<GameScreen, { screen: "join_game_wait" }>
) {
  const allPlayersIn =
    props.playersCount &&
    props.playersCount.playersIn === props.playersCount.totalPlayers
      ? true
      : false;

  return (
    <>
      {!allPlayersIn && (
        <>
          <Typography m={2} variant="body1">
            Waiting for players to join.
          </Typography>
          <Typography m={2} variant="body1">
            {`${props.playersCount?.playersIn ?? 0} of ${
              props.playersCount?.totalPlayers ?? 0
            }`}
          </Typography>
        </>
      )}
      {allPlayersIn && (
        <>
          <Typography m={2} variant="body1">
            All players in, waiting for game to start.
          </Typography>
        </>
      )}
    </>
  );
}

function Game(props: Extract<GameScreen, { screen: "game" }>) {
  const timeRef = useRef<number>(new Date().getTime());
  const [showClick, setShowClick] = useState<boolean>(true);
  const { wins, socket, gameId, gameIsOver, clicker } = props;

  useEffect(() => {
    resetTimer(timeRef);
    setShowClick(true);
  }, [clicker]);

  return (
    <>
      <Container
        sx={{
          height: "100vh",
          textAlign: "left",
          paddingTop: 0,
          backgroundImage: `url(${forest})`,
        }}
        maxWidth="md"
      >
        {!gameIsOver && (
          <Typography
            color={"white"}
            variant="body1"
          >{`Score: ${wins}`}</Typography>
        )}

        {showClick && !gameIsOver && (
          <Mosquito
            select={() => {
              const action: ClientEvent = {
                action: ClientAction.Click,
                payload: { gameId, time: getTimeDiff(timeRef) },
              };
              socket.emit(socket.id, action);
              setShowClick(false);
            }}
            x={clicker.x}
            y={clicker.y}
          />
        )}
        {gameIsOver && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
            sx={
              {
                // borderRadius: 1,
                // backgroundColor: "red",
              }
            }
          >
            <Box
              display="flex"
              flexDirection={"column"}
              minHeight="20vh"
              minWidth="80%"
              maxWidth="md"
              justifyContent="center"
              alignItems="center"
              textAlign={"center"}
              sx={{
                borderRadius: 1,
                backgroundColor: "primary.light",
              }}
            >
              <Typography color={"white"} variant="body1">
                Game is over.
                <br />
                {`Your score is ${wins}`}
              </Typography>
              <Button
                size="large"
                variant="contained"
                sx={{
                  m: 1,
                }}
                onClick={() => {
                  // Send event and reave the game.
                }}
              >
                Ok cool
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
}

export default App;
