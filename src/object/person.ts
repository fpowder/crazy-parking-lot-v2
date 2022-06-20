
export class Person {

    sprite: Phaser.Physics.Arcade.Sprite;

    tilePos: Phaser.Math.Vector2;
    realPos: Phaser.Math.Vector2;

    scene: Phaser.Scene;

    personType: String;
    uuid: String;

    constructor(
        personType: String,
        tilePos: Phaser.Math.Vector2,
        scene: Phaser.Scene,
        uuid: String
    ) {
        this.personType = personType;
        this.uuid = uuid;
        this.scene = scene;
        this.tilePos = tilePos;
    }

}