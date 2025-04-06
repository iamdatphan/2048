const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

export default class Grid {
    /**
     * Private variable to store the array of Cell objects
     *
     * This variable can only be accessed within the Grid class
     * This is a PRIVATE CLASS FIELD, which is a new feature in JavaScript after ES2020
     */
    #cells;

    constructor(gridElement) {
        // Set the CSS custom properties for the grid
        gridElement.style.setProperty("--grid-size", GRID_SIZE);
        gridElement.style.setProperty("--cell-size", CELL_SIZE + "vmin");
        gridElement.style.setProperty("--cell-gap", CELL_GAP + "vmin");

        // Create an array of Cell objects
        // by mapping over an array of cell elements created by createCellElements
        // and creating a new Cell object for each cell element
        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            /**
             * The x coordinate (column number) is the remainder of the index divided by GRID_SIZE.
             *
             * For example, if GRID_SIZE is 4, the x coordinate of the cell at index 5 is 5 % 4 = 1
             */

            /**
             * The y coordinate (row number) is the floor of the index divided by GRID_SIZE.
             *
             * For example, if GRID_SIZE is 4, the y coordinate of the cell at index 5
             * is floor(5 / 4) = floor(1.25) = 1
             */
            return new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE));
        });
    }

    get cells() {
        return this.#cells;
    }

    // Gets the cells organized by columns
    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            // Initialize the column array if it doesn't exist
            cellGrid[cell.x] = cellGrid[cell.x] || [];

            // Assign the cell to the correct position in the column array based on the y coordinate
            // For example, if the cell is at (x: 1, y: 2), it will be cellGrid[1][2]
            cellGrid[cell.x][cell.y] = cell;

            return cellGrid;
        }, []);
    }

    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || [];
            cellGrid[cell.y][cell.x] = cell;
            return cellGrid;
        }, []);
    }

    get #emptyCells() {
        return this.#cells.filter((cell) => cell.tile == null);
    }

    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
        return this.#emptyCells[randomIndex];
    }
}

class Cell {
    // Private class fields
    #cellElement;
    #x;
    #y;
    #tile;
    #mergeTile;

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get tile() {
        return this.#tile;
    }

    set tile(value) {
        this.#tile = value;
        if (value == null) return;
        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
    }

    get mergeTile() {
        return this.#mergeTile;
    }

    set mergeTile(value) {
        this.#mergeTile = value;
        if (value == null) return;
        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }

    canAccept(tile) {
        // If the cell is empty, it can accept any tile

        // If the cell is not empty, and it have not merged with another tile,
        // it can accept a tile with the same value
        return this.tile == null || (this.mergeTile == null && this.tile.value === tile.value);
    }

    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return;
        this.tile.value = this.tile.value + this.mergeTile.value;
        // Remove the merged tile from the DOM
        this.mergeTile.remove();
        // Remove the merged tile from the cell
        this.mergeTile = null;
    }
}

/**
 * Function to create an array of cell elements
 * and append them to the grid element,
 * whose size is determined by GRID_SIZE
 *
 * @param {HTMLElement} gridElement The grid element
 * @returns {HTMLElement[]} An array of cell elements
 */
function createCellElements(gridElement) {
    const cells = [];

    // Loop to create GRID_SIZE * GRID_SIZE cell elements
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell);
        gridElement.append(cell);
    }

    return cells;
}
