const getRandomPos = require('./randomPos');
const colors = [ 'red', 'blue', 'green' ];

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const item = colors[randomIndex];
    return item;
}

function createCarsTilePos() {
    let result = [];
    for(let i = 0; i < 3; i++) {
        result.push(getRandomPos);
    }

    return result;
}





