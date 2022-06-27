import uuid from "uuid4"

import { Direction, Position } from "./game"
import { getRandomName } from "./util"

export class Snake {
  positions: Position[]
  head: Position
  length: number
  id: String
  name: String
  direction: Direction

  constructor(positions: Position[], direction: Direction, name?: String) {
    if (name) this.name = name
    this.name = getRandomName()

    this.id = uuid()

    this.direction = direction

    if (positions.length < 2) throw new Error("Must have at least two cells in size.")
    
    this.positions = positions
    this.head = positions[0]
    this.length = this.positions.length
  }
}