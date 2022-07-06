import uuid from "uuid4"

import { Direction, Position, Game } from "./game"
import { posToString } from "./util"
import { Strategy, Strategies, StrategyMap } from "./strategies/strategies"

export class Snake {
  positions: Position[]
  head: Position
  length: number
  id: string
  direction: Direction
  alive: boolean
  strategy: Strategy
  print: Boolean

  constructor(
    positions: Position[] = [],
    direction: Direction = Direction.DOWN,
    strategy: Strategy = StrategyMap[Strategies.SMARTV1],
    print: Boolean = false) {

    this.id = uuid()

    this.direction = direction
    this.strategy = strategy

    this.positions = positions
    this.head = positions[0]
    this.length = this.positions.length
    this.alive = true
    this.print = print
  }

  move(game: Game): Direction {
    if (!this.alive) throw new Error("Cannot move a dead snake")

    const direction = this.strategy.move(this, game)
    this.direction = direction

    return direction
  }

  printInfo() {
    process.stdout.write(`Snake:
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