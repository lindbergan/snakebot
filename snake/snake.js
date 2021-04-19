import StraightAndStupid from "./strategies/straightAndStupid.js"
import SmartV1 from "./strategies/smart-v1.js"
import SmartV2 from "./strategies/smart-v2.js"

export const getBestDirection = (game, snake) => {
  switch (snake.strategy) {
    case "straight-and-stupid":
      return StraightAndStupid.getBestDirection(game, snake)

    case "smart-v1":
      return SmartV1.getBestDirection(game, snake)

    case "smart-v2":
      return SmartV2.getBestDirection(game, snake)

    default:
      'down';
  }
}
