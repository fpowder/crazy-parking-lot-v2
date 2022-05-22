import Phaser from 'phaser';

import Preloader from './scenes/preloader';
import Wall from './scenes/Wall';
import ParkingArea from './scenes/parkingArea';
import EntranceExit from './scenes/EntranceExit';

import { settings }  from './config/settings';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'parking-lot',
    width: settings.phrWidth,
    height: settings.phrHeight,
    pixelArt: true,
    // scale: {
    //     mode: Phaser.Scale.FIT,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    // },
    backgroundColor: '#b7dfed',
    canvasStyle: `left: ${settings.cnvAdjWidth}px; top: ${settings.cnvAdjHeight}px; position: absolute;`,
    // plugins: {
    //     global: [
    //         { key: 'RexPinch', plugin: RexPinch, start: true, mapping: 'RexPinch' }
    //     ]
    // },
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
    // scene: {
    //     preload: preload,
    //     create: create
    // }
    scene: [ Preloader, Wall, ParkingArea, EntranceExit ]
}

export default new Phaser.Game(config);