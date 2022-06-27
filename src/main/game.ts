import { SnakeMap } from "./map"
import { Snake } from "./snake"
import {
  getRandomDirection,
  getRandomPosition,
  getOppositeDirection,
  translatePosition,
} from "./util"

export enum Direction {
  LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down"
}

export type Position = {
  x: number,
  y: number
}

const DEFAULTS = {
  width: 6,
  height: 6,
  nrOfSnakes: 1,
  startLength: 2,
}

export class Game {
  width: number
  height: number
  map: SnakeMap
  snakes: Snake[]
  startLength: number

  constructor(
    width: number = DEFAULTS.width,
    height: number = DEFAULTS.height,
    nrOfSnakes: number = DEFAULTS.nrOfSnakes,
    startLength: number = DEFAULTS.startLength,
  ) {
    this.width = width
    this.height = height
    this.startLength = startLength

    this.snakes = Array.of(...new Array(nrOfSnakes)).map(() => this.createSnake())
    this.map = new SnakeMap(width, height, this.snakes)
  }

  createSnake(): Snake {
    const direction = getRandomDirection()
    const positions: Position[] = this.getRandomSnakeStartPositions(direction)

    return new Snake(positions, direction)
  }

  getRandomSnakeStartPositions(direction: Direction): Position[] {
    let positions: Position[] = []

    let tries = 0
    while(positions.length < this.startLength) {
      if (positions.length === 0) positions.push(getRandomPosition(this.width, this.height))

      if (positions.length < this.startLength) {
        if (positions.length === 0) throw Error("Positions length should not be 0 here.")

        const lastPos = positions.slice(-1)[0]
        const oppositeDirection = getOppositeDirection(direction)
        positions.push(translatePosition(lastPos, oppositeDirection))
      }

      if (!positions.every(pos => this.isValidPosition(pos))) positions = []

      tries += 1
    }

    console.log("Took " + tries + " amt of tries")

    return positions
  }

  getSnakeAtPosition(pos: Position): Snake | undefined {
    return this.snakes.find(snake => {
      return snake.positions.some(p => p.x === pos.x && p.y === pos.y)
    })
  }

  isSnakeAtPosition(pos: Position): boolean {
    return this.getSnakeAtPosition(pos) !== undefined
  }

  isValidPosition(pos: Position) {
      return pos.x >= 0 && pos.x < this.width &&
             pos.y >= 0 && pos.y < this.height
  }

  isPositionFreeToMoveTo(pos: Position): boolean {
    return this.isValidPosition(pos) && !this.isSnakeAtPosition(pos)
  }

  start(): void {
    console.log("Starting game")
    console.log("-------------------")
    console.log("Init snakes")

    this.snakes.forEach(snake => snake.printInfo())

    console.log("Init map")
    this.map.printMap()
  }
}