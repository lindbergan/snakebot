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

const countFreeTiles = (snake: Snake, game: Game): number => {
  let freeTiles = 0

  const getDirections = (direction: Direction, head: Position) => {
    return DIRECTION_VALUES
      .filter(d => d !== getOppositeDirection(direction))
      .filter(d => game.isPositionFreeToMoveTo(translatePosition(head, d)))
  }

  const handler = (direction: Direction, head: Position): [Direction[], number] => {
    const originalDirections = getDirections(direction, head)

    if (originalDirections.length === 0) return [[], 0]

    return [ originalDirections, originalDirections.length ]
  }

  for (let i = 0; i < 5; i++) {
    let testPos = snake.head

    const [ directions, free ] = handler(snake.direction, testPos)

    freeTiles += free

    for (let direction of directions) {
      const position = translatePosition(testPos, direction)

      const [ dirs, frees ] = handler(direction, position)

      freeTiles += frees
    }
  }

  return freeTiles
}

export const SmartV1: Strategy = {
  type: "smart-v1",
  move(snake: Snake, game: Game): Direction {
    const directions = DIRECTION_VALUES
      .filter(d => d !== getOppositeDirection(snake.direction))

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
      freeTiles: -1
    }

    for (let direction of directions) {
      const maybePosition = translatePosition(head, direction)
      const possible = game.isPositionFreeToMoveTo(maybePosition)
      const range = possible ? euclideanDistance(maybePosition, enemyHead) : 9999
      const freeTiles = countFreeTiles(snake, game)

      if (closestDirection === null) {
        closestDirection = { direction, range, freeTiles }
      } else if (range < closestDirection.range) {
        closestDirection = { direction, range, freeTiles }
      }
    }

    if (closestDirection.direction === null) throw new Error("Closest direction should have been found.")
    
    return closestDirection.direction
  }
}
