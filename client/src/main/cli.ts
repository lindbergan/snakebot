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

  start() {
    if (this.socket && this.socket.ws) {
      console.log("Requesting start")
      this.socket.ws.send(JSON.stringify({
        command: "start"
      }))
    }
  }

  stop() {
    if (this.socket && this.socket.ws) {
      console.log("Requesting stop")
      this.socket.ws.send(JSON.stringify({
        command: "stop"
      }))
    }
  }

  pause() {
    if (this.socket && this.socket.ws) {
      console.log("Requesting pause")
      this.socket.ws.send(JSON.stringify({
        command: "pause"
      }))
    }
  }

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
        case "KeyS": return this.start()
        case "KeyT": return this.stop()
        case "KeyP": return this.pause()
      }
    })
  }
}