import { Game, Position } from "../main/game"

describe('testing game file', () => {
  test('should be able to create a game', () => {
    const game = new Game()

    expect(game.snakes.length).toBeGreaterThan(0)
  })

  test('should check valid positions', () => {
    const game = new Game()

    const correctPos: Position = { x: 0, y: 0 }
    expect(game.isValidPosition(correctPos)).toBeTruthy()

    const faultyXPosHigh: Position = { x: 99, y: 0 }
    expect(game.isValidPosition(faultyXPosHigh)).toBeFalsy()

    const faultyXPosLow: Position = { x: -1, y: 0 }
    expect(game.isValidPosition(faultyXPosLow)).toBeFalsy()

    const faultyPosYHigh: Position = { x: 0, y: 999 }
    expect(game.isValidPosition(faultyPosYHigh)).toBeFalsy()

    const faultyPosYLow: Position = { x: 0, y: -9 }
    expect(game.isValidPosition(faultyPosYLow)).toBeFalsy()
  })

  test('should create snakes at the right positions', () => {
    const game = new Game()

    game.snakes.forEach(snake => {
      return expect(snake.positions.every(pos => game.isValidPosition(pos))).toBeTruthy()
    })
  })

  test('should create snakes with correct length', () => {
    const game = new Game(10, 10, 1, 4)

    game.snakes.forEach(snake => {
      return expect(snake.positions.length).toBe(4)
    })

    const game2 = new Game(10, 10, 1, 3)

    game2.snakes.forEach(snake => {
      return expect(snake.positions.length).toBe(3)
    })
  })

  test('should create several snakes', () => {
    const game = new Game(10, 10, 2)

    expect(game.snakes.length).toBe(2)
  })
})