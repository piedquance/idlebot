// var canvas = document.querySelector("canvas");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;



// var c = canvas.getContext("2d");

// c.fillRect(0, 100, 100, 100);


var counter = 0;
var countNum = [];

var StringCounter = "";
var number = 1;
var d = document;
var heart = d.getElementById("heart");
var counterText = d.getElementById("counter");

function count(number) {
    counter += number;
    StringCounter = ""
    countNum[2] = Math.floor(counter/1000000);
    countNum[1] = Math.floor((counter - countNum[2]*1000000)/1000);
    countNum[0] = Math.floor((counter - countNum[2]*1000000 - countNum[1]*1000));
    var space = " "

    for(let x = 2; x >= 0; x--) {
        if(x === 0) {
            space = " "
        } else space = " "

        if(countNum[x].toString().length === 2){ StringCounter += space + "0 "
            StringCounter += countNum[x].toString()[0] + "‎‎‎ " + countNum[x].toString()[1] 
    }
        else if(countNum[x].toString().length === 1 && countNum[x].toString() !== "0"){ StringCounter += space + "0 0 "
            StringCounter += countNum[x].toString()[0] + "‎‎‎ "
    }
        else if(countNum[x].toString() === "0") {StringCounter += space + "0 0 0 "

    } else if(countNum[x].toString().length === 3)  StringCounter += space + countNum[x].toString()[0] + "‎‎‎ " + countNum[x].toString()[1] + " " + countNum[x].toString()[2]
}

    counterText.innerHTML = StringCounter;
}

heart.addEventListener("click", ()=> {
   count(number)
})

let decayTick = 500

setInterval(()=>{
if(counter > 0) count(-1)
}, decayTick)