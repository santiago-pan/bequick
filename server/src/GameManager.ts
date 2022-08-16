import {
  sendGameIsOver,
  sendGameStartAck,
  sendJoinAck,
  sendNewCoords,
  sendNewGameId,
  sendPlayersIn,
  sendRoundWinner,
} from './SocketManager';
import { ClickAction, SocketID } from './types';

export type GameID = string;

export type PlayerStats = {
  playerId: SocketID;
  role: 'host' | 'join';
  score: number;
};

export type Roll = {
  time: number;
};

export type Round = {
  // numRolls: number; // In a round, how many players did their play
  rolls: Map<SocketID, Roll>;
};

export type Coords = {
  x: number;
  y: number;
};

export class Game {
  id: GameID;
  totalPlayers: number;
  totalRounds: number;
  players: Map<SocketID, PlayerStats>;
  rounds: Array<Round>;
  constructor(gameId: GameID, totalPlayers: number, totalRounds: number) {
    this.id = gameId;
    this.totalPlayers = totalPlayers;
    this.totalRounds = totalRounds;
    this.players = new Map();
    this.rounds = [];
  }
  getPlayers() {
    return this.players;
  }
  getPlayersIds() {
    return [...this.players.keys()];
  }
  getPlayersIn() {
    return this.players.size;
  }
  getRounds() {
    return this.rounds;
  }
  getRound() {
    if (this.rounds.length > 0) {
      return this.rounds[this.rounds.length - 1];
    } else {
      return null;
    }
  }
  // Add a new player to this game
  addPlayer(playerId: SocketID, role: 'host' | 'join') {
    this.players.set(playerId, {
      playerId,
      role,
      score: 0,
    });
  }
  allPlayersIn() {
    return this.totalPlayers === this.players.size;
  }
  // Add a new round to the game
  addRound() {
    if (this.rounds.length < this.totalRounds) {
      this.rounds.push({
        rolls: new Map(),
      });
    } else {
      console.log(`Game max rounds reached ${this.totalRounds}`);
    }
  }
  // Updates round for a player
  updateRound(playerId: SocketID, time: number) {
    const currentRound = this.getRound();
    if (currentRound) {
      if (!currentRound.rolls.get(playerId)) {
        currentRound.rolls.set(playerId, { time });
      }
    } else {
      console.log(`Warning: No current round for ${playerId}`);
    }
  }
  roundIsOver() {
    const currentRound = this.getRound();
    if (currentRound) {
      return currentRound.rolls.size === this.totalPlayers;
    } else {
      console.log(`Warning: No current round.`);
      return false;
    }
  }
  // When all rounds are done
  gameIsOver() {
    return this.totalRounds === this.rounds.length && this.roundIsOver();
  }
  roundWinner() {
    const round = this.getRound();

    if (round) {
      let minTime = 100000000000;
      let winnerId = 'n/a';
      for (const [id, roll] of round.rolls) {
        if (roll.time < minTime) {
          winnerId = id;
          minTime = roll.time;
        }
      }
      this.addPlayerScore(winnerId);
      return winnerId;
    } else {
      return null;
    }
  }
  addPlayerScore(winnerId: string) {
    const winner = this.getPlayers().get(winnerId);
    if (winner) {
      winner.score += 1;
    }
  }
  log() {
    console.log(`Game [${this.id}]\n
Players:
${[...this.players.values()].map((p) => `(*) ${p.playerId}`).join('\n')}

Rounds:
${[
  ...this.rounds.map((r, index) => {
    return (
      `(${index}):\n` +
      [...r.rolls.entries()]
        .map((rll) => `${rll[0]} - ${rll[1].time}`)
        .join('\n')
    );
  }),
].join('\n')}
`);
  }
}

const _Games: Map<GameID, Game> = new Map();

export function getGames() {
  return _Games;
}

export function newGame(
  hostSockedId: SocketID,
  totalPlayers?: number,
  totalRounds?: number,
) {
  const game = createGame(getGames(), hostSockedId, totalPlayers, totalRounds);
  sendNewGameId(hostSockedId, game.id);
  sendPlayersIn(game.getPlayersIds(), game.totalPlayers, game.getPlayersIn());
  game.log();
  return game;
}

export function joinGame(playerSocketId: SocketID, gameId: GameID) {
  const games = getGames();
  const game = getGame(games, gameId);
  game.addPlayer(playerSocketId, 'join');
  game.addRound();
  game.log();
  // Only to sender
  sendJoinAck(playerSocketId, gameId, game.totalPlayers, game.getPlayersIn());
  // To all but sender
  sendPlayersIn(game.getPlayersIds(), game.totalPlayers, game.getPlayersIn());
}

export function gameStart(gameId: GameID) {
  const game = getGame(getGames(), gameId);
  const coords = getRandomCoord();
  sendGameStartAck(game.id, game.getPlayersIds(), coords);
}

export function newClickAction(playerSocketId: string, action: ClickAction) {
  const gameId = action.payload.gameId;
  const game = getGame(getGames(), gameId);

  // Last round from a game
  if (game.gameIsOver()) {
    game.log();
    return null;
  }

  game.updateRound(playerSocketId, action.payload.time);
  game.log();

  // Not last player, do nothing
  if (!game.roundIsOver()) {
    return null;
  }

  console.log('Round is over');
  game.log();

  // Find round winner
  const winner = game.roundWinner();

  game.log();
  console.log('winner: ', winner);

  if (winner) {
    sendRoundWinner(winner);
  }

  if (game.gameIsOver()) {
    sendGameIsOver(game.getPlayersIds());
  }

  sendNewCoords(game.getPlayersIds());

  // Add new round
  game.addRound();
}

export function createGame(
  games: Map<GameID, Game>,
  hostSockedId: SocketID,
  totalPlayers = 2,
  totalRounds = 10,
): Game {
  const newGame = new Game(hostSockedId, totalPlayers, totalRounds);
  newGame.addPlayer(hostSockedId, 'host');
  games.set(newGame.id, newGame);
  return newGame;
}

export function getRandomCoord(): Coords {
  const MARGIN_X = 5;
  const MARGIN_Y = 10;
  return {
    x: Math.max(MARGIN_X, Math.random() * (100 - MARGIN_X)),
    y: Math.max(MARGIN_Y, Math.random() * (100 - MARGIN_Y)),
  };
}

function getGame(games: Map<GameID, Game> = new Map(), gameId: GameID) {
  const game = games.get(gameId);
  if (!game) {
    throw Error(`Game not found ${gameId}`);
  }
  return game;
}
