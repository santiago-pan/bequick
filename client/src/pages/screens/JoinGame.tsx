import { Button, ButtonGroup, Typography } from "@mui/material";
import { ExtractScreen, GameScreen, SCREEN_NAME } from "../AppTypes";

export function JoinGame(
  props: ExtractScreen<GameScreen, SCREEN_NAME.JOIN_GAME>
) {
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
          onClick={() => props.joinGame(props.gameId)}
        >
          Join Game
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
