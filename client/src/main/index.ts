import { SnakeSocket } from "./clientsocket"
import { Grid } from "./grid"


// Runs immediately
console.log("Client is listening")

const grid = new Grid("#grid")

const socket = new SnakeSocket("ws://localhost:8081", grid)