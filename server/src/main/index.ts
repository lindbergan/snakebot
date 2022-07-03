import { Game } from "./game"
import { ServerSocket } from "./serversocket"

const WIDTH = 10,
  HEIGHT = 10,
  NR_OF_SNAKES = 2,
  START_LENGTH = 2,
  TEST_SNAKES = undefined,
  CONTINUE = false
  
const game = new Game(WIDTH, HEIGHT, NR_OF_SNAKES, START_LENGTH,
  TEST_SNAKES, CONTINUE)

const socket = new ServerSocket()

game.setSocket(socket)

game.start()
