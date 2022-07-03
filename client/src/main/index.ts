import { SnakeSocket } from "./clientsocket"
import { Grid } from "./grid"


// Runs immediately
const grid = new Grid("#grid")

const socket = new SnakeSocket("ws://localhost:8081", grid)