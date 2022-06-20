const getRandomPos = require('./randomPos');
const uuidv4 = require('./uuid');
const persons = [ 'p1', 'p2', 'p3', 'p4' ];

function getRandomPersonType() {
    const randomIndex = Math.floor(Math.random() * persons.length);
    const item = persons[randomIndex];
    return item;
}

// creat 4 person tile positions
function createPersonsTilePos() {
    let result = [];

    for(let i = 0; i < 4; i++) {
        result.push(getRandomPos());
    }

    return result;

}

module.exports = function createRandomPersons() {

    let persons = new Object();

    let tileCords = createPersonsTilePos();
    for(let eachPos of tileCords) {
        let uuid = uuidv4();
        let eachPerson = {
            objectType: 'person',
            personType: getRandomPersonType(),
            tilePos: {
                x: eachPos[0],
                y: eachPos[1]
            }
        }
        persons[uuid] = eachPerson;
    }
    
     return persons;

}
