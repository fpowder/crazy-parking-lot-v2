const colors = [ 'red', 'blue', 'green' ];

exports.randomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const item = colors[randomIndex];
    return item;
}

exports.uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

exports.randomDegrees = () => {

    const min = -180;
    const max = 180;

    return Math.random() < 0.5 ? ((1 - Math.random()) * (max - min) + min)
            : (Math.random() * (max - min) + min);
}

exports.randomInt = (min, max) => {

    return Math.round(Math.random() * (max - min) + min);

}
