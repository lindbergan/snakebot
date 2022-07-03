import $ from "jquery"

export type SnakeColor = {
  head: string,
  tail: string,
  description: string
}

export const Purple: SnakeColor = {
  head: "#9019e6bf",
  tail: '#8a40bfbf',
  description: "Purple"
}

export const Blue: SnakeColor = {
  head: "#194ce6bf",
  tail: '#4060bfbf',
  description: "Blue"
}

export const Orange: SnakeColor = {
  head: "#e64d19bf",
  tail: '#bf6040bf',
  description: "Orange"
}

export const Green: SnakeColor = {
  head: "#e6d419bf",
  tail: '#bfb540bf',
  description: "Green"
}

const Colors: SnakeColor[] = [
  Purple,
  Blue,
  Orange,
  Green
]

type Position = {
  x: number,
  y: number
}

function posEq(posA: Position, posB: Position): boolean {
  return posA.x === posB.x && posA.y === posB.y
}

export class Grid {
  el: JQuery<HTMLElement>
  activeColors: SnakeColor[] = []
  colorMap: Map<string, SnakeColor> = new Map()

  constructor(id: string) {
    this.el = $(id)
  }

  showGrid() {
    $("#loader").css("display", "none")
    this.el.css("display", "flex")
  }

  paint(jsonStr: string): void {
    if (this.el.length === 0) {
      throw new Error("Grid is undefined")
    }

    this.showGrid()

    // Clear previous tick
    this.el.empty()

    const json = JSON.parse(jsonStr)

    const {
      width,
      height,
      items,
     } = json

     let iter = 0

    for (let i = 0; i < width; i++) {
      const row = $(window.document
        .createElement("div"))
        .addClass("row")

      this.el.append(row)
      
      for (let j = 0; j < height; j++) {
        const cell = items[iter]

        let square

        if (cell.type === "snake") {
          square = $(window.document
            .createElement("span"))
            .addClass("square")
            .attr("row", i)
            .attr("col", j)

          const pos = { x: i, y: j }
          let snakeColor = this.colorMap.get(cell.snake.id)

          if (snakeColor === undefined) {
            snakeColor = this.getAvailableSnakeColor()
            this.colorMap.set(cell.snake.id, snakeColor)
          }

          if (posEq(cell.snake.head, pos)) {
            square.css("background-color", snakeColor.head)
          } else {
            square.css("background-color", snakeColor.tail)
          }
        }
        else {
          square = $(document
            .createElement("span"))
            .addClass("square")
            .attr("row", i)
            .attr("col", j)
        }

        row.append(square)
        iter += 1
      }
    }
  }

  getAvailableSnakeColor(): SnakeColor {
    const color = Colors.find(c => !this.activeColors.some(ac => ac.description === c.description))

    if (color) {
      this.activeColors.push(color)

      return color
    }
    else {
      const randomHeadColor = Math.floor(Math.random() * 16777215).toString(16)
      const randomTailColor = Math.floor(Math.random() * 16777215).toString(16)
      const color = {
        description: "random" + Date.now(),
        head: "#" + randomHeadColor,
        tail: "#" + randomTailColor
      }

      this.activeColors.push(color)

      return color
    }
  }
}