import { Button, ButtonGroup, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

type Props = {
  wins: number;
};

export default function GameOver(props: Props) {
  let navigate = useNavigate();

  const { wins } = props;
  return (
    <Box className="app-game-over-box-container">
      <Box className="app-game-over-box">
        <ButtonGroup orientation="vertical">
          <Typography m={2} variant="h4">
            BeQuick
          </Typography>
          <Typography m={2} variant="body1">
            {`Game is over, your score is ${wins}`}
          </Typography>
          <Button
            size="large"
            variant="contained"
            sx={{
              m: 1,
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            Ok cool
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}
