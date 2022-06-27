import { translatePosition } from '../main/util';
import { Position } from "../main/game"
import { Direction } from "../main/game"

describe('testing util file', () => {
  test('translatePosition - 0,0 with direction up should be 0,1', () => {
    const pos: Position = { x: 0, y: 0 }
    const direction = Direction.UP

    const shouldBe: Position = { x: 0, y: 1 }

    expect(translatePosition(pos, direction)).toStrictEqual(shouldBe)
  })
})