export default class Preloader extends Phaser.Scene {
    constructor() {
        super('reloader');
    }

    preload() {
        this.load.image('tiles', 'assets/gridTiles.png');
    }

    create() {
        this.scene.start('wall');
        this.scene.start('parkingArea');
        this.scene.start('entranceExit');

    }
}