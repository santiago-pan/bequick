export enum ClientAction {
  Click = 'click',
  NewGame = 'new-game',
  JoinGame = 'join-game',
  GameStart = 'game-start',
}

export enum ServerAction {
  NewGameAck = 'new-game-ack',
  JoinGameAck = 'join-game-ack',
  GameStartAck = 'game-start-ack',
  PlayersIn = 'players-in',
  NewClicker = 'new-clicker',
  RoundWinner = 'round-winner',
  GameIsOver = 'game-is-over',
}

// Client to Server events

export type NewGame = {
  action: ClientAction.NewGame;
  payload: {
    playerId: string;
    numPlayers: number;
    numRounds: number;
  };
};

export type JoinGame = {
  action: ClientAction.JoinGame;
  payload: {
    gameId: string;
  };
};

export type GameStart = {
  action: ClientAction.GameStart;
  payload: {
    gameId: string;
  };
};

export type ClickAction = {
  action: ClientAction.Click;
  payload: {
    gameId: string;
    time: number;
  };
};

// Server to Client events

export type NewGameAck = {
  action: ServerAction.NewGameAck;
  payload: {
    gameId: string;
  };
};

export type JoinGameAck = {
  action: ServerAction.JoinGameAck;
  payload: {
    gameId: string;
    totalPlayers: number;
    playersIn: number;
  };
};

export type GameStartAck = {
  action: ServerAction.GameStartAck;
  payload: {
    gameId: string;
    x: number;
    y: number;
  };
};

export type PlayersIn = {
  action: ServerAction.PlayersIn;
  payload: {
    totalPlayers: number;
    playersIn: number;
  };
};

export type NewClicker = {
  action: ServerAction.NewClicker;
  payload: {
    x: number;
    y: number;
  };
};

export type RoundWinner = {
  action: ServerAction.RoundWinner;
  payload: null;
};

export type GameIsOver = {
  action: ServerAction.GameIsOver;
  payload: null;
};

export type ClientEvent = ClickAction | NewGame | JoinGame | GameStart;

export type ServerEvent =
  | NewGameAck
  | JoinGameAck
  | GameStartAck
  | NewClicker
  | RoundWinner
  | GameIsOver
  | PlayersIn;

// Sockets

export type SocketID = string;

export enum MSG_TYPE {
  EMIT_ALL = 'emit-all',
  EMIT_ONE = 'emit-one',
}
