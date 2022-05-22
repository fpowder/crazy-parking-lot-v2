import { settings } from '../config/settings';

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

    }

}