import { Direction, Game, DIRECTION_VALUES } from "../game"
import { Snake } from "../snake"
import { translatePosition } from "../util"
import { Strategy } from "./strategies"

export const StraightAndStupid: Strategy = {
  type: "straight-and-stupid",
  move(snake: Snake, game: Game): Direction {
    const directions = [...new Set([snake.direction].concat(DIRECTION_VALUES))]

    // Continue until you have to turn
    for (let i = 0; i < directions.length; i++) {
      if (game.isPositionFreeToMoveTo(translatePosition(snake.head, directions[i]))) {
        return directions[i]
      }
    }

    // Will die next turn
    return Direction.DOWN
  }
}