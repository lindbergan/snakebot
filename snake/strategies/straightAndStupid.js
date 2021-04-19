import Utils from "../../utils/utils.js"

const StraightAndStupid = {
  getBestDirection: (Game, snake) => {
    const directions = [
      "down",
      "up",
      "left",
      "right"
    ]

    const returnedDirr = directions.filter(direction => {
      const { posX, posY } = snake.positions[0]
      const newX = posX + Utils.changePosX(direction)
      const newY = posY + Utils.changePosY(direction)

      const isOk = Game.isSquareFreeToMoveTo(newX, newY)
      return isOk
    })[0]
    return returnedDirr
  }
}


export default StraightAndStupid