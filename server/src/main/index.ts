import { Game, Direction } from "./game"
import { ServerSocket } from "./serversocket"
import { Snake } from "./snake"
import { StrategyMap } from "./strategies/strategies"

const WIDTH = 20,
  HEIGHT = 20,
  NR_OF_SNAKES = 2,
  START_LENGTH = 2,
  TEST_SNAKES = [
    new Snake(undefined, undefined, StrategyMap["smart-v1"]),
    new Snake(undefined, undefined, StrategyMap["straight-and-stupid"]),
  ],
  CONTINUE = false
  
const game = new Game(WIDTH, HEIGHT, NR_OF_SNAKES, START_LENGTH,
  TEST_SNAKES, CONTINUE)

const socket = new ServerSocket(game)

game.setSocket(socket)

// game.start()

setTimeout(() => {
  game.step()
}, 2000)
