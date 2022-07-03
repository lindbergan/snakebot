import { Direction, Game } from "../game"
import { Snake } from "../snake"
import { StraightAndStupid } from "./straight-and-stupid"
import { SmartV1 } from "./smart-v1"

export type Strategy = {
  type: string,
  move(snake: Snake, game: Game): Direction
}

export enum Strategies {
  STRAIGHT_AND_STUPID = "straight-and-stupid",
  SMARTV1 = "smart-v1"
}

export const StrategyMap = {
  [Strategies.STRAIGHT_AND_STUPID]: StraightAndStupid,
  [Strategies.SMARTV1]: SmartV1,
}