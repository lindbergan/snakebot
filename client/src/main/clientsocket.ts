import { Grid } from "./grid"

export class SnakeSocket {
  ws: WebSocket
  grid: Grid

  constructor(url: string, grid: Grid) {
    this.ws = new WebSocket(url)
    this.grid = grid

    this.ws.addEventListener("open", this.onOpen.bind(this))
    this.ws.addEventListener("message", this.onMessage.bind(this))
    this.ws.addEventListener("close", this.onClose.bind(this))
  }
  
  onOpen(event: any) {
    console.log("Client is connected")
  }

  onMessage(event: any) {
    console.log("Client got a message")

    this.grid.paint(event.data)
  }

  onClose(event: any) {
    console.log("Socket closed")
  }
} 