import Game from "./game/game.js"
import SnakeMap from "./map/map.js"
import Utils from "../utils/utils.js"

window.Game = Game
window.SnakeMap = SnakeMap
window.Utils = Utils

/* Add snakes */
Game.initSnake({
  direction: 'right',
  color: '#8a40bfbf', // Purple
  headColor: "#9019e6bf",
  positions: [],
  name: "Snake 1",
  // human: true,
  strategy: "smart-v2",
})

Game.initSnake({
  direction: 'down',
  color: '#4060bfbf', // Blue
  headColor: "#194ce6bf",
  positions: [],
  name: "Snake 2",
  strategy: "smart-v2",
})

Game.initSnake({
  direction: 'up',
  color: '#bf6040bf',
  headColor: "#e64d19bf",
  positions: [],
  name: "Snake 3",
  strategy: "smart-v2",
})

Game.initSnake({
  direction: 'left',
  color: '#bfb540bf',
  headColor: "#e6d419bf",
  positions: [],
  name: "Snake 4",
  strategy: "smart-v2",
})

SnakeMap.draw(Game)

// Game.step(SnakeMap.grid)

/* Start event loop */
// Game.run(grid)

/* Wait so that I can record */
// setTimeout(() => {
//   Game.run(grid)
// }, 5000);
