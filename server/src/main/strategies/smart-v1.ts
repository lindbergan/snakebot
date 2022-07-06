import { Direction, Game, DIRECTION_VALUES, Position } from "../game"
import { Snake } from "../snake"
import {
  translatePosition,
  euclideanDistance,
  getOppositeDirection
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


  // 0 is almost 1 and it helps with div by 0
  return freeTiles || 1
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
      const range = euclideanDistance(head, enemyHead)

      if (closestSnake === null) {
        closestSnake = { snake: otherSnake, range }
      } else if (range < closestSnake.range) {
        closestSnake = { snake: otherSnake, range }
      }
    }

    if (closestSnake.snake === null) {
      console.log("Closest snake should have been found.")
      return Direction.DOWN
    }

    const enemyHead = closestSnake.snake.head

    let closestDirection: DirectionRangeComparison = {
      direction: null,
      range: 9999,
      freeTiles: 1
    }

    console.log("My choices are: ")
    console.log(directions)

    for (let direction of directions) {
      const maybePosition = translatePosition(head, direction)
      const range = euclideanDistance(maybePosition, enemyHead)
      const freeTiles = countFreeTiles(snake, game, direction)

      const isCloser = range < closestDirection.range
      const freeTilesScale = freeTiles / closestDirection.freeTiles
      
      const more = freeTilesScale > 1
      const muchLess = freeTilesScale < 5
      const lessLimit = freeTilesScale > 0.8
      const above20 = freeTiles > 20

      // Never choose much less
      if (!muchLess) {

        if (above20 && isCloser) {
          closestDirection = { direction, range, freeTiles }
        }
        else {
          if (isCloser && (more || lessLimit)) {
            closestDirection = { direction, range, freeTiles }
          }
        }
      }

      console.log({ direction, range, freeTiles })
    }

    if (closestDirection.direction === null) {
      console.log("Closest direction should have been found.")
      return Direction.DOWN
    }
    
    return closestDirection.direction
  }
}
