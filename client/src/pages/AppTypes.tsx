import { Socket } from "socket.io-client";

export type ClickerPosition = {
  x: number;
  y: number;
};

export type GameScreen =
  | {
      screen: "new_game";
      newGame: () => void;
    }
  | {
      screen: "new_game_create";
      socket: Socket;
      createGame: (
        socket: Socket,
        numPlayers: string,
        numRounds: string
      ) => void;
    }
  | {
      screen: "new_game_share";
      gameId: string;
      playerId: string;
      playersCount: PlayersCount | null;
      socket: Socket;
      startGame: (socket: Socket, gameId: string) => void;
    }
  | {
      screen: "new_game_start";
      gameId: string;
      playerId: string;
    }
  | {
      screen: "join_game";
      gameId: string;
      socket: Socket;
      joinGame: (socket: Socket, gameId: string | null) => void;
    }
  | {
      screen: "join_game_wait";
      gameId: string;
      playerId: string;
      playersCount: PlayersCount | null;
    }
  | {
      screen: "game";
      gameId: string;
      playerId: string;
      socket: Socket;
      wins: number;
      gameIsOver: boolean;
      clicker: ClickerPosition;
    };

export type ScreenType = GameScreen["screen"];

export type PlayersCount = {
  totalPlayers: number;
  playersIn: number;
};
