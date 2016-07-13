import { HexGrid } from '../helpers/hexgrid/index'
import { IRandom } from '../helpers/random'
import { TerrainPathFindingStrategy } from './terrain-pathfinding-strategy'
import { AStar } from '../helpers/a-star'

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable'

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

export class PathChangeEvent {
    oldPathIndexes: number[]
    currentPathIndexes: number[]
}

export class IndexChange {
    oldIndex: number;
    currentIndex: number
}

export class Game {
    private random: IRandom;
    public grid: HexGrid<TerrainCell>;
    public pathIndexesSubject: BehaviorSubject<PathChangeEvent>;
    public startIndexSubject: BehaviorSubject<IndexChange>;
    public finishIndexSubject: BehaviorSubject<IndexChange>;

    public get startIndex() {
        return this.startIndexSubject.getValue().currentIndex;
    }

    public set startIndex(value: number) {
        this.startIndexSubject.next({ oldIndex: this.startIndex, currentIndex: value });
    }

    public get finishIndex() {
        return this.finishIndexSubject.getValue().currentIndex;
    }

    public set finishIndex(value: number) {
        this.finishIndexSubject.next({ oldIndex: this.finishIndex, currentIndex: value });
    }

    constructor(random: IRandom, width: number, height: number) {
        this.random = random;
        this.grid = this.generateGameField(width, height);
        this.startIndexSubject = new BehaviorSubject<IndexChange>({ oldIndex: -1, currentIndex: 0 });
        this.finishIndexSubject = new BehaviorSubject<IndexChange>({ oldIndex: -1, currentIndex: width * height - 1 });
        this.pathIndexesSubject = new BehaviorSubject<PathChangeEvent>({ oldPathIndexes: [], currentPathIndexes: [] });
    }

    generateGameField(width: number, height: number): HexGrid<TerrainCell> {
        let grid = new HexGrid<TerrainCell>(width, height, (index) => {
            let tile = new TerrainCell();
            let rnd = this.random.GetRandomNumber(100);
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
        let startCell = this.grid.getCell(this.startIndex);
        let finishCell = this.grid.getCell(this.finishIndex);
        let path = astar.GetPath(startCell, finishCell);
        if (path.length > 0) {
            path = [
                startCell,
                ...
                path
            ];
        }

        let pathChange: PathChangeEvent = {
            currentPathIndexes: path.map(c => c.cellIndex),
            oldPathIndexes: this.pathIndexesSubject.getValue().currentPathIndexes
        };

        this.pathIndexesSubject.next(pathChange);
    }
}