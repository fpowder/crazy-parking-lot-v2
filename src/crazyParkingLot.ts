import Phaser from 'phaser';

// phaser3 rex plugins
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin';
import { Pinch } from 'phaser3-rex-plugins/plugins/gestures';

import { settings }  from './config/settings';
import { Car } from './object/car';

export class CrazyParkingLot extends Phaser.Scene {

    static readonly TILE_SIZE = 32;

    constructor() {
        super({
            key: 'crazyParkingLot'
        });
        
        // super({
        //     key: 'examples'
        // });
    }

    preload() {
        // parking area tiles
        this.load.image('tiles', 'assets/gridTiles.png');
        // parking area
        this.load.spritesheet('parkingArea','assets/parkingArea.png', { frameWidth: 129, frameHeight: 164 });
        // tile layer and parking area json
        this.load.tilemapTiledJSON('map', 'tile/crazyParkingLot.json');
        // car
        this.load.spritesheet('redCar', 'assets/car/red.png', { frameWidth: 128, frameHeight: 231 });
        
    }

    create() {

        const cplMap = this.make.tilemap({ key: 'map' });
        // const cplMap = this.add.tilemap('map');

        // tileset name -> gridtiles
        let cptiles = cplMap.addTilesetImage('gridtiles', 'tiles');

        let layerWidth = settings.xGridCnt * 32;
        let layerHeight = settings.yGridCnt * 32;

        let layer = cplMap.createLayer('paTileLayer', cptiles, 0, 0);
        // layer.setScale(settings.spacer / 32);

        // create normal object layer
        let sprites = cplMap.createFromObjects('paLayer', [
            { gid: 141, key: 'parkingArea' },
            { id: 238 },
            { id: 234 }
        ]);

        // sprites.forEach((value: Phaser.GameObjects.Sprite) => {
        //     value.setScale(settings.spacer / 32, settings.spacer / 32);
        // });

        let camera = this.cameras.main;
        
        camera.scrollX += (layerWidth / 2) - (settings.phrWidth / 2);
        camera.scrollY += (layerHeight / 2) - (settings.phrHeight / 2);
        camera.zoom *= settings.spacer / 32;

        let pinch = new Pinch(this, {
            enable: true,
            bounds: undefined,
            threshold: 0
        });
        
        // console.log(pinch);

        pinch.on('drag1', function (pinch) {
            //console.log(pinch.drag1Vector);
            let drag1Vector = pinch.drag1Vector;
            camera.scrollX -= drag1Vector.x / camera.zoom;
            camera.scrollY -= drag1Vector.y / camera.zoom;
        }).on('pinch', function (pinch) {
            //console.log(pinch.scaleFactor);
            let scaleFactor = pinch.scaleFactor;
            camera.zoom *= scaleFactor;
        }, this);

        const redCarSprite = this.physics.add.sprite(0, 0, "redCar");
        // redCarSprite.setDepth(2);

        const redCar = new Car(redCarSprite, new Phaser.Math.Vector2(36, 112));

    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    // dom:{
    //     createContainer: true
    // },
    width: settings.phrWidth,
    height: settings.phrHeight,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#b7dfed',
    // canvasStyle: `left: ${settings.cnvAdjWidth}px; top: ${settings.cnvAdjHeight}px; position: absolute; z-index: -1;`,
    // canvasStyle: `touch-action: auto; overflow: hidden; margin: 0%; padding: 0%;`,
    // canvasStyle: `z-index: -1;`,
    plugins: {
        scene: [
            { key: 'rexGestures', plugin: GesturesPlugin, mapping: 'rexGestures' }
        ]
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: true
        }
        // default: 'matter',
        // matter: {
        //     gravity: { x: 0, y: 0 },
        //     debug: true
        // }
    },
    scene: [CrazyParkingLot],
    // scene: {
    //     preload: preload,
    //     create: create
    // },
    // scene: [ Preloader, Wall, ParkingArea, EntranceExit ],
    // callbacks: {
    //     postBoot: function (game) {
    //       game.domContainer.style.pointerEvents = 'none';
    //     },
    // },
}

export const game = new Phaser.Game(config);