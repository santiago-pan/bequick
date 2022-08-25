import { Button, ButtonGroup, TextField, Typography } from "@mui/material";
import { useState } from "react";
import {
  DEFAULT_NUM_PLAYERS,
  DEFAULT_NUM_ROUNDS,
  ExtractScreen,
  GameScreen,
  SCREEN_NAME,
} from "../AppTypes";

type Props = ExtractScreen<GameScreen, SCREEN_NAME.NEW_GAME_CREATE>;

export default function NewGameCreate(props: Props) {
  const [players, setPlayers] = useState<string>(DEFAULT_NUM_PLAYERS);
  const [rounds, setRounds] = useState<string>(DEFAULT_NUM_ROUNDS);
  return (
    <>
      <ButtonGroup orientation="vertical">
        <Typography m={2} variant="h4">
          BeQuick
        </Typography>
        <TextField
          id="num-players-input"
          data-testid="num-players-input"
          sx={{
            m: 1,
          }}
          label="Players"
          variant="outlined"
          value={players}
          type="number"
          onChange={(v) => setPlayers(v.currentTarget.value)}
        />
        <TextField
          id="num-rounds-input"
          data-testid="num-rounds-input"
          sx={{
            m: 1,
          }}
          label="Rounds"
          variant="outlined"
          value={rounds}
          type="number"
          onChange={(v) => setRounds(v.currentTarget.value)}
        />
        <Button
          id="new-game-button"
          size="large"
          variant="contained"
          sx={{
            m: 1,
          }}
          onClick={() => props.createGame(players, rounds)}
        >
          Create
        </Button>
      </ButtonGroup>
    </>
  );
}
