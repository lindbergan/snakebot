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

  constructor(
    width: number = DEFAULTS.width,
    height: number = DEFAULTS.height,
    nrOfSnakes: number = DEFAULTS.nrOfSnakes
  ) {
    this.width = width
    this.height = height

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
    while(positions.length < DEFAULTS.startLength) {
      if (positions.length === 0) positions.push(getRandomPosition(this.width, this.height))

      if (positions.length < DEFAULTS.startLength) {
        if (positions.length === 0) throw Error("Positions length should not be 0 here.")

        const lastPos = positions.slice(-1)[0]
        const oppositeDirection = getOppositeDirection(direction)
        positions.push(translatePosition(lastPos, oppositeDirection))
      }
      else {
        // Reset and try again
        if (positions.some(pos => !this.isValidPosition(pos))) positions = []
      }

      tries++
    }

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

  isValidPosition(pos: Position): boolean {
    return !this.isSnakeAtPosition(pos) && this.map.isValidPosition(pos)
  }

  start(): void {
    console.log("Starting game")
    console.log("-------------------")
    console.log("Init map")
    this.map.printMap()
  }
}