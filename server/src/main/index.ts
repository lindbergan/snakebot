import { Game, Direction } from "./game"
import { ServerSocket } from "./serversocket"
import { Snake } from "./snake"
import { Strategies, StrategyMap } from "./strategies/strategies"

const WIDTH = 20,
  HEIGHT = 20,
  NR_OF_SNAKES = 2,
  START_LENGTH = 4,
  TEST_SNAKES: Snake[] = [
    new Snake([
      { x: 13, y: 5 }, { x: 14, y: 5 }, { x: 15, y: 5 },
      { x: 16, y: 5 }
    ], Direction.UP, StrategyMap[Strategies.SMARTV1]),
    new Snake([
      { x: 13, y: 6 }, { x: 14, y: 6 }, { x: 15, y: 6 },
      { x: 16, y: 6 }
    ], Direction.UP, StrategyMap[Strategies.SMARTV1])
  ],
  CONTINUE = false
  
const game = new Game(WIDTH, HEIGHT, NR_OF_SNAKES, START_LENGTH,
  TEST_SNAKES, CONTINUE)

const socket = new ServerSocket(game)

game.setSocket(socket)
