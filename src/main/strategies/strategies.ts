import { Direction, Game } from "../game"
import { Snake } from "../snake"
import { StraightAndStupid } from "./straight-and-stupid"

export type Strategy = {
  type: string,
  move(snake: Snake, game: Game): Direction
}

export enum Strategies {
  STRAIGHT_AND_STUPID = "straight-and-stupid"
}

export const StrategyMap = {
  [Strategies.STRAIGHT_AND_STUPID]: StraightAndStupid
}