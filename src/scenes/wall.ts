import { settings } from '../config/settings';

import { Pinch } from 'phaser3-rex-plugins/plugins/gestures';

export default class Wall extends Phaser.Scene {

    constructor() {
        super({
            key: 'wall'
        });
    }

    preload() {

    }

    create() {
        let wall = this.make.tilemap({
            data: [
                [19, 19, 19, 19, 19, 33, 33],
                [19, 0, 0, 0, 0, 0, 0],
                [19, 0, 0, 0, 0, 33, 33],
                [19, 0, 0, 0, 0, 0, 19],
                [19, 0, 0, 0, 0, 0, 19],
                [19, 0, 0, 0, 0, 0, 19],
                [19, 0, 0, 0, 0, 0, 19],
                [19, 0, 0, 0, 0, 0, 19],
                [19, 0, 0, 0, 0, 0, 19],
                [19, 0, 0, 0, 0, 47, 47],
                [19, 0, 0, 0, 0, 0, 0],
                [19, 19, 19, 19, 19, 47, 47]
            ],
            tileWidth: 32,
            tileHeight: 32,
            width: settings.xGridCnt,
            height: settings.yGridCnt
        });
    
        // wall.layer.name = 'wall';
        
        let wallTileset = wall.addTilesetImage('tiles', null, 32, 32 );
        let wallLayer = wall.createLayer(0, wallTileset, 0, 0);
        
        wallLayer.type = 'wallLayer';
        wallLayer.setScale(settings.spacer / 32);

        wall.setCollision([ 19, 33, 47 ]);

        let pinch = new Pinch(this, {
            enable: true,
            bounds: undefined,
            threshold: 0
        });
        let camera = this.cameras.main;
        pinch
            .on('drag1', function (pinch) {
                console.log(pinch.drag1Vector);
                let drag1Vector = pinch.drag1Vector;
                camera.scrollX -= drag1Vector.x / camera.zoom;
                camera.scrollY -= drag1Vector.y / camera.zoom;
            })
            .on('pinch', function (pinch) {
                console.log(pinch.scaleFactor);
                let scaleFactor = pinch.scaleFactor;
                camera.zoom *= scaleFactor;
            }, this)

    }

}