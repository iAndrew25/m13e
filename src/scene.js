import {colors, sizes, positions, instructions, directionMapper} from './constants.js';

class Scene {
    constructor() {
        this.level = 1;
        this.timer = 13.00;
        this.gameSpeed = 3;

        this.map = kontra.dataAssets[`./assets/jsonmap`];
        this.tileEngine = kontra.TileEngine(this.map);

        this.coins = [];
        this.walls = [];
        this.lavas = [];
        this.portals = [];
        this.instructions = [];

        this.hero = kontra.Sprite({
            x: positions.hero.x,
            y: positions.hero.y,
            width: sizes.heroSize,
            height: sizes.heroSize,
            color: colors.hero
        })

        this.finish = kontra.Sprite({
            ...positions.finish,
            width: sizes.tileSize,
            height: sizes.tileSize,
            color: colors.finish
        })

        this.timerText = kontra.Text({
            text: this.timer.toString(),
            font: 'bold 40px fangsong',
            color: 'black',
            x: 25*16,
            y: 2*16,
        });

        this.title = kontra.Text({
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
            kontra.Text({
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
            sprite: kontra.Sprite({
                ...position,
                width: sizes.coinSize,
                height: sizes.coinSize,
                color: colors.coin
              })
        }))       
    }

    initWalls = () => {
        this.walls = positions.walls[this.level - 1].map(position => kontra.Sprite({
            ...position,
            width: sizes.tileSize,
            height: sizes.tileSize,
            color: colors.wall
        }))  
    }

    initLavas = () => {
        this.lavas = positions.lavas[this.level - 1].map(position => kontra.Sprite({
            ...position,
            width: sizes.tileSize,
            height: sizes.tileSize,
            color: colors.lava
        }))  
    }

    initPortals = () => {
        this.portals = positions.portals[this.level - 1].map(position => kontra.Sprite({
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
            if(kontra.collides(coin.sprite, this.hero)) {
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
            if (kontra.keyPressed(key)) {
                collisionBox[axis] += direction * this.gameSpeed;
                const collidesWithMazeWall = this.tileEngine.layerCollidesWith('walls', collisionBox);
                const collidesWithFinish = kontra.collides(collisionBox, this.finish);
                const areAllCoinsCollected = this.coins.every(coin => !coin.shouldDisplay);
                const collidesWithWall = this.walls.some(wall => kontra.collides(collisionBox, wall));
                const collidesWithLava = this.lavas.some(lava => kontra.collides(collisionBox, lava));

                if(collidesWithFinish && areAllCoinsCollected) {
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
        this.timer -= dt;
        if(this.timer <= 0) {
            this.initLevel()
        } else {
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