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
        let x = mousex - this.leftMargin + this.spriteWidthHalf;
        let y = mousey - this.topMargin + this.spriteHeightHalf;

        let col = Math.floor(x / this.spriteWidthThreeFourth);
        let row = Math.floor(y / this.spriteHeight);

        //console.log('look around', col, row);

        let res = this.checkIfInsideHex(0, col, row, mousex, mousey)
            || this.checkIfInsideHex(1, col - 1, row, mousex, mousey)
            || this.checkIfInsideHex(2, col, row - 1, mousex, mousey)
            || this.checkIfInsideHex(3, col - 1, row - 1, mousex, mousey)
            || this.checkIfInsideHex(4, col + 1, row, mousex, mousey)
            || this.checkIfInsideHex(5, col, row + 1, mousex, mousey)
            || this.checkIfInsideHex(6, col + 1, row + 1, mousex, mousey)
            || this.checkIfInsideHex(7, col + 1, row - 1, mousex, mousey)
            || this.checkIfInsideHex(8, col - 1, row + 1, mousex, mousey);

        if (res) {
            return res.row * this.gridWidth + res.col;
        } else {
            return -1;
        }
    }

    checkIfInsideHex(n: number, col: number, row: number, mousex: number, mousey: number): { col: number, row: number } {
        if (col < 0 || row < 0 || col >= this.gridWidth || row >= this.gridHeight) {
            return null;
        }

        //get coords of hex
        let coords = { x: undefined, y: undefined };
        this.setSpriteCoordinates(row, col, coords);

        //normalize coords
        let x = mousex - coords.x;
        let y = coords.y - mousey;
        console.log('off', x, y);

        x = x / this.spriteWidthHalf;
        y = y / this.spriteHeightHalf;

        if (this.isInsideNormalizedHexagon(x, y)) {
            console.log('check ok - ' + n);
            return {
                col: col,
                row: row
            };
        }

        return null;
    }

    isInsideNormalizedHexagon(x: number, y: number): boolean {
        // Check length (squared) against inner and outer radius
        let l2 = x * x + y * y;
        if (l2 > 1.0) return false;
        if (l2 < 0.75) return true; // (sqrt(3)/2)^2 = 3/4

        // Check against borders
        let px = x * 1.15470053838; // 2/sqrt(3)
        if (px > 1.0 || px < -1.0) return false;

        let py = 0.5 * px + y;
        if (py > 1.0 || py < -1.0) return false;

        if (px - py > 1.0 || px - py < -1.0) return false;

        return true;
    }
}