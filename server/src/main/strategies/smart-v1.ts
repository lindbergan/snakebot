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
      range: 9999
    }

    for (let direction of directions) {
      const maybePosition = translatePosition(head, direction)
      const possible = game.isPositionFreeToMoveTo(maybePosition)
      const range = possible ? euclideanDistance(maybePosition, enemyHead) : 9999

      console.log({ direction, range })

      if (closestDirection === null) {
        closestDirection = { direction, range }
      } else if (range < closestDirection.range) {
        closestDirection = { direction, range }
      }
    }

    console.log("Chose")
    console.log(closestDirection)
    console.log("------")

    if (closestDirection.direction === null) throw new Error("Closest direction should have been found.")
    
    return closestDirection.direction
  }
}
