const getRandomPos = require('./randomPos');
const { randomDegrees, randomColor, uuidv4 } = require('./utils');

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
            carType: randomColor(),
            angle: randomDegrees(),
            tilePos: {
                x: eachPos[0],
                y: eachPos[1]
            },
            parked: false
        }

        cars[uuid] = eachCar;
    }

    return cars;

}





