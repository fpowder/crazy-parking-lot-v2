const parkingAreaCords = require('../assets/parkingAreaCords');
const { randomInt } = require('./utils');

let randomParked = [];
let result = {};
let parkedCount = randomInt(1, 57);
let count = 0;

module.exports = function createRandomParkedPos() {
    
    while(true) {
        let value = randomInt(1, 57);

        if(count === parkedCount) break;

        if(!randomParked.includes(value)){
            randomParked.push(value);
            result[String(value)] = parkingAreaCords[String(value)];
            count++;
            return createRandomParkedPos();
        }
    }

    return result;
}   