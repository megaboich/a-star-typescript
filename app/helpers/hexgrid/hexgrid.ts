export enum HexDirection {
    N,
    NE,
    SE,
    S,
    SW,
    NW
}

export class HexCell<T>{
    value: T;
    row: number;
    col: number;
    cellIndex: number;
}

export class HexGrid<T> {
    public width: number;
    public height: number;
    private datalen: number;
    private data: HexCell<T>[];

    constructor(width: number, height: number, cellInitializer: (cellIndex: number) => T) {
        this.width = width;
        this.height = height;
        this.datalen = width * height;
        this.data = new Array<HexCell<T>>(this.datalen);
        let cellIndex = 0;
        for (let irow = 0, index = 0; irow < this.height; irow++) {
            for (let icol = 0; icol < this.width; icol++) {
                this.data[index] = {
                    col: icol,
                    row: irow,
                    cellIndex: cellIndex++,
                    value: cellInitializer(index)
                };
                ++index;
            }
        }
    }

    getCell(cellIndex: number): HexCell<T> {
        return this.data[cellIndex];
    }

    enumerateAllCells(func: (cell: HexCell<T>, cellIndex: number) => void) {
        this.data.forEach((cell, index) => {
            func(cell, index);
        });
    }

    getNeighbor(cell: HexCell<T>, direction: HexDirection): HexCell<T> {
        let row = this.data[cell.cellIndex].row;
        let col = this.data[cell.cellIndex].col;
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
            return this.data[this.getCellIndex(newrow, newcol)];
        }
        return null;
    }

    getCellIndex(row: number, col: number): number {
        return row * this.width + col;
    }
}