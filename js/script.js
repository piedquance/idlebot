// var canvas = document.querySelector("canvas");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;



// var c = canvas.getContext("2d");

// c.fillRect(0, 100, 100, 100);


var countNum = [];

var StringCounter = "";
var number = 1;
var d = document;
var heart = d.getElementById("heart");
var counterText = d.getElementById("counter");
var message = d.getElementById("message");
var title = d.querySelector("title")
var leftPane = d.getElementById("left")


// data formatting for upgrades: 
//------------------------------
//name[0]=counter | name[1]=cost | name[2]=number
//name[3]=cost reference | name[4]=number reference
//name[5]=name reference | name[6] = cost increase
//name[7]=string id | name[8]=string name
//name[9]=string description | name[10]=tick
//
//upgrade[0] = blood
//

let data = {
    counter:0,
    upgrade: [[0, 10 , 0,
         d.getElementById("bloodUpgradeCost"),
         d.getElementById("bloodUpgradeNum"),
         d.getElementById("bloodUpgrade"),
         5, "bloodCounter", "Blood Valve", "Pumps blood every 0.5s", 500],

]

}


var messageChecker = new Array(1000);
messageChecker.fill(false);


function count(number) {
    data.counter += number;
    StringCounter = ""
    countNum[2] = Math.floor(data.counter/1000000);
    countNum[1] = Math.floor((data.counter - countNum[2]*1000000)/1000);
    countNum[0] = Math.floor((data.counter - countNum[2]*1000000 - countNum[1]*1000));
    var space = " "
    var specialSpace = ""
    for(let x = 2; x >= 0; x--) {
        if(x == 0) {
            space = " "
        } else space = " "

        if(data.counter >= 10000 && x == 0) {
            specialSpace=" "
        } else specialSpace= ""

        if(countNum[x].toString().length === 2){ StringCounter += specialSpace + space + "0 "
            StringCounter += countNum[x].toString()[0] + "‎‎‎ " + countNum[x].toString()[1] 
    }
        else if(countNum[x].toString().length === 1 && countNum[x].toString() !== "0"){ StringCounter += specialSpace + space + "0 0 "
            StringCounter += countNum[x].toString()[0] + "‎‎‎ "
    }
        else if(countNum[x].toString() === "0") {StringCounter += specialSpace + space + "0 0 0 "

    } else if(countNum[x].toString().length === 3)  StringCounter += specialSpace + space + countNum[x].toString()[0] + "‎‎‎ " + countNum[x].toString()[1] + " " + countNum[x].toString()[2]
}

    counterText.innerHTML = StringCounter;
}

heart.addEventListener("click", ()=> {
   count(number)
})


function checkMessage(text, check) {
    if(check === false) {
        message.innerHTML += text;
        console.log(check);
         return true;
    }
}

function addUpgrade(upgrade) {
 var node = d.createElement("DIV");
 node.id = upgrade[7];
 node.classList.add("upgrade");

 node.innerHTML = '<p class="upgradeName">'+ upgrade[8] 
 +'</p><p class="upgradeDesc">'+ upgrade[9]
 +'</p><p class="upgradeCost">Cost:' + upgrade[1] 
 +'</p><p class="upgradeNum">' + upgrade[2] + '</p>'

 leftPane.appendChild(node)
}

function updateData() {
    for(x in data.upgrade) {
        data.upgrade[x][3].innerHTML = "Cost: " + data.upgrade[x][1]
        data.upgrade[x][4].innerHTML = data.upgrade[x][2]
    }
}

function buyUpdate() {}

function checkUpgradeCost() {
    for(x in data.upgrade) {

    if(data.counter>=data.upgrade[x][1]) {
        data.upgrade[x][4].style.color="#000"
        data.upgrade[x][5].style.borderColor = "white"
        data.upgrade[x][5].classList.add("active");
    } else {
        data.upgrade[x][4].style.color="#888"
        data.upgrade[x][5].style.borderColor = "black"
        data.upgrade[x][5].classList.remove("active");
    }
}
}


for(x in data.upgrade) {
    data.upgrade[x][5].addEventListener("click", ()=> {
        if(data.counter > data.upgrade[x][1]) {

            data.upgrade[x][2]++
            data.upgrade[x][0] += 1
            data.counter -= data.upgrade[x][1]
            data.upgrade[x][1] += data.upgrade[x][6]
        }
    })
}




let decayTick = 200
let tick = 100;
let bloodTick = 500;
let frame = 0;

setInterval(()=>{
if(data.counter > 0) count(-1)
}, decayTick)

setInterval(()=>{
frame++

switch (data.counter) {
    case 10:
    messageChecker[0] = checkMessage("Energy received", messageChecker[0]);
    break;
    case 20:
    messageChecker[0] = checkMessage("Energy received", messageChecker[0]);

    default:break;
}

checkUpgradeCost();

message.scrollTop = message.scrollHeight;
title.innerHTML = Math.floor(data.counter) + " - IdleBot"


updateData();
}, tick)


for(x in data.upgrade) {
setInterval(()=>{
    count(data.upgrade[x][0])
}, data.upgrade[x][10])
}