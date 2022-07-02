import { Game } from "./game"

const WIDTH = 6, HEIGHT = 6, NR_OF_SNAKES = 2, START_LENGTH = 3

const game = new Game(WIDTH, HEIGHT, NR_OF_SNAKES, START_LENGTH)

game.start()