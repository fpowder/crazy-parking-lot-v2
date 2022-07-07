import { CrazyParkingLot } from '../crazyParkingLot';
import { Socket } from 'socket.io-client';

export class Car {

    sprite: Phaser.Physics.Arcade.Sprite;

    tilePos: Phaser.Math.Vector2; // tile position
    realPos: Phaser.Math.Vector2; // pixel position

    targetTilePos: Phaser.Math.Vector2; // move target tile position
    targetPixPos: Phaser.Math.Vector2; // move target real position

    scene: Phaser.Scene;
    wallLayer: Phaser.Tilemaps.TilemapLayer;
    entranceExitLayer: Phaser.Tilemaps.TilemapLayer;

    uuid: string;
    moving: boolean = false;
    parked: boolean = false;
    parkingArea: number = 0;

    socketClient: Socket;

    constructor(
        carType: any,
        tilePos: Phaser.Math.Vector2,
        scene: Phaser.Scene,
        wallLayer: Phaser.Tilemaps.TilemapLayer,
        entranceExitLayer: Phaser.Tilemaps.TilemapLayer,
        uuid: string
        // input: Phaser.Input.InputPlugin
    ) {

        this.uuid = uuid;

        // set scene of this car object
        this.scene = scene;

        // set layer of this car Object
        this.wallLayer = wallLayer;
        this.entranceExitLayer = entranceExitLayer;

        // set current tile position
        this.tilePos = tilePos;

        // set move complete
        this.moving = false; 

        // socketClient set
        this.socketClient = scene.registry.get('socketClient');
        
        // set current pixel position
        // this.realPos = new Phaser.Math.Vector2(
        //     tilePos.x * CrazyParkingLot.TILE_SIZE + (offsetX * 3 / 2),
        //     tilePos.y * CrazyParkingLot.TILE_SIZE + (offsetY * 3 / 2)
        // );
        this.realPos = this.tilePosToPixPos(tilePos.x, tilePos.y);
        this.targetPixPos = new Phaser.Math.Vector2(this.realPos.x, this.realPos.y);

        //scene.load.image(carType, `assets/car/${carType}.png`);
        this.sprite = scene.physics.add.sprite(0, 0, carType + 'Car').setInteractive();
        this.sprite.setOrigin(0.5, 0.5);
        
        // object start postion according to tile posision
        this.sprite.setPosition(this.realPos.x, this.realPos.y);

        // this.sprite.setFrame(10);
        this.setTileCollisionEvent();
        
        // scene update event
        scene.events.on('update', () => {
            
            let distance = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                this.targetPixPos.x,
                this.targetPixPos.y
            );
            
            // calculate distance between objects, when this object is moving
            if(this.moving === true) {
                const carIds: string[] = (scene.registry.get('carIds') as string[]).filter(value => {
                    return (value !== this.uuid);
                });
                
                console.log(carIds);
                for(let eachId of carIds) {

                    let car: Car = scene.registry.get(eachId);
                    let distance = Phaser.Math.Distance.Between(
                        this.sprite.x,
                        this.sprite.y,
                        car.sprite.x,
                        car.sprite.y
                    )
                    console.log(distance);
                    /**
                     * * if distance is under 100px set tint on object
                     * * if distance is not under 100px remove tint on object
                     */
                    if(distance <= 1000) {
                        this.sprite.setTint(0xff0000);
                        car.sprite.setTint(0xff0000);
                    } /* else {
                        this.sprite.clearTint();
                    } */
                }
            }

            // 10 pixel 아래일경우 원하는 지정 목표 타일 좌표에 도착한것으로 간주
            if(distance < 10 && this.moving === true) {

                this.sprite.body.reset(this.targetPixPos.x, this.targetPixPos.y);
                this.setPixelPos(this.targetPixPos.x, this.targetPixPos.y);
                //this.tilePos = this.pixPosToTilePos(this.targetPixPos.x, this.targetPixPos.y);
                this.tilePos = this.targetTilePos;

                this.moving = false;
                this.parked = false;
                
                this.carMovedEmit();

                // this.socketClient.emit('carMoved', {
                //     uuid: this.uuid,
                //     tilePos: {
                //         x: this.tilePos.x,
                //         y: this.tilePos.y
                //     },
                //     angle: this.sprite.angle
                // });
                console.log(this.sprite);
                console.log(this.tilePos);
            }

        }, scene);

        // add fade in
        scene.tweens.add({
            targets: this.sprite,
            alpha: { from: 0, to: 1 },
        });

        this.sprite.on('pointerdown', (pointer: any) => {
            this.sprite.setTint(0xff0000);

            // set this Car object UUID on control panel UUID text input
            const controlPanel: Phaser.GameObjects.DOMElement
                = scene.registry.get('controlPanel');

            (document.getElementById('targetUUID') as HTMLInputElement).value = this.uuid;
            (document.getElementById('tileX') as HTMLInputElement).value = String(this.tilePos.x);
            (document.getElementById('tileY') as HTMLInputElement).value = String(this.tilePos.y);

        });

        this.sprite.on('pointerup', (pointer: any) => {
            this.sprite.clearTint();
        });

        // tween test
        // scene.tweens.add({
        //     targets: this.sprite,
        //     x: testVector.x,
        //     y: testVector.y,
        //     duration: 2000,
        //     ease: 'Sine.easeInOut',
        //     repeat: 0,
        // });

    }

    carMovedEmit(): void {
        this.socketClient.emit('carMoved', {
            uuid: this.uuid,
            tilePos: {
                x: this.tilePos.x,
                y: this.tilePos.y
            },
            angle: this.sprite.angle
        });
    }

    setPosition(tileX: number, tileY: number, angle: number): void {
        this.tilePos = new Phaser.Math.Vector2(tileX, tileY);
        this.realPos = this.tilePosToPixPos(tileX, tileY);
        
        this.sprite.body.reset(this.realPos.x, this.realPos.y);
        this.sprite.angle = angle;
        
        this.moving = false;
    }

    moveToTilePos(tileX: number, tileY: number): void {
        this.moving = true;
        this.targetTilePos = new Phaser.Math.Vector2(tileX, tileY);
        this.targetPixPos = this.tilePosToPixPos(tileX, tileY);

        let distance = Phaser.Math.Distance.Between(
            this.sprite.x,
            this.sprite.y,
            this.targetPixPos.x,
            this.targetPixPos.y
        );

        let angleDeg = (Math.atan2(this.targetPixPos.y - this.sprite.y, this.targetPixPos.x - this.sprite.x) * 180 / Math.PI);
        this.sprite.angle = angleDeg - 90;

        // set speed 
        this.scene.physics.moveToObject(this.sprite, this.targetPixPos, distance);
    }

    setTileCollisionEvent(): void {
        this.scene.physics.add.collider(this.sprite, this.wallLayer, 
            () => {
                console.log('wall layer collision detected!!');
                this.sprite.body.reset(this.sprite.x, this.sprite.y);
                this.realPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
                this.tilePos = this.pixPosToTilePos(this.sprite.x, this.sprite.y);
                this.moving = false;
                this.carMovedEmit();
            }
        );
        this.scene.physics.add.collider(this.sprite, this.entranceExitLayer,
            () => {
                console.log('entrance exit layer collision deteceted!!');
                this.sprite.body.reset(this.sprite.x, this.sprite.y);
                this.realPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
                this.tilePos = this.pixPosToTilePos(this.sprite.x, this.sprite.y);
                this.moving = false;
                this.carMovedEmit();
            }
        );
    }

    setPixelPos(realX: number, realY: number): void {
        this.realPos = new Phaser.Math.Vector2(realX, realY);
    }

    pixPosToTilePos(realX: number, realY: number): Phaser.Math.Vector2 {
        let tileSize = CrazyParkingLot.TILE_SIZE;
        let tileX = Math.ceil(realX / tileSize -  1);
        let tileY = Math.ceil(realY / tileSize - 1);

        return new Phaser.Math.Vector2(tileX, tileY);
    }

    tilePosToPixPos(tileX: number, tileY: number): Phaser.Math.Vector2 {
        let tileSize = CrazyParkingLot.TILE_SIZE;
        let realX = tileX * tileSize + (tileSize * 1 / 2);
        let realY = tileY * tileSize + (tileSize * 1 / 2);

        return new Phaser.Math.Vector2(realX, realY);
    }

} 