import { posix } from "path"
import { Direction, Game, DIRECTION_VALUES, Position } from "../game"
import { Snake } from "../snake"
import {
  translatePosition,
  euclideanDistance,
  getOppositeDirection,
  posEq,
  translateChangeToDirection
} from "../util"
import { Strategy } from "./strategies"

type SnakeRangeComparison = {
  snake: Snake | null,
  range: number,
  path: Position[]
}

type DirectionComparison = {
  direction: Direction,
  freeTiles: number
}

const countFreeTiles = (snake: Snake, game: Game, direction: Direction, obstacles: Position[]): number => {
  let freeTiles = 0

  const getDirections = (pos: Position, dir: Direction): Direction[] =>
    DIRECTION_VALUES
      .filter(d => d !== getOppositeDirection(dir))
      .filter(d => game.isPositionFreeToMoveTo(translatePosition(pos, d)))

  const getNeighbours = (pos: Position, dir: Direction, visited: Position[]): Position[] =>
    getDirections(pos, dir)
      .map(dirFound => translatePosition(pos, dirFound))
      .filter(pos => !visited.find(v => posEq(pos, v)))
      .filter(pos => !obstacles.find(ob => posEq(ob, pos)))

  const queue: {
    pos: Position,
    dir: Direction
  }[] = []
  const visited: Position[] = []

  // This is the position corresponding to the direction we are checking
  const newPosition = translatePosition(snake.head, direction)
  const directionsFromHere = getDirections(newPosition, direction)

  freeTiles += directionsFromHere.length

  const handler = (currentPos: Position,
    dirs: Direction[], visited: Position[]) => {
    for (let d of dirs) {
      const newPos = translatePosition(currentPos, d)
  
      visited.push(newPos)

      const batch = getNeighbours(newPos, d, visited)
        .map(pos => ({
          pos,
          dir: d
        }))

      freeTiles += batch.length
      
      queue.push(...batch)
    }
  }

  handler(newPosition, directionsFromHere, visited)

  let iter = 0

  for (let { pos, dir } of queue) {
    // Stop at iteration 10
    if (iter >= 5) return freeTiles

    handler(pos, getDirections(pos, dir), visited)
    iter++
  }


  // 0 is almost 0.01 and it helps with div by 0
  return freeTiles || 0.01
}

/* A-star */
const getPath = (startPos: Position, endPos: Position, snake: Snake, game: Game): Position[] => {
  const getNeighbours = (pos: Position, width: number, height: number,
    obstacles: Position[]): Position[] => {
    const list = DIRECTION_VALUES.map(d => translatePosition(pos, d))

    const fullfillsConstraints = (x: number, y: number) => {
      return x >= 0 && x < width && y >= 0 && y < height
    }

    const notInObstacles = (x: number, y: number) => {
      return !obstacles.find(ob => posEq(ob, { x, y }))
    }

    return list
      .filter(l => fullfillsConstraints(l.x, l.y))
      .filter(l => notInObstacles(l.x, l.y))
  }

  type AStarComparison = {
    pos: Position,
    parent: AStarComparison | null,
    fCost: number,
    gCost: number,
    hCost: number
  }
  
  const retrace = (pos: AStarComparison) => {
    const path: Position[] = []

    let current: AStarComparison | null = pos

    while(current !== null) {
      path.push(current.pos)

      current = current.parent
    }

    return path.reverse()
  }

  const open: AStarComparison[] = []
  const closed: AStarComparison[] = []

  open.push({
    pos: startPos,
    fCost: 0,
    gCost: 0,
    hCost: 0,
    parent: null
  })

  const obstacles: Position[] = game.snakes
    .map(s => s.positions)
    .reduce((s1Pos: Position[], s2Pos: Position[]) => s1Pos.concat(s2Pos), [])

  while(open.length > 0) {
    const current: AStarComparison | null = open.pop() || null
    
    if (current === null) {
      snake.log("Should not happen")

      return []
    }

    const neighbours: AStarComparison[] = getNeighbours(current.pos, game.width, game.height, obstacles)
      .map(pos => ({
        pos,
        fCost: 9999,
        gCost: 9999,
        hCost: 9999,
        parent: current
      }))

    for (const neighbour of neighbours) {
      if (posEq(neighbour.pos, endPos)) return retrace(neighbour)
      else {
        const gCost = current.gCost + euclideanDistance(neighbour.pos, current.pos)
        const hCost = euclideanDistance(neighbour.pos, endPos)

        const newNeighbour = {
          pos: neighbour.pos,
          parent: neighbour.parent,
          gCost,
          hCost,
          fCost: gCost + hCost
        }

        const inOpenPos = open.find(obj => posEq(obj.pos, newNeighbour.pos))
        const inClosedPos = closed.find(obj => posEq(obj.pos, newNeighbour.pos))

        if ((inOpenPos && (inOpenPos.fCost < newNeighbour.fCost))) {
          continue
        }
        if ((inClosedPos && (inClosedPos.fCost < newNeighbour.fCost))) {
          continue
        }
        else {
          if (!open.find(obj => posEq(obj.pos, newNeighbour.pos))) {
            open.push(newNeighbour)
            open.sort((a, b) => {
              if (a.fCost === b.fCost) return b.hCost - a.hCost
              return b.fCost - a.fCost
            })
          }
        }
      }
    }

    closed.push(current)
  }

  snake.log("Should have found path by now...")

  return []
}

export const SmartV1: Strategy = {
  type: "smart-v1",
  move(snake: Snake, game: Game): Direction {
    const head = snake.head
    const otherSnakes = game.snakes
      .filter(({ id, alive }) => alive && id !== snake.id)

    let closestSnake: SnakeRangeComparison = {
      snake: null,
      range: 9999,
      path: []
    }

    for (let otherSnake of otherSnakes) {
      // Get the path to the closest snake by a-star pathfinding
      
      // We aim for where the enemy head will be in two ticks by translating the current direction
      // twice on to its head
      const enemyHead = translatePosition(translatePosition(otherSnake.head, otherSnake.direction), otherSnake.direction)
      const path = getPath(head, enemyHead, snake, game)
      const range = path.length

      if (range < closestSnake.range) {
        closestSnake = { snake: otherSnake, range, path }
      }
    }

    const directions = DIRECTION_VALUES
        .filter(d => game.isPositionFreeToMoveTo(translatePosition(snake.head, d)))

    snake.log("My choices are: ")
    snake.log(directions)

    const obstacles: Position[] = game.snakes
      .map(s => DIRECTION_VALUES.map(d => translatePosition(s.head, d)))
      .reduce((a: Position[], b: Position[]) => a.concat(b), [])

    const comparisions: DirectionComparison[] = directions.map(d => ({
      direction: d,
      freeTiles: countFreeTiles(snake, game, d, obstacles)
    }))

    comparisions.sort((a, b) => b.freeTiles - a.freeTiles)

    snake.log(comparisions)

    if (closestSnake.snake === null) {
      snake.log("Closest snake should have been found.")
      return Direction.DOWN
    }

    // If we can go there, pick the next on the path
    if (closestSnake.path.length > 0) {
      const { x, y} = closestSnake.path[1]
      const direction = translateChangeToDirection(x - head.x, y - head.y)

      const comparison = comparisions.find(c => c.direction === direction)

      if (comparison && comparison.freeTiles > 15) return direction
    }

    // If we can't go there
    if (comparisions.length > 0) return comparisions[0].direction
    if (directions.length > 0) return directions[0]

    snake.log("Should have found a better direction...")

    return Direction.DOWN

    

    

    // let closestDirection: DirectionRangeComparison = {
    //   direction: null,
    //   range: 9999,
    //   freeTiles: 0.1
    // }

    // snake.log("My choices are: ")
    // snake.log(directions)

    // for (let direction of directions) {
    //   const maybePosition = translatePosition(head, direction)
    //   const range = getPath(maybePosition, enemyHead, snake, game).length
    //   const freeTiles = countFreeTiles(snake, game, direction)

    //   const isCloser = range < closestDirection.range
    //   const freeTilesScale = freeTiles / closestDirection.freeTiles
      
    //   const more = freeTilesScale > 1
    //   const muchLess = freeTilesScale < 5
    //   const lessLimit = freeTilesScale > 0.8
    //   const above20 = freeTiles > 20

    //   // Never choose much less
    //   if (above20 && isCloser) {
    //     closestDirection = { direction, range, freeTiles }
    //   }
    //   else if (!muchLess) {
    //     if (isCloser && (more || lessLimit)) {
    //       closestDirection = { direction, range, freeTiles }
    //     }
    //   }

    //   snake.log({ direction, range, freeTiles })
    // }

    // if (closestDirection.direction === null) {
    //   snake.log("Closest direction should have been found.")
    //   return Direction.DOWN
    // }

    // snake.log("Chose: " + closestDirection.direction)
    
    // return closestDirection.direction
  }
}
