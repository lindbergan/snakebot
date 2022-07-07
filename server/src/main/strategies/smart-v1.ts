import { Direction, Game, DIRECTION_VALUES, Position } from "../game"
import { Snake } from "../snake"
import {
  translatePosition,
  euclideanDistance,
  getOppositeDirection,
  posEq
} from "../util"
import { Strategy } from "./strategies"

type SnakeRangeComparison = {
  snake: Snake | null,
  range: number
}

type DirectionRangeComparison = {
  direction: Direction | null,
  range: number,
  freeTiles: number
}

const countFreeTiles = (snake: Snake, game: Game, direction: Direction): number => {
  let freeTiles = 0

  const getDirections = (pos: Position, dir: Direction): Direction[] =>
    DIRECTION_VALUES
      .filter(d => d !== getOppositeDirection(dir))
      .filter(d => game.isPositionFreeToMoveTo(translatePosition(pos, d)))

  const getNeighbours = (pos: Position, dir: Direction, visited: Position[]): Position[] =>
    getDirections(pos, dir)
      .map(dirFound => translatePosition(pos, dirFound))
      .filter(pos => !visited.find(({ x, y }) => pos.x === x && pos.y === y))

  const queue: {
    pos: Position,
    dir: Direction
  }[] = []
  const visited: Position[] = []

  // This is the position corresponding to the direction we are checking
  const newPosition = translatePosition(snake.head, direction)
  const directionsFromHere = getDirections(newPosition, direction)

  freeTiles += directionsFromHere.length

  const handler = (currentPos: Position,
    dirs: Direction[], visited: Position[]) => {
    for (let d of dirs) {
      const newPos = translatePosition(currentPos, d)
  
      visited.push(newPos)

      const batch = getNeighbours(newPos, d, visited)
        .map(pos => ({
          pos,
          dir: d
        }))

      freeTiles += batch.length
      
      queue.push(...batch)
    }
  }

  handler(newPosition, directionsFromHere, visited)

  let iter = 0

  for (let { pos, dir } of queue) {
    // Stop at iteration 10
    if (iter >= 10) return freeTiles

    handler(pos, getDirections(pos, dir), visited)
    iter++
  }


  // 0 is almost 0.01 and it helps with div by 0
  return freeTiles || 0.01
}

/* A-star todo: redo */
const countRange = (startPos: Position, endPos: Position,
  snake: Snake, game: Game): number => {

  type PositionComparison = {
    pos: Position,
    cost: number, // f-cost
    gCost: number,
    hCost: number
  }

  const getNeighbours = (pos: Position, game: Game, closed: Position[]): Position[] =>
    DIRECTION_VALUES
      .map(dir => translatePosition(pos, dir))
      .filter(pos => game.isPositionFreeToMoveTo(pos))
      .filter(pos => !closed.find(({ x, y }) => pos.x === x && pos.y === y))

  const getCost = (startPos: Position, endPos: Position, pos: Position): {
    cost: number, gCost: number, hCost: number } => ({
    gCost: euclideanDistance(startPos, pos),
    hCost: euclideanDistance(endPos, pos),
    cost: euclideanDistance(startPos, pos) + euclideanDistance(endPos, pos)
  })

  const closed: PositionComparison[] = []
  const open: PositionComparison[] = getNeighbours(startPos, game, closed.map(({ pos }) => pos))
    .map(pos => ({
      pos,
      ...getCost(startPos, endPos, pos)
    }))
    .sort((a, b) => a.cost - b.cost)

  const isInOpen = (pos: Position): boolean =>
    !!open.find(({ pos: { x, y } }) => pos.x === x && pos.y === y)

  let current: PositionComparison | undefined

  snake.log("Before loop\n" + open.map(({ pos, cost }) => `(${pos.x}, ${pos.y}):${cost.toFixed(1)}`).join(", ") + "\n" + "Open length: " + open.length)

  while (open.length > 0) {
    current = open.pop()

    if (current === undefined) return 9999

    closed.push(current)

    if (posEq(current.pos, endPos)) return current.cost
    else {
      const neighbours: PositionComparison[] = getNeighbours(current.pos, game, closed.map(({ pos }) => pos))
        .map(pos => ({
          pos,
          ...getCost(startPos, endPos, pos)
        }))

      for (let neighbour of neighbours) {
        const newCost = current.gCost = euclideanDistance(current.pos, neighbour.pos)

        if ((newCost < neighbour.gCost) || !isInOpen(neighbour.pos)) {
          neighbour.gCost = newCost
          neighbour.hCost = euclideanDistance(neighbour.pos, endPos)
          neighbour.cost = neighbour.gCost + neighbour.hCost

          if (!isInOpen(neighbour.pos)) {
            open.push(neighbour)
            open.sort((a, b) => a.cost - b.cost)
          }
        }
      }
    }
  }

  const choices = getNeighbours(startPos, game, [])
    .map(pos => closed.find(({ pos: { x, y } }) => x === pos.x && y === pos.y))
    .sort((a, b) => {
      if (!a || !b) return 0
      return a.cost - b.cost
    })

  if (choices.length > 0 && choices[0]) return choices[0].cost

  return 9998
}

export const SmartV1: Strategy = {
  type: "smart-v1",
  move(snake: Snake, game: Game): Direction {
    const directions = DIRECTION_VALUES
      .filter(d => d !== getOppositeDirection(snake.direction))
      .filter(d => game.isPositionFreeToMoveTo(translatePosition(snake.head, d)))

    const head = snake.head
    const otherSnakes = game.snakes
      .filter(({ id, alive }) => alive && id !== snake.id)

    let closestSnake: SnakeRangeComparison = {
      snake: null,
      range: 9999
    }

    for (let otherSnake of otherSnakes) {
      // Measure euclidean distance from my head to enemy head
      
      const enemyHead = otherSnake.head
      const range = countRange(head, enemyHead, snake, game)

      if (closestSnake === null) {
        closestSnake = { snake: otherSnake, range }
      } else if (range < closestSnake.range) {
        closestSnake = { snake: otherSnake, range }
      }
    }

    if (closestSnake.snake === null) {
      snake.log("Closest snake should have been found.")
      return Direction.DOWN
    }

    const enemyHead = closestSnake.snake.head

    let closestDirection: DirectionRangeComparison = {
      direction: null,
      range: 9999,
      freeTiles: 1
    }

    snake.log("My choices are: ")
    snake.log(directions)

    for (let direction of directions) {
      const maybePosition = translatePosition(head, direction)
      const range = countRange(maybePosition, enemyHead, snake, game)
      const freeTiles = countFreeTiles(snake, game, direction)

      const isCloser = range < closestDirection.range
      const freeTilesScale = freeTiles / closestDirection.freeTiles
      
      const more = freeTilesScale > 1
      const muchLess = freeTilesScale < 5
      const lessLimit = freeTilesScale > 0.8
      const above20 = freeTiles > 20

      // Never choose much less
      if (above20 && isCloser) {
        closestDirection = { direction, range, freeTiles }
      }
      else if (!muchLess) {
        if (isCloser && (more || lessLimit)) {
          closestDirection = { direction, range, freeTiles }
        }
      }

      snake.log({ direction, range, freeTiles })
    }

    if (closestDirection.direction === null) {
      snake.log("Closest direction should have been found.")
      return Direction.DOWN
    }

    snake.log("Chose: " + closestDirection.direction)
    
    return closestDirection.direction
  }
}
