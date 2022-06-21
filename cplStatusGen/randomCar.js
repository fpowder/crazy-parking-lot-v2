const getRandomPos = require('./randomPos');
const uuidv4 = require('./uuid');
const colors = [ 'red', 'blue', 'green' ];

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const item = colors[randomIndex];
    return item;
}

function createCarsTilePos() {
    let result = [];
    for(let i = 0; i < 3; i++) {
        result.push(getRandomPos());
    }

    return result;
}

module.exports = function createRandomCars() {

    let cars = new Object();

    let tileCords = createCarsTilePos();
    for(let eachPos of tileCords) {
        let uuid = uuidv4();
        let eachCar = {
            objectType: 'car',
            carType: getRandomColor(),
            tilePos: {
                x: eachPos[0],
                y: eachPos[1]
            }
        }

        cars[uuid] = eachCar;
    }

    return cars;

}





