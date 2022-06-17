export const settings = (() => {
    // 가로 세로 cell수
    let xGridCnt = 59;
    let yGridCnt = 143;

    // let xGridCnt = 60;
    // let yGridCnt = 168;

    let aspectRatio = yGridCnt / xGridCnt;
    let reverseAspectRatio = xGridCnt / yGridCnt;

    let phrHeight = window.innerHeight;// * 0.919;
    let phrWidth = phrHeight * reverseAspectRatio;

    if (phrWidth > window.innerWidth) {
        let reduceRatio = window.innerWidth / phrWidth;
        phrWidth = phrWidth * reduceRatio;
        phrHeight = phrHeight * reduceRatio;
    }

    //div 요소 위치 조정용 변수
    /*
    각 canvas 요소위에 html div요소를 mapping하여, mouse click event를 정의한다.
    div position 요소는 canvas요소의 좌측 margin 너비 만큼, 세로 margin만큼 더해져야 한다.
*/
    let cnvAdjHeight = (window.innerHeight - phrHeight) / 2;
    let cnvAdjWidth = (window.innerWidth - phrWidth) / 2;

    // 한 cell 변의 길이
    let spacer = phrHeight / yGridCnt;

    //자연수 좌표계[(0,0) (1,1)....]를 canvas의 좌표계에 mapping한다. [(0,0) (19.1919, 23.34)....]
    let xCordinates = [];
    let yCordinates = [];

    //canvas에 그려전 각 cell의 중심 좌표
    let xCenters = [];
    let yCenters = [];

    for (let x = 0; x <= xGridCnt; x++) {
        xCordinates.push(x * spacer);
        if (x !== xGridCnt) {
            xCenters.push(x * spacer + spacer / 2);
        }
    }

    for (let y = 0; y <= yGridCnt; y++) {
        yCordinates.push(y * spacer);
        if (y !== yGridCnt) {
            yCenters.push(y * spacer + spacer / 2);
        }
    }

    return {
        xGridCnt: xGridCnt, 
        yGridCnt: yGridCnt,
        xCenters: xCenters,
        yCenters: yCenters,
        xCordinates: xCordinates,
        yCordinates: yCordinates,
        spacer: spacer,
        cnvAdjHeight: cnvAdjHeight,
        cnvAdjWidth: cnvAdjWidth,
        phrHeight: phrHeight,
        phrWidth: phrWidth
    }

})();

// random person create work
// 4 person position create function
export const createPersonsTilePos = () => {
    let result = [];
    

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.ceil(Math.random() * (max - min)) + min;
}

const wallTileRange = {
    1: [[1, 143]],
    2: [[1, 12], [131, 143]],
    3: [[1, 12], [139, 143]],
    4: [[1, 3], [139, 143]],
    5: [[1, 3], [139, 143]],
    6: [[1, 3], [139, 143]],
    7: [[1, 3], [139, 143]],
    8: [[1, 3], [139, 143]],
    9: [[1, 3], [139, 143]],
    10: [[1, 3], [139, 143]],
    11: [[1, 3], [33, 33], [48, 48], [63, 63], [78, 78], [93, 93], [106, 106], [118, 118], [139, 143]],
    12: [[1, 2], [141, 143]],
    13: [[1, 2], [141, 143]],
    14: [[1, 2], [141, 143]],
    15: [[1, 2], [141, 143]],
    16: [[1, 2], [141, 143]],
    17: [[1, 2], [141, 143]],
    18: [[1, 2], [141, 143]],
    19: [[1, 2], [141, 143]],
    20: [[1, 2], [141, 143]],
    21: [[1, 2], [141, 143]],
    22: [[1, 2], [12, 12], [33, 33], [48, 48], [63, 63], [78, 78], [93, 93], [106, 106], [118, 118], [131, 131], [141, 143]],
    23: [[1, 2], [141, 143]],
    24: [[1, 2], [141, 143]],
    25: [[1, 2], [141, 143]],
    26: [[1, 2], [141, 143]],
    27: [[1, 2], [141, 143]],
    28: [[1, 2], [141, 143]],
    29: [[1, 2], [141, 143]],
    30: [[1, 2], [141, 143]],
    31: [[1, 2], [33, 33], [48, 48], [63, 63], [78, 78], [93, 93], [106, 106], [118, 118], [141, 143]],
    32: [[1, 2], [40, 118], [131, 131], [141, 143]],
    33: [[1, 2], [12, 12], [40, 118], [141, 143]],
    34: [[1, 2], [47, 109], [141, 143]],
    35: [[1, 2], [47, 109], [141, 143]],
    36: [[1, 2], [47, 109], [141, 143]],
    37: [[1, 2], [47, 109], [141, 143]],
    38: [[1, 2], [47, 109], [141, 143]],
    39: [[1, 2], [47, 109], [141, 143]],
    40: [[1, 2], [47, 109], [141, 143]],
    41: [[1, 2], [47, 109], [141, 143]],
    42: [[1, 2], [47, 109], [141, 143]],
    43: [[1, 2], [40, 118], [141, 143]],
    44: [[1, 2], [40, 118], [141, 143]],
    45: [[1, 2], [48, 118], [141, 143]],
    46: [[1, 2], [48, 118], [141, 143]],
    47: [[1, 2], [48, 118], [131, 131], [141, 143]],
    48: [[1, 12], [44, 118], [131, 131], [141, 143]],
    49: [[1, 12], [44, 118], [141, 143]],
    50: [[1, 12], [44, 118], [141, 143]],
    51: [[1, 12], [44, 118], [141, 143]],
    52: [[1, 12], [44, 118], [141, 143]],
    53: [[1, 12], [44, 118], [141, 143]],
    54: [[1, 12], [44, 118], [141, 143]],
    55: [[1, 12], [44, 118], [141, 143]],
    56: [[1, 12], [44, 118], [131, 131], [141, 143]],
    57: [[1, 143]],
    58: [[1, 143]],
    59: [[1, 143]],
}