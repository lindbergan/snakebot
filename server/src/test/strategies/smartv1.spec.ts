import { Game, Position, Direction } from "../../main/game"
import { ServerSocket } from "../../main/serversocket"
import { Snake } from "../../main/snake"
import { StrategyMap } from "../../main/strategies/strategies"
import { translatePosition } from "../../main/util"

describe('testing strategy smart v1', () => {
  test('should ', () => {
    const testSnake1 = new Snake([
      { x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 3, y: 6 }
    ], Direction.UP, StrategyMap["smart-v1"])

    const testSnake2 = new Snake([
      { x: 8, y: 5 }, { x: 7, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 5 }
    ], Direction.UP, StrategyMap["smart-v1"])

    const game = new Game(20, 20, 2, 4, [
      testSnake1, testSnake2
    ])

    game.setSocket(new ServerSocket(game))

    expect(game.snakes.length).toBeGreaterThan(0)

    game.step()

    game.snakes.forEach(s => s.printInfo())
  })
})