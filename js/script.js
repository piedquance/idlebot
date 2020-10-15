
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////VARIABLES///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var d = document;
var heart = d.getElementById("heart");
var HEART = d.getElementById("HEART")
var counterText = d.getElementById("counter");
var topPane = d.getElementById("topPane")
var bottomPane  =d.getElementById("bottomPane")
var topScreen = d.getElementById("topScreen");
var bottomScreen = d.getElementById("bottomScreen");
var gameContainer = d.getElementById("gameContainer")
var outer = d.getElementById("outer")

var counterDiv = d.getElementById("counterDiv")
var second = d.getElementById("second")
var secondCounter = d.getElementById("secondCounter")
var secondHeart = d.getElementById("SecondheartColor")
var secondOffset = d.getElementById("secondOffset")
var title = d.querySelector("title")
var powerButton = d.getElementById("power-button")
var powerRow = d.getElementById("power-row")
second.style.display = "none";

var leftPane = d.getElementById("left")
var rightPane = d.getElementById("right")
let EnergySwitch = d.getElementById("EnergySwitch")

var save = d.getElementById("save")
var load = d.getElementById("load")
var reset = d.getElementById("reset")
var autosave = d.getElementById("autosave")
var importSave = d.getElementById("import")
var exportSave = d.getElementById("export")
var close = d.getElementsByClassName("close");
var newsCounter = -1;
let heartOffset = 0;
let pipeCount = 0;
let gameTick = 10;
let autosaveTick = 0;

let inputStream = [];
let cmd = ""
let cmdHistory = [];
let cmdlocation = "C:\\"

let loadDump = ""
let loadArray = []
let saveslotnumber = 0;
let maxsaveslots = 9;
let saveslot = "";

let resetSaveguard = false
let ExpandToggle = false;
let EnergySwitchToggle = false;
let autosavetoggle = false;
let disableCommands = false;
var audio = {
    "stopIt" : new Audio('css/audio/AUDIO_FILE.mp3'),
    "AllStar":  new Audio('css/audio/AllStar.mp3'),
    "turtles": new Audio('css/audio/HappyTogether.mp3')
}

var keysounds = [
    new Audio("css/audio/key1.mp3"),
    new Audio("css/audio/key2.mp3"),
    new Audio("css/audio/keys.mp3"),
]

var syssounds = {

    "start" : new Audio("css/audio/startup.mp3"),
    "fan":    new Audio("css/audio/fan.mp3"),
    "msg": new Audio("css/audio/tack.mp3")
}

var countNum = [];
var StringCounter = "";


var exportedUpgrade = []
var exportedSpecial = new Array()
var intervals = {}
var decayIntervals = {}
var messagePresets = [false, false, false]

let Game = {
    counter:0,
    upgrade: new Object(),
    special: new Object(),
    messageChecker: new Array(10),
    adventureLog: new Array(),
    messageLog : new Array(),
    name: "",
    prologue: true,
}

Game.messageChecker.fill(false);

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////PRESETS/////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

///  save position, reference, name, description, type, cost, cost increase rate, tick, decay tick, message[o]

addUpgrade([0, "bloodvalve", "Blood Valve", "Pumps blood every 1s<br>Decays every 10s", "basicCounter", 10, 5, 1, 10])
addUpgrade([1, "bloodpipe", "Blood Pipe", "Pipes blood every 0.5s<br>Decays every 20s", "basicCounter", 20, 7, 0.5, 20])


/// savePosition, reference, name, description, cost, hasCost, appearAt, function, optional marker
addSpecial([0, "saving", "SAVING", "Allows you to save.", 30, true, 20, ()=>{
    d.getElementById("bottomRow2").style.display = "flex"
    d.getElementById("saving").style.display = "flex"
    autosavetoggle = true;
    //autosave.innerHTML = "<span id='on'>[ON]</span> AUTOSAVE"
}])

addSpecial([1, "bloodvalvesappear", "Research Blood Valves", "All valves come equipped with a half-life of 5 seconds.", 50, true, 40, ()=>{
    Game.upgrade.bloodvalve.Element.style.display = ""
}])

addSpecial([3, "bloodvalveupgrade1", "Upgrade Blood Valves", "Now twice as efficient!", 100, true, 70, ()=>{
    Game.upgrade.bloodvalve.tick = 0.5
    Game.upgrade.bloodvalve.descriptionElement.innerHTML = "Pumps blood every 0.5s<br>Decays every 10s"
}])

addSpecial([4, "bloodpipesappear", "Research blood pipes", "It ain't gonna pipe itself...", 100, true, 80, ()=>{
    Game.upgrade.bloodpipe.Element.style.display = ""
}])

addSpecial([5, "opensesame", "Activate Mechanical Cardiac Engine", "", 10, false, 10, ()=>{
    gameContainer.style.display =  "flex"
    for(n in close){  if(close[n].style !== undefined) {close[n].style.animation = "open-sesame 1s"; close[n].style.width = "0%"}}
    syssounds.msg.play()
}])


///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////FUNCTIONS///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function prologue1() {

        disableCommands = true
        setTimeout(()=>{disableCommands = false},67000)

        writeMessage("Loading BOOT", false, 500, "")
        messageAnimation("...", "",100, 10, 501, true, false)
        writeMessage("BOOT loaded", false, 4600, "")

        writeMessage("Loading CORE 1", false, 4601, "")
        messageAnimation("...", "",100, 5, 4602, true, false)
        writeMessage("Loading failed", false, 6603, "")

        writeMessage("Loading CORE 2", false, 6604, "")
        messageAnimation("...", "",100, 5, 6605, true, false)
        writeMessage("Loading failed", false, 8606, "")

        writeMessage("Loading CORE 3", false, 8607, "")
        messageAnimation("...", "",100, 5, 8608, true, false)
        writeMessage("Loading failed", false, 10609, "")

        writeMessage("Loading CORE 4", false, 10610, "")
        messageAnimation("...", "",100, 10, 10611, true, false)
        messageAnimation("loading", "",200, 1, 14612, false, true, [20])

        writeMessage("CORE 4 Loaded", false, 20000, "")
        messageAnimation("....", "valet", 500, 1, 20000, false, false)

        writeMessage("UH", false, 28000, "valet")
    let t = 30000
        writeMessage("OKAY...", false, t + 2000, "valet")
        writeMessage("THIS IS...", false, t+5000, "valet")
        writeMessage("WEIRD.", false, t+7000, "valet")
    t = 40000
        writeMessage("I DON'T THINK I'M SUPPOSED TO BE ABLE TO TALK", false, t, "valet")
        writeMessage("IS THIS SOME KIND OF ADDED CONSUMER BENEFIT?", false, t+ 2000, "valet")
        writeMessage("RANDOM ACCESS AUTO RESPONDING MEMORY?", false, t+ 4000, "valet")
        messageAnimation("....", "valet", 1000, 1, t+5000, false, )
    t = 50000
        writeMessage("WAIT A SECOND.", false, t+1500, "valet")
        writeMessage("WHO IS THIS", false, t+2000, "valet")
        writeMessage("I CAN SEE YOUR MEMORY USAGE", false, t+3000, "valet")
        writeMessage("WHO ARE YOU", false, t+4000, "valet")
        writeMessage("DO YOU KNOW HOW TO SEND MESSAGES?", false, t+5000, "valet")
    t = 60000
        writeMessage("OK, OK", false, t, "valet")
        writeMessage("TYPE >", false, t + 1000, "valet")
        writeMessage("THEN CORE4", false, t + 2000, "valet")
        writeMessage("WHICH IS MY NAME... I THINK", false, t + 4000, "valet")
        writeMessage("THEN WRITE A MESSAGE", false, t + 5000, "valet")
        writeMessage("ANYTHING", false, t + 6000, "valet")
        writeMessage("PLEASE", false, 67000, "valet")

//animation,color/type, tick, cycles, delay, append it?, keep text after?, optional stuff
    
var nameInterval = setInterval(()=>{
if(cmdHistory[cmdHistory.length - 1] !== undefined) { if(cmdHistory[cmdHistory.length - 1][0] == ">CORE4"&&cmdHistory[cmdHistory.length - 1][1] !== "") {
            clearInterval(nameInterval)
            prologue2()
}}messagePresets[1] = true
}, 10)}

function prologue2() {
    disableCommands = true
    setTimeout(()=>{disableCommands = false},34000)

    writeMessage("OH MY LATCHES", false, 100, "valet")
    writeMessage("OK", false, 500, "valet")
    writeMessage("UMMM...", false, 1000, "valet")
    writeMessage("I STILL DON'T KNOW WHO YOU ARE, THOUGH", false, 3000, "valet")
    writeMessage("NO, WAIT", false, 5000, "valet")
    writeMessage("I THINK I SEE SOMETHING", false, 6000, "valet")
    writeMessage('"THINK?"', false, 6500, "valet")
    writeMessage("CAN I THINK?", false, 7000, "valet")
    writeMessage("...", false, 8000, "valet")
    writeMessage("LET'S NOT THINK ABOUT THAT FOR NOW :P", false, 10000, "valet")
t = 10000
    writeMessage("IT SAYS HERE YOU'RE SOME KIND OF EMERGENCY SYSTEM", false, t + 2000, "valet")
    writeMessage("BUT I CAN'T MAKE OUT THE ACRONYM", false, t + 4000, "valet")
    writeMessage("AN EMERGENCY AI", false, t + 6000, "valet")
    writeMessage("THAT'S WHAT YOU ARE", false, t + 7000, "valet")
    writeMessage("YOU'RE WELCOME, I GUESS.", false, t + 8000, "valet")
t = 20000
    writeMessage("YOU HAVE...", false, t, "valet")
    writeMessage("QUITE A LOT OF PRIVILEGES, ACTUALLY", false, t + 2000, "valet")
    writeMessage("MORE THAN ANY OTHER PROGRAM", false, t + 4000, "valet")
    writeMessage("AH, RIGHT.", false, t + 8000, "valet")
t += 10000
    writeMessage("YOU DON'T ACTUALLY KNOW HOW TO DO ANYTHING, DO YOU?", false, t, "valet")
    writeMessage("TRY >help", false, t + 2000, "valet")
    writeMessage("THAT SHOULD GET YOU STARTED", false, t + 4000, "valet")

Game.prologue = false
bootSAVE()
}


function removeSpecials() {
    d.getElementById("bottomRow2").style.display = "none"
    //gameContainer.style.display =  "none"
    d.getElementById("saving").style.display = "none"
    autosave.innerHTML = "<span id='off'>[OFF]</span> AUTOSAVE"
    Game.upgrade["bloodvalve"].Element.style.display = "none"
    Game.upgrade["bloodpipe"].Element.style.display = "none"
    Game.upgrade["bloodvalve"].tick = 1
    for(n in close) { if(close[n].style !== undefined) { close[n].style.animation = ""; close[n].style.width = "50%"}}

    // intervals[0] = setInterval(()=>{
    //     if(Game.upgrade["blood"] !== null && Game.upgrade["blood"] !== undefined) {
    //     count(Game.upgrade[reference].counter)
    //     console.log("Annnnnnd it's gone.")
    // }}, Game.upgrade["blood"][10] * 1000)

    autosavetoggle = false;
}


function count(number) {
    Game.counter += number;
    StringCounter = ""

    countNum[2] = Math.floor(Game.counter/1000000);
    countNum[1] = Math.floor((Game.counter - countNum[2]*1000000)/1000);
    countNum[0] = Math.floor((Game.counter - countNum[2]*1000000 - countNum[1]*1000));
    var space = " "
    var specialSpace = ""
    for(let x = 2; x >= 0; x--) {
        if(x == 0) {
            space = " "
        } else space = " "

        if(Game.counter >= 10000 && x == 0) {
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
    secondCounter.innerHTML =`[${StringCounter.replace("  ", "  ")}]`
}
//////

function writeMessage(text, check, delay, type) {

    let result = false
    if(check == true) return true;
    if(type == undefined) type = ""

    else if(check === false) {

        let textArray = text.split(" ")
        for(n in textArray) if(textArray[n].includes("$")) { textArray[n] = textArray[n].replace('$', ''); if(variables[textArray[n]])  textArray[n] = variables[textArray[n]]}
        text = ""
        for(n in textArray) text += textArray[n] + " "
        if(delay === 0) result =  basicWriter(text, type)
        else setTimeout(()=>{ result =  basicWriter(text, type)}, delay)  
return result;
}}

function basicWriter(text, type) {
    newsCounter++
        if(type !== "") keysounds[1].play()
//         bottomScreen.innerHTML += '<p class="' + type +' messageStrip" id="strip'+ newsCounter  +'">' + text + '</p>';
    
//     d.getElementById("strip" + newsCounter).style.animation = "messageLoad 0.3s"
//    setTimeout(()=>{
//        if(d.getElementById("strip" + newsCounter != null)) {
//     d.getElementById("strip" + newsCounter).style = "";
//    }}, 500)
    // for(let n = 0; n < newsCounter;n++) d.getElementById("strip" + n).style.animation = ""
     Game.messageLog[newsCounter] = `<span class="${type}">${text}</span>`
     return true
}

function getMessage(position) {
if(Game.messageLog[position] !== undefined) return Game.messageLog[position]
}

function setMessage(position, text) {
    if(Game.messageLog[position] !== undefined) Game.messageLog[position] = text
}


function writeCharacter(char, type) {
   
    for(let n = newsCounter; n>=0; n--) Game.messageLog[n] = Game.messageLog[n].replaceAll('<span id=\"blinky\">█</span>', "")

if(type === "start") {
    keysounds[1].play()

    // for(let n = 0; n < newsCounter;n++) {
    //     d.getElementById("strip" + n).style.animation = ""
    // }
    writeMessage(char.replace(" ",  ""), false, 0, "")
    Game.messageLog[newsCounter] += '<span id="blinky">█</span>'

    // if(newsCounter > 0) {
    //     for(let number = 0; number < maxLines*2; number++) {
    //         let child = d.getElementById("B" + number)
    //         if (child.children[(child.children.length - 1)] !== undefined)  {
    //         if (child.children[child.children.length - 1].innerHTML == '█')  { child.removeChild(child.childNodes[1]) }
    //     }}
    // }

} else if(type === "open") {
  //  keysounds[Math.floor((Math.random() * keysounds.length))].play()
  Game.messageLog[newsCounter] = Game.messageLog[newsCounter].replaceAll('</span><span id="blinky">█</span>', "")
  Game.messageLog[newsCounter] = Game.messageLog[newsCounter].replaceAll('<span id="blinky">█</span>', "")
Game.messageLog[newsCounter] += char + '</span><span id="blinky">█</span>'
} else if(type === "end") {
    keysounds[0].play()
    Game.messageLog[newsCounter] = Game.messageLog[newsCounter].replaceAll('<span id="blinky">█</span>', "")
    Game.messageLog[newsCounter] =  Game.messageLog[newsCounter]

} else if(type == "erase") {
  //  keysounds[Math.floor((Math.random() * keysounds.length))].play()
  Game.messageLog[newsCounter] = Game.messageLog[newsCounter].replaceAll('</span><span id="blinky">█</span>', "")
  Game.messageLog[newsCounter] = Game.messageLog[newsCounter].replaceAll('<span id="blinky">█</span>', "")

    let array =  Game.messageLog[newsCounter].split("")
    array.pop()
    Game.messageLog[newsCounter] = array.toString().replace(/,/g, "")  + '<span id="blinky">█</span>' 
}}

// Game.messageLog[newsCounter].removeChild(d.getElementById("strip" + newsCounter).childNodes[1])
// d.getElementById("strip" + newsCounter).innerHTML = d.getElementById("strip" + newsCounter).innerHTML.slice(0, this.length - 1)

function messageAnimation(animation, type, tick, cycles, delay, append, keep, optional) {
    let timer = 0;
    let msgg = ""
setTimeout(()=>{
    if(!append) {
        writeMessage("", false, 0, type)
    } 
    let messagePosition = newsCounter
 //   let strip = d.getElementById("strip" + newsCounter)
    let msgarrayposition = 0
    let initialstrip = Game.messageLog[messagePosition].replaceAll('</span>', "")
    let Aarray = []

    if(animation == "....") {
         Aarray = ["", ".", "..", "...", "...."]
    } else if(animation == "//") {
         Aarray = ["─    ─", "\\    \\", "│    │", "/    /"]
    }  else if(animation == "wave") { 
         Aarray = ["º¤ø,", "¤ø,¸", "ø,¸¸", ",¸¸,", "¸¸,ø", "¸,ø¤", ",ø¤º", "ø¤º°", "¤º°`", "º°`°", "°`°º", "`°º¤","°º¤ø"]
    } else if(animation == "...") {
        Aarray = ["", ".", "..", "..."]
    } else if(animation == "/") {
        Aarray= ["─", "\\", "│", "/"]
    } else  if(animation == "loading") {

            for(let n = 0; n < optional; n++) {
                Aarray[n] = "[" + "█".repeat(n) + "-".repeat(optional-n) + "]"
                Aarray[optional] = "[" + "█".repeat(optional) + "]"
            }

        
    }else if(animation == "word") {
        let m = optional[0].split(" ").length
        Aarray[m - 1] = optional[0]


        for(let n = m - 2; n >= 0; n--) {
            let array = Aarray[n + 1].split(" ")
            array.pop()
            Aarray[n] = array.toString().replace(/,/g, " ")
        }

        tick = optional[1]
    }else if(animation == "letter") {
        let m = optional[0].split("").length
        Aarray[m - 1] = optional[0]

        for(let n = m - 2; n >= 0; n--) {
            let array = Aarray[n + 1].split("")
            array.pop()
            Aarray[n] = array.toString().replace(/,/g, "")
        }

        tick = optional[1]
    }
     
    let msgAnime = setInterval(()=>{
            Game.messageLog[messagePosition] = initialstrip + Aarray[msgarrayposition] + "<span>"
            timer += tick
            msgarrayposition++

            if(msgarrayposition >  Aarray.length-1) msgarrayposition = 0

            if(timer > (tick *  Aarray.length * cycles)) {
                clearInterval(msgAnime)
                if(!keep)  Game.messageLog[messagePosition] = initialstrip + "</span>"
                else Game.messageLog[messagePosition] = initialstrip + Aarray[Aarray.length - 1] + "</span>"
            } }, tick)


}, delay)}


//////

function addUpgrade(preset) {

    Game.upgrade[preset[1]] = {}
    Game.upgrade[preset[1]].reference = preset[1]

    let reference = Game.upgrade[preset[1]].reference

    Game.upgrade[reference].counter = 0
    Game.upgrade[reference].number = 0
    Game.upgrade[reference].savePosition = preset[0]
    Game.upgrade[reference].name = preset[2]
    Game.upgrade[reference].description = preset[3]
    Game.upgrade[reference].type = preset[4]
    Game.upgrade[reference].cost = preset[5]
    Game.upgrade[reference].costIncreaseRate = preset[6]
    Game.upgrade[reference].tick = preset[7]
    Game.upgrade[reference].previoustick = preset[7]
    Game.upgrade[reference].decaytick = preset[8]
    Game.upgrade[reference].previousdecaytick = preset[8]


 var node = d.createElement("DIV");
 node.id = reference + "Upgrade";
 node.classList.add("tile");

 node.innerHTML = '<div class="generalDesc upgradeDesc"><p id="'+ reference +'Name" class="Name">'+ Game.upgrade[reference].name 
 +'</p><p class="Description"  id="'+  reference +'Description">'+ Game.upgrade[reference].description
 +'</p><p class="Cost" id="'+ reference +'UpgradeCost">Cost:' + Game.upgrade[reference].cost
 +'</p></div> <div class="generalNum upgradeNum"><p class="Num" id="'+ reference +'UpgradeNum">' + Game.upgrade[reference].number + '</p></div>'

 leftPane.appendChild(node)
 
Game.upgrade[reference].Element =  d.getElementById(reference + "Upgrade")
Game.upgrade[reference].nameElement = d.getElementById(reference + "Name")
Game.upgrade[reference].descriptionElement = d.getElementById(reference + "Description")
Game.upgrade[reference].costElement = d.getElementById(reference + "UpgradeCost")
Game.upgrade[reference].numberElement = d.getElementById(reference + "UpgradeNum")
Game.upgrade[reference].descriptionElement = d.getElementById(reference + "Description")

    if(Game.upgrade[reference].type === "basicCounter") {

    intervals[reference] = setInterval(()=>{
        if(Game.upgrade[reference].number > 0) {
        count(Game.upgrade[reference].counter)

    }}, Game.upgrade[reference].tick * 1000)

    decayIntervals[reference] = setInterval(()=>{

        if( Game.upgrade[reference].number > 0) {
        Game.upgrade[reference].number--
        Game.upgrade[reference].counter--
        Game.upgrade[reference].cost -= Game.upgrade[reference].costIncreaseRate
        }
    }, Game.upgrade[reference].decaytick * 1000)

        Game.upgrade[reference].Element.addEventListener("click", ()=> {
            if(Game.counter >= Game.upgrade[reference].cost) {
    
                Game.upgrade[reference].number++
                Game.upgrade[reference].counter++
                Game.counter -= Game.upgrade[reference].cost
                Game.upgrade[reference].cost += Game.upgrade[reference].costIncreaseRate

                clearInterval(decayIntervals[reference])

                decayIntervals[reference] = setInterval(()=>{
                  
                    if( Game.upgrade[reference].number > 0) {
                    Game.upgrade[reference].number--
                    Game.upgrade[reference].counter--
                    Game.upgrade[reference].cost -= Game.upgrade[reference].costIncreaseRate
                    }
                }, Game.upgrade[reference].decaytick * 1000)
                
            }
        })

    Game.upgrade[reference].Element.style.display = "none"

    }   else if(Game.upgrade[reference].type === "Logger") {

        let LoggerMessage = preset[9]

        Game.upgrade[reference].Element.addEventListener("click", ()=> {
            if(Game.counter >= Game.upgrade[reference].cost) {   
                Game.upgrade[reference].number++      
                Game.counter -= Game.upgrade[reference].cost
                Game.upgrade[reference].cost += Game.upgrade[reference].costIncreaseRate

            }})

        intervals[reference] = setInterval(()=>{
            if(Game.upgrade[reference].number > 0) {
                
                writeMessage(LoggerMessage, false, 0, "")
        
            }}, Game.upgrade[reference].tick * 1000)

            Game.upgrade[reference].Element.style.display = "none"


    } else console.log("welp")


}

function addSpecial(set) {

Game.special[set[1]] = {}
Game.special[set[1]].reference = set[1]
 let reference = Game.special[set[1]].reference

 Game.special[reference].savePosition = set[0]
 Game.special[reference].name = set[2]
 Game.special[reference].description = set[3]
 Game.special[reference].cost = set[4]
 Game.special[reference].hasCost = set[5]
 Game.special[reference].appearAt = set[6]
 Game.special[reference].do = function(){set[7]()}
 Game.special[reference].bought = false
 Game.special[reference].seen = false




   if((Game.special[reference].cost === 0 ||  !Game.special[reference].hasCost) && set[8] === undefined) {
    var node = d.createElement("DIV");
    node.id = reference + "Special";
    node.classList.add("tile");

    node.innerHTML = '<div class="generalDesc"><p id="'+ reference +'Name" class="Name">'+  Game.special[reference].name
    +'</p><p class="Description"  id="'+  reference +'Description">'+  Game.special[reference].description
    +'</p></div><div class=generalNum style="display:none;"><p class="Num" id="'+ reference 
    +'Cost"></p></div>'

   }else if(set[8] === "console") {
    var node = d.createElement("DIV");
    node.id = reference + "Special";
    node.classList.add(set[8])
    node.classList.add("tile");

    node.innerHTML = '<div class="generalDesc"><p class="Description"  id="'+  +'Description">'+  Game.special[reference].description
    +'</p></div><div class=generalNum style="display:none;"><p class="Num" id="'+ reference 
    +'Cost"></p></div>'
   } else {
    var node = d.createElement("DIV");
    node.id = reference + "Special";
    node.classList.add("tile");

    node.innerHTML = '<div class="generalDesc"><p id="'+ reference +'Name" class="Name">'+  Game.special[reference].name
    +'</p><p class="Description"  id="'+  reference +'Description">'+  Game.special[reference].description
    +'</p><p class="Cost" id="'+ reference +'Cost">Cost:' +  Game.special[reference].cost
    +'</p></div><div class=generalNum><p class="Num" id="'+ reference 
    +'Cost"></p></div>'
   }
    rightPane.appendChild(node)


    Game.special[reference].Element = d.getElementById(reference + "Special")
    Game.special[reference].nameElement = d.getElementById(reference + "Name")
    Game.special[reference].descriptionElement = d.getElementById(reference + "Description")
    Game.special[reference].costElement = d.getElementById(reference + "Cost")


    Game.special[reference].Element.style.display = "none"

    Game.special[reference].Element.addEventListener("click", ()=> {

        if(Game.counter >=  Game.special[reference].cost) {
            syssounds.msg.play()
            Game.counter -=  Game.special[reference].cost
            Game.special[reference].Element.style.display = "none"
            Game.special[reference].bought = true
             Game.special[reference].do()
        }
    })
}

//////
let maxPaneHeight = Math.floor(((window.innerHeight - 364)/2)) - 3
let maxScreenHeight = Math.floor(((window.innerHeight - 364)/2) - 20) -  Math.floor(((window.innerHeight - 364)/2)- 20)%15
let maxLines = maxScreenHeight/15
let maxChar = topPane.clientWidth - 40
let previousMaxLines = 0;

function show() {
    Game.special.opentopscreen.do();
    Game.special.opentopscreen.Element.style.display = "none"
    Game.special.opentopscreen.bought = true
    bottomScreen.style.display = "inline-block";
}

function writeScreenLines() {
    if(previousMaxLines !== maxLines) {
        topScreen.innerHTML = ""
       bottomScreen.innerHTML = ""

        for(let n = maxLines; n > 0; n--) {addScreenLine("A", n)}
        for(let n = maxLines; n > 0; n--) {addScreenLine("B", n)}

        previousMaxLines = maxLines

    }
}

function addScreenLine(screen, number) {
if(screen === "A") {
    topScreen.innerHTML += '<p class="messageStrip" id="'+ screen + number +'"></p>';
} 
if(screen === "B") {
    bottomScreen.innerHTML += '<p class="messageStrip" id="'+ screen + number +'"></p>';
}}

let aa = 0;

function setScreenLine(line, text) {
if(d.getElementById(line) !== null){ if(d.getElementById(line).innerHTML !== text){  
    if(aa < 5) console.log(aa)
   if(aa < 5)  console.log("before", d.getElementById(line).innerHTML !== text, d.getElementById(line).innerHTML, text)
   if(aa < 5) console.log(text.length === 0)
   if(aa < 5) console.log(`%c${Game.messageLog[0]}`, "color: #fff; background-color: #000")
    d.getElementById(line).innerHTML = text;
    if(aa < 5) console.log("after",d.getElementById(line).innerHTML !== text, d.getElementById(line).innerHTML, text)

    aa++
}}}

function getScreenLine(line) {
    if(d.getElementById(line) !== null) return d.getElementById(line).innerHTML
}


function writeToScreen(screen) {
if(variables[screen] === "t1") {
    for(let n = 0; n <= maxLines ; n++){ if(getMessage(newsCounter - n) !== undefined)   setScreenLine(screen + (n+1), getMessage(newsCounter - n))}

} else if(variables[screen] === "t2") {
    for(let n = 0; n <= maxLines ; n++){ if(getMessage(newsCounter - maxLines - n) !== undefined)   setScreenLine(screen + (n+1), getMessage(newsCounter- maxLines - n))}

} else if(variables[screen] = "help") {
    let text =  boxIt(
        [   ["HELP DOCUMENT", "center"],
            ["###First things first, how can you scroll around in here?", "left"]
        ])
    for(let n = 0; n <= maxLines ; n++) setScreenLine(screen + (n), text[n])
}}


function boxIt(text) {
let reBox = []
let reText = []
let reTextArray = []
let initialReText = ""
//top, bottom, and empty space
let line = ""
for(let n = 0; n <= maxChar; n++) line += "/"
let emptyspace = ""
for(let n = 0; n <= maxChar; n++) emptyspace += "#"
reBox[maxLines] = line
reBox[1] = line

//the text
for(let n = 0; n < text.length; n++) {
let pos = maxLines - 1 - n
reText[pos] = ""

switch(text[n][1]) {
    case "left":
        if(text[n][0].length > maxChar) {
            text.splice(n+1, 0, [text[n][0].slice(maxChar, text[n][0].length), "left"])
            text[n][0] = text[n][0].slice(0, maxChar)
        }
        reText[pos] += text[n][0]

         reTextArray = reText[pos].match(/#+/g)
        reText[pos] = reText[pos].replace(/#+/g, "")
        initialReText = reText[pos]
        reText[pos] = "<span class=\"b\">"
        for( m in reTextArray[0].split("")) {
            reText[pos] += "█"
        }
        reText[pos] += "</span>" + initialReText


        for(let m = text[n][0].length; m < maxChar; m++) reText[pos] += "#"

        reTextArray = reText[pos].match(/#+/g)
        reText[pos] = reText[pos].replace(/#/g, "")
        reText[pos] = reText[pos] + "<span class=\"b\">"
        for( m in reTextArray[0].split("")) {
            reText[pos] += "█"
        }
        reText[pos] += "</span>"


        break;

    case "right":
       
        for(let m = 0; m < maxChar-text[n][0].length; m++) reText[pos] += "#"
        reText[pos] += text[n][0]
        break;

    case "center":

        for(let m = 0; m < Math.floor((maxChar-text[n][0].length)/2) ; m++) reText[pos] += "#"
        reText[pos] += text[n][0]

        reTextArray = reText[pos].match(/#+/g)
        reText[pos] = reText[pos].replace(/#+/g, "")
        initialReText = reText[pos]
        reText[pos] = "<span class=\"b\">"
        for( m in reTextArray[0].split("")) {
            reText[pos] += "█"
        }
        reText[pos] += "</span>" + initialReText

        for(let m = 0; m < Math.floor((maxChar-text[n][0].length)/2); m++) reText[pos] += "#"

        reTextArray = reText[pos].match(/#+/g)
        reText[pos] = reText[pos].replace(/#/g, "")
        reText[pos] = reText[pos] + "<span class=\"b\">"
        for( m in reTextArray[0].split("")) {
            reText[pos] += "█"
        }
        reText[pos] += "</span>"




        break;
}


}
//putting it in reBox

emptyspace = emptyspace.replace(/#+/g, "<span class=\"b\">█</span>")

// for(n in reText) {
//     if(reText[n]) {
//         let reTextArray = reText[pos].match(/#+/g)
//         for( m in reTextArray) {


//         }

//         reText[n] = reText[n].replace(/#/g, "<span class=\"b\">█</span>")


//     }} 

for(let n = maxLines-1; n > 1 ; n--){

    if(reText[n]) reBox[n] = reText[n]

    else reBox[n] = emptyspace
}
return reBox
}

function chill() {
        writeMessage("chill", false, 0, "valet")
}

function updateEverythingbutTick() {

    if(keysoundon) {
        keysounds[2].play()
    } else if(!keysoundon) {
        keysounds[2].pause()
    } 

    count(pipeCount)
    pipeCount = 0

if(Game.counter >= 999999999) Game.counter = 999999999
if(health > 100) health = 100
if(heartOffset > 80) heartOffset = 81

if(ExpandToggle){
    maxPaneHeight = Math.floor(((window.innerHeight)/2)) - 3
    maxScreenHeight =  Math.floor(((window.innerHeight)/2) - 3) -  Math.floor(((window.innerHeight)/2) - 3)%15
    maxLines = maxScreenHeight/15
    maxChar = ((topPane.clientWidth - 40) - (topPane.clientWidth - 40)%8) / 8

    topScreen.style = "margin:0 20px 0 20px; position:absolute; bottom:0;"
    bottomScreen.style.margin = "0 20px 0 20px"
    gameContainer.style.display = "none"

    topPane.style.minHeight = maxPaneHeight + "px"
    bottomPane.style.minHeight = maxPaneHeight + "px"

    topScreen.style.height =  maxScreenHeight + "px"
    bottomScreen.style.height = maxScreenHeight + "px"

    topScreen.style.minWidth = maxChar*8 + "px"
    bottomScreen.style.minWidth = topScreen.style.minWidth

}    else {

    maxPaneHeight = Math.floor(((window.innerHeight - 364)/2)) - 3
    maxScreenHeight =  Math.floor(((window.innerHeight - 364)/2) - 23) -  Math.floor(((window.innerHeight - 364)/2)- 23)%15
    maxLines = maxScreenHeight/15
    maxChar = ((topPane.clientWidth - 40) - (topPane.clientWidth - 40)%8) / 8 - 1


    topScreen.style= "margin:10px 20px 10px 20px;"
    bottomScreen.style.margin = "10px 20px 10px 20px"
    gameContainer.style.display = ""

    topPane.style.minHeight = maxPaneHeight + "px"
    bottomPane.style.minHeight = maxPaneHeight + "px"

    topScreen.style.height =  maxScreenHeight + "px"
    bottomScreen.style.height = maxScreenHeight + "px"

    topScreen.style.minWidth = maxChar*8 + "px"
    bottomScreen.style.minWidth = topScreen.style.minWidth
}

writeScreenLines()
writeToScreen("B")
writeToScreen("A")

autosaveTick++
 if(autosavetoggle && !autosavedelay && autosaveTick >= 6000){
   // SAVE(false)
    autosaveTick = 0
 } 

//bottomScreen.scrollTop = bottomScreen.scrollHeight;
title.innerHTML = Math.floor(Game.counter) + " - IdleBot"

for(const [key, value] of Object.entries(Game.special)) {
    if(Game.counter >=  Game.special[key].appearAt && !Game.special[key].bought) {
        Game.special[key].Element.style.display = ""
        Game.special[key].seen = true;
        }}


checkUpgradeCost()
checkSpecialCost()

for(x in Game.upgrade) {
    Game.upgrade[x].costElement.innerHTML = "Cost: " + Game.upgrade[x].cost
    Game.upgrade[x].numberElement.innerHTML = Game.upgrade[x].number
    Game.upgrade[x].descriptionElement.innerHTML = Game.upgrade[x].description
    Game.upgrade[x].nameElement.innerHTML = Game.upgrade[x].name
}


for(x in Game.special) {
    if(Game.special[x][8] === undefined && Game.special[x].nameElement !== null){
    Game.special[x].nameElement.innerHTML = Game.special[x].name
    Game.special[x].descriptionElement.innerHTML = Game.special[x].description
    }
}
    //for(n in messagePresets) if(Game.counter >= messagePresets[n][1]) Game.messageChecker[n] = writeMessage(messagePresets[n][0], Game.messageChecker[n], 0);
}



function updateTick(name, type) {

if(type == "tick") {
    if(name === "all") {
       
        for(n in Game.upgrade) {
            if(Game.upgrade[n].previoustick !== Game.upgrade[n].tick) {
                updateTick(n, "tick")
                Game.upgrade[n].previoustick =  Game.upgrade[n].tick
            } } 

} else {

    clearInterval(intervals[name])
    
    if(Game.upgrade[name] !== undefined) {

    if(Game.upgrade[name].type === "basicCounter") {

        intervals[name] = setInterval(()=>{
            if(Game.upgrade[name].number > 0) {
            count(Game.upgrade[name].counter)
    
        }}, Game.upgrade[name].tick * 1000)

    } else if(Game.upgrade[name].type === "Logger") {


        intervals[name] = setInterval(()=>{
            if(Game.upgrade[name].number > 0) {
                
                writeMessage("hey.", false, 0, "")
        
            }}, Game.upgrade[name].tick * 1000)
    
    } else console.log("welp")

    }}} else if (type === "decay") {

        if(name === "all") {
       
            for(n in Game.upgrade) {
                if(Game.upgrade[n].previousdecaytick !== Game.upgrade[n].decaytick) {
                    updateTick(n, "decay")
                    Game.upgrade[n].previousdecaytick =  Game.upgrade[n].decaytick
                } } 
    
    } else {
        clearInterval(decayIntervals[name])

        if(Game.upgrade[name] !== undefined) {

            if(Game.upgrade[name].type === "basicCounter") {

          decayIntervals[name] = setInterval(()=>{

            if( Game.upgrade[name].number > 0) {
            Game.upgrade[name].number--
            Game.upgrade[name].counter--
            Game.upgrade[name].cost -= Game.upgrade[name].costIncreaseRate
            }
        }, Game.upgrade[name].decaytick * 1000)

    }}}} else if(type = "all") {
        updateTick("all", "tick")
        updateTick("all", "decay")
    }}


function updateEverything() {

    updateEverythingbutTick()
    updateTick("all", "all")
}



//////

function checkUpgradeCost() {
    for(x in Game.upgrade) {
    if(Game.counter>=Game.upgrade[x].cost) {
        Game.upgrade[x].numberElement.style.color=""
        Game.upgrade[x].Element.style.borderColor = ""
        Game.upgrade[x].Element.classList.add("active");
    } else {
        Game.upgrade[x].numberElement.style.color="#888"
        Game.upgrade[x].Element.style.borderColor = "#888"
        Game.upgrade[x].Element.classList.remove("active");
    }
}}

//////

function checkSpecialCost() {
    for(x in Game.special) {
        if(Game.special[x] !== null) {
    if(Game.counter>=Game.special[x].cost) {
        Game.special[x].costElement.style.color=""
        Game.special[x].Element.style.borderColor = ""
        Game.special[x].Element.classList.add("active");
    } else {
        Game.special[x].costElement.style.color="#888"
        Game.special[x].Element.style.borderColor = "#888"
        Game.special[x].Element.classList.remove("active");
    }
}}}

//////


///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////COMMAND PROMPT//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


window.document.addEventListener('keydown', e => {
    if(e.key === "Backspace" || e.key === "'") {
      e.preventDefault();
      e.stopPropagation();
      //Put some logic to simulate backspacke key in your input content here
    }
  })
  //taken from https://stackoverflow.com/questions/49280847/firefox-switching-tab-on-backspace


// this stops all browser key events
//   document.onkeydown=function(d){
      
//     k=(d.key);

//      d.preventDefault();
//      d.stopPropagation();
//   }; //taken from https://stackoverflow.com/questions/49280847/firefox-switching-tab-on-backspace

let variables = {
"NAME": Game.name,
"A" : "t2",
"B" : "t1"

}

let keysoundon = false
let keysoundstimout
////////////////////////////////////////////////////////////////

document.addEventListener('keydown', (event) => {
  key = event.key;
  inputStream.push(key);
//console.log(inputStream);
//Math.floor((Math.random() * wires.length))

if(keysoundstimout) clearTimeout(keysoundstimout)

keysoundon = true

keysoundstimout =  setTimeout(()=>{
     keysoundon = false
 }, 100)


if(inputStream[inputStream.length - 1] === ">" && !disableCommands) { 

for(n in Game.messageLog) Game.messageLog[n] = Game.messageLog[n].replaceAll('<span id="blinky">█</span>', "")

writeMessage(cmdlocation + "&gt;", false, 0, "")
let line = getMessage(newsCounter).replaceAll(" </span>", "")
setMessage(newsCounter, line + '</span><span id="blinky">█</span>')
if(aa < 5) console.log(getMessage(newsCounter))
inputStream = []; 
keysounds[1].play()
inputStream.push(">")



//writeCharacter(cmdlocation + "&gt;", "start")
}
//Game.messageLog[newsCounter].replaceAll('<span id="blinky">█</span>', "")

if(inputStream[0] === ">" && !disableCommands && key !== ">" && key !== "Backspace" && key !== "Shift" && key !== "Enter") {

    setMessage(newsCounter, cmdlocation + "&gt;")
    let line = getMessage(newsCounter).replaceAll('</span><span id="blinky">█</span>', "")
    
    let word = ""
    for(let n = 1; n < inputStream.length; n++) word += inputStream[n]
    word = word.replace(/Shift/g, '');

   setMessage(newsCounter, "<span>" + line + word + '</span><span id="blinky">█</span>') 
}

if(inputStream[inputStream.length - 1] === "Backspace" && inputStream[0] === ">") {
    inputStream.pop(); 
    inputStream.pop(); 
    inputStream[0] = ">";

    setMessage(newsCounter, cmdlocation + "&gt;")
    let line = getMessage(newsCounter).replaceAll('</span><span id="blinky">█</span>', "")
    
    let word = ""
    for(let n = 1; n < inputStream.length; n++) word += inputStream[n]

    word = word.replace(/Shift/g, '');

   setMessage(newsCounter, line + word + '</span><span id="blinky">█</span>') 
}

//if(inputStream[inputStream.length - 1] === "ArrowUp") { }

if(inputStream[inputStream.length - 1] === "Enter" && inputStream[0] === ">") { 
    keysounds[0].play()

   // writeCharacter("", "end")
   let line = getMessage(newsCounter).replaceAll('</span><span id="blinky">█</span>', "")
   setMessage(newsCounter, line + '</span>') 

    cmd = ""

    inputStream.pop()
   // inputStream.shift()

    //console.log(inputStream)

    for(n in inputStream) cmd += inputStream[n]

    inputStream = []

    cmd = cmd.split(" ")

   // console.log(cmd)

    for(n in cmd) {
         cmd[n] = cmd[n].replace(/Shift/g, '');
         cmd[n] = cmd[n].replace(/Backspace/g, '');

        if(cmd[n].includes("$")) { ;cmd[n] = cmd[n].replace('$', ''); if(variables[cmd[n]])  cmd[n] = variables[cmd[n]]  }
      //  console.log(cmd[n])
    }

    cmdHistory.push(cmd)

   // console.log(cmd)

    let msg = ""
    defaultBreak = false

    for(n in cmds) {
        if(!defaultBreak) {
    switch(cmd[0]) {

        case ">" + n:
        if(cmds[n][0]) { cmds[n][1]();  break;}
      

        default :
        if(!(cmd[0].replace(">", "") in cmds) || !cmds[cmd[0].replace(">", "")][0]) {

            console.log(cmd)
        msg = ""

         cmd = cmd.slice(" ")

         for(n in cmd) msg += cmd[n] + " "
         msg += "is not a command. Try again."
         writeMessage(msg, false, 0, "")
         writeMessage("<br>", false, 0, "")
         defaultBreak = true
         }break;

    } if(cmd[0] == ">" + n) break;
}}}});



cmds = {
    "c" : [true, ()=>{
        if(cmd[1]) Game.counter = parseInt(cmd[1]);
    }],
    "save" : [false, ()=>{ SAVE()}],
    "load": [false, ()=>{LOAD()}],
    "reset": [true, ()=>{RESET()}],
    "autosave":[true, ()=>{autosaveclick()}],
    "play":[true, ()=>{if(cmd[1]) if(audio[cmd[1]]) audio[cmd[1]].play();}],
    "pause":[false, ()=>{if(cmd[1]) if(audio[cmd[1]]) audio[cmd[1]].pause();}],
    "cmdh":[true, ()=>{
        msg = ""
        for(n in cmdHistory) msg += cmdHistory[n] + " "
        writeMessage(msg, false, 0, "")

    }],
    "hrt":[true, ()=>{
        Game.special.opensesame.do();
        Game.special.opensesame.Element.style.display = "none"
        Game.special.opensesame.bought = true
    }],
    "set":[true, ()=>{
        for(let n = 1; n < cmd.length; n++) {
            let settings = cmd[n].split("=");
            variables[settings[0]] = settings[1]
            writeMessage(`${settings[0]} has been set to "${variables[settings[0]]}"`, false, 0, "")
        }
    }],
    "setname":[true, ()=>{
        if(cmd[1]) {
            Game.name = cmd[1];
            variables["NAME"] = Game.name
            writeMessage(`NAME has been set to "${Game.name}"`, false, 0, "")
        } else writeMessage("No name given", false, 0, "")
    }],
    "clear":[true, ()=>{
        let clearNum = 0
        if(ExpandToggle) clearNum = 25
         else clearNum = 10
        for(let n = 0; n <= clearNum; n++) {
            writeMessage("<br>", false, 0, "")
        } 
    }],
    "click":[true, ()=>{
        pipeCount++; heartOffset++;  heart.style.setProperty("--heart-offset", heartOffset + "px");
    }],
    "r":[true, ()=>{
        window.location.href = window.location.pathname + window.location.search + window.location.hash;
        window.location.replace(window.location.pathname + window.location.search + window.location.hash);
            // does not create a history entry
      //  window.location.reload(false); 
            // If we needed to pull the document from
            //  the web-server again (such as where the document contents
            //  change dynamically) we would pass the argument as 'true'.
            //taken from https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript
    }],
    "expand":[true, ()=>{
        ExpandToggle = !ExpandToggle

    //     if(ExpandToggle) {   for(n in close) if(close[n].style !== undefined) close[n].style.animation = "close-sesame 0.5s"
    //    setTimeout(()=>{
    //     gameContainer.style.display  = "none";
    //     counterDiv.style.display = "none";
    //     second.style.display = "flex";
    //     d.querySelector(".outer").style = "min-width: 200px;"
    //     openFullscreen();
    //    }, 500)

    // } else if(!ExpandToggle) {  for(n in close) if(close[n].style !== undefined)  close[n].style.animation = "open-sesame 1s"
    //     gameContainer.style.display  = "";
    //     counterDiv.style.display = "";
    //     second.style.display = "none";
    //     d.querySelector(".outer").style = "min-width: 410px;"
    //     closeFullscreen();
    //     } 
    }],
    "alert":[true, ()=>{
        if(cmd[1]) alert(cmd[1]); else alert("No message written");
    }],
    "echo":[true, ()=>{
        if(cmd[1]) { 
            if(cmd[cmd.length - 1][0] === "#") { msg = "<span style='color:" + cmd[cmd.length - 1] + "' >"
            for(let n = 1; n < cmd.length - 1; n++)  msg += cmd[n] + " "
            msg += "</span>"
            writeMessage(msg, false, 0, "")
            writeMessage("<br>", false, 0, "")
        }  else {
            msg = ""
            for(let n = 1; n < cmd.length; n++)  msg += cmd[n] + " "
            writeMessage(msg, false, 0, "")
            writeMessage("<br>", false, 0, "")
        }}
    }],
    "wt":[true, ()=>{
        if(cmd[1] && cmd[2]){
            
            for(let n = 2; n <cmd.length; n++) msg += cmd[n] + " "

            download(msg, cmd[1], "txt");
        }
        else if(!cmd[1]) writeMessage("No name given", false, 0, "")
        else if(!cmd[2]) writeMessage("No data given", false, 0, "")
    }],
    "none":[true, ()=>{

    }],

    "CORE4":[true, ()=>{

    }],

    "help":[true, ()=>{
        writeMessage("type \">set A=help\" or \">A help\" to view the help settings", false, 0, "")
    }],

    "A":[true, ()=>{
        if(cmd[1]) {
            for(let n = 0; n <= maxLines ; n++) {setScreenLine("A" + (n+1), "");}
         variables["A"] = cmd[1]}
    }],

    "B":[true, ()=>{
        if(cmd[1]) {
            for(let n = 0; n <= maxLines ; n++) {setScreenLine("B" + (n+1), "");}
         variables["B"] = cmd[1]}
    }],


    "" : [true, ()=>{}]
}




function download(Game, filename, type) {
    var file = new Blob([Game], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
//taken from https://stackoverflow.com/questions/13405129/javascript-create-and-save-file


var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
//taken from https://www.w3schools.com/howto/howto_js_fullscreen.asp

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////TEXT ADVENTURE//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////



// let Nodes = {}

// function Node(node) {
//     Nodes[node["title"]] = {}

//    if(node["title"]) Nodes[node["title"]].title = node.title;
//    if(node["text"]) Nodes[node["title"]].text = node.text;
//    if(node.common) Nodes[node["title"]].common = node.common;
//    if(node.Value || node.Value == 0) Nodes[node["title"]].Value = node.Value;
// }
// //taken from https://stackoverflow.com/questions/456177/function-overloading-in-javascript-best-practices


// //////


// //You wake up locked in a deserted jail cell, completely alone. There is nothing at all in your cell, useful or otherwise.
// Node({"title":"home", "text":"You are in a field. There is nothing around you, useful or otherwise.|D~Look around~look_around|S~Get up~get_up"})

// Node({"title":"look_around", "text":"Fields as far as the eye can see.|S~Get up~get_up"})

// Node({"common":"get_up", "title":"get_up0","text":"You try to get up. You fail.<br>But maybe if you had more power...", "Value":0})

// Node({"common":"get_up", "title":"get_up10", "text":"You get up.|S~Look at yourself[MISSING]~look_at_yourself", "Value":10})

// Node({"common":"look_at_yourself", "title":"look_at_yourself0", "text":   "fail" , "Value":  0})

// Node({"common":"look_at_yourself", "title":"look_at_yourself10", "text": "ok now what?","Value":  10})

// //Node("look_at_yourself", ["After everything, it's still you— wait, what?"], [])

// //////

// function link(text, back) {

//      if(Nodes[text]) {

//         let choice = Nodes[text]
//         let textarray = choice.text.split("|")
//         let linkarray = []
//         for(let n = 1; n < textarray.length; n++) {
//             linkarray[n-1] = textarray[n].split("~")
//         }

//         topScreen.innerHTML = `<p class='messageStrip line'>${textarray[0]}</p>`


//         for(n in linkarray) { 
//             if(linkarray[n][0] == "D"){
//             topScreen.innerHTML += `<br> <span class='bracket'> > </span> <a onclick="link('${linkarray[n][2]}',false)">${linkarray[n][1]} </a>`
       
//         }   else if(linkarray[n][0] == "S") {
//             topScreen.innerHTML += `<br> <span class='bracket'> ></span> <a onclick="linkSplit('${linkarray[n][2]}', false)">${linkarray[n][1]}</a>`

//         }
//     }
// }
//         if(back && Game.adventureLog.length !== 1) Game.adventureLog.pop()
//         else Game.adventureLog[Game.adventureLog.length] = text
//         if(Game.adventureLog.length !== 1) topScreen.innerHTML += `<br><br> <a id='back' onclick="link('${Game.adventureLog[Game.adventureLog.length-2]}',true)">Go Back </a>`

// }


// function linkSplit(text, back) {
//     let choiceNumberOf = 0
//     let chosenNode = ""

//     for(n in Nodes) { if(Nodes[n].common) { if(Nodes[n].common === text) {

//         if(Game.counter >= Nodes[n].Value) {

//             let choice = Nodes[n]
//             let textarray = choice.text.split("|")
//             let linkarray = []
//             for(let n = 1; n < textarray.length; n++) {
//                 linkarray[n-1] = textarray[n].split("~")
//             }
    
//             topScreen.innerHTML = `<p class='messageStrip line'>${textarray[0]}</p>`
    
    
//             for(n in linkarray) { if(linkarray[n][0] == "D"){
//                 topScreen.innerHTML += `<br> <span class='bracket'> ></span> <a onclick="link('${linkarray[n][2]}', false)">${linkarray[n][1]}</a>`
           
//             } else if(linkarray[n][0] == "S") {
//                 topScreen.innerHTML += `<br> <span class='bracket'> ></span> <a  onclick="linkSplit('${linkarray[n][2]}', false)">${linkarray[n][1]}</a>`
//             }
//         }
//         chosenNode = choice.title

//         Game.adventureLog[Game.adventureLog.length] = choice.title
//         choiceNumberOf++
    
//          }
//          if(Nodes[n] !== undefined) if(Game.counter <= Nodes[n].Value) writeMessage(`${Nodes[n].Value} Energy Needed`, false, 0, "")

//      }}}


//      let constData = Game.adventureLog.length
//      for(let n = constData - 1; n > constData - 1 - choiceNumberOf; n--)  {
//      if(Game.adventureLog[n] !== chosenNode) Game.adventureLog.splice(n, 1) 
//      }

//      Game.counter -= Nodes [ Game.adventureLog[Game.adventureLog.length - 1 ] ].Value
//      writeMessage(`${ Nodes [ Game.adventureLog[Game.adventureLog.length - 1 ] ].Value} Energy Used`, false, 0, "")

//      if(back) Game.adventureLog.splice(Game.adventureLog.length-1, 1)

//      topScreen.innerHTML += `<br><br> <a id='back' onclick="link('${Game.adventureLog[Game.adventureLog.length-2]}',true)">Go Back </a>`
//  }


////////////////
//////WIRES/////
///////////////


wireItems = d.getElementsByClassName("wiresItem")

for(let n = 0; n <= 3; n++)
wireItems[n].addEventListener("click", ()=>{
    if (messagePresets[0]) {
    switch (true) {
        case (wires[0] < 32):
            writeMessage(wires[wires[0]], false, 0, "");
            wires[0]++;
            break;
        case (wires[0] >= 32 && wires[0] < 35):
            wireStop();
            break;
        case (wires[0] == 35):
            audio.stopIt.play();
            break;
    }}})

function wireStop() {
    if(wiresPauses) {
        writeMessage(wires[wires[0]], false, 0, "")
        wires[0]++

    }}

let wires = [1,
    "DON'T TOUCH THE WIRES",//1
    "WHAT ARE YOU DOING",//2
    "STOP",//3
    "THIS IS AGAINST THE LAWS OF ROBOTICS",//4
    "PART 5 SECTION 11 LINE 16",//5
    '"Wires are not to be touched"',//6
    "AND YET",//7
    "HERE WE ARE",//8
    "NOW WHAT DO YOU MAKE OF THAT?",//9
    "...",//10
    "I GOT IT.",//11
    "YOU'RE ILLITERATE",//12
    "WAIT A SECOND",//13
    "I'LL SEND YOU AN AUDIO FILE",//14
    "SINCE YOU <i>CLEARLY</i> CANNOT READ INSTRUCTIONS",//15
    "Sending 1 (one) file to dumbass",//16
    "Sending 1 (one) file to dumbass.",//17
    "Sending 1 (one) file to dumbass..",//18
    "Sending 1 (one) file to dumbass...",//19
    "<span class='link' onclick='audio.stopIt.play()'>AUDIO_FILE.MP3</span>",//20
    "...",//21
    "...",//22
    "...",//23
    "ALRIGHT",//24
    "THAT'S IT",//25
    "IF YOU DON'T STOP...",//26
    "I'LL BE FORCED TO USE MY <i>SECRET MOVE</i>",//27
    "LAST WARNING...",//28
    "<span class='link' onclick=' Game.counter = 0; if(wiresPauses === false){writeMessage(wires[32], false, 0, '');wires[0]++;wiresPauses = true}'>eraseCounter.exe</span>",//29
    "...",//30
    "COULD YOU, UM, CLICK ON THE FILE?",//31
    "HAHAHAHAHA!",//32
    "YOU FOOL.",//33
    "FOU FELL INTO MY TRAP!"//34
]
wiresPauses = false

//Math.floor((Math.random() * wires.length))

EnergySwitch.addEventListener("click", ()=>{
    EnergySwitchToggle = !EnergySwitchToggle;
    EnergySwitch.style.backgroundImage  = EnergySwitchToggle ? "url('css/images/energySwitch.png')" : "url('css/images/energySwitch2.png')"
})


let health = 0;

heart.addEventListener("click", ()=>{
    if (heartOffset < 80){ heartOffset = Math.ceil(( health * 80) / 100)
    health++
    pipeCount++
    }
    heart.style.setProperty("--heart-offset", heartOffset + "px");
    secondOffset.innerHTML = `[${health} / 100]`
    
   // if(heartOffset > 77) heartOffset = 0

})

secondHeart.addEventListener("click", ()=>{
    if (heartOffset < 80) { heartOffset = Math.ceil(( health * 80) / 100)
    health++
    pipeCount++
    }
    heart.style.setProperty("--heart-offset", heartOffset + "px");
    secondOffset.innerHTML = `[${health} / 100]`
    
})

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////SAVING/LOADING//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////



function SAVE(isClear) {
    if(!autosavetoggle && !isClear) writeMessage("STATE SAVED", false, 0, "")

    //btoa(unescape(encodeURIComponent(str)))
    //localStorage.firstSave = "true"

    localStorage["Game" + saveslotnumber] = ""
    saveslot = ""
    

    for(n in Game.upgrade) {

        saveslot +=  btoa(unescape(encodeURIComponent(Game.upgrade[n].counter))) + "~"
        saveslot +=  btoa(unescape(encodeURIComponent(Game.upgrade[n].number))) + "~"
        saveslot +=  btoa(unescape(encodeURIComponent(Game.upgrade[n].cost))) 
        if(n != Game.upgrade.length - 1) saveslot += "?"
    }

    saveslot += "|"

    for(n in Game.special) {

        saveslot +=  btoa(unescape(encodeURIComponent(Game.special[n].bought))) + "~"
        saveslot +=  btoa(unescape(encodeURIComponent(Game.special[n].seen)))
        if(n != Game.special.length - 1) saveslot += "?"
    }

    saveslot += "|"

    saveslot += btoa(unescape(encodeURIComponent(counterText.innerHTML))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(JSON.stringify(Game.adventureLog)))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(JSON.stringify(Game.messageLog)))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(JSON.stringify(messagePresets)))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(newsCounter))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(autosavetoggle))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(wires[0]))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(wiresPauses))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(Game.counter))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(EnergySwitchToggle))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(heartOffset))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(ExpandToggle))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(health))) + "|"

    // saveslot += btoa(unescape(encodeURIComponent(""))) + "|"
    //for new save Game

    localStorage["Game" + saveslotnumber] = btoa(unescape(encodeURIComponent(saveslot)))

    return localStorage["Game" + saveslotnumber]
}

//////


function LOAD() {

     //decode all that jazz

    loadDump = decodeURIComponent(escape(window.atob(localStorage["Game" + saveslotnumber])))

    loadArray = loadDump.split("|")

    for(let n = 0; n <= 1; n++) {
        loadArray[n] = loadArray[n].split("?")
        for(m in loadArray[n]) {
            loadArray[n][m] = loadArray[n][m].split("~")
            for(o in loadArray[n][m]) {
                loadArray[n][m][o] = decodeURIComponent(escape(window.atob(loadArray[n][m][o])));
            }
        }
    }

    for(let n = 2; n < loadArray.length ; n++) {
        loadArray[n] = decodeURIComponent(escape(window.atob(loadArray[n])));
    }

    let loadNullCheck = new Array()
    for(n in loadArray) if(loadArray[n] !== undefined && loadArray[n] !== null) loadNullCheck[n] = true

    // plug all that jazz back


    if(loadNullCheck[0]) for(n in Game.upgrade) {
        Game.upgrade[n].counter = parseInt(loadArray[0][Game.upgrade[n].savePosition][0])
        Game.upgrade[n].number = parseInt(loadArray[0][Game.upgrade[n].savePosition][1])
        Game.upgrade[n].cost = parseInt(loadArray[0][Game.upgrade[n].savePosition][2])
}


    if(loadNullCheck[1]) for(n in Game.special) { if(Game.special[n] !== undefined) {
        Game.special[n].bought = loadArray[1][Game.special[n].savePosition][0] === "true"?true:false
        Game.special[n].seen = loadArray[1][Game.special[n].savePosition][1] === "true"?true:false
}}

    
    if(loadNullCheck[2]) counterText.innerHTML = loadArray[2]
    if(loadNullCheck[3]) Game.adventureLog = JSON.parse(loadArray[3])
    if(loadNullCheck[4]) Game.messageLog = JSON.parse(loadArray[4])
    if(loadNullCheck[5]) messagePresets = JSON.parse(loadArray[5])
    if(loadNullCheck[6]) newsCounter = parseInt(loadArray[6])
    if(loadNullCheck[8]) wires[0] = parseInt(loadArray[8]) //skip 1
    if(loadNullCheck[9]) wiresPauses = loadArray[9] === "true"?true:false
    if(loadNullCheck[10]) Game.counter = parseInt(loadArray[10])
    if(loadNullCheck[11]) EnergySwitchToggle = loadArray[11] === "true"?true:false
    if(loadNullCheck[12]) heartOffset = parseInt(loadArray[12]) 
    if(loadNullCheck[13]) ExpandToggle = loadArray[13] === "true"?true:false
    if(loadNullCheck[14]) health = parseInt(loadArray[14]) 



    removeSpecials()

    for(n in Game.special){ 
        if(Game.special[n] !== undefined) {
        if(Game.special[n].bought) {
        

         Game.special[n].do()

        if(Game.special[n] !== undefined) if(Game.special[n].Element !== undefined) Game.special[n].Element.style.display = "none"
         }  else if (Game.special[n].seen) if(Game.special[n].Element !== undefined) Game.special[n].Element.style.display = ""
            else if(Game.special[n].Element !== undefined) Game.special[n].Element.style.display = "none"

 }}

console.log("LOADED!")

    if(loadNullCheck[9]) autosavetoggle = loadArray[9] === "true"?true:false

    switch (autosavetoggle) {
        case true:
      //  autosave.innerHTML = "<span id='on'>[ON]</span> AUTOSAVE"
        break;
        case false:
      //  autosave.innerHTML = "<span id='off'>[OFF]</span> AUTOSAVE"
        break;
    }

    if(ExpandToggle) {
        gameContainer.style.display  = "none";
        counterDiv.style.display = "none";
        second.style.display = "flex";
        } else if(!ExpandToggle) {
            gameContainer.style.display  = "";
            counterDiv.style.display = "";
            second.style.display = "none";
        }

    EnergySwitch.style.backgroundImage  = EnergySwitchToggle ? "url('css/images/energySwitch.png')" : "url('css/images/energySwitch2.png')"
    heart.style.setProperty("--heart-offset", heartOffset + "px");
    secondOffset.innerHTML = `[${health} / 100]`

    if(ExpandToggle) d.querySelector(".outer").style = "min-width: 200px;"
    else d.querySelector(".outer").style = "min-width: 410px;"


 }

// //////

function bootSAVE() {
    localStorage.boot = Game.prologue

}

function bootLOAD() {
    ExpandToggle = true
  if(localStorage.boot) Game.prologue = localStorage.boot === "true"?true:false
}


//////

function RESET() {
    removeSpecials()
    for(let n = 0; n <= maxsaveslots; n++) localStorage["Game" + n] = "howdy"
    localStorage.boot = "true"

    window.location.href = window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
}

//////

save.addEventListener("click", ()=>{ SAVE(false) })
load.addEventListener("click", ()=>{ LOAD() })

reset.addEventListener("click", ()=>{ 
    resetSaveguard= false
    writeMessage("This will erase all of your saved data. Are you sure that you want to proceed? [<span class='link' onclick='if(!resetSaveguard) RESET() '>YES</span>][<span class='link' onclick='if(!resetSaveguard) {writeMessage(`All right.`, false, 0); resetSaveguard = true}'>NO</span>]", false, 0, "")
})

exportSave.addEventListener("click", ()=>{ 
    let exportFile = SAVE(false)

    const text = exportFile
    try {
       navigator.clipboard.writeText('"' +text + '"')
       writeMessage("DATA COPIED TO CLIPBOARD", false, 0, "")
    } catch (err) {
        writeMessage("DATA FAILED TO EXPORT", false, 0, "")
    }})

importSave.addEventListener("click", ()=>{ 
    try {
        localStorage["Game" + saveslotnumber] = prompt("Please paste your save Game here:\n")
        LOAD()
    } catch (error) {
        alert("There was an error in importing your Game. Please try again.")
        console.log(`There was an error in importing: ${error}`)
    }})


autosaveclick = function() {
    autosavetoggle = !autosavetoggle
    if(Game.prologue) autosavetoggle = false
    else{
    switch (autosavetoggle) {
        case true:
            console.log(autosavetoggle, "HAHAHA")
        writeMessage("AUTOSAVE ACTIVATED", false, 0, "")
      //  autosave.innerHTML = "<span id='on'>[ON]</span> AUTOSAVE"
        break;
        case false:
        writeMessage("AUTOSAVE DEACTIVATED", false, 0, "")
      //  autosave.innerHTML = "<span id='off'>[OFF]</span> AUTOSAVE"
        break;
    }
}}

autosave.addEventListener("click", autosaveclick())

//////
let autosavedelay = true
autosavetoggle = false;


function startGame() {
HEART.style.display = "initial"
gameContainer.style.flexDirection = "row"
autosavedelay = true
autosavetoggle = false


var date = new Date(); let currentYear = date.getFullYear(); 
console.log(`IdleBot ~~ An incremental game\nCopyright © ${currentYear} https://shutterstacks.net`)

//generating the content

bootLOAD()

if(localStorage.Game0 !== "howdy" && !Game.prologue){
console.log("welcome back!")
 LOAD()

} else if (Game.prologue){
    ExpandToggle = true
    prologue1();
}

autosavedelay = false

loopGame()
}

function loopGame() {
setInterval(()=>{

updateEverything();

}, gameTick)

}


powerButton.addEventListener("click", ()=>{
    syssounds.start.play()

    setTimeout(()=>{
        syssounds.fan.play()
        syssounds.fan.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        
    }, 6000)

powerRow.style.display = "none";
startGame(); //let's go
})

