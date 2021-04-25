import { getBestDirection } from "../snake/snake.js"
import SnakeMap from "../map/map.js"
import Utils from "../utils/utils.js"

const {
  deepClone,
  changePosX,
  changePosY,
  getOppositeDirection,
  euclideanDistance,
} = Utils

const uuidv4 = uuid.v4

const startLength = 3
const framesPerSecond = 5
const timeInterval = 1000 / framesPerSecond
const ticksToIncreaseLength = 3

let tickNr = 0
var gameInterval = null

const Game = {
  snakes: [],

  getRandomPosition: numSquares => {
    const posX = parseInt(Math.random() * (numSquares - 6)) + 3
    const posY = parseInt(Math.random() * (numSquares - 6)) + 3

    return { posX, posY }
  },

  addListeners: () => {
    $(document).on("keyup", e => {
      if (e.which === 37) updateSnakeDirection(Game.snakes[0], 'up')
      else if (e.which === 38) updateSnakeDirection(Game.snakes[0], 'left')
      else if (e.which === 39) updateSnakeDirection(Game.snakes[0], 'down')
      else if (e.which === 40) updateSnakeDirection(Game.snakes[0], 'right')
    })
  },

  removeListeners: () => {
    $(document).off("keyup")
  },

  initSnake: snake => {
    // For snake length
    for (let i = 0; i < startLength; i++) {
      if (i === 0) {
        // For head
        let pos = Game.getRandomPosition(SnakeMap.numSquares)
        while(Game.snakes.length > 0 && Game.snakes.every(s => euclideanDistance(pos, s.positions[0]) < 6)) {
          pos = Game.getRandomPosition(SnakeMap.numSquares)
        }

        snake.positions.push(pos)
      } else {
        const { posX, posY } = snake.positions[snake.positions.length - 1]
        const oppositeDirection = getOppositeDirection(snake.direction)
        const changeX = changePosX(oppositeDirection)
        const changeY = changePosY(oppositeDirection)

        snake.positions.push({
          posX: posX + changeX,
          posY: posY + changeY
        })
      }
    }

    // Set id
    snake.id = uuidv4()

    Game.snakes.push(snake)
    //console.log("Snake added on positions: ", snake.positions)
  },

  tileHasSnake: (posX, posY) => {
    for (let i = 0; i < Game.snakes.length; i++) {
      const positions = Game.snakes[i].positions

      for (let j = 0; j < positions.length; j++) {
        const x = positions[j].posX, y = positions[j].posY
        if (x === posX && y === posY) return true
      }
    }
    return false
  },

  isSquareFreeToMoveTo: (posX, posY) => {
    const isOutOfBounds = (posX < 0 ||
                          posY < 0 ||
                          (posX >= SnakeMap.numSquares) ||
                          (posY >= SnakeMap.numSquares))
    return !isOutOfBounds && !Game.tileHasSnake(posX, posY)
  },

  move: snake => {
    for (let i = 0; i < snake.positions.length; i++) {
      const { posX, posY } = snake.positions[i]

      // Snake head
      if (i === 0) {
        const direction = getBestDirection(Game, snake)

        // Allow human to control snake or fallback to last direction
        if (snake.human) snake.direction = snake.humanChoice || snake.direction
        // Let computer choose best direction or fallback to last direction
        else snake.direction = direction || snake.direction

        console.log(snake.name + " chose direction: " + snake.direction)

        const newX = posX + changePosX(snake.direction)
        const newY = posY + changePosY(snake.direction)

        if (!Game.isSquareFreeToMoveTo(newX, newY)) {
          console.log(snake.name + " died")
          snake.dead = true
        } else {
          snake.lasPos = deepClone(snake.positions[i])
          snake.positions[i].posX = newX
          snake.positions[i].posY = newY
        }
      } else {
        if (snake.dead) return;
        const lasPos = deepClone(snake.positions[i])
        snake.positions[i] = snake.lasPos
        snake.lasPos = lasPos

        // Increase length every x ticks
        if (i === snake.positions.length - 1 &&
            tickNr > 1 &&
            tickNr % ticksToIncreaseLength === 0) {
          snake.positions.push(deepClone(snake.lasPos))
          return;
        }
      }
    }
  },

  stopGame: interval => {
    clearInterval(interval)
    Game.removeListeners()
  },

  step: grid => {
    const activeSnakes = Game.snakes.filter(s => !s.dead)

    if (activeSnakes.length < 2) Game.stopGame(gameInterval)
    else {
      // Move snakes
      for (let i = 0; i < activeSnakes.length; i++) {
        const snake = activeSnakes[i]

        Game.move(snake)

        // console.log({
        //   posX: snake.positions[0].posX,
        //   posY: snake.positions[0].posY
        // })
      }

      // Draw board
      SnakeMap.draw(Game)

      tickNr += 1
      console.log("Tick", tickNr)
    }
  },

  run: grid => {
    gameInterval = setInterval(() => {
        Game.step(grid)
    }, timeInterval);
  },

  updateSnakeDirection: (snake, direction) => {
    if (snake.direction !== getOppositeDirection(direction)) {
      snake.direction = direction
    }
  },
}

/* Start game */
Game.addListeners()
SnakeMap.draw(Game)

export default Game
