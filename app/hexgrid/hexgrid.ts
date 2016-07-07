export enum HexDirection {
    N,
    NE,
    SE,
    S,
    SW,
    NW
}

export class Cell<T>{
    value: T;
    row: number;
    col: number;
}

export class HexGrid<T> {
    public width: number;
    public height: number;
    private datalen: number;
    private data: Cell<T>[];

    constructor(width: number, height: number, cellInitializer: (cellIndex: number) => T) {
        this.width = width;
        this.height = height;
        this.datalen = width * height;
        this.data = new Array<Cell<T>>(this.datalen);
        for (let irow = 0, index = 0; irow < this.height; irow++) {
            for (let icol = 0; icol < this.width; icol++) {
                this.data[index] = {
                    col: icol,
                    row: irow,
                    value: cellInitializer(index)
                };
                ++index;
            }
        }
    }

    getCell(cellIndex: number): Cell<T> {
        return this.data[cellIndex];
    }

    enumerateAllCells(func: (cell: Cell<T>, cellIndex: number) => void) {
        this.data.forEach((cell, index) => {
            func(cell, index);
        });
    }

    getNeighborCellIndex(cellIndex: number, direction: HexDirection): number {
        let row = this.data[cellIndex].row;
        let col = this.data[cellIndex].col;
        let oddcol = col % 2 == 0;
        let newrow: number, newcol: number;
        switch (direction) {
            case HexDirection.N:
                newrow = row - 1;
                newcol = col;
                break;
            case HexDirection.NE:
                if (oddcol) {
                    newrow = row - 1;
                    newcol = col + 1;
                } else {
                    newrow = row;
                    newcol = col + 1;
                }
                break;
            case HexDirection.NW:
                if (oddcol) {
                    newrow = row - 1;
                    newcol = col - 1;
                } else {
                    newrow = row;
                    newcol = col - 1;
                }
                break;
            case HexDirection.S:
                newrow = row + 1;
                newcol = col;
                break;
            case HexDirection.SE:
                if (oddcol) {
                    newrow = row;
                    newcol = col + 1;
                } else {
                    newrow = row + 1;
                    newcol = col + 1;
                }
                break;
            case HexDirection.SW:
                if (oddcol) {
                    newrow = row;
                    newcol = col - 1;
                } else {
                    newrow = row + 1;
                    newcol = col - 1;
                }
                break;
        }

        if (newcol >= 0 && newcol < this.width && newrow >= 0 && newrow < this.height) {
            return this.getCellIndex(newrow, newcol);
        }
        return -1;
    }

    getCellIndex(row: number, col: number): number {
        return row * this.width + col;
    }
}