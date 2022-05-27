import { CrazyParkingLot } from '../crazyParkingLot';

export class Car {

    constructor(
        private sprite: Phaser.GameObjects.Sprite,
        private tilePos: Phaser.Math.Vector2,
        scene: Phaser.Scene,
        layer: Phaser.Tilemaps.TilemapLayer
    ) {
        const offsetX = CrazyParkingLot.TILE_SIZE;
        const offsetY = CrazyParkingLot.TILE_SIZE;

        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setPosition(
            tilePos.x * CrazyParkingLot.TILE_SIZE + (offsetX * 3 / 2),
            tilePos.y * CrazyParkingLot.TILE_SIZE + (offsetY * 3 / 2)
        );
        this.sprite.setFrame(10);

        scene.physics.add.collider(this.sprite, layer);
    }

    getTilePos(): Phaser.Math.Vector2 {
        return this.tilePos;
    }

    setTilePos(tilePosition: Phaser.Math.Vector2): void {
        this.tilePos = tilePosition.clone();
    }



} 