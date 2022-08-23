import { Socket } from 'socket.io';
import { assertNever } from './Assert';
import {
  Coords,
  GameID,
  gameStart,
  getRandomCoord,
  joinGame,
  newClickAction,
  newGame,
} from './GameManager';
import {
  ClientAction,
  ClientEvent,
  MSG_TYPE,
  ServerAction,
  ServerEvent,
  SocketID,
} from './types';

export type TSocket = Socket<
  ListenEvents,
  EmitEvents,
  ServerSideEvents,
  SocketData
>;

export type ListenEvents = {
  [key: string]: (action: ClientEvent) => void;
};

export type EmitEvents = {
  [key: string]: (action: ServerEvent) => void;
};

export type ServerSideEvents = {};

export type SocketData = ClientEvent;

function notEmpty<T>(item: T | undefined | null): item is T {
  return item !== undefined && item !== null;
}

export function onlyDefined<T>(items: Array<T | null | undefined>): T[] {
  return items.filter(notEmpty);
}

const __sockets: Map<string, TSocket> = new Map();

export function getGameSockets(ids: Array<SocketID>) {
  return new Map(
    onlyDefined(ids.map((id) => __sockets.get(id) ?? null)).map((s) => [
      s.id,
      s,
    ]),
  );
}

export function getSockets() {
  return __sockets;
}

export function getSocket(id: SocketID) {
  return __sockets.get(id);
}

export function addSocket(socket: TSocket) {
  __sockets.set(socket.id, socket);

  try {
    socket.on(socket.id, (arg) => {
      console.log(`Server> Got: ${JSON.stringify(arg)}`);

      switch (arg.action) {
        case ClientAction.NewGame:
          newGame(
            arg.payload.playerId,
            arg.payload.numPlayers,
            arg.payload.numRounds,
          );
          return;
        case ClientAction.JoinGame:
          joinGame(socket.id, arg.payload.gameId);
          return;
        case ClientAction.GameStart:
          gameStart(arg.payload.gameId);
          return;
        case ClientAction.Click:
          newClickAction(socket.id, arg);
          return;
        default:
          return assertNever(arg);
      }
    });
    console.log(`New socket ${socket.id}. Total: ${__sockets.size}`);
  } catch (err) {
    console.log(err);
  }
}

export function removeSocket(socketId: SocketID) {
  __sockets.delete(socketId);
  console.log(`Delete socket ${socketId}. Total: ${__sockets.size}`);
}

export function emitToAllButSender(
  sockets: Map<SocketID, TSocket>,
  senderId: SocketID,
  msg: ServerEvent,
) {
  for (const [id, socket] of sockets) {
    if (id !== senderId) {
      socket.emit(MSG_TYPE.EMIT_ALL, msg);
    }
  }
}

export function emitToAll(sockets: Map<SocketID, TSocket>, msg: ServerEvent) {
  for (const [id, socket] of sockets) {
    socket.emit(MSG_TYPE.EMIT_ALL, msg);
  }
}

// High level functions

export function sendNewGameId(socketId: SocketID, gameId: string) {
  const socket = getSocket(socketId);
  if (socket) {
    socket.emit(MSG_TYPE.EMIT_ONE, {
      action: ServerAction.NewGameAck,
      payload: {
        gameId,
      },
    });
  }
}

export function sendJoinAck(
  socketId: SocketID,
  gameId: string,
  totalPlayers: number,
  playersIn: number,
) {
  const socket = getSocket(socketId);
  if (socket) {
    socket.emit(MSG_TYPE.EMIT_ONE, {
      action: ServerAction.JoinGameAck,
      payload: {
        gameId,
        totalPlayers,
        playersIn,
      },
    });
  }
}

export function sendGameStartAck(
  gameId: GameID,
  playersIds: SocketID[],
  coords: Coords,
) {
  emitToAll(getGameSockets(playersIds), {
    action: ServerAction.GameStartAck,
    payload: {
      gameId,
      ...coords,
    },
  });
}

export function sendPlayersIn(
  playersIds: SocketID[],
  totalPlayers: number,
  playersIn: number,
) {
  emitToAll(getGameSockets(playersIds), {
    action: ServerAction.PlayersIn,
    payload: {
      totalPlayers,
      playersIn,
    },
  });
}

export function sendRoundWinner(winnerId: SocketID) {
  const socket = getSocket(winnerId);
  if (socket) {
    socket.emit(MSG_TYPE.EMIT_ONE, {
      action: ServerAction.RoundWinner,
      payload: null,
    });
  }
}

export function sendNewCoords(playersIds: SocketID[]) {
  const coords = getRandomCoord();
  emitToAll(getGameSockets(playersIds), {
    action: ServerAction.NewClicker,
    payload: coords,
  });
}

export function sendGameIsOver(playersIds: SocketID[]) {
  emitToAll(getGameSockets(playersIds), {
    action: ServerAction.GameIsOver,
    payload: null,
  });
}
