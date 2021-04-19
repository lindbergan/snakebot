const SnakeMap = {
  grid: $("#grid"),
  numSquares: 20,

  placeSnake: snake => {
    for (let i = 0; i < snake.positions.length; i++) {
      const { posX, posY } = snake.positions[i]
      const snakeCell = SnakeMap.getCell(posX, posY)

      // Show on board
      snakeCell.css("background-color", snake.color)
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

        row.append(square)
      }
    }

    // Place snakes
    for (let i = 0; i < game.snakes.length; i++) {
      const snake = game.snakes[i]

      SnakeMap.placeSnake(snake)
    }
  },

  highlightPosition: (posX, posY) => {
    const snakeCell = getCell(grid, posX, posY)

      // Show on board
      snakeCell.css("background-color", "red")
  },
}

export default SnakeMap