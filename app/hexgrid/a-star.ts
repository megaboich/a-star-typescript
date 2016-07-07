import { HexGrid, HexDirection, Cell } from './hexgrid'
import { GridTile, TerrainType } from '../game/game'
import { Heap } from 'typescript-collections';

class Node<T> extends Cell<T> {
    F: number;
    G: number;
    H: number;
    cellIndex: number;
    visited: boolean;
    closed: boolean;
    parent: Node<T>;
}

function cleanNode<T>(t: Node<T>) {
    delete t.F;
    delete t.G;
    delete t.H;
    delete t.cellIndex;
    delete t.visited;
    delete t.closed;
    delete t.parent;
}

export interface IPathFindingStrategy<T> {
    iterateOverNeighbors(cellIndex: number, func: (neighborCell: Cell<T>, neighborCellIndex: number, G: number) => void): void;
    getHeuristic(c1: Cell<T>, c2: Cell<T>): number;
}

export class AStar<T> {
    constructor(private grid: HexGrid<T>,
        private strategy: IPathFindingStrategy<T>) {
    }

    public GetPath(startCellIndex: number, finishCellIndex: number): number[] {
        this.grid.enumerateAllCells(c => cleanNode(c as Node<T>));

        let dirtyNodes: Node<T>[] = [];
        let openHeap = new Heap<Node<T>>((a, b) => {
            if (a.F < b.F) return -1;
            if (a.F > b.F) return 1;
            return 0;
        });

        let result: number[] = [];
        let start: Node<T> = this.grid.getCell(startCellIndex) as Node<T>;
        let finish = this.grid.getCell(finishCellIndex);
        start.F = 0;
        start.G = 0;
        start.H = this.strategy.getHeuristic(start, finish);
        start.cellIndex = startCellIndex;
        openHeap.add(start);    // 1

        while (!openHeap.isEmpty()) {
            // 2-a: Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            let currentNode = openHeap.removeRoot();

            // End case -- result has been found, return the traced path.
            if (currentNode.cellIndex == finishCellIndex) {
                result = this.pathTo(currentNode);
                break;
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Walk over neighbours
            this.strategy.iterateOverNeighbors(currentNode.cellIndex, (n, neighborIndex, G) => { //2-c
                let neighbor = n as Node<T>;

                if (neighbor.closed) {
                    // Not a valid node to process, skip to next neighbor.
                    return;
                }
                neighbor.cellIndex = neighborIndex;

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                var gScore = currentNode.G + G;
                var beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.G) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.H = neighbor.H || this.strategy.getHeuristic(neighbor, finish);
                    neighbor.G = gScore;
                    neighbor.F = neighbor.G + neighbor.H;

                    dirtyNodes.push(neighbor);

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.add(neighbor);
                    } else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        // TODO: rewrite in more efficient way
                        let items = [];
                        openHeap.forEach(t => { items.push(t); });
                        openHeap.clear();
                        items.forEach(i => { openHeap.add(i); });
                    }
                }
            });
        }

        dirtyNodes.forEach(cell => cleanNode(cell as Node<T>));
        return result;
    }

    pathTo(cell: Node<T>): number[] {
        var curr = cell;
        var path: number[] = [];
        while (curr.parent) {
            path.unshift(curr.cellIndex);
            curr = curr.parent;
        }
        return path;
    }
}