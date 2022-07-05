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
        phrWidth: phrWidth,
        host: '192.168.1.14'
    }

})();