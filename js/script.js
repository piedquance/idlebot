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
var rightPane = d.getElementById("right")
var rightChildren = 0;

var save = d.getElementById("save")
var load = d.getElementById("load")
var clear = d.getElementById("clear")
var autosave = d.getElementById("autosave")
var importS = d.getElementById("import")
var exportS = d.getElementById("export")
var exportedUpgrade = []
var exportedSpecial = []
var intervals = []
var decayIntervals = []
var messagePresets = [
    ["Energy received x10", 10],
    ["Energy received x20", 20],
    ["Energy received x100 - Imcoming transmission...", 100]
]

//cost, increase rate, number of, reference, description, tick, data position, decay rate
var upgradePresets = [
    [10, 5, 0, "Blood Valve", "blood", "Pumps blood every 1 s<br>Decays every 10 s", 10, 0, 10],
    [20, 7, 0, "Blood Pipe", "pipe", "Pipes blood every 0.5 s<br>Decays every 20 s", 5, 1, 20],
]

var specialPresets = [
    [50, "SAVING", "Allows you to save.", 0, ()=>{
        d.getElementById("saving").style.display = "initial"
        autosavetoggle = true;
        }, 25, "saving"],

    [50, "Research Blood Valves", "", 1, ()=>{
        data.upgrade[0][5].style.display = ""
    }, 40, "bloodvalves"]

]

function removeSpecials() {
    d.getElementById("saving").style.display = "none"
    data.upgrade[0][5].style.display = "none"
    autosavetoggle = false;
}

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
    upgrade: new Array(),
    special: new Array(),
    messageChecker: new Array(1000),
    adventureLog: new Array(),
}


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

   

 var node = d.createElement("DIV");
 node.id = reference + "Upgrade";
 node.classList.add("tile");

 node.innerHTML = '<div class="generalDesc"><p class="Name">'+ name 
 +'</p><p class="Desc">'+ description
 +'</p><p class="Cost" id="'+ reference +'UpgradeCost">Cost:' + cost
 +'</p></div> <div class="generalNum"><p class="Num" id="'+ reference +'UpgradeNum">' + number + '</p></div>'

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
        //console.log(data.upgrade[dataPosition][0])
        data.upgrade[dataPosition][1] -= data.upgrade[dataPosition][6]
        }
    }}, decayRate * 1000)

        data.upgrade[dataPosition][5].addEventListener("click", ()=> {
            if(data.counter > data.upgrade[dataPosition][1]) {
    
                data.upgrade[dataPosition][2]++
                data.upgrade[dataPosition][0]++
                data.counter -= data.upgrade[dataPosition][1]
                data.upgrade[dataPosition][1] += data.upgrade[dataPosition][6]

                clearInterval(decayIntervals[dataPosition])

                decayIntervals[dataPosition] = setInterval(()=>{
                    if(data.upgrade[preset[7]] !== null && data.upgrade[preset[7]] !== undefined) {
                    if( data.upgrade[preset[7]][2] > 0) {
                    data.upgrade[dataPosition][2]--
                    data.upgrade[dataPosition][0]--
                    //console.log(data.upgrade[dataPosition][0])
                    data.upgrade[dataPosition][1] -= data.upgrade[dataPosition][6]
                    }
                }}, decayRate * 1000)
                
            }
        })

    data.upgrade[dataPosition][13] = true
    data.upgrade[dataPosition][5].style.display = "none"
}

addUpgrade(upgradePresets[0])
addUpgrade(upgradePresets[1])
//data.upgrade[0][5].style.display = ""
//////

function addSpecial(preset) {
 rightChildren++
 let cost = preset[0]
 let name = preset[1]
 let reference = preset[6]
 let description = preset[2]
 let position = preset[3]

    var node = d.createElement("DIV");
    node.id = reference + "Special";
    node.classList.add("tile");
   
    node.innerHTML = '<div class="generalDesc"><div class="Name">'+ name +'</div><div class="Desc">'+ description +'</div></div><div class=generalNum><div class="Num" id="'+ reference +'Cost">'+ cost +'</div></div>'

    rightPane.appendChild(node)
    data.special[position] = []
    data.special[position][0] = cost
    data.special[position][1] = d.getElementById(reference + "Special")
    data.special[position][2] = d.getElementById(reference + "Cost")
    data.special[position][3] = position
    data.special[position][4] = false;
    data.special[position][5] = rightChildren - 1
    data.special[position][6] = false;

    //console.log("initiation " + data.special[0][5])
    data.special[position][1].style.display = "none"

    data.special[position][1].addEventListener("click", ()=> {

        if(data.counter > data.special[position][0]) {
            data.counter -= data.special[position][0]
            data.special[position][1].style.display = "none"
            data.special[position][4] = true
        specialPresets[position][4]()
        }
    })
}

addSpecial(specialPresets[0])
addSpecial(specialPresets[1])

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
    if(data.counter>=data.upgrade[x][1]) {
        data.upgrade[x][4].style.color=""
        data.upgrade[x][5].style.borderColor = ""
        data.upgrade[x][5].classList.add("active");
    } else {
        data.upgrade[x][4].style.color="#888"
        data.upgrade[x][5].style.borderColor = "black"
        data.upgrade[x][5].classList.remove("active");
    }
}}}

//////

function checkSpecialCost() {
    for(x in data.special) {
        if(data.special[x] !== null) {
    if(data.counter>=data.special[x][0]) {
        data.special[x][2].style.color=""
        data.special[x][1].style.borderColor = ""
        data.special[x][1].classList.add("active");
    } else {
        data.special[x][2].style.color="#888"
        data.special[x][1].style.borderColor = "black"
        data.special[x][1].classList.remove("active");
    }
}}}

//////

function SAVE() {
    //console.log("before save " + data.special[0][5])
    localStorage.counter = JSON.stringify(data.counter);

    localStorage.right = JSON.stringify(rightChildren);

    for(n in data.upgrade) {
        exportedUpgrade[n] = []
        exportedUpgrade[n][0] = data.upgrade[n][0]
        exportedUpgrade[n][1] = data.upgrade[n][1]
        exportedUpgrade[n][2] = data.upgrade[n][2]
    }

    for(n in data.special) {
        exportedSpecial[n] = []
        exportedSpecial[n][0] = data.special[n][4]
        exportedSpecial[n][1] = data.special[n][5]
        exportedSpecial[n][2] = data.special[n][6]
    }

    localStorage.upgrades = JSON.stringify(exportedUpgrade)

    localStorage.specials = JSON.stringify(exportedSpecial)

    localStorage.adventureLog = JSON.stringify(data.adventureLog)
//console.log("after save " + console.log(data.special[0][5]))
}
//////

function LOAD() {
//console.log("before load " + data.special[0][5])
    data.counter = JSON.parse(localStorage.counter);

    rightChildren = JSON.parse(localStorage.right)

    exportedUpgrade = JSON.parse(localStorage.upgrades)

    exportedSpecial = JSON.parse(localStorage.specials)

    for(n in exportedUpgrade) {
        data.upgrade[n][0] = exportedUpgrade[n][0]
        data.upgrade[n][1] = exportedUpgrade[n][1]
        data.upgrade[n][2] = exportedUpgrade[n][2]
    }

    for(n in data.special) {
       data.special[n][4] = exportedSpecial[n][0]
       data.special[n][5] = exportedSpecial[n][1]
       data.special[n][6] = exportedSpecial[n][2] 
    }

    removeSpecials()

    for(n in data.special) if(data.special[n][4]) {
        specialPresets[n][4]()
        //console.log(n)
        data.special[n][1].style.display = "none"
    } else if (data.special[n][6])
     data.special[n][1].style.display = ""
     else data.special[n][1].style.display = "none"
    

    data.adventureLog = JSON.parse(localStorage.adventureLog)
    
    link(data.adventureLog[data.adventureLog.length - 1])
    //console.log("after load " + data.special[0][5])
}

function CLEAR() {
    localStorage.clear();
    data.counter = 0;
    rightChildren = 0;

    for(n in data.upgrade) {

        data.upgrade[n][0] = 0
        data.upgrade[n][1] = upgradePresets[n][0]
        data.upgrade[n][2] = 0
    }

    for(n in data.special) {
        data.special[n][1].style.display = "none"
        data.special[n][4] = false;
        data.special[n][6] = false;
        data.special[n][5] = 0;
    }

    SAVE()
    LOAD()
    link("home")
}

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
exportS.addEventListener("click", ()=>{ 

    alert("Copy this somewhere safe:\n" + JSON.stringify(localStorage))

})
importS.addEventListener("click", ()=>{ 

    localStorage = JSON.parse(prompt("Please paste your save data here:\n"))
    LOAD()

 })
importS.innerHTML = ""
exportS.innerHTML = ""


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

autosavedelay = true;
setTimeout(()=>{ LOAD(); autosavedelay = false}, 100)

setInterval(()=>{

    count(pipeCount)
    pipeCount = 0

if(autosavetoggle && !autosavedelay) SAVE()
    
frame++

for(n in messagePresets) if(data.counter >= messagePresets[n][1]) data.messageChecker[n] = checkMessage(messagePresets[n][0], data.messageChecker[n], n);

for(n in specialPresets) {
if(data.counter >= specialPresets[n][5] && !data.special[n][4]) {
      data.special[n][1].style.display = ""
      data.special[n][6] = true;
}}
checkUpgradeCost();
checkSpecialCost();

messages.scrollTop = messages.scrollHeight;
title.innerHTML = Math.floor(data.counter) + " - IdleBot"

updateData();
}, tick)

function link(text, back) {
    
    if(Nodes.hasOwnProperty(text)) {

        let array = Nodes[text].split("|")
        let linkarray = []
        for(let n = 1; n < array.length; n++) {
            linkarray[n-1] = array[n].split("~")
        }

        messages.innerHTML = "<p class='messageStrip'>"+ array[0] +"</p>"

        for(n in linkarray) {
            messages.innerHTML += "<br>> <a onclick=link('"+ linkarray[n][1] +"',false)>"+ linkarray[n][0] +"</a>"
        }

        if(back) data.adventureLog.splice(data.adventureLog.length-1, 1)
        else data.adventureLog[data.adventureLog.length] = text


        messages.innerHTML += "<br><br> <a id='back' onclick=link('"+ data.adventureLog[data.adventureLog.length-2] + "',true)>Go Back </a>"
    }

}

let Nodes = {}

function Node(title, text) {
    Nodes[title] = text;
}
//You wake up locked in a deserted jail cell, completely alone. There is nothing at all in your cell, useful or otherwise.
Node("home", "You are in a field. There is nothing around you, useful or otherwise.|Look around~look_around|Get up~get_up")
link("home");

Node("look_around", "Fields as far as the eye can see.|Get up~get_up")

Node("get_up", "You try to get up. You fail.<br>But maybe if you had more power...")