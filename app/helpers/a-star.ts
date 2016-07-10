import { BinaryHeap } from '../helpers/binary-heap';

interface Node {
    F: number;
    G: number;
    H: number;
    visited: boolean;
    closed: boolean;
    parent: Node;
}

function cleanNode<T>(t: Node) {
    delete t.F;
    delete t.G;
    delete t.H;
    delete t.visited;
    delete t.closed;
    delete t.parent;
}

export interface IPathFindingStrategy<T> {
    iterateOverNeighbors(currentNode: T, func: (neighbor: T, G: number) => void): void;
    getHeuristic(node1: T, node2: T): number;
    areWeThereYet(currentNode: T, finishNode: T): boolean;
}

export class AStar<T> {
    constructor(private strategy: IPathFindingStrategy<T>) {
    }

    public GetPath(startNode: T, finishNode: T): T[] {
        let openHeap = new BinaryHeap<Node>(a => a.F);
        let result: T[] = [];
        let start: Node = startNode as any as Node;
        let touchedNodes: Node[] = [start];
        start.F = 0;
        start.G = 0;
        start.H = this.strategy.getHeuristic(startNode, finishNode);
        openHeap.push(start);    // 1

        while (openHeap.size() > 0) {
            // 2-a: Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            let currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path.
            if (this.strategy.areWeThereYet(currentNode as any as T, finishNode)) {
                result = this.pathTo(currentNode);
                break;
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Walk over neighbours
            this.strategy.iterateOverNeighbors(currentNode as any as T, (n, G) => { //2-c
                let neighbor = n as any as Node;

                if (neighbor.closed) {
                    // Not a valid node to process, skip to next neighbor.
                    return;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                let gScore = currentNode.G + G;
                let beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.G) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.H = neighbor.H || this.strategy.getHeuristic(neighbor as any as T, finishNode);
                    neighbor.G = gScore;
                    neighbor.F = neighbor.G + neighbor.H;

                    touchedNodes.push(neighbor);

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    } else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            });
        }

        touchedNodes.forEach(cleanNode);
        return result;
    }

    pathTo(node: Node): T[] {
        let curr = node;
        let path: T[] = [];
        while (curr.parent) {
            path.unshift(curr as any as T);
            curr = curr.parent;
        }
        return path;
    }
}