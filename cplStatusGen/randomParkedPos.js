const parkingAreaCords = require('../assets/parkingAreaCords');
const { randomInt, randomColor, uuidv4 } = require('./utils');

let randomParked = [];
let parkedCars = {};
let parkedCount = randomInt(1, 57);
let count = 0;

module.exports = function createRandomParkedPos() {
    
    while(true) {
        let value = randomInt(1, 57);

        if(count === parkedCount) break;

        if(!randomParked.includes(value)) {
            randomParked.push(value);

            let eachPa = parkingAreaCords[String(value)];

            parkedCars[uuidv4()] = {
                parkingArea: value,
                carType : randomColor(),
                direction: eachPa.direction,
                tilePos: {
                    x: eachPa.cord.start[0] + (eachPa.cord.vector[0] / 2),
                    y: eachPa.cord.start[1] + (eachPa.cord.vector[1] / 2)
                }
            }

            count++;
            return createRandomParkedPos();
        }
    }

    return parkedCars;
}   
