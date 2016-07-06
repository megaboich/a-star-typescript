import { AnimationsManager } from './pixi-ext/pixi-animation-manager'
import { AnimationQueue } from './pixi-ext/./pixi-animation-combined'
import { AnimationMove, EntityPosition } from './pixi-ext/./pixi-animation-move'
import { AnimationScale } from './pixi-ext/./pixi-animation-scale'
import { AnimationFade } from './pixi-ext/./pixi-animation-fade'
import { AnimationDelay } from './pixi-ext/./pixi-animation-delay'

import { Game, TerrainType, GridTile } from '../game/game'
import { RenderHelper } from './pixi-game-render-helper'
import { AStar } from '../hexgrid/a-star'

export class Render {
    private stage: PIXI.Container;
    private fpsText: PIXI.Text;
    private staticRoot: PIXI.Container = null;
    private game: Game;
    private animationsManager: AnimationsManager;
    private renderHelper: RenderHelper;

    private hoveredTerrainIndex: number;
    private startTerrainIndex: number;
    private finishTerrainIndex: number;
    private startOrFinishFlag: boolean = true;
    private brightenFilter: PIXI.filters.ColorMatrixFilter;

    private terrainSprites: PIXI.Sprite[];

    constructor(document: Document, game: Game) {
        this.renderHelper = new RenderHelper(game);
        this.game = game;

        (PIXI.utils as any)._saidHello = true;
        var renderer = PIXI.autoDetectRenderer(600, 630, { backgroundColor: 0xffffff });
        document.body.appendChild(renderer.view);

        // create the root of the scene graph
        this.stage = new PIXI.Container();
        this.RebuildGraphics();

        this.animationsManager = new AnimationsManager(this.onAnimationsCompleted.bind(this));

        var ticker = new PIXI.ticker.Ticker();
        ticker.add(() => {
            this.animationsManager.Update(ticker.elapsedMS);

            renderer.render(this.stage);
            this.fpsText.text = Math.floor(ticker.FPS).toString();
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

        this.staticRoot = new PIXI.Container();
        this.stage.addChild(this.staticRoot);

        var style = <PIXI.TextStyle>{
            font: 'Inconsolata, Courier New',
            fill: '#005521',
            lineHeight: 14,
        };
        this.fpsText = new PIXI.Text("", style);
        this.fpsText.x = 550;
        this.fpsText.y = 8;
        this.staticRoot.addChild(this.fpsText);

        this.terrainSprites = [];
        this.renderHelper.buildTerrainSprites(this.game, (sprite) => {
            sprite.alpha = 0.5;
            this.staticRoot.addChild(sprite);
            this.terrainSprites.push(sprite);
        });

        this.staticRoot.interactive = true;
        this.staticRoot.on('mousedown', this.onMouseDown.bind(this));
        this.staticRoot.on('touchstart', this.onMouseDown.bind(this));
        this.staticRoot.on('mousemove', this.onMouseMove.bind(this));

        this.brightenFilter = new PIXI.filters.ColorMatrixFilter();
        this.brightenFilter.brightness(1.2);
    }

    onMouseDown(event) {
        let data: PIXI.interaction.InteractionData = event.data;
        let terrainIndex = this.renderHelper.coordinatesTranslator.getSpriteIndexFromCoordinates(data.global.x, data.global.y);

        if (terrainIndex < 0 || terrainIndex == this.startTerrainIndex || terrainIndex == this.finishTerrainIndex) {
            return;
        }

        if (this.startOrFinishFlag) {
            if (this.startTerrainIndex >= 0) {
                let oldStartSprite = this.terrainSprites[this.startTerrainIndex];
                oldStartSprite.tint = 0xFFFFFF;
            }
            this.startTerrainIndex = terrainIndex;
            let newStartSprite = this.terrainSprites[this.startTerrainIndex];
            newStartSprite.tint = 0x0fd80f;


        } else {
            if (this.finishTerrainIndex >= 0) {
                let oldFinishSprite = this.terrainSprites[this.finishTerrainIndex];
                oldFinishSprite.tint = 0xFFFFFF;
            }
            this.finishTerrainIndex = terrainIndex;
            let newFinishSprite = this.terrainSprites[this.finishTerrainIndex];
            newFinishSprite.tint = 0xffa30f;
        }

        this.startOrFinishFlag = !this.startOrFinishFlag;

        if (this.startTerrainIndex >= 0 && this.finishTerrainIndex >= 0) {
            let astar = new AStar(this.game.grid);
            var path = astar.GetPath(this.startTerrainIndex, this.finishTerrainIndex);
            console.log('path: ', path);
        }
    }

    onMouseMove(event) {
        let data: PIXI.interaction.InteractionData = event.data;
        let terrainIndex = this.renderHelper.coordinatesTranslator.getSpriteIndexFromCoordinates(data.global.x, data.global.y);

        if (terrainIndex >= 0 && this.hoveredTerrainIndex != terrainIndex) {
            if (this.hoveredTerrainIndex >= 0) {
                let oldHoveredSprite = this.terrainSprites[this.hoveredTerrainIndex];
                oldHoveredSprite.filters = null;
            }
            this.hoveredTerrainIndex = terrainIndex;
            let hoveredSprite = this.terrainSprites[this.hoveredTerrainIndex];
            hoveredSprite.filters = [this.brightenFilter];
        }
    }

    private rebuildDynamicObjects() {

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