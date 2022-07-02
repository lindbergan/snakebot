import uuid from "uuid4"

import { Direction, Position } from "./game"
import { getRandomName, posToString } from "./util"

export class Snake {
  positions: Position[]
  head: Position
  length: number
  id: string
  name: string
  direction: Direction
  alive: boolean

  constructor(positions: Position[], direction: Direction, name?: string) {
    if (name) this.name = name
    this.name = getRandomName()

    this.id = uuid()

    this.direction = direction

    if (positions.length < 2) throw new Error("Must have at least two cells in size.")
    
    this.positions = positions
    this.head = positions[0]
    this.length = this.positions.length
    this.alive = true
  }

  move(): Direction {
    return this.direction
  }

  printInfo() {
    process.stdout.write(`Snake:
      Name: ${this.name}
      ID: ${this.id}
      Head: ${posToString(this.head)}
      Alive: ${this.alive}
      Direction: ${this.direction}
      Length: ${this.length}
      Positions: ${this.positions.map(posToString).join(" ")}
    \n`)
  }
}