import { CrazyParkingLot } from '../crazyParkingLot';

export class Car {

    sprite: Phaser.Physics.Arcade.Sprite;

    tilePos: Phaser.Math.Vector2; // tile position
    realPos: Phaser.Math.Vector2; // pixel position

    targetTilePos: Phaser.Math.Vector2; // move target tile position
    targetRealPos: Phaser.Math.Vector2; // move target real position

    scene: Phaser.Scene;
    wallLayer: Phaser.Tilemaps.TilemapLayer;
    entranceExitLayer: Phaser.Tilemaps.TilemapLayer;

    uuid: String;

    constructor(
        carType: any,
        tilePos: Phaser.Math.Vector2,
        scene: Phaser.Scene,
        wallLayer: Phaser.Tilemaps.TilemapLayer,
        entranceExitLayer: Phaser.Tilemaps.TilemapLayer,
        // input: Phaser.Input.InputPlugin
    ) {

        this.uuid = this.uuidv4();

        // set scene of this car object
        this.scene = scene;

        // set layer of this car Object
        this.wallLayer = wallLayer;
        this.entranceExitLayer = entranceExitLayer;

        // set current tile position
        this.tilePos = tilePos;

        // set current pixel position
        // this.realPos = new Phaser.Math.Vector2(
        //     tilePos.x * CrazyParkingLot.TILE_SIZE + (offsetX * 3 / 2),
        //     tilePos.y * CrazyParkingLot.TILE_SIZE + (offsetY * 3 / 2)
        // );
        this.realPos = this.tilePosToRealPos(tilePos.x, tilePos.y);
        this.targetRealPos = new Phaser.Math.Vector2(this.realPos.x, this.realPos.y);

        //scene.load.image(carType, `assets/car/${carType}.png`);
        this.sprite = scene.physics.add.sprite(0, 0, carType);//.setInteractive(); neccasary?    
        this.sprite.setOrigin(0.5, 0.5);
        
        // object start postion according to tile posision
        this.sprite.setPosition(this.realPos.x, this.realPos.y);

        // this.sprite.setFrame(10);

        this.setTileCollisionEvent();            

        this.sprite.on('pointerdown', (pointer: any) => {
            console.log(pointer);
            this.sprite.setTint(0xff0000);
        });

        this.sprite.on('pointerup', (pointer: any) => {
            this.sprite.clearTint();
        });

        scene.events.on('update', () => {
            
            let distance = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                this.targetRealPos.x,
                this.targetRealPos.y
            );
            
            // console.log(this.sprite.x +' ' + this.sprite.y);
            // console.log(angleDeg); 
            // this.sprite.setAngle(angleDeg + 90);
            if(distance < 10) {
                this.sprite.body.reset(this.targetRealPos.x, this.targetRealPos.y);
                this.setRealPos(this.targetRealPos.x, this.targetRealPos.y);
                this.tilePos = this.realPosToTilePos(this.targetRealPos.x, this.targetRealPos.y);
            }

        }, scene);

        // add fade in
        scene.tweens.add({
            targets: this.sprite,
            alpha: { from: 0, to: 1 },
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

    moveToTilePos(tileX, tileY): void {
 
        this.targetTilePos = new Phaser.Math.Vector2(tileX, tileY);
        this.targetRealPos = this.tilePosToRealPos(tileX, tileY);

        let distance = Phaser.Math.Distance.Between(
            this.sprite.x,
            this.sprite.y,
            this.targetRealPos.x,
            this.targetRealPos.y
        );

        let angleDeg = (Math.atan2(this.targetRealPos.y - this.sprite.y, this.targetRealPos.x - this.sprite.x) * 180 / Math.PI);
        this.sprite.angle = angleDeg - 90;

        // set speed 
        this.scene.physics.moveToObject(this.sprite, this.targetRealPos, distance);
    }

    setTileCollisionEvent(): void {
        this.scene.physics.add.collider(this.sprite, this.wallLayer, 
            () => {
                console.log('wall layer collision detected!!');
                this.sprite.body.reset(this.sprite.x, this.sprite.y);
                this.realPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
                this.tilePos = this.realPosToTilePos(this.sprite.x, this.sprite.y);
            }
        );
        this.scene.physics.add.collider(this.sprite, this.entranceExitLayer,
            () => {
                console.log('entrance exit layer collision deteceted!!');
                this.sprite.body.reset(this.sprite.x, this.sprite.y);
                this.realPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
                this.tilePos = this.realPosToTilePos(this.sprite.x, this.sprite.y);
            }
        );
    }

    setRealPos(realX, realY): void {
        this.realPos = new Phaser.Math.Vector2(realX, realY);
    }

    realPosToTilePos(realX, realY): Phaser.Math.Vector2 {
        let tileSize = CrazyParkingLot.TILE_SIZE;
        let tileX = Math.round(realX / tileSize - (tileSize * 3 / 2));
        let tileY = Math.round(realY / tileSize - (tileSize * 3 / 2));

        return new Phaser.Math.Vector2(tileX, tileY);
    }

    tilePosToRealPos(tileX, tileY): Phaser.Math.Vector2 {
        let tileSize = CrazyParkingLot.TILE_SIZE;
        let realX = tileX * tileSize + (tileSize * 3 / 2);
        let realY = tileY * tileSize + (tileSize * 3 / 2);

        return new Phaser.Math.Vector2(realX, realY);
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

} 