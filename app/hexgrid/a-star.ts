import { HexGrid, HexDirection, Cell } from './hexgrid'
import { GridTile, TerrainType } from '../game/game'

class Tile<T> extends Cell<T> {
    F: number;
    G: number;
    H: number;
    cellIndex: number;
    open: boolean;
    closed: boolean;
    parent: Tile<T>;
}

export class AStar<T> {
    private openList: Tile<T>[];
    private neighbors: HexDirection[] = [
        HexDirection.N,
        HexDirection.NE,
        HexDirection.NW,
        HexDirection.S,
        HexDirection.SE,
        HexDirection.SW,
    ];

    constructor(private grid: HexGrid<T>) {

    }

    public GetPath(startCellIndex: number, finishCellIndex: number): number[] {
        this.grid.enumerateAllCells((cell) => {
            var t = cell as Tile<T>;
            delete t.cellIndex;
            delete t.closed;
            delete t.open;
            delete t.parent;
            delete t.F;
            delete t.G;
            delete t.H;
        })

        this.openList = [];
        let closedList: Tile<T>[] = [];
        let currentCell: Tile<T> = null;

        let startCell: Tile<T> = this.grid.getCell(startCellIndex) as Tile<T>;
        let finishCell = this.grid.getCell(finishCellIndex);
        startCell.F = 0;
        startCell.H = 0;
        startCell.G = 0;
        startCell.cellIndex = startCellIndex;
        this.openList.push(startCell);    // 1

        var iteration = 0;
        while (iteration < 1000) {
            ++iteration;

            var minFI = this.getMinFCellIndex();   // 2-a
            currentCell = this.openList[minFI];
            closedList.push(currentCell);   // 2-b
            currentCell.closed = true;

            if (currentCell.cellIndex == finishCellIndex) {
                //finish point in the closed list;
                break;
            }

            this.openList.splice(minFI, 1); //remove current from open list

            //Check neighbours
            var c = currentCell;

            for (var ni = 0; ni < this.neighbors.length; ++ni) {    //2-c
                let dir = this.neighbors[ni];
                let nci = this.grid.getCellNeighborIndex(c.cellIndex, dir);
                if (nci < 0) {//out of field case
                    continue;
                }
                var ncG = 10;   //TBD
                var cell = this.grid.getCell(nci) as Tile<T>;
                if (cell.value == null) {   //TBD
                    continue;   //cell is busy
                }
                if (cell.closed) {
                    continue;   //cell in  _closedList
                }
                cell.cellIndex = nci;

                if (!cell.open) {   // 2-c-2
                    this.openList.push(cell);
                    cell.open = true;
                    cell.parent = currentCell;
                    cell.G = ncG;
                    cell.H = this.getH(cell, finishCell);
                    cell.F = cell.G + cell.H;
                } else {    // 2-c-3
                    if (ncG < cell.G) {
                        cell.G = ncG;
                        cell.F = cell.G + cell.H;
                        cell.parent = currentCell;
                    }
                }
            }
        }

        // Get the result chain
        var p = currentCell;
        var result: number[] = [];
        while (p != null) {
            result.push(p.cellIndex);
            p = p.parent;
        }
        return result;
    }


    getH(c1: Cell<T>, c2: Cell<T>) {
        return 10 * (Math.abs(c1.row - c2.row) + Math.abs(c1.col - c2.col));
    }

    getMinFCellIndex() {
        var minIndex = 0;
        var minFValue = this.openList[0].F;
        for (var i = 1; i < this.openList.length; ++i) {
            if (this.openList[i].F < minFValue) {
                minIndex = i;
                minFValue = this.openList[i].F;
            }
        }
        return minIndex;
    }
}