import { HexGrid } from '../hexgrid/hexgrid'
import { IRandom } from '../helpers/random'

export enum TerrainType {
    Grass,
    Desert,
    Water,
    Tree,
    Mountain
}

export class Persona {
    name: string;
}

export class GridTile {
    terrainType: TerrainType;
    persona: Persona;
}

export class Game {
    private random: IRandom;
    public grid: HexGrid<GridTile>;

    constructor(random: IRandom) {
        this.random = random;
        this.grid = this.generateGameField();
    }

    generateGameField(): HexGrid<GridTile> {
        let grid = new HexGrid<GridTile>(10, 10, (index) => {
            var tile = new GridTile();
            var rnd = this.random.GetRandomNumber(20);
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
}