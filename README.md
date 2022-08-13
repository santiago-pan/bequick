# Quick click

Quick click is a frameworks that allows to measure reaction times for a group of user.

The framework can be executed in different flavous like in this case, trough a game.

## How it works

Quick click uses websockets under the hood to communicate the client frontend applications with the server.
The reaction time is measured independently to the connection lag or device performance.

## TODO

- Rename 'gameid' by just 'id'
- If a URL has id, chek with the server that the game is not finished or ongoing
- If the game is finished or ongoing redirect to some error page or to starting page

DONE:
- Allow multiple and independent games: getSockets([ids])
- Stype the Game screen
