export const DEFAULT_NUM_PLAYERS = "2";
export const DEFAULT_NUM_ROUNDS = "10";

export type GameState = {
  screen: GameScreen | null;
  gameId: string | null;
  clicker: ClickerPosition | null;
  gameIsOver: boolean;
  wins: number;
  playersCount: PlayersCount | null;
};

export type ClickerPosition = {
  x: number;
  y: number;
};

export enum GAME_ACTION {
  START_SCREEN = "start_screen",
  NEW_GAME_CREATE = "new_game_create",
  NEW_GAME_SHARE = "new_game_share",
  PLAYER_IN = "player_in",
  JOIN_GAME = "join_game",
  JOIN_GAME_WAIT = "join_game_wait",
  GAME = "game",
  NEW_CLICKER = "new_clicker",
  UPDATE_WINS = "update_wins",
  GAME_OVER = "game_over",
}

export type GameAction =
  | {
      type: GAME_ACTION.START_SCREEN;
      payload: {
        newGame: () => void;
      };
    }
  | {
      type: GAME_ACTION.NEW_GAME_CREATE;
      payload: {
        createGame: (numPlayers: string, numRounds: string) => void;
      };
    }
  | {
      type: GAME_ACTION.NEW_GAME_SHARE;
      payload: {
        gameId: string;
        playerId: string;
        startGame: (gameId: string) => void;
      };
    }
  | {
      type: GAME_ACTION.PLAYER_IN;
      payload: {
        totalPlayers: number;
        playersIn: number;
      };
    }
  | {
      type: GAME_ACTION.JOIN_GAME;
      payload: { gameId: string; joinGame: (gameId: string) => void };
    }
  | {
      type: GAME_ACTION.JOIN_GAME_WAIT;
      payload: {
        gameId: string;
        playerId: string;
        playersCount: PlayersCount | null;
      };
    }
  | {
      type: GAME_ACTION.GAME;
      payload: {
        gameId: string;
        playerId: string;
        wins: number;
        gameIsOver: boolean;
        clicker: ClickerPosition;
        itemClick: (gameId: string, time: number) => void;
      };
    }
  | {
      type: GAME_ACTION.NEW_CLICKER;
      payload: {
        clicker: ClickerPosition;
      };
    }
  | {
      type: GAME_ACTION.UPDATE_WINS;
    }
  | {
      type: GAME_ACTION.GAME_OVER;
    };

export enum SCREEN_NAME {
  START_SCREEN = "start_screen",
  NEW_GAME_CREATE = "new_game_create",
  NEW_GAME_SHARE = "new_game_share",
  JOIN_GAME = "join_game",
  JOIN_GAME_WAIT = "join_game_wait",
  GAME = "game",
}

export type GameScreen =
  | {
      screen: SCREEN_NAME.START_SCREEN;
      newGame: () => void;
    }
  | {
      screen: SCREEN_NAME.NEW_GAME_CREATE;
      createGame: (numPlayers: string, numRounds: string) => void;
    }
  | {
      screen: SCREEN_NAME.NEW_GAME_SHARE;
      gameId: string;
      playerId: string;
      playersCount: PlayersCount | null;
      startGame: (gameId: string) => void;
    }
  | {
      screen: SCREEN_NAME.JOIN_GAME;
      gameId: string;
      joinGame: (gameId: string) => void;
    }
  | {
      screen: SCREEN_NAME.JOIN_GAME_WAIT;
      gameId: string;
      playerId: string;
      playersCount: PlayersCount | null;
    }
  | {
      screen: SCREEN_NAME.GAME;
      gameId: string;
      playerId: string;
      wins: number;
      gameIsOver: boolean;
      clicker: ClickerPosition;
      itemClick: (gameId: string, time: number) => void;
    };

export type PlayersCount = {
  totalPlayers: number;
  playersIn: number;
};

export type ScreenNames = GameScreen["screen"];
export type ExtractScreen<T, U extends ScreenNames> = Extract<T, { screen: U }>;
