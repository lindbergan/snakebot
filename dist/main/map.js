"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnakeMap = exports.printMatrix = exports.createMatrix = void 0;
const util_1 = require("./util");
class Cell {
    constructor(rowIndex, colIndex, entry) {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.entry = entry;
    }
}
class Row {
    constructor(items) {
        this.items = items;
    }
}
class Column {
    constructor(items) {
        this.items = items;
    }
}
class Matrix {
    constructor(items, width, height) {
        this.rows = [];
        this.cols = [];
        for (let rowIndex = 0; rowIndex < width; rowIndex++) {
            this.rows.push(new Row(items.filter(i => i.rowIndex === rowIndex)));
        }
        for (let colIndex = 0; colIndex < height; colIndex++) {
            this.cols.push(new Column(items.filter(i => i.colIndex === colIndex)));
        }
    }
    getCell(rowIndex, colIndex) {
        const throwInvalid = (msg) => {
            throw new Error("Cell reference out of bounds: " + msg);
        };
        if (rowIndex < 0 || rowIndex > this.rows.length)
            throwInvalid("RowIndex out of bounds. RowIndex" + rowIndex);
        if (colIndex < 0 || colIndex > this.cols.length)
            throwInvalid("ColIndex out of bounds. ColIndex" + colIndex);
        const item = this.rows[rowIndex].items.find(i => i.colIndex === colIndex);
        if (item === undefined)
            return throwInvalid("Item was not found");
        return item;
    }
}
function createMatrix(width, height, snakes) {
    const items = [];
    for (let rowIndex = 0; rowIndex < width; rowIndex++) {
        for (let colIndex = 0; colIndex < height; colIndex++) {
            const getContent = (pos) => {
                const snake = snakes.find(snake => {
                    return snake.positions.some(p => p.x === pos.x && p.y === pos.y);
                });
                if (snake !== undefined) {
                    return {
                        type: "snake",
                        snake
                    };
                }
                else {
                    return {
                        type: "tile",
                    };
                }
            };
            const pos = {
                x: rowIndex,
                y: colIndex
            };
            items.push(new Cell(rowIndex, colIndex, getContent(pos)));
        }
    }
    return new Matrix(items, width, height);
}
exports.createMatrix = createMatrix;
function translateCellToPosition(cell) {
    return {
        x: cell.rowIndex,
        y: cell.colIndex
    };
}
function printMatrix(matrix, cellWidth = 3, cellHeight = 3) {
    const printNewLine = () => console.log([...Array.of(...new Array(matrix.cols.length)).map(() => [...Array.of(...new Array(cellWidth + 9)).map(() => "-")].join(""))].join(""));
    const printCell = (cell, coords = false, content = false) => {
        const printEmpty = () => process.stdout.write(`      `);
        const printCoords = () => process.stdout.write(`(${cell.rowIndex}, ${cell.colIndex})`);
        const printContent = () => {
            if (cell.entry.type === "snake") {
                const snake = cell.entry.snake;
                // Is head
                if ((0, util_1.posEq)(snake.head, translateCellToPosition(cell))) {
                    process.stdout.write(`  o   `);
                }
                else {
                    process.stdout.write(`  =   `);
                }
            }
            else if (cell.entry.type === "tile") {
                printEmpty();
            }
        };
        const divider = "|";
        // Start
        process.stdout.write(divider);
        // First half
        for (let i = 0; i < cellWidth / 2; i++)
            process.stdout.write(" ");
        // Write entry
        if (coords)
            printCoords();
        else if (content)
            printContent();
        else
            printEmpty();
        // Second half
        for (let i = cellWidth / 2; i < cellWidth; i++)
            process.stdout.write(" ");
        // End
        process.stdout.write(divider);
    };
    const newLine = () => process.stdout.write("\n");
    for (let rowIndex = matrix.rows.length - 1; rowIndex >= 0; rowIndex--) {
        printNewLine();
        for (let h = 0; h < cellHeight; h++) {
            for (let colIndex = 0; colIndex < matrix.cols.length; colIndex++) {
                const content = h === cellHeight - 1;
                const coords = Math.floor(cellHeight / 2) === h;
                printCell(matrix.getCell(rowIndex, colIndex), coords, content);
                if (colIndex === matrix.cols.length - 1)
                    newLine();
            }
        }
        if (rowIndex === 0)
            printNewLine();
    }
}
exports.printMatrix = printMatrix;
class SnakeMap {
    constructor(width, height, snakes) {
        this.width = width;
        this.height = height;
        this.matrix = createMatrix(width, height, snakes);
    }
    printMap() {
        printMatrix(this.matrix);
    }
}
exports.SnakeMap = SnakeMap;
