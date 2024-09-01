import Scene from './scene.js';

const assetsToLoad = [
    './assets/jsonmap.tmj',
    './assets/m13e.tsj',
    './assets/m13e-bg.tsj',
    './assets/m13e.png',
    './assets/m13e-bg.png',
]
const INITIAL_SCENE = 'home';

class Game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.currentScene = null;
    }
    
    init = async () => {
        let { canvas, context } = kontra.init();
        this.canvas = canvas;
        this.context = context;

        kontra.initKeys();
        kontra.initInput();

        await kontra.load(...assetsToLoad);

        this.currentScene = new Scene({scene: INITIAL_SCENE}, this.canvas);
        
        // borders = new Borders(canvas);

        this.addEventListeners();
        this.gameLoop();
    }

    addEventListeners = () => {
        // prevent default key behavior
        kontra.onKey(['arrowup', 'arrowdown', 'arrowleft', 'arrowright'], function(e) {
            e.preventDefault();
        });

        kontra.on('newScene', (payload) => {
            console.log('My event was triggered', payload);
            this.currentScene = new Scene(payload, this.canvas);
        });          
    }

    gameLoop = () => {
        kontra.GameLoop({
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