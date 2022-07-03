import { Direction, Position } from "./game"

export function getRandomDirection(): Direction {
  const rnd = Math.random()

  if (rnd < 0.25) return Direction.UP
  else if (rnd >= 0.25 && rnd < 0.5) return Direction.RIGHT
  else if (rnd >= 0.5 && rnd < 0.75) return Direction.DOWN
  else return Direction.LEFT
}

export function getRandomPosition(width: number, height: number): Position {
  return {
    x: parseInt((Math.random() * width).toString()),
    y: parseInt((Math.random() * height).toString())
  }
}

export function changePosX(direction: Direction): number {
  switch(direction) {
    case Direction.UP: return 1
    case Direction.DOWN: return -1

    default: return 0
  }
}

export function changePosY(direction: Direction): number {
  switch(direction) {
    case Direction.LEFT: return -1
    case Direction.RIGHT: return 1

    default: return 0
  }
}

export function translatePosition(pos: Position, direction: Direction): Position {
  const { x, y } = pos

  const deltaX = changePosX(direction)
  const deltaY = changePosY(direction)

  return {
    x: x + deltaX,
    y: y + deltaY
  }
}

export function getOppositeDirection(direction: Direction): Direction {
  switch(direction) {
    case Direction.DOWN: return Direction.UP
    case Direction.UP: return Direction.DOWN
    case Direction.RIGHT: return Direction.LEFT
    case Direction.LEFT: return Direction.RIGHT
  }
}

export function posEq(posA: Position, posB: Position): boolean {
  return posA.x === posB.x && posA.y === posB.y
}

export function posToString(pos: Position): string {
  return `{ x: ${pos.x}, y: ${pos.y} }`
}

export function euclideanDistance(pos1: Position, pos2: Position) {
  const a = Math.pow(pos1.x - pos2.x, 2)
  const b = Math.pow(pos1.y - pos2.y, 2)
  return Math.sqrt(a + b)
}

export function deepClone(object: any) {
  if (typeof object !== "object") throw new Error("Trying to clone a nonjson")

  return JSON.parse(JSON.stringify(object))
}

