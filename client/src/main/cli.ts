import { SnakeSocket } from "./clientsocket"

export class CLI {
  socket: SnakeSocket

  constructor(socket: SnakeSocket) {
    this.socket = socket

    this.initKeyListeners()
  }

  step() {
    if (this.socket && this.socket.ws) {
      console.log("Requesting step")
      this.socket.ws.send(JSON.stringify({
        command: "step"
      }))
    }
  }

  moveUp() {}
  moveRight() {}
  moveLeft() {}
  moveDown() {}
  start() {}
  stop() {}

  initKeyListeners() {
    window.addEventListener("keydown", ev => {
      const key = ev.code

      // console.log(ev)

      switch(key) {
        case "ArrowUp": return this.moveUp()
        case "ArrowRight": return this.moveRight()
        case "ArrowDown": return this.moveDown()
        case "ArrowLeft": return this.moveLeft()
        case "Space": return this.step()
        case "KeyR": return this.start()
        case "KeyT": return this.stop()
      }
    })
  }
}