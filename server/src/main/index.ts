import { Game, Direction } from "./game"
import { ServerSocket } from "./serversocket"
import { Snake } from "./snake"
import { Strategies, StrategyMap } from "./strategies/strategies"

const testSnake1 = new Snake([], undefined,
  StrategyMap[Strategies.SMARTV1], true)

const WIDTH = 20,
  HEIGHT = 20,
  NR_OF_SNAKES = 4,
  START_LENGTH = 4,
  TEST_SNAKES: Snake[] = [
    testSnake1
  ],
  CONTINUE = false
  
const game = new Game(WIDTH, HEIGHT, NR_OF_SNAKES, START_LENGTH,
  TEST_SNAKES, CONTINUE)

const socket = new ServerSocket(game)

game.setSocket(socket)
