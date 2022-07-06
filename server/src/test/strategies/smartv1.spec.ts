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
    ], Direction.UP, StrategyMap["straight-and-stupid"])

    const game = new Game(20, 20, 2, 4, [
      testSnake1, testSnake2
    ])

    const socket = new ServerSocket(game)
    game.setSocket(socket)

    expect(game.snakes.length).toBeGreaterThan(0)

    game.map.updateMap(game.snakes, socket)

    const smartSnake = game.snakes[0]

    // Can't move up or down
    expect(game.isPositionFreeToMoveTo(translatePosition(smartSnake.head, Direction.UP))).toBeFalsy()
    expect(game.isPositionFreeToMoveTo(translatePosition(smartSnake.head, Direction.DOWN))).toBeFalsy()
    
    // Can move to the left and the right
    expect(game.isPositionFreeToMoveTo(translatePosition(smartSnake.head, Direction.LEFT))).toBeTruthy()
    expect(game.isPositionFreeToMoveTo(translatePosition(smartSnake.head, Direction.RIGHT))).toBeTruthy()

    const direction = smartSnake.move(game)

    // The smartest choice here is to move to the left. Thereby avoiding the
    // trap.
    expect(direction).toStrictEqual(Direction.LEFT)
  })
})