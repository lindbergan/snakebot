const SnakeMap = {
  grid: $("#grid"),
  numSquares: 20,

  placeSnake: snake => {
    for (let i = 0; i < snake.positions.length; i++) {
      const { posX, posY } = snake.positions[i]
      const snakeCell = SnakeMap.getCell(posX, posY)

      // Show on board
      if (i === 0) snakeCell.css("background-color", snake.headColor)
      else snakeCell.css("background-color", snake.color)
    }
  },

  getCell: (posX, posY) => {
    return $(SnakeMap.grid.children()[posX].children[posY])
  },

  draw: game => {
    // Clear previous tick
    SnakeMap.grid.empty()

    // Build squares
    for (let i = 0; i < SnakeMap.numSquares; i++) {
      const row = $(document
        .createElement("div"))
        .addClass("row")

      SnakeMap.grid.append(row)
      for (let j = 0; j < SnakeMap.numSquares; j++) {
        const square = $(document
          .createElement("span"))
          .addClass("square")
//          .text(`${i};${j}`)

        row.append(square)
      }
    }

    // Place snakes
    for (let i = 0; i < game.snakes.length; i++) {
      const snake = game.snakes[i]

      SnakeMap.placeSnake(snake)
    }
  },

  highlightPosition: (posX, posY, color="red") => {
    const snakeCell = SnakeMap.getCell(posX, posY)

    // Show on board
    snakeCell.css("background-color", color)
  },

  removeHighlightedPosition: (posX, posY) => {
    if (Game.tileHasSnake(posX, posY)) {
      const snake = Game.snakes.find(s => s.positions
        .find(pos => pos.posX === posX && pos.posY === posY)
      )

      if (snake) SnakeMap.placeSnake(snake)
    } else {
      const snakeCell = SnakeMap.getCell(posX, posY)

      // Show green on board
      snakeCell.css("background-color", "#40bf4abf")
    }
  },
}

export default SnakeMap