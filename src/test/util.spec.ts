import { translatePosition } from '../main/util';
import { Position } from "../main/game"
import { Direction } from "../main/game"

describe('testing util file', () => {
  test('translatePosition - 1,1 with direction up should be 2,1', () => {
    const pos: Position = { x: 1, y: 1 }
    const direction = Direction.UP

    const shouldBe: Position = { x: 2, y: 1 }

    expect(translatePosition(pos, direction)).toStrictEqual(shouldBe)
  })

  test('translatePosition - 1,1 with direction left should be 1,0', () => {
    const pos: Position = { x: 1, y: 1 }
    const direction = Direction.LEFT

    const shouldBe: Position = { x: 1, y: 0 }

    expect(translatePosition(pos, direction)).toStrictEqual(shouldBe)
  })

  test('translatePosition - 1,1 with direction right should be 1,2', () => {
    const pos: Position = { x: 1, y: 1 }
    const direction = Direction.RIGHT

    const shouldBe: Position = { x: 1, y: 2 }

    expect(translatePosition(pos, direction)).toStrictEqual(shouldBe)
  })

  test('translatePosition - 1,1 with direction down should be 0,1', () => {
    const pos: Position = { x: 1, y: 1 }
    const direction = Direction.DOWN

    const shouldBe: Position = { x: 0, y: 1 }

    expect(translatePosition(pos, direction)).toStrictEqual(shouldBe)
  })
})