import { Grid } from "./grid"

export class SnakeSocket {
  ws: WebSocket | null = null
  grid: Grid

  constructor(url: string, grid: Grid) {
    const interval = setInterval(() => {
      if (this.ws && this.ws.readyState === 1) {
        clearInterval(interval)
        this.setListeners()
      } else {
        this.ws = new WebSocket(url)

        if (this.ws && this.ws.readyState === 1) {
          window.location.reload()
        }
      }
    }, 1000)
    this.grid = grid
  }

  setListeners() {
    if (this.ws) {
      this.ws.addEventListener("open", this.onOpen.bind(this))
      this.ws.addEventListener("message", this.onMessage.bind(this))
      this.ws.addEventListener("close", this.onClose.bind(this))
    }
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