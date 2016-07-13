import { HighligtedSprite } from './pixi-ext/pixi-highlighted-sprite'

import { Game, PathChangeEvent } from '../game/game'
import { RenderHelper } from './pixi-game-render-helper'
import { Subject } from 'rxjs/Subject';

const START_TINT_COLOR = 0x0fd80f;
const FINISH_TINT_COLOR = 0xff6666;

export class Render {
    private game: Game;
    private renderHelper: RenderHelper;

    private stage: PIXI.Container;
    private fpsText: PIXI.Text;
    private terrainContainer: PIXI.Container = null;
    private brightenFilter: PIXI.filters.ColorMatrixFilter;
    private terrainSprites: HighligtedSprite[];

    private hoveredTerrainIndex: number;
    private dragStartCell: boolean;
    private dragFinishCell: boolean;

    public onCellClick = new Subject<number>();
    public onStartChanged = new Subject<number>();
    public onFinishChanged = new Subject<number>();

    constructor(document: Document, game: Game) {
        this.renderHelper = new RenderHelper(game);
        this.game = game;

        (PIXI.utils as any)._saidHello = true;
        let renderer = PIXI.autoDetectRenderer(1200, 630, { backgroundColor: 0xffffff });
        document.body.appendChild(renderer.view);

        // create the root of the scene graph
        this.stage = new PIXI.Container();
        let ticker = new PIXI.ticker.Ticker();
        ticker.add(() => {
            renderer.render(this.stage);
            if (this.fpsText) {
                this.fpsText.text = Math.floor(ticker.FPS).toString();
            }
        });
        ticker.start();

        // create all graphic objects        
        this.buildGraphics();

        this.game.pathIndexesSubject.subscribe(change => {
            change.oldPathIndexes.forEach(i => this.terrainSprites[i].removeHighlighting({ alpha: true }));
            change.currentPathIndexes.forEach(i => this.terrainSprites[i].setHighlighting({ alpha: 1 }));
        });
        this.game.startIndexSubject.subscribe(change => {
            if (change.oldIndex >= 0) {
                this.terrainSprites[change.oldIndex].removeHighlighting({ tintColor: true });
            }
            this.terrainSprites[change.currentIndex].setHighlighting({ tintColor: START_TINT_COLOR });
        });
        this.game.finishIndexSubject.subscribe(change => {
            if (change.oldIndex >= 0) {
                this.terrainSprites[change.oldIndex].removeHighlighting({ tintColor: true });
            }
            this.terrainSprites[change.currentIndex].setHighlighting({ tintColor: FINISH_TINT_COLOR });
        });
    }

    buildGraphics(): void {
        const fpsTextStyle = <PIXI.TextStyle>{
            font: 'Inconsolata, Courier New',
            fill: '#005521',
            lineHeight: 14,
        };
        this.fpsText = new PIXI.Text("", fpsTextStyle);
        this.fpsText.x = 550;
        this.fpsText.y = 8;
        this.stage.addChild(this.fpsText);

        this.terrainContainer = new PIXI.Container();
        this.stage.addChild(this.terrainContainer);

        this.terrainSprites = [];
        this.renderHelper.buildTerrainSprites(this.game, (sprite) => {
            sprite.alpha = 0.6;
            this.terrainContainer.addChild(sprite);
            this.terrainSprites.push(HighligtedSprite.fromSprite(sprite));
        });

        this.terrainContainer.interactive = true;
        this.terrainContainer
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
    }

    updateCellTexture(cellIndex: number) {
        let cell = this.game.grid.getCell(cellIndex);
        this.terrainSprites[cellIndex].texture = this.renderHelper.getTerrainTexture(cell.value.terrainType);
    }

    onMouseDown(event) {
        let data: PIXI.interaction.InteractionData = event.data;
        let terrainIndex = this.renderHelper.coordinatesTranslator.getCellndexFromCoordinates(data.global.x, data.global.y);

        // Click outside cell
        if (terrainIndex < 0) {
            return;
        }

        // Click on start - toggle dragging        
        if (terrainIndex == this.game.startIndex) {
            this.dragStartCell = true;
            return;
        }

        // Click on finish - toggle dragging        
        if (terrainIndex == this.game.finishIndex) {
            this.dragFinishCell = true;
            return;
        }

        // Regular click
        this.onCellClick.next(terrainIndex);
    }

    onMouseMove(event) {
        let data: PIXI.interaction.InteractionData = event.data;
        let terrainIndex = this.renderHelper.coordinatesTranslator.getCellndexFromCoordinates(data.global.x, data.global.y);

        if (terrainIndex < 0
            || terrainIndex == this.game.startIndex
            || terrainIndex == this.game.finishIndex) {
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
            this.onStartChanged.next(terrainIndex);
        }

        if (this.dragFinishCell) {
            this.onFinishChanged.next(terrainIndex);
        }
    }

    onMouseUp(event) {
        this.dragStartCell = false;
        this.dragFinishCell = false;
    }
}