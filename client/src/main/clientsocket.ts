import { Grid } from "./grid"

export class SnakeSocket {
  ws: WebSocket | null = null
  grid: Grid

  constructor(url: string, grid: Grid) {
    let interval: number

    // @ts-ignore
    window.clearInterval(window.interval)

    const promise = async () => {
      return new Promise<any>(res => {
        interval = window.setInterval(() => {
          if (this.ws && this.ws.readyState === 1) {
            this.ws.send(JSON.stringify({
              ready: true
            }))
            res(true)
          } else {
            this.ws = new WebSocket(url)
          }
        }, 250)

        // @ts-ignore
        window.interval = interval
      })
    }

    promise.bind(this)()
      .then(() => {
        // Ready to intercept
        window.clearInterval(interval)
        this.setListeners.bind(this)()
      })
      .finally(() => {
      window.clearInterval(interval)
    })

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