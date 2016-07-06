import * as pixi from 'pixi.js'

import { Game, TerrainType } from '../game/game'
import { CoordinatesTranslator } from '../hexgrid/coordinates-translator'

export class RenderHelper {
    TerrainTextures = {
        Water: pixi.Texture.fromImage(require('../assets/terrain/water.gif')),
        Wood: pixi.Texture.fromImage(require('../assets/terrain/wood.gif')),
        Grass: pixi.Texture.fromImage(require('../assets/terrain/grass.gif')),
        Desert: pixi.Texture.fromImage(require('../assets/terrain/desert.gif')),
        Mouintain: pixi.Texture.fromImage(require('../assets/terrain/ore.gif'))
    }

    coordinatesTranslator: CoordinatesTranslator;

    constructor(private game: Game) {
        this.coordinatesTranslator = new CoordinatesTranslator(100, 100, 64, 54, game.grid.width, game.grid.height);
    }

    public getTerrainTexture(terrainType: TerrainType): pixi.Texture {
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

    public getTerrainSprite(terrainType: TerrainType): pixi.Sprite {
        let texture = this.getTerrainTexture(terrainType);
        var terrainSprite = new pixi.Sprite(texture);
        terrainSprite.anchor.x = 0.5;
        terrainSprite.anchor.y = 0.5;
        return terrainSprite;
    }

    public buildTerrainSprites(game: Game, func: (sprite: pixi.Sprite) => void): void {
        let index = 0;
        for (let irow = 0; irow < game.grid.height; ++irow) {
            for (let icol = 0; icol < game.grid.width; ++icol) {
                let c = game.grid.getCellValue(index);
                let terrainSprite = this.getTerrainSprite(c.terrainType);
                terrainSprite.alpha = 0.04;
                this.coordinatesTranslator.setSpriteCoordinates(irow, icol, terrainSprite.position);
                func(terrainSprite);
                ++index;
            }
        }
    }
}





