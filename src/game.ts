import {assetsToLoad, colors, sizes, positions, instructions, directionMapper} from './constants';
import {
    init,
    initKeys,
    load,
    onKey,
    GameLoop,
    dataAssets 
} from 'kontra';
import Scene from './scene';

// import jsonmap from '../assets/jsonmap.json';
import {tileset, tilesetBg} from './tilesets.ts';
// import m13epng from '../assets/m13e.png';
initKeys();

class Game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.currentScene = null;
    }
    
    init = async () => {
        let { canvas, context } = init();
        this.canvas = canvas;
        this.context = context;


        dataAssets[new URL('m13e', location.href).href] = tileset;
        dataAssets[new URL('m13e-bg', location.href).href] = tilesetBg;

        await load(...assetsToLoad);

        this.currentScene = new Scene();

        this.addEventListeners();
        this.gameLoop();
    }

    addEventListeners = () => {
        onKey(['arrowup', 'arrowdown', 'arrowleft', 'arrowright'], function(e) {
            e.preventDefault();
        });
    }

    gameLoop = () => {
        GameLoop({
            update: dt => {
              this.currentScene.update(dt);
            },
            render: () => {
              this.currentScene.render();
            }
          }).start();        
    }
}

export default Game;