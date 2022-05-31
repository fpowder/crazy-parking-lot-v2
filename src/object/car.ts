import { CrazyParkingLot } from '../crazyParkingLot';

export class Car {

    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(
        carType: any,
        private tilePos: Phaser.Math.Vector2,
        scene: Phaser.Scene,
        wallLayer: Phaser.Tilemaps.TilemapLayer,
        entranceExitLayer: Phaser.Tilemaps.TilemapLayer,
        // input: Phaser.Input.InputPlugin
    ) {
        const offsetX = CrazyParkingLot.TILE_SIZE;
        const offsetY = CrazyParkingLot.TILE_SIZE;

        scene.load.image(carType, 'assets/car/red.png');

        this.sprite = scene.physics.add.sprite(0, 0, carType).setInteractive();    
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setPosition(
            tilePos.x * CrazyParkingLot.TILE_SIZE + (offsetX * 3 / 2),
            tilePos.y * CrazyParkingLot.TILE_SIZE + (offsetY * 3 / 2)
        );

        // this.sprite.setFrame(10);

        scene.physics.add.collider(this.sprite, wallLayer, 
            () => {console.log('collision detected!!')}
        );
        scene.physics.add.collider(this.sprite, entranceExitLayer);

        this.sprite.on('pointerdown', (pointer: any) => {
            console.log(pointer);
            this.sprite.setTint(0xff0000);
        });

        this.sprite.on('pointerup', (pointer: any) => {
            this.sprite.clearTint();
        });

        let testXVector = 32 * 3;
        let testYVector = 32 * 3;
        let testVector = new Phaser.Math.Vector2(testXVector, testYVector);

        // scene.physics.world.on('tilecollide', (event) => {
        //     console.log(this.sprite);
        // }, scene);

        scene.events.on('update', () => {
            console.log(this.sprite);

        }, scene);

        // sprite physics move object test
        scene.physics.moveToObject(this.sprite, testVector, 800);

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

    getTilePos(): Phaser.Math.Vector2 {
        return this.tilePos;
    }

    setTilePos(tilePosition: Phaser.Math.Vector2): void {
        this.tilePos = tilePosition.clone();
    }

} 