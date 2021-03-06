import { Position } from "./game"
import { Snake } from "./snake"
import { ServerSocket } from "./serversocket"
import { posEq } from "./util"

interface CellContent {
  type: string
}

export interface SnakeContent extends CellContent {
  snake: Snake
  type: "snake"
}

interface TileContent extends CellContent {
  type: "tile"
}

class Cell {
  rowIndex: number
  colIndex: number
  entry: CellContent

  constructor(rowIndex: number, colIndex: number, entry: CellContent) {
    this.rowIndex = rowIndex
    this.colIndex = colIndex
    this.entry = entry
  }
}

class Row {
  columns: Map<number, Cell>

  constructor(items: Cell[]) {
    const columns = new Map()

    items.forEach((item, index) => columns.set(index, item))
    this.columns = columns
  }
}

class Column {
  rows: Map<number, Cell>

  constructor(items: Cell[]) {
    const rows = new Map()

    items.forEach((item, index) => rows.set(index, item))
    this.rows = rows
  }
}

export class Matrix {
  rows: Row[]
  cols: Column[]
  items: Cell[]

  constructor(items: Cell[], width: number, height: number) {
    this.rows = []
    this.cols = []
    this.items = items
    for (let rowIndex = 0; rowIndex < width; rowIndex++) {
      this.rows.push(new Row(items.filter(i => i.rowIndex === rowIndex)))
    }
    for (let colIndex = 0; colIndex < height; colIndex++) {
      this.cols.push(new Column(items.filter(i => i.colIndex === colIndex)))
    }
  }

  getCell(rowIndex: number, colIndex: number): Cell {
    const throwInvalid = (msg: String) => {
      throw new Error("Cell reference out of bounds: " + msg)
    }

    if (rowIndex < 0 || rowIndex > this.rows.length)
      throwInvalid("RowIndex out of bounds. RowIndex" + rowIndex)
    if (colIndex < 0 || colIndex > this.cols.length)
      throwInvalid("ColIndex out of bounds. ColIndex" + colIndex)

    const item = this.rows[rowIndex].columns.get(colIndex)

    if (item === undefined) return throwInvalid("Item was not found")

    return item
  }
}

export function createMatrix(width: number, height: number, snakes: Snake[]): Matrix {
  const items = []

  for (let rowIndex = 0; rowIndex < width; rowIndex++) {
    for (let colIndex = 0; colIndex < height; colIndex++) {
      const getContent = (pos: Position): CellContent => {
        const snake = snakes
          .filter(s => s.alive)
          .find(snake => {
          return snake.positions.some(p => p.x === pos.x && p.y === pos.y)
        })
  
        if (snake !== undefined) {
          return {
            type: "snake",
            snake
          } as SnakeContent
        }
        else {
          return {
            type: "tile",
          } as TileContent
        }
      }

      const pos: Position = {
        x: rowIndex,
        y: colIndex
      }

      items.push(new Cell(rowIndex, colIndex, getContent(pos)))
    }
  }


  return new Matrix(items, width, height)
}

function translateCellToPosition(cell: Cell): Position {
  return {
    x: cell.rowIndex,
    y: cell.colIndex
  }
}

export function printMatrix(matrix: Matrix, cellWidth: number = 3, cellHeight: number = 3): void {
  const printNewLine = () => process.stdout.write([...Array.of(...new Array(matrix.cols.length)).map(() => [...Array.of(...new Array(cellWidth + 9)).map(() => "-")].join(""))].join("") + "\n")
  const printCell = (
    cell: Cell,
    coords: boolean = false,
    content: boolean = false,
  ) => {
    const printEmpty = () => process.stdout.write(`      `)
    const printCoords = () => process.stdout.write(`(${cell.rowIndex}, ${cell.colIndex})`)
    const printContent = () => {
      if (cell.entry.type === "snake") {
        const snake = (cell.entry as SnakeContent).snake

        // Is head
        if (posEq(snake.head, translateCellToPosition(cell))) {
          process.stdout.write(`  o   `)
        } else {
          process.stdout.write(`  =   `)
        }
      } else if (cell.entry.type === "tile") {
        printEmpty()
      }
    }

    const divider = "|"

    // Start
    process.stdout.write(divider)

    // First half
    for (let i = 0; i < cellWidth / 2; i++) process.stdout.write(" ")

    // Write entry
    if (coords)
      printCoords()
    else if (content)
      printContent()
    else
      printEmpty()

    // Second half
    for (let i = cellWidth / 2; i < cellWidth; i++) process.stdout.write(" ")

    // End
    process.stdout.write(divider)
  }
  const newLine = () => process.stdout.write("\n")


  for (let rowIndex = matrix.rows.length - 1; rowIndex >= 0; rowIndex--) {
    printNewLine()

    for (let h = 0; h < cellHeight; h++) {
      for (let colIndex = 0; colIndex < matrix.cols.length; colIndex++) {
        const content = h === cellHeight - 1
        const coords = Math.floor(cellHeight / 2) === h
        printCell(matrix.getCell(rowIndex, colIndex), coords, content)

        if (colIndex === matrix.cols.length - 1) newLine()
      }
    }

    if (rowIndex === 0) printNewLine()
  }

  process.stdout.write("\t\tUp: 1\n")
  process.stdout.write("\tLeft: -1\tRight: 1\n")
  process.stdout.write("\t\tDown: -1\n")
}

export class SnakeMap {
  width: number
  height: number
  private matrix: Matrix

  constructor(width: number, height: number, snakes: Snake[]) {
    this.width = width
    this.height = height
    this.matrix = createMatrix(width, height, snakes)
  }

  updateMap(snakes: Snake[], socket: ServerSocket | undefined = undefined) {
    this.matrix = createMatrix(this.width, this.height, snakes)

    if (socket !== undefined) {
      socket.updateMap(this)
    }
  }

  getMatrix(): Matrix {
    return this.matrix
  }

  printMap() {
    printMatrix(this.matrix)
  }

  toJson(): string {
    // @ts-ignore on

    const obj = {
      width: this.width,
      height: this.height,

      items: this.matrix.rows.reduce((a, b) => {

        const list: Cell[] = []
        for (let key of b.columns.keys()) {
          const val = b.columns.get(key)
          if (val) list.push(val)
        }
  
        
        // @ts-ignore off
        return a.concat(list.map(cell => ({
          type: cell.entry.type,
          snake: cell.entry.type === "snake" ? (cell.entry as SnakeContent).snake : undefined
        })))
      }, [])
    }

    return JSON.stringify(obj)
  }
}