"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snake = void 0;
const uuid4_1 = __importDefault(require("uuid4"));
const util_1 = require("./util");
class Snake {
    constructor(positions, direction, name) {
        if (name)
            this.name = name;
        this.name = (0, util_1.getRandomName)();
        this.id = (0, uuid4_1.default)();
        this.direction = direction;
        if (positions.length < 2)
            throw new Error("Must have at least two cells in size.");
        this.positions = positions;
        this.head = positions[0];
        this.length = this.positions.length;
    }
    printInfo() {
        console.log(`Snake:
      Name: ${this.name}
      ID: ${this.id}
      Head: ${(0, util_1.posToString)(this.head)}
      Length: ${this.length}
      Direction: ${this.direction}
      Positions: ${this.positions.map(util_1.posToString).join(" ")}
    `);
    }
}
exports.Snake = Snake;
