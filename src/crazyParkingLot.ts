import Phaser from 'phaser';

// phaser3 rex plugins
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin';
import { Pinch } from 'phaser3-rex-plugins/plugins/gestures';

import { settings }  from './config/settings';
import { Car } from './object/car';

import { io, Socket } from 'socket.io-client';

export class CrazyParkingLot extends Phaser.Scene {

    static readonly TILE_SIZE = 32;
    
    wallLayer: Phaser.Tilemaps.TilemapLayer;
    floorLayer: Phaser.Tilemaps.TilemapLayer;
    entranceExitLayer: Phaser.Tilemaps.TilemapLayer;

    parkingAreas: any;
    entrance: any; 
    exit: any;

    socket: Socket;

    //mouse input
    //input: ; 

    constructor() {
        super({
            key: 'crazyParkingLot'
        });
    }

    preload() {
        // parking area tiles
        this.load.image('tiles', 'assets/gridtiles.png');
        // parking area
        this.load.spritesheet('parkingAreaImg','assets/parkingArea.png', { frameWidth: 129, frameHeight: 164 });
        // tile layer and parking area json
        this.load.tilemapTiledJSON('map', 'tile/crazyParkingLot.json');
        // car
        // this.load.spritesheet('redCar', 'assets/car/red.png', { frameWidth: 128, frameHeight: 231 });
        this.load.image('redCar', 'assets/car/red.png');
        this.load.image('blueCar', 'assets/car/blue.png');
        this.load.image('greenCar', 'assets/car/green.png');

        // load person image (p1 ~ p4)
        for(let i = 1; i <= 4; i++) {
            this.load.image('p' + String(i), 'assets/person/p' + String(i) + '.png');
        }
        
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

        // layer.setScale(settings.spacer / 32);

        this.wallLayer = cplMap.createLayer('wallLayer', 'gridtiles', 0, 0);
        this.floorLayer = cplMap.createLayer('floorLayer', 'gridtiles', 0, 0);
        this.entranceExitLayer = cplMap.createLayer('entranceExitLayer', 'gridtiles', 0, 0);

        this.wallLayer.setCollisionByProperty({ collides: true });
        this.entranceExitLayer.setCollisionByProperty({ collides: true });
        
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

        setPinchDrag(this, layerWidth, layerHeight);

        // socket
        this.socket = io('ws://localhost:3000', {
            transports: ['websocket'],
            reconnectionDelayMax: 10000
        });

        this.socket.on('currentCpl', () => {

        });

        // const redCarSprite = this.physics.add.sprite(0, 0, "redCar").setInteractive();
        const redCar = new Car(
            "redCar",
            new Phaser.Math.Vector2(13, 123), // tile pos
            this, 
            this.wallLayer,
            this.entranceExitLayer,
            // this.input
        );

        const blueCar = new Car(
            "blueCar",
            new Phaser.Math.Vector2(3, 6), // tile pos
            this, 
            this.wallLayer,
            this.entranceExitLayer,
            // this.input
        );

        console.log(redCar.uuid);
        console.log(blueCar.uuid);

        this.registry.set('redCar', redCar);
        this.registry.set('blueCar', blueCar);

        // redCar.moveToTilePos(3, 3);
        // blueCar.moveToTilePos(13, 100);
        
        setControlPanel(this);
        
    } // create

    update() {
        
    }
}

function setControlPanel(scene) {

    // control panel 
    let inputStyle = 
        `width: 90%;
        height: 60px;
        font-size: 48px;
        padding: 12px 20px; 
        margin: 10px; 
        display: inline-block; 
        border: 1px solid #ccc; 
        border-radius: 4px; 
        box-sizing: border-box;`;

    let containerDivStyle = 
        `background-color: rgba(0,255,0,0.2); 
        width: 600px; 
        height: 470px; 
        font: 48px Arial; 
        font-weight: bold;`;

    let btnStyle = 
        `width: 100%;
        background-color: #2f77ed;
        font-size: 48px;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;`;

    let targetInput = document.createElement('input');
    targetInput.id = 'target';
    targetInput.setAttribute('style', inputStyle);

    let tileXInput = document.createElement('input');
    tileXInput.id = 'tileX';
    tileXInput.setAttribute('style', inputStyle);

    let tileYInput = document.createElement('input');
    tileYInput.id = 'tileY';
    tileYInput.setAttribute('style', inputStyle);

    let targetLabel = document.createElement('label');
    targetLabel.setAttribute('for', 'target');
    targetLabel.textContent = 'Car Target';

    let tileXLabel = document.createElement('label');
    tileXLabel.setAttribute('for', 'tileX');
    tileXLabel.textContent = 'Target TileX';

    let tileYLabel = document.createElement('label');
    tileYLabel.setAttribute('for', 'tileY');
    tileYLabel.textContent = 'Target TileY';

    let goBtn = document.createElement('button');
    goBtn.setAttribute('style', btnStyle);
    goBtn.textContent = 'MOVE';
    goBtn.addEventListener('click', () => {
        goBtnEvent(
            scene,
            (document.getElementById('target') as HTMLInputElement).value,
            (document.getElementById('tileX') as HTMLInputElement).value,
            (document.getElementById('tileY') as HTMLInputElement).value,
        );
    });

    let containerDiv = document.createElement('div');
    containerDiv.setAttribute('style', containerDivStyle);

    containerDiv.appendChild(targetLabel);
    containerDiv.appendChild(targetInput);

    containerDiv.appendChild(tileXLabel);
    containerDiv.appendChild(tileXInput);

    containerDiv.appendChild(tileYLabel);
    containerDiv.appendChild(tileYInput);

    containerDiv.appendChild(goBtn);

    let container = scene.add.container(32 * 50, 240);
    let element = scene.add.dom(0, 0, containerDiv);
    container.add([element]);

}

function goBtnEvent(scene, targetObjKey, tileX, tileY) {

    let car:Car = scene.registry.get(targetObjKey);
    car.moveToTilePos(tileX, tileY);

}

function setPinchDrag(scene, layerWidth, layerHeight) {
    let camera = scene.cameras.main;
    camera.scrollX += (layerWidth / 2) - (settings.phrWidth / 2);
    camera.scrollY += (layerHeight / 2) - (settings.phrHeight / 2);
    camera.zoom *= settings.spacer / 32;

    let zoomLimit = camera.zoom;
    let scrollXLimit = camera.scrollX;
    let scrollYLimit = camera.scrollY;

    let pinch = new Pinch(scene, {
        enable: true,
        bounds: undefined,
        threshold: 0
    });
    
    pinch.on('drag1', function (pinch) {
        //console.log(pinch.drag1Vector);
        let drag1Vector = pinch.drag1Vector;
        camera.scrollX -= drag1Vector.x / camera.zoom;
        camera.scrollY -= drag1Vector.y / camera.zoom;

        if(
            camera.zoom <= zoomLimit && 
            (camera.scrollX >= scrollXLimit || camera.scrollX <= scrollXLimit + settings.phrWidth)
        ) {
            camera.scrollX = scrollXLimit;
        }

        if(
            camera.zoom <= zoomLimit &&
            (camera.scrollY >= scrollYLimit || camera.scrollY <= scrollYLimit + settings.phrHeight)
        ) {
            camera.scrollY = scrollYLimit;
        }

    }).on('pinch', function (pinch) {
        //console.log(pinch.scaleFactor);
        let scaleFactor = pinch.scaleFactor;
        camera.zoom *= scaleFactor;

        if(camera.zoom < zoomLimit) {
            camera.zoom  = zoomLimit;
        }

    }, scene);
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    dom:{
        createContainer: true
    },
    parent: 'crazyParkingLot',
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
    fps: {
        forceSetTimeOut: true,
        target: 60
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
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