const wallTileRange = require('../assets/tileWallLayer');

module.exports = function getRandomPos() {
    let randomX  = getRandomInt(1, 59);
    let randomY  = getRandomInt(1, 143);

    let rangeClear = true;

    let availableYRange = wallTileRange[String(randomX)];
    for(let eachRange of availableYRange) {
        if(checkInRange(eachRange[0], eachRange[1], randomY)) {
            rangeClear = false;
            return getRandomPersonPos();
        } 
    }

    if(rangeClear) {
        return [randomX, randomY];
    } 
    
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    let randomInt = Math.ceil(Math.random() * (max - min)) + min;
    return randomInt;
}

function checkInRange(low, high, value) {
    return value >= low && value <= high;
}