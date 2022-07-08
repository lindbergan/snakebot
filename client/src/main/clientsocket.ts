import { Grid } from "./grid"

export class SnakeSocket {
  ws: WebSocket | null = null
  grid: Grid

  constructor(url: string, grid: Grid) {
    this.ws = new WebSocket(url)

    const interval = setInterval(() => {
      if (this.ws && this.ws.readyState === this.ws.OPEN) {
        clearInterval(interval)

        console.log("Sending")
        this.ws.send(JSON.stringify({
          ready: true
        }))
      }
    }, 500)

    this.setListeners.bind(this)()
    this.grid = grid
  }

  setListeners() {
    if (this.ws) {
      this.ws.addEventListener("open", this.onOpen.bind(this))
      this.ws.addEventListener("message", this.onMessage.bind(this))
      this.ws.addEventListener("close", this.onClose.bind(this))
      this.ws.addEventListener("error", this.onError.bind(this))
    }
  }
  
  onOpen(event: any) {
    console.log("Client is connected")
  }

  onMessage(event: any) {
    this.grid.paint(event.data)
  }

  onClose(event: any) {
    console.log("Socket closed")
  }

  onError(event: any) {
    console.log("Error")
    console.log(event)
  }
} 