import Phaser from 'phaser';

// phaser3 rex plugins
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin';
import { Pinch } from 'phaser3-rex-plugins/plugins/gestures';

import { settings }  from './config/settings';
import { Car } from './object/car';
import { Person } from './object/person';

import { io, Socket } from 'socket.io-client';

let testCar: Car;

export class CrazyParkingLot extends Phaser.Scene {

    static readonly TILE_SIZE = 32;
    
    wallLayer: Phaser.Tilemaps.TilemapLayer;
    floorLayer: Phaser.Tilemaps.TilemapLayer;
    entranceExitLayer: Phaser.Tilemaps.TilemapLayer;

    parkingAreas: any;
    entrance: any; 
    exit: any;

    socketClient: Socket;

    //mouse input
    //input: ; 

    constructor() {
        super({
            key: 'crazyParkingLot'
        });
        // this.socketClient = socketClient;
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

        // control panel html set
        this.load.html('controlPanel', 'assets/dom/controlPanel.html');
        
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
        
        console.log(this.parkingAreas);

        // sprites.forEach((value: Phaser.GameObjects.Sprite) => {
        //     value.setScale(settings.spacer / 32, settings.spacer / 32);
        // });

        setPinchDrag(this, layerWidth, layerHeight);

        this.socketClient = io('ws://localhost:3000', {
            transports: ['websocket'],
            reconnectionDelayMax: 10000
        });

        // socket
        this.socketClient.on('currentCpl', (cplStatus) => {
            console.log(cplStatus);
            // cars
            if(cplStatus.cars) {
                let cars = cplStatus.cars;
                for(let uuid in cars) {
                    let eachCar = cars[uuid];
                    let car = new Car(
                        eachCar.carType,
                        new Phaser.Math.Vector2(eachCar.tilePos.x, eachCar.tilePos.y),
                        this, //Phaser scene
                        this.wallLayer,
                        this.entranceExitLayer,
                        uuid
                    );
                    car.sprite.angle = eachCar.angle;
                    this.registry.set(uuid, car);
                }
            }
            // persons
            if(cplStatus.persons) {
                let persons = cplStatus.persons;
                for(let uuid in persons) {
                    let eachPerson = persons[uuid];
                    let person = new Person(
                        eachPerson.personType,
                        new Phaser.Math.Vector2(eachPerson.tilePos.x, eachPerson.tilePos.y),
                        this, //Phaser scene
                        uuid
                    );
                    person.sprite.angle = eachPerson.angle;
                    this.registry.set(uuid, person);
                }
            }
            // parked cars
            if(cplStatus.parkedCars) {

            }
        });

        this.socketClient.on('carMoveComplete', (movedData) => {
            console.log('on carMoveComplete');
            console.log(movedData);
            let movedCar: Car = this.registry.get(movedData.uuid);
            movedCar.setPosition(
                movedData.tilePos.x,
                movedData.tilePos.y,
                movedData.angle
            )
        });

        // save socketClient on Phaser registry
        this.registry.set('socketClient', this.socketClient);
        
        // create test control panel for object movement
        let controlPanel: Phaser.GameObjects.DOMElement = this.add.dom(640, -650).createFromCache('controlPanel');

        let moveBtn: Element = controlPanel.getChildByID('moveBtn');
        moveBtn.addEventListener('click', () => {
            let uuid :string = (document.getElementById('targetUUID') as HTMLInputElement).value;
            let tileX :number = parseInt((document.getElementById('tileX') as HTMLInputElement).value);
            let tileY :number = parseInt((document.getElementById('tileY') as HTMLInputElement).value);
            console.log('tileX : ' + tileX);
            console.log('tileY : ' + tileY);
            doMove(this, uuid, tileX, tileY);
        });

        // save control panel on Phaser registry
        this.registry.set('controlPanel', controlPanel);

        // old
        // setControlPanel(this);

        // create testCar
        testCar = new Car(
            'red',
            new Phaser.Math.Vector2(3, 3),
            this, //Phaser scene
            this.wallLayer,
            this.entranceExitLayer,
            '0000-0000-0000-0000'
        );

    } // create

    update() {
        
    }
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
    width: settings.phrWidth,
    height: settings.phrHeight,
    parent: 'crazyParkingLot',
    dom:{
        createContainer: true
    },
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

function doMove(scene, targetObjKey, tileX, tileY) {

    let car:Car = scene.registry.get(targetObjKey);
    car.moveToTilePos(tileX, tileY);

}