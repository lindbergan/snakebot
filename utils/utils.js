const Utils = {
  deepClone: obj => {
    return JSON.parse(JSON.stringify(obj))
  },

  euclideanDistance: (pos1, pos2) => {
    const a = Math.pow(pos1.posX - pos2.posX, 2)
    const b = Math.pow(pos1.posY - pos2.posY, 2)
    return Math.sqrt(a + b)
  },

  changePosX: direction => {
    switch (direction) {
      case "right":
        return 1

      case "left":
        return -1

      default:
        return 0;
    }
  },

  changePosY: direction => {
    switch (direction) {
      case "down":
        return 1

      case "up":
        return -1

      default:
        return 0;
    }
  },

  translateDirection: (pos, direction) => {
    const { posX, posY } = pos
    const newX = posX + Utils.changePosX(direction)
    const newY = posY + Utils.changePosY(direction)

    return {
      posX: newX,
      posY: newY,
    }
  },

  getOppositeDirection: direction => {
    switch (direction) {
      case "right": return "left"
      case "left": return "right"
      case "up": return "down"
      default: return "up"
    }
  },

  convertRelativeDirection: (actualDirection, directionRelativeToMe) => {
    if (actualDirection === "left") {
      if (directionRelativeToMe === "left") return "up"
      if (directionRelativeToMe === "forward") return "left"
      if (directionRelativeToMe === "right") return "down"
    }

    if (actualDirection === "right") {
      if (directionRelativeToMe === "left") return "down"
      if (directionRelativeToMe === "forward") return "right"
      if (directionRelativeToMe === "right") return "up"
    }

    if (actualDirection === "up") {
      if (directionRelativeToMe === "left") return "right"
      if (directionRelativeToMe === "forward") return "up"
      if (directionRelativeToMe === "right") return "left"
    }

    if (actualDirection === "down") {
      if (directionRelativeToMe === "left") return "left"
      if (directionRelativeToMe === "forward") return "down"
      if (directionRelativeToMe === "right") return "right"
    }
  }
}

export default Utils