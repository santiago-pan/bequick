import { Button, ButtonGroup, TextField } from "@mui/material";
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
          onClick={() => props.createGame(players, rounds)}
        >
          Create Game
        </Button>
      </ButtonGroup>
    </>
  );
}
