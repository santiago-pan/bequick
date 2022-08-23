import { Game, getGame, getGames, newGame } from '../GameManager';

describe('Thest for Game Manager', () => {
  it('create a new defaul game', () => {
    const gameId = 'abc123';
    newGame(gameId);
    expect(getGames().get(gameId)).toBeDefined();
  });

  it('create a new game', () => {
    const gameId = 'abc123';
    newGame(gameId, 10, 5);
    const game = getGames().get(gameId);
    if (!game) {
      throw new Error("Value doesn't exist");
    }
    expect(game.totalPlayers).toBe(10);
    expect(game.totalRounds).toBe(5);
    expect(game.getPlayers().size).toBe(1);
    expect(game.getPlayers().get('abc123')).toBeDefined();
    expect(game.getPlayers().get('abc123')?.role).toBe('host');
    expect(game.getPlayers().get('abc123')?.playerId).toBe('abc123');
    expect(game.getPlayers().get('abc123')?.score).toBe(0);
    expect(game.getRound.length).toBe(0);
  });

  it('create a new game and add players', () => {
    const gameId = 'abc123';
    newGame(gameId);
    const game = getGames().get(gameId);
    if (!game) {
      throw new Error("Value doesn't exist");
    }
    game.addPlayer('player1', 'join');
    expect(game.getPlayers().size).toBe(2);
    expect(game.getPlayers().get('player1')).toBeDefined();
    expect(game.getPlayers().get('player1')?.role).toBe('join');
    expect(game.getPlayers().get('player1')?.playerId).toBe('player1');
    expect(game.getPlayers().get('player1')?.score).toBe(0);
    expect(game.getRounds().length).toBe(0);
  });

  it('should test getting a non existing game', () => {
    try {
      const game = getGame(getGames(), 'non-game');
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should test that no more players can join when all in', () => {
    const gameId = 'player1';
    const game = newGame(gameId, 2, 1);
    game.addPlayer('player2', 'join');
    expect(game.allPlayersIn()).toBeTruthy();
    game.addPlayer('player3', 'join');
    expect(game.players.size).toBe(2);
  });

  it('should test that a non joined player can not roll in a game', () => {
    const gameId = 'player1';
    const game = newGame(gameId, 2, 1);
    game.addPlayer('player2', 'join');
    expect(game.allPlayersIn()).toBeTruthy();
    game.addRound();
    game.updateRound('player3', 100);
    expect(game.getRound()?.rolls.size).toBe(0);
  });

  it('should test that same player can not play more than one roll per round', () => {
    const gameId = 'player1';
    const game = newGame(gameId, 2, 1);
    expect(game.allPlayersIn()).toBeFalsy();
    game.addPlayer('player2', 'join');
    expect(game.allPlayersIn()).toBeTruthy();

    game.addRound();
    expect(game.gameIsOver()).toBeFalsy();
    expect(game.roundIsOver()).toBeFalsy();
    game.updateRound('player1', 102);
    game.updateRound('player1', 100);
    expect(game.roundIsOver()).toBeFalsy();
    game.updateRound('player2', 101);
    expect(game.roundIsOver()).toBeTruthy();

    expect(game.getRound()?.rolls.get('player1')?.time).toBe(102);
    expect(game.getRound()?.rolls.get('player2')?.time).toBe(101);
    expect(game.roundWinner()).toEqual('player2');
  });

  it('should play a full game', () => {
    const gameId = 'player1';
    const game = newGame(gameId, 3, 2);
    expect(game.allPlayersIn()).toBeFalsy();
    game.addPlayer('player2', 'join');
    expect(game.allPlayersIn()).toBeFalsy();
    game.addPlayer('player3', 'join');
    expect(game.allPlayersIn()).toBeTruthy();

    game.addRound();
    expect(game.gameIsOver()).toBeFalsy();
    expect(game.roundIsOver()).toBeFalsy();
    game.updateRound('player3', 103);
    expect(game.roundIsOver()).toBeFalsy();
    game.updateRound('player1', 101);
    expect(game.roundIsOver()).toBeFalsy();
    game.updateRound('player2', 102);
    expect(game.roundIsOver()).toBeTruthy();

    expect(game.getRound()?.rolls.get('player1')?.time).toBe(101);
    expect(game.getRound()?.rolls.get('player2')?.time).toBe(102);
    expect(game.getRound()?.rolls.get('player3')?.time).toBe(103);
    expect(game.roundWinner()).toEqual('player1');

    game.addRound();
    expect(game.gameIsOver()).toBeFalsy();
    expect(game.roundIsOver()).toBeFalsy();
    game.updateRound('player3', 93);
    expect(game.roundIsOver()).toBeFalsy();
    game.updateRound('player1', 91);
    expect(game.roundIsOver()).toBeFalsy();
    game.updateRound('player2', 92);
    expect(game.roundIsOver()).toBeTruthy();

    expect(game.getRound()?.rolls.get('player1')?.time).toBe(91);
    expect(game.getRound()?.rolls.get('player2')?.time).toBe(92);
    expect(game.getRound()?.rolls.get('player3')?.time).toBe(93);
    expect(game.roundWinner()).toEqual('player1');

    expect(game.gameIsOver()).toBeTruthy();

    expect(game.getPlayers().get('player1')?.score).toBe(2);
    expect(game.getPlayers().get('player2')?.score).toBe(0);
    expect(game.getPlayers().get('player3')?.score).toBe(0);
  });

  it('should create two games', () => {
    const game1Id = 'player1Game1';
    let game = newGame(game1Id, 2, 2);
    expect(game.allPlayersIn()).toBeFalsy();
    game.addPlayer('player2Game1', 'join');
    expect(game.allPlayersIn()).toBeTruthy();

    const game2Id = 'player1Game2';
    game = newGame(game2Id, 3, 2);
    expect(game.allPlayersIn()).toBeFalsy();
    game.addPlayer('player2Game2', 'join');
    expect(game.allPlayersIn()).toBeFalsy();
    game.addPlayer('player3Game2', 'join');
    expect(game.allPlayersIn()).toBeTruthy();

    // Game 1
    const game1 = getGames().get(game1Id);
    expect(game1).toBeDefined();
    if (game1) {
      expect(game1.getPlayersIds().length).toBe(2);
      expect(game1.getPlayersIds()[0]).toBe('player1Game1');
      expect(game1.getPlayersIds()[1]).toBe('player2Game1');
      game1.addRound();
      expect(game1.gameIsOver()).toBeFalsy();
      expect(game1.roundIsOver()).toBeFalsy();
      game1.updateRound('player1Game1', 101);
      expect(game1.roundIsOver()).toBeFalsy();
      game1.updateRound('player2Game1', 102);
      expect(game1.roundIsOver()).toBeTruthy();

      expect(game1.getRound()?.rolls.get('player1Game1')?.time).toBe(101);
      expect(game1.getRound()?.rolls.get('player2Game1')?.time).toBe(102);
      expect(game1.roundWinner()).toEqual('player1Game1');
    }

    // Game 2
    const game2 = getGames().get(game2Id);
    expect(game2).toBeDefined();
    if (game2) {
      expect(game2.getPlayersIds().length).toBe(3);
      expect(game2.getPlayersIds()[0]).toBe('player1Game2');
      expect(game2.getPlayersIds()[1]).toBe('player2Game2');
      expect(game2.getPlayersIds()[2]).toBe('player3Game2');
      game2.addRound();
      expect(game2.gameIsOver()).toBeFalsy();
      expect(game2.roundIsOver()).toBeFalsy();
      game2.updateRound('player3Game2', 103);
      expect(game2.roundIsOver()).toBeFalsy();
      game2.updateRound('player1Game2', 101);
      expect(game2.roundIsOver()).toBeFalsy();
      game2.updateRound('player2Game2', 102);
      expect(game2.roundIsOver()).toBeTruthy();

      expect(game2.getRound()?.rolls.get('player1Game2')?.time).toBe(101);
      expect(game2.getRound()?.rolls.get('player2Game2')?.time).toBe(102);
      expect(game2.getRound()?.rolls.get('player3Game2')?.time).toBe(103);
      expect(game2.roundWinner()).toEqual('player1Game2');
    }
  });

  it('should perform a stress test', () => {
    const NUM_GAMES = 1000;
    const NUM_PLAYERS = 100;
    const NUM_ROUNDS = 10;

    const games: Array<Game> = [];

    for (let gameIndex = 0; gameIndex < NUM_GAMES; gameIndex++) {
      const allgames = getGames();
      const game = new Game(gameIndex.toString(), NUM_PLAYERS, NUM_ROUNDS);
      allgames.set(game.id, game);
      games.push(game);
    }
    for (const game of games) {
      for (let playerIndex = 0; playerIndex < NUM_PLAYERS; playerIndex++) {
        game.addPlayer(`${game.id}-${playerIndex.toString()}`, 'join');
      }
    }
    for (const game of games) {
      for (let roundIndex = 0; roundIndex < NUM_ROUNDS; roundIndex++) {
        game.addRound();
        for (let playerIndex = 0; playerIndex < NUM_PLAYERS; playerIndex++) {
          const playerId = `${game.id}-${playerIndex.toString()}`;
          game.updateRound(playerId, 200 - playerIndex);
        }
      }
    }

    for (const game of games) {
      expect(game.roundIsOver()).toBeTruthy();
      expect(game.gameIsOver()).toBeTruthy();
      expect(game.roundWinner()).toBe(`${game.id}-${NUM_PLAYERS - 1}`);
    }
  });
});

export function assertExists<A>(value: A | null | undefined): boolean {
  if (!value) {
    throw new Error("Value doesn't exist");
  } else {
    return true;
  }
}
