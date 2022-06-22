import { CrazyParkingLot } from '../crazyParkingLot';

export class Person {

    sprite: Phaser.Physics.Arcade.Sprite;

    tilePos: Phaser.Math.Vector2;
    realPos: Phaser.Math.Vector2;

    scene: Phaser.Scene;

    personType: any;
    uuid: String;

    constructor(
        personType: any,
        tilePos: Phaser.Math.Vector2,
        scene: Phaser.Scene,
        uuid: String
    ) {
        this.personType = personType;
        this.uuid = uuid;
        this.scene = scene;
        this.tilePos = tilePos;

        this.sprite = scene.physics.add.sprite(0, 0, personType);
        this.sprite.setOrigin(0.5, 0.5);

        this.realPos = this.tilePosToRealPos(tilePos.x, tilePos.y);
        this.sprite.setPosition(this.realPos.x, this.realPos.y);

    }

    tilePosToRealPos(tileX: number, tileY: number): Phaser.Math.Vector2 {
        let tileSize = CrazyParkingLot.TILE_SIZE;
        let realX = tileX * tileSize + (tileSize * 3 / 2);
        let realY = tileY * tileSize + (tileSize * 3 / 2);

        return new Phaser.Math.Vector2(realX, realY);
    }

    setInitAngle(): void {
        this.sprite.angle = Phaser.Math.Angle.RandomDegrees();
    }

}