import { Button, ButtonGroup } from "@mui/material";
import { ExtractScreen, GameScreen, SCREEN_NAME } from "../AppTypes";

export default function StartScreen(
  props: ExtractScreen<GameScreen, SCREEN_NAME.START_SCREEN>
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
