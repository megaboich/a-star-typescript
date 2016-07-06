import * as pixi from 'pixi.js'
import { AnimationsManager } from './pixi-ext/pixi-animation-manager'
import { AnimationQueue } from './pixi-ext/./pixi-animation-combined'
import { AnimationMove, EntityPosition } from './pixi-ext/./pixi-animation-move'
import { AnimationScale } from './pixi-ext/./pixi-animation-scale'
import { AnimationFade } from './pixi-ext/./pixi-animation-fade'
import { AnimationDelay } from './pixi-ext/./pixi-animation-delay'

import { Game, TerrainType } from '../game/game'
import { RenderHelper } from './pixi-game-render-helper'

export class Render {
    private stage: pixi.Container;
    private fpsText: pixi.Text;
    private staticRoot: pixi.Container = null;
    private game: Game;
    private animationsManager: AnimationsManager;
    private renderHelper: RenderHelper;

    private terrainSprites: pixi.Sprite[];

    constructor(document: Document, game: Game) {
        this.renderHelper = new RenderHelper(game);
        this.game = game;

        (pixi.utils as any)._saidHello = true;
        var renderer = pixi.autoDetectRenderer(900, 900, { backgroundColor: 0xffffff });
        document.body.appendChild(renderer.view);

        // create the root of the scene graph
        this.stage = new pixi.Container();
        this.RebuildGraphics();

        this.animationsManager = new AnimationsManager(this.onAnimationsCompleted.bind(this));

        var ticker = new pixi.ticker.Ticker();
        ticker.add(() => {
            this.animationsManager.Update(ticker.elapsedMS);

            renderer.render(this.stage);
            this.fpsText.text = ticker.FPS.toFixed(2);
        });
        ticker.start();
    }

    RebuildGraphics(): void {
        this.rebuildStaticObjects();
        this.rebuildDynamicObjects();
    }

    onAnimationsCompleted(): void {
    }

    private rebuildStaticObjects() {
        if (this.staticRoot != null) {
            this.stage.removeChild(this.staticRoot);
        }

        this.staticRoot = new pixi.Container();
        this.stage.addChild(this.staticRoot);

        var style = <pixi.TextStyle>{
            font: 'Inconsolata, Courier New',
            fill: '#005521',
            lineHeight: 14,
        };
        this.fpsText = new pixi.Text("", style);
        this.fpsText.x = 300;
        this.fpsText.y = 8;
        this.staticRoot.addChild(this.fpsText);

        this.terrainSprites = [];
        this.renderHelper.buildTerrainSprites(this.game, (sprite) => {
            this.staticRoot.addChild(sprite);
            this.terrainSprites.push(sprite);
        });

        this.staticRoot.interactive = true;
        this.staticRoot.on('mousedown', this.onButtonDown.bind(this));
        this.staticRoot.on('touchstart', this.onButtonDown.bind(this));
    }

    onButtonDown(event) {
        let data: pixi.interaction.InteractionData = event.data;
        let terrainIndex = this.renderHelper.coordinatesTranslator.getSpriteIndexFromCoordinates(data.global.x, data.global.y);
        console.log(data.global.x, data.global.y, terrainIndex);

        this.terrainSprites.forEach(sprite => sprite.alpha = 0.05);
        this.terrainSprites[terrainIndex].alpha = 0.3;
    }

    private rebuildDynamicObjects() {
        /*
        // Remove existing tiles
        this.tiles.Values().forEach(element => {
            this.stage.removeChild(element);
        });

        this.stage.children.forEach((item) => {
            if (item instanceof TileSprite) {
                console.log('Found not deleted ' + (<TileSprite>item).TileKey);
            }
        });

        this.tiles = new Dictionary<string, TileSprite>([]);

        // Add tiles from game grid
        for (var irow = 0; irow < this.game.Grid.Size; ++irow) {
            for (var icell = 0; icell < this.game.Grid.Size; ++icell) {
                var tileValue = this.game.Grid.Cells[irow][icell];
                if (tileValue != 0) {
                    var tile = this.addTileGraphics(irow, icell, tileValue);
                    this.registerTile(tile);
                }
            }
        }*/
    }

    private bringToFront(tile: PIXI.DisplayObject) {
        if (tile) {
            var p = tile.parent;
            if (p) {
                p.removeChild(tile);
                p.addChild(tile);
            }
        }
    }
}