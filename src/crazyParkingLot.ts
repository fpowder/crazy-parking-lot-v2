import Phaser from 'phaser';

import Wall from './scenes/Wall';
import ParkingArea from './scenes/parkingArea';
import EntranceExit from './scenes/EntranceExit';

// phaser3 rex plugins
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin';
import { Pinch } from 'phaser3-rex-plugins/plugins/gestures';

import { settings }  from './config/settings';

class CrazyParkingLot extends Phaser.Scene {
    constructor() {
        super({
            key: 'crazyParkingLot'
        });

        // super({
        //     key: 'examples'
        // });
    }

    preload() {
        this.load.image('tiles', 'assets/gridTiles.png');
    }

    create() {

        // this.scene.start('wall');
        // this.scene.start('parkingArea');
        // this.scene.start('entranceExit');

        // this.scene.add('preloader', Preloader, true, null);
        this.scene.add('wall', Wall, true, null);
        this.scene.add('parkingArea', ParkingArea, true, null);
        this.scene.add('entranceExit', EntranceExit, true, null);

        // let pinch = new Pinch(this, {
        //     enable: true,
        //     bounds: undefined,
        //     threshold: 0
        // });
        // let camera = this.cameras.main;
        // pinch
        //     .on('drag1', function (pinch) {
        //         console.log(pinch.drag1Vector);
        //         let drag1Vector = pinch.drag1Vector;
        //         camera.scrollX -= drag1Vector.x / camera.zoom;
        //         camera.scrollY -= drag1Vector.y / camera.zoom;
        //     })
        //     .on('pinch', function (pinch) {
        //         console.log(pinch.scaleFactor);
        //         let scaleFactor = pinch.scaleFactor;
        //         camera.zoom *= scaleFactor;
        //     }, this)
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'parking-lot',
    width: settings.phrWidth,
    height: settings.phrHeight,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#b7dfed',
    // canvasStyle: `left: ${settings.cnvAdjWidth}px; top: ${settings.cnvAdjHeight}px; position: absolute;`,
    plugins: {
        scene: [
            { key: 'rexGestures', plugin: GesturesPlugin, mapping: 'rexGestures' }
        ]
    },
    physics: {
        // default: 'arcade',
        // arcade: {
        //     gravity: { y: 0 }
        // }
        default: 'matter',
        matter: {
            gravity: { x: 0, y: 0 },
            debug: true
        }
    },
    scene: [CrazyParkingLot]
    // scene: {
    //     preload: preload,
    //     create: create
    // }
    // scene: [ Preloader, Wall, ParkingArea, EntranceExit ]
}

export default new Phaser.Game(config);