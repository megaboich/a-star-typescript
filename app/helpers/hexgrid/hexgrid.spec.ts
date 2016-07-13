import { HexGrid, HexDirection } from './hexgrid'

class TestCell {
    name: string;
    num: number;
    data: any[] = [];
}

describe(`Hex Grid`, () => {
    it(`Create and expect to have correct number of cells`, () => {
        let grid = new HexGrid<string>(2, 2, (index) => index.toString());

        let arr: string[] = [];
        grid.enumerateAllCells((cell, index) => {
            arr.push(cell.value);
        });
        expect(arr).toEqual(['0', '1', '2', '3']);
    })

    it(`Objects in a grid`, () => {
        let grid = new HexGrid<TestCell>(2, 2, (index) => new TestCell());

        let firstCell = grid.getCell(0).value;
        firstCell.name = 'First cell';
        firstCell.data.push('Some data of first cell');

        grid.enumerateAllCells((cell, cellIndex) => {
            if (cellIndex == 0) {
                expect(cell.value.name).toEqual('First cell');
                expect(cell.value.data).toEqual(['Some data of first cell']);
            }
        })
    })

    function checkNeighbor<T>(grid: HexGrid<T>, index: number, dir: HexDirection, expectedIndex: number) {
        let neighbor = grid.getNeighbor(grid.getCell(index), dir);
        if (expectedIndex >= 0) {
            let expeced = grid.getCell(expectedIndex);
            expect(neighbor).toBe(expeced);
        }
        else {
            expect(neighbor).toBe(null);
        }
    }

    it(`Get neighbor index`, () => {
        let grid = new HexGrid<string>(4, 3, (index) => index.toString());
        checkNeighbor(grid, 1, HexDirection.N, -1);
        checkNeighbor(grid, 5, HexDirection.N, 1);
        checkNeighbor(grid, 11, HexDirection.N, 7);

        checkNeighbor(grid, 0, HexDirection.NE, -1);
        checkNeighbor(grid, 3, HexDirection.NE, -1);
        checkNeighbor(grid, 4, HexDirection.NE, 1);
        checkNeighbor(grid, 1, HexDirection.NE, 2);

        checkNeighbor(grid, 0, HexDirection.NW, -1);
        checkNeighbor(grid, 4, HexDirection.NW, -1);
        checkNeighbor(grid, 5, HexDirection.NW, 4);
        checkNeighbor(grid, 10, HexDirection.NW, 5);

        checkNeighbor(grid, 11, HexDirection.S, -1);
        checkNeighbor(grid, 0, HexDirection.S, 4);
        checkNeighbor(grid, 1, HexDirection.S, 5);

        checkNeighbor(grid, 11, HexDirection.SE, -1);
        checkNeighbor(grid, 7, HexDirection.SE, -1);
        checkNeighbor(grid, 5, HexDirection.SE, 10);
        checkNeighbor(grid, 10, HexDirection.SE, 11);

        checkNeighbor(grid, 11, HexDirection.SW, -1);
        checkNeighbor(grid, 5, HexDirection.SW, 8);
        checkNeighbor(grid, 8, HexDirection.SW, -1);
        checkNeighbor(grid, 6, HexDirection.SW, 5);
    })
})