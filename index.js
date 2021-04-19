import Game from "./game/game.js"
import SnakeMap from "./map/map.js"
import Utils from "../utils/utils.js"

window.Game = Game
window.SnakeMap = SnakeMap
window.Utils = Utils

/* Add snakes */
Game.initSnake({
  direction: 'right',
  color: '#8a40bfbf',
  positions: [],
  name: "Snake 1",
  // human: true,
  // strategy: "straight-and-stupid",
  strategy: "smart-v1",
})

Game.initSnake({
  direction: 'down',
  color: '#4060bfbf',
  positions: [],
  name: "Snake 2",
  strategy: "smart-v2",
})

Game.initSnake({
  direction: 'up',
  color: '#bf6040bf',
  positions: [],
  name: "Snake 3",
  strategy: "straight-and-stupid",
})

Game.step(SnakeMap.grid)

/* Start event loop */
// Game.run(grid)

/* Wait so that I can record */
// setTimeout(() => {
//   Game.run(grid)
// }, 5000);
