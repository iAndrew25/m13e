import {dataAssets,
    TileEngine,
    Text,
    Sprite,
    keyPressed,
    collides} from 'kontra';
import {colors, sizes, positions, instructions, directionMapper} from './constants';
import jsonmap from '../assets/jsonmap.json';

class Scene {
    constructor() {
        this.level = 8;
        this.timer = 13.00;
        this.gameSpeed = 3;

        this.tileEngine = TileEngine(jsonmap);

        this.coins = [];
        this.walls = [];
        this.lavas = [];
        this.portals = [];
        this.instructions = [];

        this.hero = Sprite({
            x: positions.hero.x,
            y: positions.hero.y,
            width: sizes.heroSize,
            height: sizes.heroSize,
            color: colors.hero
        })

        this.finish = Sprite({
            ...positions.finish,
            width: sizes.tileSize,
            height: sizes.tileSize,
            color: colors.finish
        })

        this.timerText = Text({
            text: this.timer.toString(),
            font: 'bold 40px fangsong',
            color: 'black',
            x: 25*16,
            y: 2*16,
        });

        this.title = Text({
            text: 'Listen up',
            font: 'bold 20px fangsong',
            color: 'black',
            x: 25*16,
            y: 6*16,
      })

      this.initLevel()
    }
    
    initInstructions = () => {
        this.instructions = instructions.map((text, index) => this.level > index ? 
            Text({
                text: `${index + 1}. ${text}`,
                font: '18px fangsong',
                color: 'black',
                lineHeight: 1.3,
                x: 25*16,
                y: 8*16 + index * 25,
          }) : undefined).filter(Boolean)
    }


    initCoins = () => {
        this.coins = positions.coins[this.level - 1].map(position => ({
            shouldDisplay: true,
            sprite: Sprite({
                ...position,
                width: sizes.coinSize,
                height: sizes.coinSize,
                color: colors.coin
              })
        }))       
    }

    initWalls = () => {
        this.walls = positions.walls[this.level - 1].map(position => Sprite({
            ...position,
            width: sizes.tileSize,
            height: sizes.tileSize,
            color: colors.wall
        }))  
    }

    initLavas = () => {
        this.lavas = positions.lavas[this.level - 1].map(position => Sprite({
            ...position,
            width: sizes.tileSize,
            height: sizes.tileSize,
            color: colors.lava
        }))  
    }

    initPortals = () => {
        this.portals = positions.portals[this.level - 1].map(position => Sprite({
            ...position,
            width: sizes.tileSize,
            height: sizes.tileSize,
            color: colors.portal
        }))  
    }

    initLevel = () => {
        this.timer = 13.00;
        this.initInstructions();
        this.initCoins();
        this.initWalls();
        this.initLavas();
        this.initPortals();
        this.hero.x = positions.hero.x;
        this.hero.y = positions.hero.y;       
    }

    initNextLevel = () => {
        this.level++;
        this.initLevel()
    }

    coinsUpdate = () => {
        this.coins.forEach(coin => {
            if(collides(coin.sprite, this.hero)) {
                coin.shouldDisplay = false;
            }
        });
    }

    heroUpdate = () => {
        const collisionBox = {
            x: this.hero.x,
            y: this.hero.y,
            width: this.hero.width,
            height: this.hero.height
        };

        directionMapper.forEach(([key, {direction, axis}]) => {
            if (keyPressed(key)) {
                collisionBox[axis] += direction * this.gameSpeed;
                const collidesWithMazeWall = this.tileEngine.layerCollidesWith('walls', collisionBox);
                const collidesWithFinish = collides(collisionBox, this.finish);
                const areAllCoinsCollected = this.coins.every(coin => !coin.shouldDisplay);
                const collidesWithWall = this.walls.some(wall => collides(collisionBox, wall));
                const collidesWithLava = this.lavas.some(lava => collides(collisionBox, lava));

                if(collidesWithFinish && areAllCoinsCollected && this.level < 9) {
                    this.initNextLevel();
                } else if(collidesWithLava) {
                    this.initLevel();
                } else {
                    if (!collidesWithMazeWall && !collidesWithFinish && !collidesWithWall) {
                        this.hero[axis] += direction * this.gameSpeed;
                    }
                }
            }
        });
    }

    timerUpdate = dt => {
        if(this.level < 9) {
            this.timer -= dt;
            if(this.timer <= 0) {
                this.initLevel()
            } else {
                this.timerText.text = this.timer.toFixed(2);
            }
        } else {
            this.timer = 13.00;
            this.timerText.text = this.timer.toFixed(2);
        }
    }

    update = dt => {
        this.heroUpdate();
        this.coinsUpdate();
        this.timerUpdate(dt);
    }

    render = () => {
        this.tileEngine.render();
        this.hero.render();
        this.coins.forEach(coin => coin.shouldDisplay && coin.sprite.render());
        this.walls.forEach(wall => wall.render());
        this.lavas.forEach(lava => lava.render());
        this.portals.forEach(portal => portal.render());
        this.finish.render();
        this.instructions.forEach(instruction => instruction.render());
        this.title.render();
        this.timerText.render();
    }
}

export default Scene;