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
var messages = d.getElementById("messages");
var title = d.querySelector("title")
var leftPane = d.getElementById("left")


// data formatting for upgrades: 
//------------------------------
//name[0]=counter | name[1]=cost | name[2]=number
//name[3]=cost reference | name[4]=number reference
//name[5]=name reference | name[6] = cost increase
//name[7]=string id | name[8]=string name
//name[9]=string description | name[10]=tick
//name[11]=string cost | name[12]=string number
//name[13]=boolean | name[14]=decay rate
//
//upgrade[0] = blood
//

let data = {
    counter:0,
    upgrade: [],
    upgradeInstance : new Array(100)
}


var messageChecker = new Array(1000);
data.upgradeInstance.fill(false);
messageChecker.fill(false);

//////

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
//////

function checkMessage(text, check, num) {
    if(check === false) {
        messages.innerHTML += '<p class="messageStrip" id="strip'+ num +'" style="animation-name:messageLoad;animation-duration:0.5s">' + text + '</p>';
       setTimeout(()=>{
        d.getElementById("strip" + num).style = "";
       }, 500)
         return true;
    }
}

//////

function addUpgrade(cost, increaseRate, number, name, reference, description, tick, dataPosition, decayRate) {

    if(!data.upgradeInstance[dataPosition]) {

 var node = d.createElement("DIV");
 node.id = reference + "Upgrade";
 node.classList.add("upgrade");
 //node.classList.add("active");

 node.innerHTML = '<div class="generalUpgradeDesc"><p class="upgradeName">'+ name 
 +'</p><p class="upgradeDesc">'+ description
 +'</p><p class="upgradeCost" id="'+ reference +'UpgradeCost">Cost:' + cost
 +'</p></div> <div class="generalUpgradeNum"><p class="upgradeNum" id="'+ reference +'UpgradeNum">' + number + '</p></div>'

 leftPane.appendChild(node)

 data.upgrade[dataPosition] =        [0, cost , number,
    d.getElementById(reference + "UpgradeCost"),
    d.getElementById(reference + "UpgradeNum"),
    d.getElementById(reference + "Upgrade"),
    increaseRate, reference + "Upgrade", "Pipe Valve", "Pipes blood every 1s", tick,
    reference+ "UpgradeCost", reference+ "UpgradeNum", false, decayRate]

    setInterval(()=>{
        count(data.upgrade[dataPosition][0])
    }, data.upgrade[dataPosition][10])

    setInterval(()=>{
        if( data.upgrade[dataPosition][2] > 0)
        data.upgrade[dataPosition][2]--
        data.upgrade[dataPosition][0]--
        data.upgrade[dataPosition][1] -= data.upgrade[dataPosition][6]
    }, decayRate * 1000)

        data.upgrade[dataPosition][5].addEventListener("click", ()=> {
            if(data.counter > data.upgrade[dataPosition][1]) {
    
                data.upgrade[dataPosition][2]++
                data.upgrade[dataPosition][0]++
                data.counter -= data.upgrade[dataPosition][1]
                data.upgrade[dataPosition][1] += data.upgrade[dataPosition][6]
            }
        })


    data.upgrade[dataPosition][13] = true
    data.upgradeInstance[dataPosition] = true
}}

//////

function updateData() {
    for(x in data.upgrade) {
        data.upgrade[x][3].innerHTML = "Cost: " + data.upgrade[x][1]
        data.upgrade[x][4].innerHTML = data.upgrade[x][2]
    }
}

//////

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
}}

//////

heart.addEventListener("click", ()=> {
    count(number)
 })

//////

let decayTick = 800
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
    messageChecker[0] = checkMessage("Energy received x10 - Blood Valve acquired", messageChecker[0], 0);
    addUpgrade(10, 5, 0, "Blood Valve", "valve", "Pumps blood every 1 s<br>Decays every 5 s", 1000, 0, 5);
    break;
    case 20:
    messageChecker[1] = checkMessage("Energy received x20 - Blood Pipe acquired", messageChecker[1], 1);
    addUpgrade(20, 10, 0, "Blood Pipe", "pipe", "Pipes blood every 0.5 s<br>Decays every 10 s", 500, 1, 10);
    default:break;
}

checkUpgradeCost();

messages.scrollTop = messages.scrollHeight;
title.innerHTML = Math.floor(data.counter) + " - IdleBot"

updateData();
}, tick)


