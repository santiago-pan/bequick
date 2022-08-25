import { GameState, SCREEN_NAME } from "./AppTypes";

export const initialStateGameScreen: GameState = {
  screen: {
    screen: SCREEN_NAME.GAME,
    clicker: {
      x: 50,
      y: 25,
    },
    gameId: "gameId",
    gameIsOver: false,
    wins: 0,
    playerId: "playerId",
    itemClick: (gameId: string, time: number) => {
      console.log(`Item glick ${gameId} with time ${time}`);
    },
  },
  clicker: null,
  gameId: "1",
  gameIsOver: false,
  wins: 0,
  playersCount: null,
};
