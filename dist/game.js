"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.Direction = void 0;
const map_1 = require("./map");
const snake_1 = require("./snake");
const util_1 = require("./util");
var Direction;
(function (Direction) {
    Direction["LEFT"] = "left";
    Direction["RIGHT"] = "right";
    Direction["UP"] = "up";
    Direction["DOWN"] = "down";
})(Direction = exports.Direction || (exports.Direction = {}));
const DEFAULTS = {
    width: 6,
    height: 6,
    nrOfSnakes: 1,
    startLength: 2,
};
class Game {
    constructor(width = DEFAULTS.width, height = DEFAULTS.height, nrOfSnakes = DEFAULTS.nrOfSnakes) {
        this.width = width;
        this.height = height;
        this.snakes = Array.of(...new Array(nrOfSnakes)).map(() => this.createSnake());
        this.map = new map_1.SnakeMap(width, height, this.snakes);
    }
    createSnake() {
        const direction = (0, util_1.getRandomDirection)();
        const positions = this.getRandomSnakeStartPositions(direction);
        return new snake_1.Snake(positions, direction);
    }
    getRandomSnakeStartPositions(direction) {
        let positions = [];
        let tries = 0;
        while (positions.length < DEFAULTS.startLength) {
            if (positions.length === 0)
                positions.push((0, util_1.getRandomPosition)(this.width, this.height));
            if (positions.length < DEFAULTS.startLength) {
                if (positions.length === 0)
                    throw Error("Positions length should not be 0 here.");
                const lastPos = positions.slice(-1)[0];
                const oppositeDirection = (0, util_1.getOppositeDirection)(direction);
                positions.push((0, util_1.translatePosition)(lastPos, oppositeDirection));
            }
            else {
                // Reset and try again
                if (positions.some(pos => !this.isValidPosition(pos)))
                    positions = [];
            }
            tries++;
        }
        return positions;
    }
    getSnakeAtPosition(pos) {
        return this.snakes.find(snake => {
            return snake.positions.some(p => p.x === pos.x && p.y === pos.y);
        });
    }
    isSnakeAtPosition(pos) {
        return this.getSnakeAtPosition(pos) !== undefined;
    }
    isValidPosition(pos) {
        return !this.isSnakeAtPosition(pos) && this.map.isValidPosition(pos);
    }
    start() {
        console.log("Starting game");
        console.log("-------------------");
        console.log("Init map");
        this.map.printMap();
    }
}
exports.Game = Game;
