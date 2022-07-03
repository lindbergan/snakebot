import { Game, Position, Direction } from "../../main/game"
import { ServerSocket } from "../../main/serversocket"
import { Snake } from "../../main/snake"
import { StrategyMap } from "../../main/strategies/strategies"
import { translatePosition } from "../../main/util"

describe('testing strategy smart v1', () => {
  test('should ', () => {
    const testSnake1 = new Snake([
      { x: 7, y: 14 },
      { x: 6, y: 14 },
      { x: 6, y: 15 },
      { x: 6, y: 16 },
      { x: 6, y: 17 },
      { x: 6, y: 18 },
      { x: 6, y: 19 },
      { x: 7, y: 19 },
      { x: 7, y: 18 },
      { x: 7, y: 17 },
      { x: 7, y: 16 }
    ], Direction.UP, StrategyMap["smart-v1"])

    const testSnake2 = new Snake([
      { x: 8, y: 14 },
      { x: 9, y: 14 },
      { x: 9, y: 15 },
      { x: 9, y: 16 },
      { x: 9, y: 17 },
      { x: 9, y: 18 },
      { x: 9, y: 19 },
      { x: 8, y: 19 },
      { x: 8, y: 18 },
      { x: 8, y: 17 },
      { x: 8, y: 16 }
    ], Direction.UP, StrategyMap["smart-v1"])

    const game = new Game(20, 20, 2, 4, [
      testSnake1, testSnake2
    ])

    game.setSocket(new ServerSocket(game))

    expect(game.snakes.length).toBeGreaterThan(0)

    game.step()

    expect(game.snakes[0].move(game)).toStrictEqual(Direction.LEFT)
    expect(game.snakes[0].move(game)).toStrictEqual(Direction.LEFT)
  })
})