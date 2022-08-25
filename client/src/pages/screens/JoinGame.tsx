import { Button, ButtonGroup, Typography } from "@mui/material";
import { ExtractScreen, GameScreen, SCREEN_NAME } from "../AppTypes";

export function JoinGame(
  props: ExtractScreen<GameScreen, SCREEN_NAME.JOIN_GAME>
) {
  return (
    <>
      <ButtonGroup orientation="vertical">
        <Typography m={2} variant="h4">
          BeQuick
        </Typography>
        <Typography m={2} variant="body1">
          Join a new game
        </Typography>
        <Button
          size="large"
          variant="contained"
          sx={{
            m: 1,
          }}
          onClick={() => props.joinGame(props.gameId)}
        >
          Join
        </Button>
      </ButtonGroup>
    </>
  );
}

export function JoinGameWait(
  props: ExtractScreen<GameScreen, SCREEN_NAME.JOIN_GAME_WAIT>
) {
  const allPlayersIn =
    props.playersCount &&
    props.playersCount.playersIn === props.playersCount.totalPlayers
      ? true
      : false;

  return (
    <>
      <ButtonGroup orientation="vertical">
        {!allPlayersIn && (
          <>
            <Typography m={2} variant="h4">
              BeQuick
            </Typography>
            <Typography m={2} variant="body1">
              Waiting for players to join
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
            <Typography m={2} variant="h4">
              BeQuick
            </Typography>
            <Typography m={2} variant="body1">
              All players in, waiting for game to start
            </Typography>
          </>
        )}
      </ButtonGroup>
    </>
  );
}
