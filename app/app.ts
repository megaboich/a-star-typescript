import 'pixi.js'
import { DefaultRandom } from './helpers/random'
import { Render } from './render/pixi-game-render'
import { Game } from './game/game'

let game: Game;
let render: Render;

function Run() {
    let random = new DefaultRandom();
    game = new Game(random, 10, 10);
    render = new Render(document, game);

    render.onCellClick.subscribe(cellIndex => {
        let cell = game.grid.getCell(cellIndex).value;
        cell.terrainType = game.getNextTerrainType(cell.terrainType);
        render.updateCell(cellIndex);
        game.buildPath();
    });

    render.onStartChanged.subscribe(newStartIndex => {
        game.startIndex = newStartIndex;
        game.buildPath();
    });

    render.onFinishChanged.subscribe(newFinishIndex => {
        game.finishIndex = newFinishIndex;
        game.buildPath();
    });

    game.buildPath();

    console.log(game);
}

Run();
