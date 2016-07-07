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

    it(`Get neighbor index`, () => {
        let grid = new HexGrid<string>(4, 3, (index) => index.toString());
        expect(grid.getNeighborCellIndex(1, HexDirection.N)).toBe(-1);
        expect(grid.getNeighborCellIndex(5, HexDirection.N)).toBe(1);
        expect(grid.getNeighborCellIndex(11, HexDirection.N)).toBe(7);

        expect(grid.getNeighborCellIndex(0, HexDirection.NE)).toBe(-1);
        expect(grid.getNeighborCellIndex(3, HexDirection.NE)).toBe(-1);
        expect(grid.getNeighborCellIndex(4, HexDirection.NE)).toBe(1);
        expect(grid.getNeighborCellIndex(1, HexDirection.NE)).toBe(2);

        expect(grid.getNeighborCellIndex(0, HexDirection.NW)).toBe(-1);
        expect(grid.getNeighborCellIndex(4, HexDirection.NW)).toBe(-1);
        expect(grid.getNeighborCellIndex(5, HexDirection.NW)).toBe(4);
        expect(grid.getNeighborCellIndex(10, HexDirection.NW)).toBe(5);

        expect(grid.getNeighborCellIndex(11, HexDirection.S)).toBe(-1);
        expect(grid.getNeighborCellIndex(0, HexDirection.S)).toBe(4);
        expect(grid.getNeighborCellIndex(1, HexDirection.S)).toBe(5);

        expect(grid.getNeighborCellIndex(11, HexDirection.SE)).toBe(-1);
        expect(grid.getNeighborCellIndex(7, HexDirection.SE)).toBe(-1);
        expect(grid.getNeighborCellIndex(5, HexDirection.SE)).toBe(10);
        expect(grid.getNeighborCellIndex(10, HexDirection.SE)).toBe(11);

        expect(grid.getNeighborCellIndex(11, HexDirection.SW)).toBe(-1);
        expect(grid.getNeighborCellIndex(5, HexDirection.SW)).toBe(8);
        expect(grid.getNeighborCellIndex(8, HexDirection.SW)).toBe(-1);
        expect(grid.getNeighborCellIndex(6, HexDirection.SW)).toBe(5);
    })
})