import { HexGrid, Cell, HexDirection } from '../hexgrid/hexgrid'
import { IPathFindingStrategy } from '../hexgrid/a-star'
import { TerrainType, GridTile } from './game'

export class TerrainPathFindingStrategy implements IPathFindingStrategy<GridTile> {
    private directions: HexDirection[] = [
        HexDirection.N,
        HexDirection.NE,
        HexDirection.NW,
        HexDirection.S,
        HexDirection.SE,
        HexDirection.SW,
    ];

    constructor(private grid: HexGrid<GridTile>) {
    }

    iterateOverNeighbors(cellIndex: number, func: (neighborCell: Cell<GridTile>, neighborCellIndex: number, G: number) => void): void {
        for (var i = 0; i < this.directions.length; ++i) {
            var neighborCellIndex = this.grid.getNeighborCellIndex(cellIndex, this.directions[i]);
            if (neighborCellIndex < 0) {
                continue;
            }

            // check the terrain type and assign different value
            let G: number;
            let cell = this.grid.getCell(neighborCellIndex);
            switch (cell.value.terrainType) {
                case TerrainType.Desert:
                    G = 25;
                    break;
                case TerrainType.Tree:
                    G = 15;
                    break;
                case TerrainType.Mountain:
                    G = 100;
                    break;
                case TerrainType.Water:
                    continue;   //can't swim or fly across water yet
                case TerrainType.Grass:
                default:
                    G = 10;
                    break;
            }

            func(cell, neighborCellIndex, G);
        }
    }

    getHeuristic(c1: Cell<GridTile>, c2: Cell<GridTile>): number {
        //return 10 * (Math.abs(c1.row - c2.row) + Math.abs(c1.col - c2.col));
        //return 5 * Math.sqrt((Math.pow(Math.abs(c1.row - c2.row), 2) + Math.pow(Math.abs(c1.col - c2.col), 2)));
        return 1;
    }
} 