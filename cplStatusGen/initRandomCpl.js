const createRandomCars = require('./randomCar');
const createRandomPersons = require('./randomPerson');
const createRandomParkedCars = require('./randomParkedCar');

module.exports = function() {
    const cars = createRandomCars();
    const persons = createRandomPersons();
    const parkedCars = createRandomParkedCars(); 

    return {
        cars: cars,
        parkedCars: parkedCars,
        persons: persons
    }

}