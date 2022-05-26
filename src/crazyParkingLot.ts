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
        // let graphics = this.add.graphics();

        let wallLayer = cplMap.createLayer('wallLayer', 'gridtiles', 0, 0);
        let floorLayer = cplMap.createLayer('floorLayer', 'gridtiles', 0, 0);
        let entranceExitLayer = cplMap.createLayer('entranceExitLayer', 'gridtiles', 0, 0);

        // wallLayer.setCollisionFromCollisionGroup(true);
        // wallLayer.setCollisionByProperty({ collides: true });

        // wallLayer.forEachTile((tile) => {
        //     let tileWorldPos = wallLayer.tileToWorldXY(tile.x, tile.y);
        //     let collisionGroup: any = cpltiles.getTileCollisionGroup(tile.index);

        //     console.log(collisionGroup);
        //     if (!collisionGroup || collisionGroup.objects.length === 0) { return; }

        //     if (collisionGroup.properties && collisionGroup.properties.isInteractive)
        //     {
        //         graphics.lineStyle(5, 0x00ff00, 1);
        //     }
        //     else
        //     {
        //         graphics.lineStyle(5, 0x00ffff, 1);
        //     }

        //     var objects = collisionGroup.objects;

        //     for (var i = 0; i < objects.length; i++) {
        //         var object = objects[i];
        //         var objectX = tileWorldPos.x + object.x;
        //         var objectY = tileWorldPos.y + object.y;

        //         // When objects are parsed by Phaser, they will be guaranteed to have one of the
        //         // following properties if they are a rectangle/ellipse/polygon/polyline.
        //         if (object.rectangle)
        //         {
        //             graphics.strokeRect(objectX, objectY, object.width, object.height);
        //         }
        //         else if (object.ellipse)
        //         {
        //             // Ellipses in Tiled have a top-left origin, while ellipses in Phaser have a center
        //             // origin
        //             graphics.strokeEllipse(
        //                 objectX + object.width / 2, objectY + object.height / 2,
        //                 object.width, object.height
        //             );
        //         }
        //         else if (object.polygon || object.polyline)
        //         {
        //             var originalPoints = object.polygon ? object.polygon : object.polyline;
        //             var points = [];
        //             for (var j = 0; j < originalPoints.length; j++)
        //             {
        //                 var point = originalPoints[j];
        //                 points.push({
        //                     x: objectX + point.x,
        //                     y: objectY + point.y
        //                 });
        //             }
        //             graphics.strokePoints(points);
        //         }
        //     }

        // })

        // create normal object layer
        cplMap.createFromObjects('parkingAreas', [
            { gid: 141, key: 'parkingAreaImg' },
        ]);
        cplMap.createFromObjects('entrance', [
            { id: 5 },
        ]);
        cplMap.createFromObjects('exit', [
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
        const redCar = new Car(redCarSprite, new Phaser.Math.Vector2(36, 112));
        
        this.physics.add.collider(redCarSprite, wallLayer);

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