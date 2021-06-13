gsap.registerPlugin(CSSRulePlugin, MorphSVGPlugin);

let containerHeight = document.getElementById("container").clientHeight;
let containerWidth = document.getElementById("container").clientWidth;
let speed = 1.1*(containerWidth*0.25) ;
let bias = 100;
let x = 14;
let y = 10;
let t = 4;
let bx = 8;
let by = 4;
let refWid = containerWidth / x;
let refHei = containerHeight/ y;
let blobWid = refWid;
let blobHei = refHei;
let dotData = [];
let resetData = [];
let resultState = false;
let moving = 0;
let oldArr = [];
let oldNum;
let PeopleGen = false;
let longestTime = 0;
let aninmationSpeed = 3;
let is_mobile = false;
let is_small = false;
let dots = [];
let time = 0.15;
let containerPercentageHeight = containerHeight/100;
let containerPercentageWidth = containerWidth/100;
let speedDouble= false;

//Check Mobile
function Mobile() {      
    var checker = document.getElementById("some-element");
    if (window.getComputedStyle(checker).display === "none") {
        x = 10;
        y = 16;
        t = 8;
        bx = 6;
        by = 8;
        refWid = containerWidth / x;
        refHei = containerHeight/ y;
        blobWid = refWid;
        blobHei = refHei;    
        is_mobile = true;  
       
    }else if(containerHeight< 650){
        x = 18;
        y = 12;
        t = 16;
        bx = 12;
        by = 8;
        refWid = containerWidth / x;
        refHei = containerHeight/ y;
        blobWid = refWid;
        blobHei = refHei; 
        gsap.to('.textarea',{width:"64vw","max-height":"66%"})

        is_small = true;  
    }
 };

// Test Button Show Results
function test3() {
    let inputVal = document.getElementById("inputId").value;
    showResults(inputVal);
}

// Test Button Runaway
function runaway() {
    //console.log("Runway Start resultState " + resultState);
    showResults(oldNum, true);
 
}

function speed2(){
    if(speedDouble == false){
        speed = speed*2;
        speedDouble = true;
        document.getElementById("SpeedThing").innerText = "Нормальный режим";
    }else{
        speed = speed/2
        speedDouble = false;
        document.getElementById("SpeedThing").innerText = "Ускорить";
    }
}

// Test Button Load LoadLotties
function test1() {
    loadLotties();
    reset();
}

// Test Button Reset People
function reset() {
    longestTime = 0;
    for (let n = 0; n < 100; n++) {
        dotData[n][7] = "#3d405b";
        movePeople(n, resetData, n);
    }
    writeData();
    resultState = false;
}

// Empty Grid creation
function emptyGrid() {
    var emptyGrid = [];
    emptyGrid.push(1);
    emptyGrid.push(y, x * y, x * y - (y - 1));
    for (let n = 0; n < t; n++) {
        emptyGrid.push(y * (x / 2 - t / 2) + 1 + n * y);
    }
    for (let n = 0; n < bx; n++) {
        for (let m = 0; m < by; m++) {
            emptyGrid.push(
                y * (x / 2 - bx / 2) + (y / 2 - by / 2) + 1 + n * y + m
            );
        }
    }
    return emptyGrid;
}

// Create Basic Grid Points
function generateStartingGrid() {
    Mobile();
    let Gaps = emptyGrid();
    let n = 1;
    let m = 0;
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            // People point generater
            if (Gaps.includes(n)) {
            } else {
                var dotOffWid = getRandomArbitrary(0.2, 0.8) * refWid;
                var dotOffHei = getRandomArbitrary(0.2, 0.8) * refHei;
                let xData = refWid * i + dotOffWid;
                let yData = refHei * j + dotOffHei;
                dotData[m] = [xData, yData, 0, 0, 0, 0, 0,"blue"];
                resetData[m] = [xData, yData];
                m++;
            }
            n++;
        }
    }
    //console.log("generateStartingGrid: " + dotData)
}
const walkbeg = new Event('walkbeg');
const walkend = new Event('walkend');
// Load Lottie Files
function loadLotties() {
    longestTime = 0;
    if (PeopleGen == true) {
        return;
    }
    for (let n = 0; n < 100; n++) {
        console.log(1)
        let dot = document.createElement("div");
        let divNo = "no" + (n);
        let svgNum = Math.floor(getRandomArbitrary(0, 6));
        let invert = Math.floor(getRandomArbitrary(1, 3));

        dot.className = "dot";
        dot.id = divNo;
        dot.innerHTML = SVGs[svgNum][0];
        dots[n] = dot;

        if (invert == 1) {
            dot.className = "dot invert";
        } else {
        }

        let sizeNum = getRandomArbitrary(0.8, 1.2);
        dotData[n][3] = 4 * sizeNum.toFixed(1);
        if(is_mobile == true){
            dotData[n][3] = 6 * sizeNum.toFixed(1);  
        }else if(is_small==true){
            dotData[n][3] = 3 * sizeNum.toFixed(1); 
        }

        gsap.to(dot, {width:`${dotData[n][3]}vw`});
        
        dotData[n][8] = SVGs[svgNum][1];
        
        timer = (time*(sizeNum)).toFixed(2);

        setUpAnnimation(dot,n);

        dots[n] = dot;
    }
    logger('loadLotties',dotData);
    
    showResults(50, true, true);
    for(n=0; n < dots.length; n++){
        document.getElementById("container").appendChild(dots[n]);        
    }
    resultState = false;    
}

// Wait
function wait(A, B) {
    if (document.getElementById("no99").offsetHeight == 0) {
        setTimeout(wait, 100, A, B);
    } else {
        reset();
    }
}

// Set Movement Data
function setData(n){
}

// Write Movement Data
function writeData(){
    
  
    for(n=0;n<100;n++){
        let dot = dots[n];
        let body = dots[n].querySelector('.cls-2')
        let shadow = dots[n].querySelector('.cls-1')
        gsap.to(dot, {duration: dotData[n][2], x:dotData[n][0], y:dotData[n][1], zIndex:dotData[n][6], ease:"power1.inOut", onStart:walkstart, onStartParams:[dot], onComplete: walkstop, onCompleteParams:[dot]})
        gsap.to([body, shadow],{duration: 0.1, fill:dotData[n][7]});


        
        // ,onStart:walkstart, onStartParams:[dot], onComplete: walkstop, onCompleteParams:[dot]
        // dot.setAttribute("style","left:"+dotData[n][0]+"%; top:" +dotData[n][1]+ "%; transition-duration:" + dotData[n][2]+"s; width:"+ dotData[n][3]+"%; z-index:"+dotData[n][6]+";");
        // dot.classList.remove("green","red","blue");
        // dot.classList.add(dotData[n][7]|| "blue");
    }
    logger('writeData','write');
} 

function walkstart(dot){
    dot.dispatchEvent(walkbeg);
  }
  
function walkstop(dot){
    dot.dispatchEvent(walkend);

}

// Move People
function movePeople(item, Arr, n, instant) {
    let xOffset = ((dotData[item][3]/2)*containerPercentageWidth);
    let yOffset = ((dotData[item][3]*dotData[item][8]/2)*containerPercentageWidth);
    //console.log(xOffset,yOffset);
    let xData = (Arr[n][0])-xOffset;
    let yData = (Arr[n][1])-yOffset;
    let oldX = dotData[item][0];
    let oldY = dotData[item][1];
    if (instant == true) {
        s = Infinity;
    } else {
        s = speed;
    }
    dotData[item][2] = (travel(xData, yData, oldX, oldY, s));
    dotData[item][4] = oldX;
    dotData[item][5] = oldY;
    dotData[item][0] = xData;
    dotData[item][1] = yData;
    dotData[item][6] = (yData + (2*yOffset)).toFixed(0);
    //console.log(dotData[item]);
}

// Get Random Number
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Show Results
function showResults(num, runaway, instant) {
    var error = 0;
    var arr = [];
    if (runaway == true && resultState == false) {
        arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 
                31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
                41, 42, 43, 44, 45, 46, 47, 48, 49, 50
            ];
    } else if (runaway == true && resultState == true) {
        arr = oldArr;
    } else {
        while (arr.length < num) {
            var r = Math.floor(Math.random() * 100) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
        }
    }
    var pointsG = gridsetup(num, bias, 0, runaway); // Green Point Arr
    var pointsR = gridsetup(100 - num, bias, 1, runaway); // Red Point Arr
    //console.log(pointsG, pointsR)
    var binG = [];
    var binR = [];
    longestTime = 0;
    for (let n = 100; n > 0; n--) {

        let oldx = dotData[n-1][0];
        let oldy = dotData[n-1][1];

        if (arr.includes(n)) {

            if (runaway == true) {
            } else {
                dotData[n-1][7] = '#81b29a';
            }
            let closeP = pointchoice(oldx, oldy, pointsG, binG)[0];
            binG.push(closeP);
            movePeople(n-1, pointsG, closeP, instant);
        } else {
        }
    }
    for (let n = 1; n < 101; n++) {

        let oldx = dotData[n-1][0];
        let oldy = dotData[n-1][1];

        if (arr.includes(n)) {
        } else {

            if (runaway == true) {
            } else {
                dotData[n-1][7] = '#e07a5f';
            }
            let closeP = pointchoice(oldx, oldy, pointsR, binR)[0];
            binR.push(closeP);
            movePeople(n-1, pointsR, closeP, instant);
        }
    }
    oldArr = arr;
    oldNum = num;
    resultState = true;
    logger('showResults',dotData);
    writeData();
}

//Speed controller
function travel(newx, newy, oldx, oldy, speed) {
    let x = newx - (oldx);
    let y = newy - (oldy);
    let d = Math.sqrt(x * x + y * y);
    let traveltime = d / speed;
    if (traveltime > longestTime) {
        longestTime = traveltime;
    }
    //console.log("long:" + longestTime);
    if(traveltime<1 && speed !== Infinity){
        traveltime += 1;
    }
    return traveltime;
}

//Generate Result Grid
function gridsetup(num, bias, rule, runaway) {
    let gridArr = [];
    var i;
    for (i = 0; i < num; i++) {
        gridArr[i] = randomPointOf(i, bias, rule);
        if (runaway == true) {
            if (rule == 0) {
                gridArr[i][0] = parseFloat(gridArr[i][0])-containerWidth/4;
            } else {
                gridArr[i][0] = parseFloat(gridArr[i][0])+containerWidth/4;
            }
        } else {
        }
        gridArr[i][1] = gridArr[i][1]-0;
        gridArr[i][0] = gridArr[i][0]-0;
    }
    //console.log(gridArr)

    return gridArr;
}

//Generate Result Grid Points
function randomPointOf(n, bias, val) {
    let h = (y - 2) * refHei;
    let w = ((x - bx) / 2) * refWid;
    let spread = Math.sqrt(bias);
    let xs = w / spread;
    let ys = h / spread;
    n = n % bias;
    let ny = (n % spread) * ys;
    let nx = (n / spread) * xs;
    let xx = 0;
    let yy = 0;
    let offsetY = 0;
    if(is_mobile == true){
        offsetY = refHei*1.5;
    } else{
        offsetY = refHei*1.2;
    }
    if (val == 1) {
        xx = containerWidth - (Math.random() * xs + nx);
        yy = (Math.random() * ys + ny) + (offsetY);
    } else {
        xx = (Math.random() * xs + nx);
        yy = (Math.random() * ys + ny) + (offsetY);   
    }
    
    return [xx.toFixed(1), yy.toFixed(1)];
}

// Choose what point to Go to
function pointchoice(oldx, oldy, array, bin) {
    let closet = Infinity;
    for (let p = 0; p < array.length; p++) {
        if (bin.includes(p)) {
        } else {
            let x = array[p][0] - (oldx);
            let y = array[p][1] - (oldy);
            let c = Math.sqrt(x * x + y * y);
            if (c < closet) {
                closet = c;
                closeP = p;
            }
        }
    }
    return [closeP, closet];
}

function setUpAnnimation(dot,n){

    const rot = Math.floor(getRandomArbitrary(5, 10))
    const tl = gsap.timeline({
        repeat: -1,
        paused: true
      });

    tl.to(dot,{
        duration: timer, 
        ease: "power3.out", 
        rotation:-rot,
        transformOrigin:"0% 100%",
        scaleY:"1.02"
    })
    .to(dot,{
        duration: timer/2, 
        ease: "power3.out", 
        rotation:0,
        transformOrigin:"0% 100%",
        scaleY:"0.95"
    })
    .to(dot,{
        duration: timer, 
        ease: "power3.out", 
        rotation:rot,
        transformOrigin:"100% 100%",
        scaleY:"1.02"
    })
    .to(dot,{
        duration: timer/2, 
        ease: "power3.out", 
        rotation:0,
        transformOrigin:"100% 100%",
        scaleY:"0.95"
    })

const lt = gsap.timeline({
    paused: true
    });
    var Shadow = dot.querySelector('.cls-1');
    var Body = dot.querySelector('.cls-2');
    var Eyes = dot.querySelector('.cls-3');
    var x = (dotData[n][3]/2)*containerPercentageWidth;
    var y = ((dotData[n][3]*dotData[n][8])*containerPercentageWidth)/2;
    var xy = `${x} ${y}`

    lt.to(dot,{
        duration: timer, 
        ease: "power3.out",
        transformOrigin:"50% 100%",
        scaleY:"0.8"
    })
    .to(dot,{
        duration: timer*1.5, 
        ease: "back.out", 
        transformOrigin:"50% 100%",
        scaleY:"1.05"
    })
    .to([Body, Eyes], {
        duration: timer*1.5, 
        ease: "back.out", 
        y: "-=20"
    }, `-=${timer*1.5}`)
    .to(Shadow,{
        duration: timer*1.5, 
        ease: "back.out", 
        y: "0",
        transformOrigin:"50% 100%",
        scale:"0.7"
    }, `-=${timer*1.5}`)
    .to(dot,{
        duration: timer*1.5, 
        ease: "back.out",
        transformOrigin:"50% 100%",
        scaleY:"0.9"
    })
    .to([Body, Eyes], {
        duration: timer*1.5, 
        ease: "back.out", 
        y: "+=20"
    }, `-=${timer*1.5}`)
    .to(Shadow,{
        duration: timer*1.5, 
        ease: "back.out", 
        y: "0",
        transformOrigin:"50% 100%",
        scale:"1"
    }, `-=${timer*1.5}`)
    .to(dot,{
        duration: timer*1.5, 
        ease: "power3.out", 
        transformOrigin:"50% 100%",
        scaleY:"1"
    })

    dot.addEventListener("mouseenter", (e) => {
        lt.restart();
    });

    dot.addEventListener('walkbeg', () => {
        tl.play();
        moving++;
    });

    dot.addEventListener("walkend", () => {
        tl.pause(0);
        moving--;
    });
}