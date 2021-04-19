import Utils from "../../utils/utils.js"

const {
  euclideanDistance,
  translateDirection,
  convertRelativeDirection,
  getOppositeDirection,
} = Utils

const nrOfTilesToCheck = 5

const SmartV2 = {
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

      const freeTilesA = SmartV2.getNoOfFreeTiles(maybePosition, a.direction)
      const freeTilesB = SmartV2.getNoOfFreeTiles(maybePosition, b)

      // console.log({
      //   noOfFreeTiles,
      //   direction: b,
      //   a,
      //   obj,
      //   myDirection
      // })

      const side1 = Math.pow(a.distance, 2) - freeTilesA
      const side2 = Math.pow(obj.distance, 2) - freeTilesB

      // console.log({
      //   a: a.direction,
      //   b,
      //   side1,
      //   side2,
      // })

      return side1 < side2 ? a : obj
    }, { direction: null, distance: Number.MAX_VALUE }).direction
    return closestDirection
  },

  getNoOfFreeTiles: (maybePosition, direction) => {
    if (!direction) return -1

    // Check x times ahead if good direction
    const pillar = [
      ["forward", "forward", "forward", "forward", "forward"],
      ["left", "forward", "forward", "forward", "forward"],
      ["right", "forward", "forward", "forward", "forward"],
    ]
    var noOfFreeTiles = 0
    for (let i = 0; i < pillar.length; i++) {
      const path = pillar[i]
      var pos = maybePosition
      for (let j = 0; j < path.length; j++) {
        pos = translateDirection(pos, convertRelativeDirection(direction, path[j]))

        if (Game.isSquareFreeToMoveTo(pos.posX, pos.posY)) {
          noOfFreeTiles += 1
        } else {
          continue;
        }
      }
    }

    return noOfFreeTiles
  },
}


export default SmartV2