"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../main/game");
describe('testing game file', () => {
    test('should be able to create a game', () => {
        const game = new game_1.Game();
        expect(game.snakes.length).toBeGreaterThan(0);
    });
    test('should check valid positions', () => {
        const game = new game_1.Game();
        const correctPos = { x: 0, y: 0 };
        expect(game.isValidPosition(correctPos)).toBeTruthy();
        const faultyXPosHigh = { x: 99, y: 0 };
        expect(game.isValidPosition(faultyXPosHigh)).toBeFalsy();
        const faultyXPosLow = { x: -1, y: 0 };
        expect(game.isValidPosition(faultyXPosLow)).toBeFalsy();
        const faultyPosYHigh = { x: 0, y: 999 };
        expect(game.isValidPosition(faultyPosYHigh)).toBeFalsy();
        const faultyPosYLow = { x: 0, y: -9 };
        expect(game.isValidPosition(faultyPosYLow)).toBeFalsy();
    });
    test('should create snakes at the right positions', () => {
        const game = new game_1.Game();
        game.snakes.forEach(snake => {
            return expect(snake.positions.every(pos => game.isValidPosition(pos))).toBeTruthy();
        });
    });
    test('should create snakes with correct length', () => {
        const game = new game_1.Game(10, 10, 1, 4);
        game.snakes.forEach(snake => {
            return expect(snake.positions.length).toBe(4);
        });
        const game2 = new game_1.Game(10, 10, 1, 3);
        game2.snakes.forEach(snake => {
            return expect(snake.positions.length).toBe(3);
        });
    });
});
