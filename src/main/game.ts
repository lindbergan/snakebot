import { SnakeMap } from "./map"
import { Snake } from "./snake"
import {
  getRandomDirection,
  getRandomPosition,
  getOppositeDirection,
  translatePosition,
  deepClone
} from "./util"

export enum Direction {
  LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down"
}

export const DIRECTION_VALUES = [
  Direction.UP,
  Direction.RIGHT,
  Direction.DOWN,
  Direction.LEFT
]

export type Position = {
  x: number,
  y: number
}

const DEFAULTS = {
  width: 6,
  height: 6,
  nrOfSnakes: 1,
  startLength: 2,
  intervalWait: 500
}

export class Game {
  width: number
  height: number
  map: SnakeMap
  snakes: Snake[] = []
  startLength: number
  tickNr: number
  gameInterval: NodeJS.Timer | null = null
  intervalWait: number = DEFAULTS.intervalWait

  constructor(
    width: number = DEFAULTS.width,
    height: number = DEFAULTS.height,
    nrOfSnakes: number = DEFAULTS.nrOfSnakes,
    startLength: number = DEFAULTS.startLength,

    // Test only
    testSnakes: Snake[] = []
  ) {
    this.width = width
    this.height = height
    this.startLength = startLength

    if (testSnakes.length === 0) {
      for (let i = 0; i < nrOfSnakes; i++) {
        this.snakes.push(this.createSnake())
      }
    } else {
      this.snakes = testSnakes
    }

    this.map = new SnakeMap(width, height, this.snakes)
    this.tickNr = 1
  }

  /**
   * TEST ONLY
   * @param testContinue {boolean} - Test parameter to continue as you're doing
   */
  step(print: boolean = false, testContinue: boolean = false): void {
    const snakes = this.snakes.map(snake => {
      const dir = testContinue ? snake.direction : snake.move(this)

      return this.moveSnake(snake, dir)
    })

    this.map.updateMap(snakes)
    this.tickNr += 1
    console.log("Tick: " + this.tickNr)

    if (print) this.map.printMap()
  }

  moveSnake(snake: Snake, dir: Direction): Snake {
    const head: Position = deepClone(snake.head)
    const newHead = translatePosition(head, dir)

    if (this.isPositionFreeToMoveTo(newHead)) {
      const lastTail = snake.positions[snake.positions.length - 1]
      snake.positions = [newHead].concat(snake.positions.slice(0, snake.positions.length - 1))
      snake.head = newHead

      if (this.tickNr % 3 === 0) snake.positions.push(lastTail)
    } else {
      snake.alive = false
    }

    return snake
  }

  getSnake(id: string): Snake | undefined {
    return this.snakes.find(snake => snake.id === id)
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

      if (!positions.every(pos => this.isPositionFreeToMoveTo(pos))) positions = []

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

    this.gameInterval = setInterval(() => {
      const aliveSnakes = this.snakes.filter(s => s.alive)

      if (aliveSnakes.length < 2) {
        this.stop()
      }
      else {
        this.step(true)
      }
    }, this.intervalWait)
  }

  stop(): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval)
    }

    console.log("Game has ended")
    process.exit(0)
  }
}