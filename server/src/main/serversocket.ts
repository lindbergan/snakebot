import { SnakeMap } from "./map"
import { WebSocket } from "ws"
import uuid4 from "uuid4"
import { Game } from "./game"

let lastMsg: SnakeMap | null = null

export class ServerSocket {
  clients: Map<String, WebSocket>
  game: Game

  constructor(game: Game) {
    const wss = new WebSocket.Server({
      port: 8081
    })

    this.game = game

    const clients = new Map()
    this.clients = clients

    wss.on("connection", (ws: WebSocket) => {
      const id = uuid4()
      clients.set(id, ws)

      ws.on("message", (data) => {
        const body = JSON.parse(data.toString("utf-8"))

        // console.log(body)

        if (body.ready && lastMsg !== null) this.updateMap(lastMsg)
        else {
          switch(body.command) {
            case "step": return this.game.step()
            case "start": return this.game.start()
            case "stop": return this.game.stop()
            case "pause": return this.game.pause()
          }
        }
      })
    })

    wss.on("message", (msg) => {
      console.log("Message recieved" + msg)
    })

    wss.on("close", (ws: WebSocket) => {
      console.log("Websocket dropped")
    })
  }

  updateMap(map: SnakeMap): void {
    lastMsg = map
    console.log("Updating map in server")

    if (this.clients.size > 0) {
      console.log("sent smthng")

      for (let client of this.clients) {
        client[1].send(JSON.stringify({
          map: map.toJson(),
          snakes: this.game.snakes
        }))
      }
    }
  }
}
