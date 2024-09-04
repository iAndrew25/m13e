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

import jsonmap from '../assets/jsonmap.json';
import m13e from '../assets/m13e.json'
import m13ebg from '../assets/m13e-bg.json'
import m13epng from '../assets/m13e.png';

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

        initKeys();

        await load(...assetsToLoad);

        // dataAssets[new URL('assets/m13e.png', location.href).href] = m13epng;
        dataAssets[new URL('assets/m13e.json', location.href).href] = m13e;
        dataAssets[new URL('assets/m13e-bg.json', location.href).href] = m13ebg;
        
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