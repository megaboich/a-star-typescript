import { HighligtedSprite } from './pixi-ext/pixi-highlighted-sprite'

import { Game } from '../game/game'
import { RenderHelper } from './pixi-game-render-helper'

const START_TINT_COLOR = 0x0fd80f;
const FINISH_TINT_COLOR = 0xff6666;

export class Render {
    private game: Game;
    private renderHelper: RenderHelper;

    private stage: PIXI.Container;
    private fpsText: PIXI.Text;
    private staticRoot: PIXI.Container = null;
    private brightenFilter: PIXI.filters.ColorMatrixFilter;
    private terrainSprites: HighligtedSprite[];

    private hoveredTerrainIndex: number;
    private dragStartCell: boolean;
    private dragFinishCell: boolean;

    constructor(document: Document, game: Game) {
        this.renderHelper = new RenderHelper(game);
        this.game = game;

        (PIXI.utils as any)._saidHello = true;
        var renderer = PIXI.autoDetectRenderer(1200, 630, { backgroundColor: 0xffffff });
        document.body.appendChild(renderer.view);

        // create the root of the scene graph
        this.stage = new PIXI.Container();
        this.BuildGraphics();

        var ticker = new PIXI.ticker.Ticker();
        ticker.add(() => {
            renderer.render(this.stage);
            this.fpsText.text = Math.floor(ticker.FPS).toString();
        });
        ticker.start();
    }

    BuildGraphics(): void {
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
            sprite.alpha = 0.6;
            this.staticRoot.addChild(sprite);
            this.terrainSprites.push(HighligtedSprite.fromSprite(sprite));
        });

        this.staticRoot.interactive = true;
        this.staticRoot
            .on('mousedown', this.onMouseDown.bind(this))
            .on('touchstart', this.onMouseDown.bind(this))
            .on('mousemove', this.onMouseMove.bind(this))
            .on('touchmove', this.onMouseMove.bind(this))
            .on('mouseup', this.onMouseUp.bind(this))
            .on('mouseupoutside', this.onMouseUp.bind(this))
            .on('touchend', this.onMouseUp.bind(this))
            .on('touchendoutside', this.onMouseUp.bind(this))

        this.brightenFilter = new PIXI.filters.ColorMatrixFilter();
        this.brightenFilter.brightness(1.2);

        this.terrainSprites[this.game.startCellIndex].setHighlighting({ tintColor: START_TINT_COLOR });
        this.terrainSprites[this.game.finishCellIndex].setHighlighting({ tintColor: FINISH_TINT_COLOR });
    }

    onAnimationsCompleted(): void {
    }

    onMouseDown(event) {
        let data: PIXI.interaction.InteractionData = event.data;
        let terrainIndex = this.renderHelper.coordinatesTranslator.getCellndexFromCoordinates(data.global.x, data.global.y);

        if (terrainIndex < 0) {
            return;
        }

        if (terrainIndex == this.game.startCellIndex) {
            this.dragStartCell = true;
            return;
        }

        if (terrainIndex == this.game.finishCellIndex) {
            this.dragFinishCell = true;
            return;
        }

        // switch cell terrain type
        var cell = this.game.grid.getCell(terrainIndex).value;
        cell.terrainType = this.game.getNextTerrainType(cell.terrainType);
        this.terrainSprites[terrainIndex].texture = this.renderHelper.getTerrainTexture(cell.terrainType);

        this.buildPath();
    }

    onMouseMove(event) {
        let data: PIXI.interaction.InteractionData = event.data;
        let terrainIndex = this.renderHelper.coordinatesTranslator.getCellndexFromCoordinates(data.global.x, data.global.y);

        if (terrainIndex < 0) {
            return;
        }

        if (this.hoveredTerrainIndex != terrainIndex) {
            if (this.hoveredTerrainIndex >= 0) {
                this.terrainSprites[this.hoveredTerrainIndex].removeHighlighting({ filters: true });
            }
            this.hoveredTerrainIndex = terrainIndex;
            this.terrainSprites[this.hoveredTerrainIndex].setHighlighting({ filters: [this.brightenFilter] });
        }

        if (this.dragStartCell) {
            if (terrainIndex == this.game.finishCellIndex) {
                return;
            }
            if (terrainIndex != this.game.startCellIndex) {
                this.terrainSprites[this.game.startCellIndex].removeHighlighting({ tintColor: true });
                this.game.startCellIndex = terrainIndex;
                this.terrainSprites[this.game.startCellIndex].setHighlighting({ tintColor: START_TINT_COLOR });

                this.buildPath();
            }
        }

        if (this.dragFinishCell) {
            if (terrainIndex == this.game.startCellIndex) {
                return;
            }
            if (terrainIndex != this.game.finishCellIndex) {
                this.terrainSprites[this.game.finishCellIndex].removeHighlighting({ tintColor: true });
                this.game.finishCellIndex = terrainIndex;
                this.terrainSprites[this.game.finishCellIndex].setHighlighting({ tintColor: FINISH_TINT_COLOR });

                this.buildPath();
            }
        }
    }

    onMouseUp(event) {
        this.dragStartCell = false;
        this.dragFinishCell = false;
    }

    buildPath() {
        this.game.pathIndexes.forEach(i => this.terrainSprites[i].removeHighlighting({ alpha: true }));
        this.game.buildPath();
        this.game.pathIndexes.forEach(i => this.terrainSprites[i].setHighlighting({ alpha: 1 }));
    }
}