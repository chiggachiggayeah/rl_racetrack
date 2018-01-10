// TODO
// [] allow overwriting so if I want to make a track square a finish or start square I can
// [] get rid of / mitigate global usage (could scope these with {}

let grid = []
let cWidth = 50
let cHeight = 50
let cellW = 10
let cellH = 10
let squares = {}
let start = {}
let finish = {}
let squaresArr = {} //<- change squares to a nested array [x][y]
let curEpisode = []

let state = (function(){
    let drawingStart = false
    let drawingFinish = false
    let drawingTrack = true
    let training = false

    let s = {
        drawTrack: function() {
            drawingStart = false
            drawingFinish = false
            drawingTrack = true
            training = false
        },

        drawFinish: function() {
            drawingStart = false
            drawingFinish = true
            drawingTrack = false
            training = false

        },

        drawStart: function() {
            drawingStart = true
            drawingFinish = false
            drawingTrack = false
            training = false

        },

        startTraining: function() {
            drawingStart = false
            drawingFinish = false
            drawingTrack = false
            training = true
        },

        isTraining: () => training,
        isDrawingTrack: () => drawingTrack,
        isDrawingStart: () => drawingStart,
        isDrawingFinish: () => drawingFinish
    }

    return s
})()

function setup(){
    createCanvas(cWidth * cellW + cellW, cHeight * cellH + cellH)   
}

function loadTrack(trackToLoad = savedTrack){
    let f = function(arr, dict) {
        for(i in arr){
            let newKey = arr[i].x + "&" + arr[i].y
            dict[newKey] = arr[i] 
        }    
    }

    // reset all of the track sets
    squares = {}
    finish = {}
    start = {}

    // load the saved track var
    f(trackToLoad["track"], squares)    
    f(trackToLoad["start"], start)    
    f(trackToLoad["finish"], finish)    
}

function buildGrid(){
    for(var x = 0; x < cWidth; x++) {
        for(var y = 0; y < cHeight; y++){
            rect(x * cellW, y * cellH, cellW, cellH)
        }
    }
}


function getSquare(mouseX, mouseY) {
    let color = state.isDrawingTrack() ? 'rgb(0, 0, 0)' : (state.isDrawingFinish() ? 'rgb(255, 0, 0)' : 'rgb(10, 255, 10)')
    return {
        x: Math.floor(mouseX / 10) * cellW,
        y: Math.floor(mouseY / 10) * cellH,
        color: color 
    }
}

function drawSquares() {
       
    if(Object.keys(squares).length > 0) {
        for(k in squares){
            // console.log("Key is: ", k)
            let pos = squares[k]
            fill(pos.color)
            rect(pos.x, pos.y, cellW, cellH) 
        }
    }
    if(Object.keys(start).length > 0) {
        for(k in start){
            // console.log("Key is: ", k)
            let pos = start[k]
            fill(pos.color)
            rect(pos.x, pos.y, cellW, cellH) 
        }
    }
    if(Object.keys(finish).length > 0) {
        for(k in finish){
            // console.log("Key is: ", k)
            let pos = finish[k]
            fill(pos.color)
            rect(pos.x, pos.y, cellW, cellH) 
        }
    }

     
}

function drawCurEpisode() {
    for(ind in curEpisode){
        let pos = curEpisode[ind][0]
        fill(0, 0, 255)
        rect(pos.x, pos.y, cellW, cellH)
    }
}

function addToTrack() {
    if(mouseIsPressed && !state.isTraining()){
        if(mouseX <= cWidth * cellW && mouseX >= 0 & mouseY >= 0 & mouseY <= cHeight * cellH){
            // console.log("keys in squares: ", Object.keys(squares).toString())
            let pos = getSquare(mouseX, mouseY)
            // console.log("Mouse x: ", pos.x, " Mouse y: ", pos.y) 
            let newKey = pos.x.toString() + "&" + pos.y.toString()
            // console.log("new key is: ", newKey)
            if(squaresArr[pos.x] == undefined) squaresArr[pos.x] = []
            // I only want to add this to my squaresArr (for filling) if it's not been added)
            if(squares[newKey] == undefined) squaresArr[pos.x].push(pos)

            
            if(state.isDrawingTrack()) squares[newKey] = pos   
            if(state.isDrawingFinish()) finish[newKey] = pos
            if(state.isDrawingStart()) start[newKey] = pos

                        // console.log("newly stored value: ", squares[newKey].x)
        }

    }    
}

function fillTrack() {
    if(state.isDrawingTrack()){
        console.log("number of squares before fill: ", Object.keys(squares).length)
        let xArray = Object.values(squares).map((v) => v.x)
        let yArray = Object.values(squares).map((v) => v.y)

        // console.log("X's: ", xArray.toString())
        // console.log("Y's: ", yArray.toString())

        let xMin = xArray.reduce((acc, cv) => {
            return Math.min(acc, cv)
        })      
        let xMax = xArray.reduce((acc, cv) => {
            return Math.max(acc, cv)
        })
        let yMin = yArray.reduce((acc, cv) => {
            return Math.min(acc, cv)
        }) 
        let yMax = yArray.reduce((acc, cv) => {
            return Math.max(acc, cv)
        })
        
        

        console.log("xMax: ", xMax, " xMin: ", xMin)
        console.log("yMax: ", yMax, " yMin: ", yMin)
        
        let newAdded = [] 
        
        for(let i = xMin; i < xMax; i+=cellW) {
            // get the bounding y's of the shape at the x and fill along the x between the y's
            let localYs = squaresArr[i].map(p => p.y) 
            console.log("Local y's array: ", squaresArr[i].toString())
            let localYMax = localYs.reduce((acc, cv) => Math.max(acc, cv))
            let localYMin = localYs.reduce((acc, cv) => Math.min(acc, cv))
            console.log("Local y min: ", localYMin, " local y max: ", localYMax)
            for(let j = localYMin + cellH; j < localYMax; j+=cellH){ 
                let pos = {
                    x: i,
                    y: j,
                    color: 'rgb(0,0,0)'
                } 
                let newKey = pos.x + "&" + pos.y
                squares[newKey] = pos
            }
        }

        // for(let x = 0; x < cWidth; x++) {
        //     for(let y = 0; y < cHeight; y++) {
        //         if(x * cellW > xMin && x * cellW < xMax) {
        //             if(y * cellH > yMin && y * cellH < yMax) {
        //                 let pos = {
        //                     x: x * cellW,
        //                     y: y * cellH,
        //                     color: 'rgb(0,0,0)'
        //                 }
        //                 let newKey = pos.x.toString() + "&" + pos.y.toString()
        //                 squares[newKey] = pos
        //                 newAdded.push(pos)
        //             }
        //         }
        //     }
        // } 
        console.log("number of squares after fill: ", Object.keys(squares).length)
        console.log("number of new squares: ", newAdded.length)
        for(let i = 0; i < newAdded.length; i++) {
            console.log("New x: ", newAdded[i].x, " New y: ", newAdded[i].y)
        }
    } 
}

let getTrackStates = function() {
}

let printOutStates = function printOutStates() {
    let obj = {
        start: [],
        finish: [],
        track: []
    }
    // obj.start = Object.values(start).map((x) => JSON.stringify(x))
    // obj.finish = Object.values(finish).map((x) => JSON.stringify(x))
    // obj.track = Object.values(squares).map((x) => JSON.stringify(x))
   
    obj.start = Object.values(start)
    obj.finish = Object.values(finish)
    obj.track = Object.values(squares)

    let stringified = JSON.stringify(obj)
    console.log(stringified)
    console.log(JSON.parse(stringified))
    return stringified
}

function draw() {
    addToTrack()
    fill(255)
    stroke(0) 
    // rect(cellW, cellH, cellW, cellH)
    buildGrid()
    drawSquares()
    drawCurEpisode()
}
