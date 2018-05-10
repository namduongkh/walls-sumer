import CatchFruit from "../app/CatchFruit";
import ScreenObjectExample from "../app/libs/ScreenObjectExample";
import GameScreen from "../app/libs/GameScreen";
import Assets from "./Assets";

let gameScreen = new GameScreen('gameScreen', 320, 400);

let fruit1 = new ScreenObjectExample(gameScreen.ctx, 0, -50, 50, 50, { name: "Fruit1", image: Assets.LimeImage });
let fruit2 = new ScreenObjectExample(gameScreen.ctx, 120, -50, 50, 50, { name: "Fruit2", image: Assets.LimeImage });
let fruit3 = new ScreenObjectExample(gameScreen.ctx, 200, -50, 50, 50, { name: "Fruit3", image: Assets.LimeImage });
let scoreBoard = new ScreenObjectExample(gameScreen.ctx, 120, 20, 50, 50, { name: "Score board" });
let basket = new ScreenObjectExample(gameScreen.ctx, 100, 325, 100, 75, {
    name: "Basket",
    image: Assets.BasketImage,
    dragBound: {
        x: 0,
        y: 325,
        w: 320,
        h: 75
    }
});

let _game = new CatchFruit({
    ctx: gameScreen.ctx,
    screen: gameScreen.screen,
    noop: gameScreen.noop,
    basket,
    fruits: [fruit1, fruit2, fruit3],
    scoreBoard: scoreBoard,
    catched: [new ScreenObjectExample(), new ScreenObjectExample()],
    loopMs: 0,
    config: {
        dropSpeed: 3
    }
});

window.game = _game;