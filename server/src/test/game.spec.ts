import { Game, Position, Direction } from "../main/game"
import { Snake } from "../main/snake"
import { translatePosition } from "../main/util"

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

  test('should move a snake up', () => {
    const positions: Position[] = [{ x: 2, y: 2},{ x: 1, y: 2},{ x: 0, y: 2}]
    const testSnake = new Snake(positions, Direction.UP)

    const game = new Game(5, 5, 1, 3, [testSnake])
    
    const chosenDirection = Direction.UP

    const movedSnake = game.moveSnake(testSnake, chosenDirection)

    expect(movedSnake.direction).toBe(Direction.UP)
    expect(movedSnake.head.x).toBe(3)
    expect(movedSnake.head.y).toBe(2)

    game.map.updateMap(game.snakes)

    const snake = game.getSnake(testSnake.id)

    expect(snake).toBeDefined()

    expect(snake?.positions[1].x).toBe(2)
    expect(snake?.positions[1].y).toBe(2)

    expect(snake?.positions[2].x).toBe(1)
    expect(snake?.positions[2].y).toBe(2)
  })

  test('should crash in to a wall', () => {
    const positions: Position[] = [{ x: 4, y: 2},{ x: 3, y: 2},{ x: 2, y: 2}]
    const testSnake = new Snake(positions, Direction.UP)

    const game = new Game(5, 5, 1, 3, [testSnake])

    const chosenDirection = Direction.UP

    const movedSnake = game.moveSnake(testSnake, chosenDirection)

    expect(movedSnake.alive).toBeFalsy()
  })

  test('should crash in to another snake', () => {
    const testSnake1 = new Snake([{ x: 3, y: 3},{ x: 2, y: 3},{ x: 1, y: 3}], Direction.UP)
    const testSnake2 = new Snake([{ x: 3, y: 2},{ x: 3, y: 1},{ x: 3, y: 0}], Direction.RIGHT)

    const game = new Game(5, 5, 1, 3, [testSnake1, testSnake2])

    game.step(false, true)

    const movedSnake1 = game.getSnake(testSnake1.id)
    const movedSnake2 = game.getSnake(testSnake2.id)

    expect(movedSnake1?.alive).toBeTruthy
    expect(movedSnake2?.alive).toBeFalsy()
  })

  test('should add another tail after 3 ticks', () => {
    let testSnake1 = new Snake([{ x: 3, y: 3},{ x: 2, y: 3},{ x: 1, y: 3}], Direction.UP)

    const game = new Game(10, 10, 1, 3, [testSnake1])

    // Tick 1
    game.step(false, true)

    // Tick 2
    game.step(false, true)

    // Tick 3
    game.step(false, true)

    // Tick 4
    game.step(false, true)

    // Tick 5
    game.step(false, true)

    const movedSnake1 = game.getSnake(testSnake1.id)

    expect(movedSnake1?.alive).toBeTruthy
    expect(movedSnake1?.positions.length).toBe(4)
  })

  test('should die choosing a direction into itself', () => {
    let testSnake1 = new Snake([{ x: 3, y: 3},{ x: 2, y: 3},{ x: 1, y: 3}], Direction.UP)

    const game = new Game(10, 10, 1, 3, [testSnake1])

    game.moveSnake(testSnake1, Direction.DOWN)
    game.map.updateMap(game.snakes)

    const movedSnake1 = game.getSnake(testSnake1.id)

    expect(movedSnake1?.alive).toBeFalsy()
  })
})