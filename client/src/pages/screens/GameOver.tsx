import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";

type Props = {
  wins: number;
};

export default function GameOver(props: Props) {
  const { wins } = props;
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
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
  );
}
