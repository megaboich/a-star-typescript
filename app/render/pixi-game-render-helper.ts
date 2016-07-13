import { Game, TerrainType } from '../game/game'
import { HexGridCoordinatesTranslator } from '../helpers/hexgrid/index'

export class RenderHelper {
    TerrainTextures = {
        Water: PIXI.Texture.fromImage(require('../assets/terrain/water.gif')),
        Wood: PIXI.Texture.fromImage(require('../assets/terrain/wood.gif')),
        Grass: PIXI.Texture.fromImage(require('../assets/terrain/grass.gif')),
        Desert: PIXI.Texture.fromImage(require('../assets/terrain/desert.gif')),
        Mouintain: PIXI.Texture.fromImage(require('../assets/terrain/ore.gif'))
    }

    coordinatesTranslator: HexGridCoordinatesTranslator;

    constructor(private game: Game) {
        this.coordinatesTranslator = new HexGridCoordinatesTranslator(100, 60, 64, 54, game.grid.width, game.grid.height);
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
            case TerrainType.Water:
                return this.TerrainTextures.Water;
        }
    }

    public getTerrainSprite(terrainType: TerrainType): PIXI.Sprite {
        let texture = this.getTerrainTexture(terrainType);
        let terrainSprite = new PIXI.Sprite(texture);
        terrainSprite.anchor.x = 0.5;
        terrainSprite.anchor.y = 0.5;
        return terrainSprite;
    }

    public buildTerrainSprites(game: Game, func: (sprite: PIXI.Sprite) => void): void {
        let index = 0;
        for (let irow = 0; irow < game.grid.height; ++irow) {
            for (let icol = 0; icol < game.grid.width; ++icol) {
                let c = game.grid.getCell(index).value;
                let terrainSprite = this.getTerrainSprite(c.terrainType);
                this.coordinatesTranslator.setCoordinatesOfHexCell(irow, icol, terrainSprite.position);
                func(terrainSprite);
                ++index;
            }
        }
    }
}





