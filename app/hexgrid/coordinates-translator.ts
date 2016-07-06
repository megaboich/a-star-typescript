export class CoordinatesTranslator {
    spriteHeightHalf: number;
    spriteWidthHalf: number;
    spriteWidthThreeFourth: number;

    constructor(private leftMargin: number,
        private topMargin: number,
        private spriteWidth: number,
        private spriteHeight: number,
        private gridWidth: number,
        private gridHeight: number) {

        this.spriteHeightHalf = spriteHeight / 2;
        this.spriteWidthHalf = spriteWidth / 2;
        this.spriteWidthThreeFourth = (spriteWidth / 4) * 3;
    }

    setSpriteCoordinates(row: number, col: number, sprite: { x: number, y: number }): void {
        let vert_shift = (col % 2 != 0) ? this.spriteHeightHalf : 0;
        sprite.x = this.leftMargin + col * this.spriteWidthThreeFourth;
        sprite.y = this.topMargin + row * this.spriteHeight + vert_shift;
    }

    getSpriteIndexFromCoordinates(mousex: number, mousey: number): number {
        let x = mousex - this.leftMargin;
        let y = mousey - this.topMargin;

        let col = Math.floor(x / this.spriteWidthThreeFourth);
        let row = Math.floor(y / this.spriteHeight);

        console.log('look around', col, row);

        let res = this.checkIfInsideHex(col, row, mousex, mousey)
            || this.checkIfInsideHex(col - 1, row, mousex, mousey)
            || this.checkIfInsideHex(col, row - 1, mousex, mousey)
            || this.checkIfInsideHex(col - 1, row - 1, mousex, mousey)
            || this.checkIfInsideHex(col + 1, row, mousex, mousey)
            || this.checkIfInsideHex(col, row + 1, mousex, mousey)
            || this.checkIfInsideHex(col + 1, row + 1, mousex, mousey)
            || this.checkIfInsideHex(col + 1, row - 1, mousex, mousey)
            || this.checkIfInsideHex(col - 1, row + 1, mousex, mousey);

        return res.row * this.gridWidth + res.col;
    }

    checkIfInsideHex(col: number, row: number, mousex: number, mousey: number): { col: number, row: number } {
        if (col < 0 || row < 0 || col >= this.gridWidth || row >= this.gridHeight) {
            return null;
        }

        return {
            col: col,
            row: row
        };
    }
}