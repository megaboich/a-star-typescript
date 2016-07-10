import { HexGrid } from '../helpers/hexgrid/index'
import { IRandom } from '../helpers/random'
import { TerrainPathFindingStrategy } from './terrain-pathfinding-strategy'
import { AStar } from '../helpers/a-star'

export enum TerrainType {
    Grass,
    Tree,
    Desert,
    Mountain,
    Water
}

export class TerrainCell {
    terrainType: TerrainType;
}

export class Game {
    private random: IRandom;
    public grid: HexGrid<TerrainCell>;
    public startCellIndex: number;
    public finishCellIndex: number;
    public pathIndexes: number[] = [];

    constructor(random: IRandom, width: number, height: number) {
        this.random = random;
        this.grid = this.generateGameField(width, height);
        this.startCellIndex = 0;
        this.finishCellIndex = width * height - 1;
    }

    generateGameField(width: number, height: number): HexGrid<TerrainCell> {
        let grid = new HexGrid<TerrainCell>(width, height, (index) => {
            var tile = new TerrainCell();
            var rnd = this.random.GetRandomNumber(100);
            switch (rnd) {
                case 0:
                    tile.terrainType = TerrainType.Mountain;
                    break;
                case 1:
                case 2:
                    tile.terrainType = TerrainType.Water;
                    break;
                case 3:
                case 4:
                case 5:
                    tile.terrainType = TerrainType.Tree;
                    break;
                case 6:
                case 7:
                case 8:
                case 9:
                    tile.terrainType = TerrainType.Desert;
                    break;
                default:
                    tile.terrainType = TerrainType.Grass;
                    break;
            }
            return tile;
        });
        return grid;
    }

    getNextTerrainType(type: TerrainType): TerrainType {
        let t = type + 1;
        if (t > TerrainType.Water) {
            t = TerrainType.Grass;
        }
        return t;
    }

    buildPath(): void {
        let strategy = new TerrainPathFindingStrategy(this.grid);
        let astar = new AStar(strategy);
        let startCell = this.grid.getCell(this.startCellIndex);
        let finishCell = this.grid.getCell(this.finishCellIndex);
        let path = astar.GetPath(startCell, finishCell);
        if (path.length > 0) {
            path = [
                startCell,
                ...
                path
            ];
        }

        this.pathIndexes = path.map(c => c.cellIndex);
    }
}