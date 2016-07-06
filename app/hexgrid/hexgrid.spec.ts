import { HexGrid, HexDirection } from './hexgrid'

class TestCell {
    name: string;
    num: number;
    data: any[] = [];
}

describe(`Hex Grid`, () => {
    it(`Create and expect to have correct number of cells`, () => {
        let grid = new HexGrid<string>(2, 2, (index) => index.toString());

        let arr: number[] = [];
        let f = (cell, index) => {
            arr.push(cell)
        };
        grid.enumerateAllCells(f);
        expect(arr).toEqual(['0', '1', '2', '3']);
    })

    it(`Objects in a grid`, () => {
        let grid = new HexGrid<TestCell>(2, 2, (index) => new TestCell());

        let firstCell = grid.getCellValue(0);
        firstCell.name = 'First cell';
        firstCell.data.push('Some data of first cell');

        grid.enumerateAllCells((cellValue, cellIndex) => {
            if (cellIndex == 0) {
                expect(cellValue.name).toEqual('First cell');
                expect(cellValue.data).toEqual(['Some data of first cell']);
            }
        })
    })

    it(`Get neighbor index`, () => {
        let grid = new HexGrid<string>(4, 3, (index) => index.toString());
        expect(grid.getCellNeighborIndex(1, HexDirection.N)).toBe(-1);
        expect(grid.getCellNeighborIndex(5, HexDirection.N)).toBe(1);
        expect(grid.getCellNeighborIndex(11, HexDirection.N)).toBe(7);

        expect(grid.getCellNeighborIndex(0, HexDirection.NE)).toBe(-1);
        expect(grid.getCellNeighborIndex(3, HexDirection.NE)).toBe(-1);
        expect(grid.getCellNeighborIndex(4, HexDirection.NE)).toBe(1);
        expect(grid.getCellNeighborIndex(1, HexDirection.NE)).toBe(2);

        expect(grid.getCellNeighborIndex(0, HexDirection.NW)).toBe(-1);
        expect(grid.getCellNeighborIndex(4, HexDirection.NW)).toBe(-1);
        expect(grid.getCellNeighborIndex(5, HexDirection.NW)).toBe(4);
        expect(grid.getCellNeighborIndex(10, HexDirection.NW)).toBe(5);

        expect(grid.getCellNeighborIndex(11, HexDirection.S)).toBe(-1);
        expect(grid.getCellNeighborIndex(0, HexDirection.S)).toBe(4);
        expect(grid.getCellNeighborIndex(1, HexDirection.S)).toBe(5);

        expect(grid.getCellNeighborIndex(11, HexDirection.SE)).toBe(-1);
        expect(grid.getCellNeighborIndex(7, HexDirection.SE)).toBe(-1);
        expect(grid.getCellNeighborIndex(5, HexDirection.SE)).toBe(10);
        expect(grid.getCellNeighborIndex(10, HexDirection.SE)).toBe(11);

        expect(grid.getCellNeighborIndex(11, HexDirection.SW)).toBe(-1);
        expect(grid.getCellNeighborIndex(5, HexDirection.SW)).toBe(8);
        expect(grid.getCellNeighborIndex(8, HexDirection.SW)).toBe(-1);
        expect(grid.getCellNeighborIndex(6, HexDirection.SW)).toBe(5);
    })
})