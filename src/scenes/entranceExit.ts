import { settings } from '../config/settings';

export default class EntranceExit extends Phaser.Scene {
    constructor() {
        // super('entranceExit');
        super({
            key: 'entranceExit'
        });
    }

    preload() {

    }

    create() {
        let ee = this.make.tilemap({
            data: [
                [ null, null, null, null, null, null, null ],
                [ null, null, null, null, null, 29, 29 ],
                [ null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null ],
                [ null, null, null, null, null, 43, 43 ],
                [ null, null, null, null, null, null, null ]
            ],
            tileWidth: 32,
            tileHeight: 32,
            width: settings.xGridCnt,
            height: settings.yGridCnt
        });

        let eeTileset = ee.addTilesetImage('tiles', null, 32, 32);
        let eeLayer = ee.createLayer(0, eeTileset, 0, 0);

        eeLayer.type = 'eeLayer';
        eeLayer.setScale(settings.spacer / 32);
    }
}