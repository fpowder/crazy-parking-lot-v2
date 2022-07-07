import Phaser from 'phaser';

// phaser3 rex plugins
// import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin';
import { Pinch } from 'phaser3-rex-plugins/plugins/gestures';
// import Drag from 'phaser3-rex-plugins/plugins/drag';

import { settings }  from './config/settings';
import { Car } from './object/car';
import { Person } from './object/person';

import { io, Socket } from 'socket.io-client';

import interact from 'interactjs';

const position = { x: 0, y: 0 };

interact('#controlPanel').draggable({
    listeners: {
        start(event) {
            console.log(event.type, event.target);
        },
        move(event) {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
        }
    }
});

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
    //input
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
        // this.load.html('controlPanel', 'assets/dom/controlPanel.html');
        
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

        this.socketClient = io(`ws://${settings.host}:3000`, {
            transports: ['websocket'],
            reconnectionDelayMax: 10000
        });

        const carIds: string[] = [];
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
                    car.parked = eachCar.parked;
                    this.registry.set(uuid, car);
                    carIds.push(uuid);
                }
                this.registry.set('carIds', carIds);
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
        
        const moveBtn: HTMLButtonElement = document.getElementById('moveBtn') as HTMLButtonElement;
        
        moveBtn.addEventListener('click', () => {
            let uuid :string = (document.getElementById('targetUUID') as HTMLInputElement).value;
            let tileX :number = parseInt((document.getElementById('tileX') as HTMLInputElement).value);
            let tileY :number = parseInt((document.getElementById('tileY') as HTMLInputElement).value);
            console.log('tileX : ' + tileX);
            console.log('tileY : ' + tileY);
            doMove(this, uuid, tileX, tileY);
        });

        // create test control panel for object movement
        /* 
        let controlPanel: Phaser.GameObjects.DOMElement = this.add.dom(125, 300).createFromCache('controlPanel');

        let moveBtn: Element = controlPanel.getChildByID('moveBtn');
        moveBtn.addEventListener('click', () => {
            let uuid :string = (document.getElementById('targetUUID') as HTMLInputElement).value;
            let tileX :number = parseInt((document.getElementById('tileX') as HTMLInputElement).value);
            let tileY :number = parseInt((document.getElementById('tileY') as HTMLInputElement).value);
            console.log('tileX : ' + tileX);
            console.log('tileY : ' + tileY);
            doMove(this, uuid, tileX, tileY);
        }); 
        */

        // insert container into scene with contorl panel 
        /* 
        let dragBtn = this.add.rectangle(0, 0, 250, 100, 0x6666ff);
        let container = this.add.container(300, 500);
        container.add([dragBtn, controlPanel]);
        container.setSize(250, 100);
        container.setDepth(1); 
        */

        // container.setInteractive(dragBtn, Phaser.Geom.Rectangle.Contains);
        // container.setInteractive(new Phaser.Geom.Rectangle(0, 0, 250, 100), Phaser.Geom.Rectangle.Contains);

        // let graphics = this.add.graphics();
        // graphics.lineStyle(2, 0x00ffff, 1);
        // graphics.strokeRect(container.x - 250, container.y - 50, container.input.hitArea.width, container.input.hitArea.height);

        // drag with rexPlugin
        // let cpDrag = new Drag(container, {
        //     enable: true,
        //     axis: 'both',
        // }).drag();

        // let conX = container.x;
        // let conY = container.y;
        
        // dragBtn.setInteractive({ draggable: true, pixelPerfect: false }).on('drag', (pointer, dragX, dragY) => {
        //     console.log(dragX);
        //     console.log(dragY);

        //     let camera = this.cameras.main;

        //     container.setPosition(
        //         dragX,
        //         dragY
        //     )

        // }, this);

        // save control panel on Phaser registry
        // this.registry.set('controlPanel', controlPanel);

        // old

    } // create

    update() {
        
    }
}

function setPinchDrag(scene: Phaser.Scene, layerWidth: number, layerHeight: number) {
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

function doMove(scene: Phaser.Scene, targetObjKey: string, tileX: number, tileY: number) {

    let car:Car = scene.registry.get(targetObjKey);
    car.moveToTilePos(tileX, tileY);

}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: settings.phrWidth,
    height: settings.phrHeight,
    parent: 'crazyParkingLot',
    dom:{
        createContainer: true
    },
    pixelArt: true,
    // scale: {
    //     mode: Phaser.Scale.FIT,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    // },
    backgroundColor: '#b7dfed',
    canvasStyle: `left: ${settings.cnvAdjWidth}px; top: ${settings.cnvAdjHeight}px; position: absolute; z-index: -1;`,
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
}

export const game = new Phaser.Game(config);