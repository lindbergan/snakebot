import { Game, Position, Direction } from "../main/game"
import { Snake } from "../main/snake"
import { posEq } from "../main/util"

describe('testing map file', () => {
  test('should be able to convert map to json', () => {
    const positions = [{ x: 3, y: 2 }, { x: 2, y: 2 }]
    const testSnake1 = new Snake(positions, Direction.UP)
    const width = 5, height = 5
    const game = new Game(width, height, 1, 2, [testSnake1])

    const str = game.map.toJson()
    const json = JSON.parse(str)

    expect(game.snakes.length).toBeGreaterThan(0)
    expect(json.width).toBe(width)
    expect(json.height).toBe(height)

    expect(json.items).toBeDefined()
    expect(json.items.length).toBe(width * height)

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const pos = { x: i, y: j }
        if (positions.find(aPos => posEq(aPos, pos))) {
          expect(json.items[i + j].type === "snake")
        } else {
          expect(json.items[i + j].type === "tile")
        }
      }
    }
  })
})