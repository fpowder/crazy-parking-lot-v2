import Phaser, { GameObjects } from 'phaser';

// phaser3 rex plugins
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin';
import { Pinch } from 'phaser3-rex-plugins/plugins/gestures';

import { settings }  from './config/settings';
import { Car } from './object/car';

export class CrazyParkingLot extends Phaser.Scene {

    static readonly TILE_SIZE = 32;
    
    wallLayer: Phaser.Tilemaps.TilemapLayer;
    floorLayer: Phaser.Tilemaps.TilemapLayer;
    entranceExitLayer: Phaser.Tilemaps.TilemapLayer;

    parkingAreas: any;
    entrance: any; 
    exit: any;

    constructor() {
        super({
            key: 'crazyParkingLot'
        });

        // this.wallLayer;
    }

    preload() {
        // parking area tiles
        this.load.image('tiles', 'assets/gridtiles.png');
        // parking area
        this.load.spritesheet('parkingAreaImg','assets/parkingArea.png', { frameWidth: 129, frameHeight: 164 });
        // tile layer and parking area json
        this.load.tilemapTiledJSON('map', 'tile/crazyParkingLot.json');
        // car
        this.load.spritesheet('redCar', 'assets/car/red.png', { frameWidth: 128, frameHeight: 231 });
        
    }

    create() {

        const cplMap = this.make.tilemap({ key: 'map' });
        // const cplMap = this.add.tilemap('map');

        // tileset name -> gridtiles
        let cpltiles = cplMap.addTilesetImage('gridtiles', 'tiles');

        let layerWidth = settings.xGridCnt * 32;
        let layerHeight = settings.yGridCnt * 32;

        // for(let i = 0; i < cplMap.layers.length; i++) {
        //     let eachLayer = cplMap.createLayer(i, 'gridtiles', 0, 0);
        // }

        // let layer = cplMap.createLayer('paTileLayer', cptiles, 0, 0);
        // layer.setScale(settings.spacer / 32);

        // collision border graphic add
        

        this.wallLayer = cplMap.createLayer('wallLayer', 'gridtiles', 0, 0);
        this.floorLayer = cplMap.createLayer('floorLayer', 'gridtiles', 0, 0);
        this.entranceExitLayer = cplMap.createLayer('entranceExitLayer', 'gridtiles', 0, 0);

        this.wallLayer.setCollisionByProperty({ collides: true });
        // this.wallLayer.setCollisionFromCollisionGroup();

        // create objects layer
        this.parkingAreas = cplMap.createFromObjects('parkingAreas', [
            { gid: 141, key: 'parkingAreaImg' },
        ]);
        this.entrance = cplMap.createFromObjects('entrance', [
            { id: 5 },
        ]);
        this.exit = cplMap.createFromObjects('exit', [
            { id: 5 },
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
        const redCar = new Car(redCarSprite, new Phaser.Math.Vector2(37, 113), this, this.wallLayer);
        // redCarSprite.setDepth(2);
        // this.physics.add.collider(redCarSprite, wallLayer);

    } // create

    update() {
        
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
        //     gravity: { y: 1 },
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