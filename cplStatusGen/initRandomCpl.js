const createRandomCars = require('./randomCar');
const createRandomPersons = require('./randomPerson');
const createRandomParkedCars = require('./randomParkedCar');

module.exports = function() {
    const cars = createRandomCars();
    const persons = createRandomPersons();
    const parkedCars = createRandomParkedCars(); 

    return {
        cars: Object.assign(cars, parkedCars),
        persons: persons
    }

}