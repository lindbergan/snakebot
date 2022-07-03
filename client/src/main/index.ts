import { SnakeSocket } from "./clientsocket"
import { Grid } from "./grid"
import { CLI } from "./cli"

// Runs immediately
const grid = new Grid("#grid")

const socket = new SnakeSocket("ws://localhost:8081", grid)

const cli = new CLI(socket)

// @ts-ignore off
window.cli = cli