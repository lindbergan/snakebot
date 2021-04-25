import Utils from "../../utils/utils.js"

const {
  euclideanDistance,
  translateDirection,
  convertRelativeDirection,
  getOppositeDirection,
  deepClone,
} = Utils

const nrOfTilesToCheck = 5

const SmartV2 = {
  getBestDirection: (Game, snake) => {
    const head = snake.positions[0]
    const myDirection = snake.direction

    console.log("\n" +
      "My head: " + JSON.stringify(head) + "\n" +
      "My direction: " + myDirection)

    const otherSnakes = Game.snakes
      .filter(({ id, dead }) => !dead && id !== snake.id)
      .map(snake => {
        const enemyHead = snake.positions[0]
        return {
          snake,
          distance: euclideanDistance(head, enemyHead)
        }
      })
      .sort((a, b) => a.distance - b.distance)

      if (otherSnakes.length === 0) return myDirection

    // console.log("Other snakes")
    // console.log({ otherSnakes })

    const closestSnake = otherSnakes[0].snake
    const enemyHead = closestSnake.positions[0]

    const directions = [
      "down",
      "up",
      "left",
      "right",
    ]

    const directionDistances = directions
      .filter(d => d !== getOppositeDirection(snake.direction))
      .map((direction) => {
        const maybePosition = translateDirection(head, direction)
        const obj = {
          direction,
          distance: euclideanDistance(maybePosition, enemyHead)
        }

        // Check if I can go there
        if (!Game.isSquareFreeToMoveTo(maybePosition.posX, maybePosition.posY)) {
          obj.distance += 999
        }

        return obj
      })
      .sort((a, b) => a.distance - b.distance)

    //console.log("Closest distances")
    //console.log(directionDistances)

    const closestDirection = directionDistances[0].direction

    const directionWithFreeTiles = directionDistances.map(obj => ({
      ...obj,
      freeTiles: SmartV2.getNoOfFreeTiles(translateDirection(head, obj.direction), obj.direction)
    }))

    console.log("Free tiles")
    console.log({directionWithFreeTiles})

    for (let d = 0; d < directionWithFreeTiles.length; d++) {
      if (directionWithFreeTiles[d].freeTiles > 3) return directionWithFreeTiles[d].direction
    }

    return directionWithFreeTiles[0].direction
  },

  getNoOfFreeTiles: (newPos, myDirection) => {
    console.log("Checking position:", newPos)
    // SnakeMap.highlightPosition(newPos.posX, newPos.posY)

    const patterns = [
      ["forward", "forward", "forward", "forward", "forward"],
      ["left", "right", "forward", "forward", "forward"],
      ["right", "left", "forward", "forward", "forward"]
    ]

    for (let i = 0; i < patterns.length; i++) {
      const path = patterns[i]
      patterns[i] = Utils.deepClone({
        free: 0,
        patterns: patterns[i],
        positionsChecked: [],
      })

      let actualDirection = myDirection
      let actualPos = newPos
      for (let j = 0; j < path.length; j++) {
        const relativeDir = path[j]
        const realDir = convertRelativeDirection(actualDirection, relativeDir)
        actualDirection = realDir

        const thePos = translateDirection(actualPos, realDir)
        actualPos = thePos

        // SnakeMap.highlightPosition(thePos.posX, thePos.posY, "yellow")

        patterns[i].positionsChecked.push(thePos)
        if (Game.isSquareFreeToMoveTo(thePos.posX, thePos.posY)) {
          patterns[i].free += 1
        } else {
          break;
        }
      }
    }

    return patterns.reduce((a, b) => a + b.free, 0)
  },
}


export default SmartV2