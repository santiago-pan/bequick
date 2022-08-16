import { Container, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ClientAction, ClientEvent } from "../../types";
import { ExtractScreen, GameScreen } from "../AppTypes";
import Ko from "../ui/Smoke";
import Mosquito from "../ui/Mosquito";
import forest from "./../../assets/images/forest.jpg";
import GameOver from "./GameOver";

function resetTimer(timeRef: React.MutableRefObject<number>) {
  const d = new Date();
  timeRef.current = d.getTime();
}

function getTimeDiff(timeRef: React.MutableRefObject<number>) {
  const d = new Date();
  return d.getTime() - timeRef.current;
}

type GameProps = ExtractScreen<GameScreen, "game">;

export default function Game(props: GameProps) {
  const timeRef = useRef<number>(new Date().getTime());
  const [showClick, setShowClick] = useState<boolean>(true);
  const { wins, socket, gameId, gameIsOver, clicker } = props;

  function handleItemClick() {
    setShowClick(false);
    const action: ClientEvent = {
      action: ClientAction.Click,
      payload: { gameId, time: getTimeDiff(timeRef) },
    };
    socket.emit(socket.id, action);
  }

  useEffect(() => {
    resetTimer(timeRef);
    setShowClick(true);
  }, [clicker]);

  const showItem = showClick && !gameIsOver;
  const showItemKo = !showClick && !gameIsOver;

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
          >{`Score ${wins}`}</Typography>
        )}
        {showItem && (
          <Mosquito select={handleItemClick} x={clicker.x} y={clicker.y} />
        )}
        {showItemKo && <Ko x={clicker.x} y={clicker.y} />}
        {gameIsOver && <GameOver wins={wins} />}
      </Container>
    </>
  );
}
