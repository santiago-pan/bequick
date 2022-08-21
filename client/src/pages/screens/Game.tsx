import { Container, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ExtractScreen, GameScreen, SCREEN_NAME } from "../AppTypes";
import Mosquito from "../ui/Mosquito";
import Ko from "../ui/Smoke";
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

type GameProps = ExtractScreen<GameScreen, SCREEN_NAME.GAME>;

export default function Game(props: GameProps) {
  const timeRef = useRef<number>(new Date().getTime());
  const [showClick, setShowClick] = useState<boolean>(true);
  const { wins, gameId, gameIsOver, clicker } = props;

  function handleItemClick() {
    setShowClick(false);
    props.itemClick(gameId, getTimeDiff(timeRef));
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
