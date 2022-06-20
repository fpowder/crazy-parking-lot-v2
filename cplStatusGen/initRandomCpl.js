const createRandomCars = require('./randomCar');
const createRandomPersons = require('./randomPerson');

module.exports = function() {
    const cars = createRandomCars();
    const persons = createRandomPersons();
    return Object.assign(cars, persons);
}