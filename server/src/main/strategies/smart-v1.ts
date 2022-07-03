import { Direction, Game, DIRECTION_VALUES } from "../game"
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
  range: number
}

export const SmartV1: Strategy = {
  type: "smart-v1",
  move(snake: Snake, game: Game): Direction {
    const directions = [...new Set([snake.direction].concat(DIRECTION_VALUES))]

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

    console.log(closestSnake)

    if (closestSnake.snake === null) {
      console.log("Closest snake should have been found.")
      return Direction.DOWN
    }

    const enemyHead = closestSnake.snake.head

    const possibleDirections = directions
      .filter(d => d !== getOppositeDirection(snake.direction))

    let closestDirection: DirectionRangeComparison = {
      direction: null,
      range: 9999
    }

    for (let direction of possibleDirections) {
      const maybePosition = translatePosition(head, direction)
      const range = euclideanDistance(maybePosition, enemyHead)

      if (closestDirection === null) {
        closestDirection = { direction: direction, range }
      } else if (range < closestDirection.range) {
        closestDirection = { direction: direction, range }
      }

      // Check if I can go there
      if (!game.isPositionFreeToMoveTo(maybePosition)) {
        closestDirection.range += 999
      }
    }

    console.log(closestDirection)

    if (closestDirection.direction === null) throw new Error("Closest direction should have been found.")
    
    return closestDirection.direction
  }
}
