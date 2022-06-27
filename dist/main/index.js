"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const WIDTH = 6, HEIGHT = 6, NR_OF_SNAKES = 2;
const game = new game_1.Game(WIDTH, HEIGHT, NR_OF_SNAKES);
game.start();
