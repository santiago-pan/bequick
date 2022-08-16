import { Box, Button, Typography } from "@mui/material";
import QRCode from "react-qr-code";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { ExtractScreen, GameScreen } from "../AppTypes";

export default function NewGameShare(
  props: ExtractScreen<GameScreen, "new_game_share">
) {
  const shareUrl = `https://bequick.pancarneiro.com/?id=${props.gameId}`;
  const title = "";
  const allPlayersIn =
    props.playersCount &&
    props.playersCount.playersIn === props.playersCount.totalPlayers
      ? true
      : false;
  return (
    <>
      <Typography m={2} variant="body1">
        Share with the other player/s.
      </Typography>
      <Box m={2}>
        <QRCode size={120} value={shareUrl} />
      </Box>
      <Box>
        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={48} />
        </WhatsappShareButton>
        <LineShareButton url={shareUrl} title={title}>
          <LineIcon size={48} />
        </LineShareButton>
        <FacebookShareButton url={shareUrl} quote={title}>
          <FacebookIcon size={48} />
        </FacebookShareButton>
        <EmailShareButton
          url={shareUrl}
          subject={"Quick click game"}
          body={""}
        >
          <EmailIcon size={48} />
        </EmailShareButton>
      </Box>
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
            All players in.
          </Typography>
          <Button
            size="large"
            variant="contained"
            sx={{
              m: 1,
            }}
            onClick={() => props.startGame(props.socket, props.gameId)}
          >
            Start Game
          </Button>
        </>
      )}
    </>
  );
}
