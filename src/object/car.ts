import { CrazyParkingLot } from '../crazyParkingLot';

export class Car {

    constructor(
        private sprite: Phaser.GameObjects.Sprite,
        private tilePos: Phaser.Math.Vector2,
        scene: Phaser.Scene,
        wallLayer: Phaser.Tilemaps.TilemapLayer,
        entranceExitLayer: Phaser.Tilemaps.TilemapLayer,
        input: Phaser.Input.InputPlugin
    ) {
        const offsetX = CrazyParkingLot.TILE_SIZE;
        const offsetY = CrazyParkingLot.TILE_SIZE;

        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setPosition(
            tilePos.x * CrazyParkingLot.TILE_SIZE + (offsetX * 3 / 2),
            tilePos.y * CrazyParkingLot.TILE_SIZE + (offsetY * 3 / 2)
        );
        this.sprite.setFrame(10);

        scene.physics.add.collider(this.sprite, wallLayer);
        // scene.physics.add.collider(this.sprite, entranceExitLayer);
        
        let testXVector = 96;
        let testYVector = 400;
        let testVector = new Phaser.Math.Vector2(testXVector, testYVector);


        scene.physics.moveToObject(this.sprite, testVector, 800);
        this.sprite.on(Phaser.Physics.Arcade.Events.COLLIDE, (event) => {
            console.log(event);
        })

        // let debug = scene.add.graphics();

        // input.on('pointerdown', (pointer) => {
        //     console.log(pointer);
        //     tilePos.x = pointer.x;
        //     tilePos.y = pointer.y;

        //     scene.physics.moveToObject(this.sprite, pointer, 200);

        //     debug.clear().lineStyle(1, 0x00ff00);
        //     debug.lineBetween(0, tilePos.y, 32 * 59, tilePos.y);
        //     debug.lineBetween(tilePos.x, 0, tilePos.x, 32 * 143);

        // }, scene);

    }

    getTilePos(): Phaser.Math.Vector2 {
        return this.tilePos;
    }

    setTilePos(tilePosition: Phaser.Math.Vector2): void {
        this.tilePos = tilePosition.clone();
    }

} 