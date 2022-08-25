import { Button, ButtonGroup, Typography } from "@mui/material";
import { ExtractScreen, GameScreen, SCREEN_NAME } from "../AppTypes";

export default function StartScreen(
  props: ExtractScreen<GameScreen, SCREEN_NAME.START_SCREEN>
) {
  return (
    <>
      <ButtonGroup orientation="vertical">
        <Typography m={2} variant="h4">
          BeQuick
        </Typography>
        <Typography m={2} variant="body1">
          Create a new game
        </Typography>
        <Button
          id="create-game-button"
          data-testid="create-game-button"
          size="large"
          variant="contained"
          sx={{
            m: 1,
          }}
          onClick={() => props.newGame()}
        >
          Create
        </Button>
      </ButtonGroup>
    </>
  );
}
