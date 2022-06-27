"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../main/util");
const game_1 = require("../main/game");
describe('testing util file', () => {
    test('translatePosition - 0,0 with direction up should be 0,1', () => {
        const pos = { x: 0, y: 0 };
        const direction = game_1.Direction.UP;
        const shouldBe = { x: 0, y: 1 };
        expect((0, util_1.translatePosition)(pos, direction)).toStrictEqual(shouldBe);
    });
});
