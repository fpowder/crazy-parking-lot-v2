const getRandomPos = require('./randomPos');

// creat 4 person tile positions
function createPersonsTilePos() {
    let result = [];

    for(let i = 0; i < 4; i++) {
        result.push(getRandomPos());
    }

    return result;

}
