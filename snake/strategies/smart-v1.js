import Utils from "../../utils/utils.js"

const {
  euclideanDistance,
  translateDirection,
  convertRelativeDirection,
  getOppositeDirection,
} = Utils

const nrOfTilesToCheck = 5

const SmartV1 = {
  getBestDirection: (Game, snake) => {
    const directions = [
      "down",
      "up",
      "left",
      "right"
    ]

    const head = snake.positions[0]
    const myDirection = snake.direction
    const otherSnakes = Game.snakes.filter(({ id, dead }) => !dead && id !== snake.id)

    const closestSnake = otherSnakes.reduce((a, b) => {
      // Measure euclidean distance from my head to enemy head
      const enemyHead = b.positions[0]
      const obj = {
        snake: b,
        distance: euclideanDistance(head, enemyHead)
      }

      return a.distance < obj.distance ? a : obj
    }, { snake: null, distance: Number.MAX_VALUE }).snake

    const enemyHead = closestSnake.positions[0]

    const closestDirection = directions
      .filter(d => d !== getOppositeDirection(snake.direction))
      .reduce((a, b) => {
      const maybePosition = translateDirection(head, b)
      const obj = {
        direction: b,
        distance: euclideanDistance(maybePosition, enemyHead)
      }

      // Check if I can go there
      if (!Game.isSquareFreeToMoveTo(maybePosition.posX, maybePosition.posY)) {
        obj.distance += 999
      }

      return a.distance < obj.distance ? a : obj
    }, { direction: null, distance: Number.MAX_VALUE }).direction
    return closestDirection
  },
}


export default SmartV1