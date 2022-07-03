import { SnakeMap } from "./map"
import { createServer, Server } from "http"
import { WebSocket } from "ws"
import uuid4 from "uuid4"

export class ServerSocket {
  clients: Map<String, WebSocket>

  constructor() {
    const wss = new WebSocket.Server({
      port: 8081
    })

    const clients = new Map()
    this.clients = clients

    wss.on("connection", (ws: WebSocket, req) => {
      const id = uuid4()
      clients.set(id, ws)
    })

    wss.on("message", (msg) => {
      console.log("Message recieved" + msg)
    })

    wss.on("close", (ws: WebSocket) => {
      console.log("Websocket dropped")
    })
  }

  updateMap(map: SnakeMap): void {
    console.log("Updating map in server")

    if (this.clients.size > 0) {
      console.log("sent smthng")

      for (let client of this.clients) {
        client[1].send(map.toJson())
      }
    }
  }
}
