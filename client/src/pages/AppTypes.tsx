import { Socket } from "socket.io-client";

export const DEFAULT_NUM_PLAYERS = "2";
export const DEFAULT_NUM_ROUNDS = "10";

export type ClickerPosition = {
  x: number;
  y: number;
};

export type GameScreen =
  | {
      screen: "start_screen";
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


export type PlayersCount = {
  totalPlayers: number;
  playersIn: number;
};

export type ScreenType = Pick<GameScreen, "screen">;
export type ScreenNames = ScreenType["screen"];
export type ExtractScreen<T, U extends ScreenNames> = Extract<T, { screen: U }>;
