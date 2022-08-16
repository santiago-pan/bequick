import { Button, ButtonGroup } from "@mui/material";
import { ExtractScreen, GameScreen } from "../AppTypes";

export default function StartScreen(
  props: ExtractScreen<GameScreen, "start_screen">
) {
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
