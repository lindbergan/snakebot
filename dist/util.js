"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posEq = exports.getOppositeDirection = exports.translatePosition = exports.changePosY = exports.changePosX = exports.getRandomPosition = exports.getRandomDirection = exports.getRandomName = void 0;
const game_1 = require("./game");
function getRandomName() {
    return "Adrian" + Math.random();
}
exports.getRandomName = getRandomName;
function getRandomDirection() {
    const rnd = Math.random();
    if (rnd < 0.25)
        return game_1.Direction.UP;
    else if (rnd >= 0.25 && rnd < 0.5)
        return game_1.Direction.RIGHT;
    else if (rnd >= 0.5 && rnd < 0.75)
        return game_1.Direction.DOWN;
    else
        return game_1.Direction.LEFT;
}
exports.getRandomDirection = getRandomDirection;
function getRandomPosition(width, height) {
    return {
        x: parseInt((Math.random() * width).toString()),
        y: parseInt((Math.random() * height).toString())
    };
}
exports.getRandomPosition = getRandomPosition;
function changePosX(direction) {
    switch (direction) {
        case game_1.Direction.RIGHT: return 1;
        case game_1.Direction.LEFT: return -1;
        default: return 0;
    }
}
exports.changePosX = changePosX;
function changePosY(direction) {
    switch (direction) {
        case game_1.Direction.UP: return 1;
        case game_1.Direction.DOWN: return -1;
        default: return 0;
    }
}
exports.changePosY = changePosY;
function translatePosition(pos, direction) {
    const { x, y } = pos;
    const deltaX = changePosX(direction);
    const deltaY = changePosY(direction);
    return {
        x: x + deltaX,
        y: y + deltaY
    };
}
exports.translatePosition = translatePosition;
function getOppositeDirection(direction) {
    switch (direction) {
        case game_1.Direction.DOWN: return game_1.Direction.UP;
        case game_1.Direction.UP: return game_1.Direction.DOWN;
        case game_1.Direction.RIGHT: return game_1.Direction.LEFT;
        case game_1.Direction.LEFT: return game_1.Direction.RIGHT;
    }
}
exports.getOppositeDirection = getOppositeDirection;
function posEq(posA, posB) {
    return posA.x === posB.x && posA.y === posB.y;
}
exports.posEq = posEq;
