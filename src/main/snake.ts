import uuid from "uuid4"

import { Direction, Position, Game } from "./game"
import { getRandomName, posToString } from "./util"
import { Strategy, Strategies, StrategyMap } from "./strategies/strategies"

export class Snake {
  positions: Position[]
  head: Position
  length: number
  id: string
  name: string
  direction: Direction
  alive: boolean
  strategy: Strategy

  constructor(
    positions: Position[],
    direction: Direction,
    strategy?: Strategy,
    name?: string) {
    if (name) this.name = name
    this.name = getRandomName()

    if (strategy) this.strategy = strategy
    else this.strategy = StrategyMap[Strategies.STRAIGHT_AND_STUPID]

    this.id = uuid()

    this.direction = direction

    if (positions.length < 2) throw new Error("Must have at least two cells in size.")
    
    this.positions = positions
    this.head = positions[0]
    this.length = this.positions.length
    this.alive = true
  }

  move(game: Game): Direction {
    return this.strategy.move(this, game)
  }

  printInfo() {
    process.stdout.write(`Snake:
      Name: ${this.name}
      ID: ${this.id}
      Head: ${posToString(this.head)}
      Alive: ${this.alive}
      Strategy: ${this.strategy.type}
      Direction: ${this.direction}
      Length: ${this.length}
      Positions: ${this.positions.map(posToString).join(" ")}
    \n`)
  }
}