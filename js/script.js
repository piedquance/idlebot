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
var newmessages = d.getElementById("newmessages");
var title = d.querySelector("title")
var leftPane = d.getElementById("left")

var save = d.getElementById("save")
var load = d.getElementById("load")
var clear = d.getElementById("clear")
var autosave = d.getElementById("autosave")
var importS = d.getElementById("import")
var exportS = d.getElementById("export")

var intervals = []
var decayIntervals = []
var messagePresets = [
    "Energy received x10",
    "Energy received x20",
    "Energy received x100 - Imcoming transmission..."
]

//cost, increase rate, number of, reference, description, tick, data position, decay rate
var upgradePresets = [
    [10, 5, 0, "Blood Valve", "valve", "Pumps blood every 1 s<br>Decays every 10 s", 10, 0, 10],
    [20, 7, 0, "Blood Pipe", "pipe", "Pipes blood every 0.5 s<br>Decays every 20 s", 5, 1, 20],
]


// data formatting for upgrades: 
//------------------------------
//name[0]=counter | name[1]=cost | name[2]=number
//name[3]=cost reference | name[4]=number reference
//name[5]=name reference | name[6] = cost increase
//name[7]=string id | name[8]=string name
//name[9]=string description | name[10]=tick
//name[11]=string cost | name[12]=string number
//name[13]=boolean | name[14]=decay rate
//name[15]=plain reference
//
//upgrade[0] = blood
//

let data = {
    counter:0,
    upgrade: new Array(100),
    upgradeInstance: new Array(100),
    messageChecker: new Array(1000)
}


data.upgradeInstance.fill(false);
data.messageChecker.fill(false);

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
    let result = false
    if(check == true) return true;
    else if(check === false) {
        newmessages.innerHTML += '<p class="messageStrip" id="strip'+ num +'" style="animation-name:messageLoad;animation-duration:0.5s">' + text + '</p>';
       setTimeout(()=>{
        d.getElementById("strip" + num).style = "";
       }, 500)
         result =  true;
    }
    
    return result;
}

//////

function addUpgrade(preset) {

    let cost = preset[0]
    let increaseRate = preset[1]
    let number = preset[2]
    let name = preset[3]
    let reference = preset[4]
    let description = preset[5]
    let tick = preset[6]
    let dataPosition = preset[7]
    let decayRate = preset[8]

    if(!data.upgradeInstance[dataPosition]) {

 var node = d.createElement("DIV");
 node.id = reference + "Upgrade";
 node.classList.add("upgrade");

 node.innerHTML = '<div class="generalUpgradeDesc"><p class="upgradeName">'+ name 
 +'</p><p class="upgradeDesc">'+ description
 +'</p><p class="upgradeCost" id="'+ reference +'UpgradeCost">Cost:' + cost
 +'</p></div> <div class="generalUpgradeNum"><p class="upgradeNum" id="'+ reference +'UpgradeNum">' + number + '</p></div>'

 leftPane.appendChild(node)

 data.upgrade[dataPosition] =        [0, cost , number,
    d.getElementById(reference + "UpgradeCost"),
    d.getElementById(reference + "UpgradeNum"),
    d.getElementById(reference + "Upgrade"),
    increaseRate, reference + "Upgrade", name, description, tick,
    reference+ "UpgradeCost", reference+ "UpgradeNum", false, decayRate, reference]

    intervals[dataPosition] = setInterval(()=>{
        if(data.upgrade[preset[7]] !== null && data.upgrade[preset[7]] !== undefined) {
        count(data.upgrade[preset[7]][0])
    }}, tick * 1000)

    decayIntervals[dataPosition] = setInterval(()=>{
        if(data.upgrade[preset[7]] !== null && data.upgrade[preset[7]] !== undefined) {
        if( data.upgrade[preset[7]][2] > 0) {
        data.upgrade[dataPosition][2]--
        data.upgrade[dataPosition][0]--
        data.upgrade[dataPosition][1] -= data.upgrade[dataPosition][6]
        }
    }}, decayRate * 1000)

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
        if(data.upgrade[x] !== null) {
        data.upgrade[x][3].innerHTML = "Cost: " + data.upgrade[x][1]
        data.upgrade[x][4].innerHTML = data.upgrade[x][2]
    }}
}

//////

function checkUpgradeCost() {
    for(x in data.upgrade) {
        if(data.upgrade[x] !== null) {
           // console.log(data.upgrade[x])
    if(data.counter>=data.upgrade[x][1]) {
        data.upgrade[x][4].style.color="#000"
        data.upgrade[x][5].style.borderColor = "white"
        data.upgrade[x][5].classList.add("active");
    } else {
        data.upgrade[x][4].style.color="#888"
        data.upgrade[x][5].style.borderColor = "black"
        data.upgrade[x][5].classList.remove("active");
    }
}}}

//////
localStorage.setItem("counter", 0)
localStorage.setItem("upgrade", new Array(100))
for(x in localStorage.upgrade) x = new Array(20)

localStorage.upgrade = new Array(100)

function SAVE() {

    localStorage.counter = data.counter - 0;

    localStorage.upgrade = JSON.stringify(data.upgrade)

    localStorage.messageChecker = JSON.stringify(data.messageChecker)

}
//////

function LOAD() {

    data.counter = localStorage.counter - 0;
    
    try {
        data.upgrade = JSON.parse(localStorage.upgrade)
    } catch (error) {
        
    } 

    data.messageChecker = JSON.parse(localStorage.messageChecker)

    fixData()
}

//////

function fixData() {
leftPane.innerHTML = ""
newmessages.innerHTML = ""


if(data.counter !== 0) {
for(n in intervals) clearInterval(intervals.n)
for(n in decayIntervals) clearInterval(decayIntervals.n)

    for(let x = 0; data.messageChecker[x] === true; x++) {
        checkMessage(messagePresets[x], false, x);
    }
}



    for(let n = 0; n < data.upgrade.length;n++) {
        if(data.upgrade[n] !== null && data.upgrade[n] !== undefined) {
        if(typeof data.upgrade[n][0] === "number") {

            var node = d.createElement("DIV");
            node.id = data.upgrade[n][15] + "Upgrade";
            node.classList.add("upgrade");
           
            node.innerHTML = '<div class="generalUpgradeDesc"><p class="upgradeName">'+ data.upgrade[n][8] 
            +'</p><p class="upgradeDesc">'+ data.upgrade[n][9]
            +'</p><p class="upgradeCost" id="'+ data.upgrade[n][15] +'UpgradeCost">Cost:' + data.upgrade[n][1]
            +'</p></div> <div class="generalUpgradeNum"><p class="upgradeNum" id="'+ data.upgrade[n][15] +'UpgradeNum">' + data.upgrade[n][2] + '</p></div>'

            leftPane.appendChild(node)

            data.upgrade[n][3] = d.getElementById(data.upgrade[n][15] + "UpgradeCost")

            data.upgrade[n][4] = d.getElementById(data.upgrade[n][15] + "UpgradeNum")

            data.upgrade[n][5] = d.getElementById(data.upgrade[n][15] + "Upgrade")

            data.upgrade[n][5].addEventListener("click", ()=> {
                if(data.upgrade[n] !== null) {
                if(data.counter > data.upgrade[n][1]) {
        
                    data.upgrade[n][2]++
                    data.upgrade[n][0]++
                    data.counter -= data.upgrade[n][1]
                    data.upgrade[n][1] += data.upgrade[n][6]
                } 
            }
            })

            intervals[n] = setInterval(() => { 
                
              if(data.upgrade[n] !== undefined && data.upgrade[n] !== null)  count(data.upgrade[n][0]) 
            
            }, data.upgrade[n][10]);

            decayIntervals[n] = setInterval(()=>{
                if(data.upgrade[n] !== null && data.upgrade[n] !== undefined) {
                if( data.upgrade[n][2] > 0) {
                data.upgrade[n][2]--
                data.upgrade[n][0]--
                data.upgrade[n][1] -= data.upgrade[n][6]
                }
            }}, data.upgrade[n][14] * 1000)
        }}
    }
}

//////

function CLEAR() {

localStorage.setItem("counter", 0)
localStorage.setItem("upgrade", JSON.stringify(new Array(100)))
//for(x in localStorage.upgrade) x = new Array(20)

localStorage.upgrade = JSON.stringify(new Array(100))




data.counter = 0;
data.upgrade = new Array(100)
data.upgradeInstance = new Array(100)
data.upgradeInstance.fill(false)

for(n in data.upgrade) n = new Array(100)

data.messageChecker= new Array(1000)
data.messageChecker.fill(false)

data.upgradeInstances

leftPane.innerHTML = ""
newmessages.innerHTML = ""
counterText.innerHTML = "0 0 0 0 0 0  0 0 0"
//LOAD()
// leftPane.innerHTML = ""
// newmessages.innerHTML = ""
// counterText.innerHTML = "0 0 0 0 0 0  0 0 0"
// console.log(data.messageChecker)
}

//////

let autosavetoggle = false;
autosave.addEventListener("click", ()=>{
    autosavetoggle = !autosavetoggle
    
    switch (autosavetoggle) {
        case true:
        autosave.innerHTML = "AUTOSAVE <span id='on'>ON</span>"
        break;
        case false:
        autosave.innerHTML = "AUTOSAVE <span id='off'>OFF</span>"
        break;
    }

})

save.addEventListener("click", ()=>{ SAVE() })
load.addEventListener("click", ()=>{ LOAD() })
clear.addEventListener("click", ()=>{ CLEAR() })

//////
let pipeCount = 0;
heart.addEventListener("click", ()=> {

    pipeCount++
    // heart.style = "  animation-name: click;animation-duration: 0.1s;"
    // setTimeout(()=>{ heart.style="" },100)
 })

//////

let decayTick = 800
let tick = 10;
let bloodTick = 500;
let frame = 0;

setInterval(()=>{
if(data.counter > 0) count(0)
}, decayTick)



setInterval(()=>{

    count(pipeCount)
    pipeCount = 0

if(autosavetoggle) SAVE()
    
frame++

switch (data.counter) {
    case 10:
    data.messageChecker[0] = checkMessage(messagePresets[0], data.messageChecker[0], 0);
    break;

    case 20:
    data.messageChecker[1] = checkMessage(messagePresets[1], data.messageChecker[1], 1);
    break;

    case 100:
    data.messageChecker[1] = checkMessage(messagePresets[2], data.messageChecker[1], 1);
    break;


    default:break;
}

checkUpgradeCost();

messages.scrollTop = messages.scrollHeight;
title.innerHTML = Math.floor(data.counter) + " - IdleBot"

updateData();
}, tick)



function node(text) {

    console.log("click")

    if(Nodes.hasOwnProperty(text)) {

        let array = Nodes[text].split("|")
        let linkarray = []
        for(let n = 1; n < array.length; n++) {
            linkarray[n-1] = array[n].split("~")
        }
        console.log(linkarray)

        messages.innerHTML = "<p class='messageStrip'>"+ array[0] +"</p>"

        for(n in linkarray) {
            messages.innerHTML += "<br>> <a onclick=node('"+ linkarray[n][1] +"')>"+ linkarray[n][0] +"</a>"
        }
    }
}


let Nodes = {

}

function Node(title, text) {
    this.text = text;
    Nodes[title] = text;
}

Node("look_around", "Fields as far as the eye can see.|Get up~get_up")

Node("get_up", "You try to get up. You fail.<br>But maybe if you had more power...")