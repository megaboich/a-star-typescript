import { Game, TerrainType, TerrainCell } from '../game/game'
import { HexGridCoordinatesTranslator, HexCell } from '../helpers/hexgrid/index'

export class RenderHelper {
    TerrainTextures = {
        Wood: PIXI.Texture.fromImage(require('../assets/terrain/forested-mixed-summer-hills-tile.png')),
        Grass: PIXI.Texture.fromImage(require('../assets/terrain/semi-dry.png')),
        Desert: PIXI.Texture.fromImage(require('../assets/terrain/desert.png')),
        Mouintain: PIXI.Texture.fromImage(require('../assets/terrain/mountains-dry-tile.png')),

        WaterAnimation: [
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A01.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A02.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A03.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A04.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A05.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A06.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A07.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A08.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A09.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A10.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A11.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A12.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A13.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A14.png')),
            PIXI.Texture.fromImage(require('../assets/terrain/water/coast-tropical-A15.png')),
        ]
    }

    MiscTextures = {
        SmallArrow: PIXI.Texture.fromImage(require('../assets/arrow-yellow.png')),
        Stub: PIXI.Texture.fromImage(require('../assets/stub.png')),
    }

    coordinatesTranslator: HexGridCoordinatesTranslator;
    sprite_vertical_scale: number;

    constructor(private game: Game) {
        this.coordinatesTranslator = new HexGridCoordinatesTranslator(100, 60, 72, 62, game.grid.width, game.grid.height);
        this.sprite_vertical_scale = 0.88;
    }

    public getTerrainTexture(terrainType: TerrainType): PIXI.Texture {
        switch (terrainType) {
            case TerrainType.Desert:
                return this.TerrainTextures.Desert;
            case TerrainType.Grass:
                return this.TerrainTextures.Grass;
            case TerrainType.Mountain:
                return this.TerrainTextures.Mouintain;
            case TerrainType.Tree:
                return this.TerrainTextures.Wood;
            default:
                throw 'Wrong terrain texture';
        }
    }

    public getTerrainSprite(terrainType: TerrainType): PIXI.Sprite {
        let terrainSprite: PIXI.Sprite;
        switch (terrainType) {
            case TerrainType.Water:
                let movie = new PIXI.extras.MovieClip(this.TerrainTextures.WaterAnimation);
                movie.animationSpeed = 0.1;
                movie.play();
                terrainSprite = movie;
                break;
            default:
                let texture = this.getTerrainTexture(terrainType);
                terrainSprite = new PIXI.Sprite(texture);
                break;
        }
        //terrainSprite = new PIXI.Sprite(this.MiscTextures.Stub);
        terrainSprite.anchor.x = 0.5;
        terrainSprite.anchor.y = 0.5;
        terrainSprite.scale.y = this.sprite_vertical_scale;
        return terrainSprite;
    }

    public buildTerrainSprites(game: Game, func: (sprite: PIXI.Sprite) => void): void {
        let index = 0;
        for (let irow = 0; irow < game.grid.height; ++irow) {
            for (let icol = 0; icol < game.grid.width; ++icol) {
                let c = game.grid.getCell(index);
                let sprite = this.buildTerrainSprite(c);
                func(sprite);
                ++index;
            }
        }
    }

    public buildTerrainSprite(cell: HexCell<TerrainCell>): PIXI.Sprite {
        let terrainSprite = this.getTerrainSprite(cell.value.terrainType);
        this.coordinatesTranslator.setCoordinatesOfHexCell(cell.row, cell.col, terrainSprite.position);
        return terrainSprite;
    }

    public buildPathHighlightSprite(cellIndex: number, nextCellIndex: number): PIXI.Sprite {
        let cell = this.game.grid.getCell(cellIndex);
        let nextCell = this.game.grid.getCell(nextCellIndex);
        let angle = this.coordinatesTranslator.calculateRotationDirectionFromOneCellToAnother(cell.row, cell.col, nextCell.row, nextCell.col);
        let sprite = new PIXI.Sprite(this.MiscTextures.SmallArrow);
        sprite.rotation = angle;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        this.coordinatesTranslator.setCoordinatesOfHexCell(cell.row, cell.col, sprite.position);
        return sprite;
    }
}





