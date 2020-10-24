/*
 *  ALL CODE REGISTERED UNDER THE POLYIDOS LICENSE
 *
 *  Copyright © POLYIDOS CORPORATION
 * 
*/



///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////VARIABLES///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
var date = new Date(); let currentYear = date.getFullYear();
var d = document;
var topPane = d.getElementById("topPane")
var bottomPane  =d.getElementById("bottomPane")
var topScreen = d.getElementById("topScreen");
var bottomScreen = d.getElementById("bottomScreen");
var outer = d.getElementById("outer")
var columns = d.getElementsByClassName("column")

var title = d.querySelector("title")
var powerButton = d.getElementById("power-button")
var powerRow = d.getElementById("power-row")

var leftPane = d.getElementById("left")
var rightPane = d.getElementById("right")

var close = d.getElementsByClassName("close");
var newsCounter = -1;
let heartOffset = 0;
let pipeCount = 0;
let gameTick = 10;
let autosaveTick = 0;

let loadDump = ""
let loadArray = []
let saveslotnumber = 0;
let maxsaveslots = 9;
let saveslot = "";

let resetSaveguard = false
let autosavetoggle = false;
let disableCommands = false;
var audio = {
    "stopIt" : new Audio('css/audio/AUDIO_FILE.mp3'),
    "AllStar":  new Audio('css/audio/AllStar.mp3'),
    "turtles": new Audio('css/audio/HappyTogether.mp3'),
    "cat": new Audio("css/audio/cat.mp3")
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
    updated: true
}

Game.messageChecker.fill(false);

let variables = {
    "NAME": Game.name,
    "A" : "t2",
    "B" : "t1",
    "font": "14",
    "$COLOR" : "green",
    "$DEFAULT": "A"
    }
    
let textSize 
let charRef = d.getElementById("charRef")
let maxPaneHeight = topPane.clientHeight
let maxScreenHeight = Math.floor(maxPaneHeight) -  Math.floor(maxPaneHeight)%charRef.clientHeight
let maxChar = ((topPane.clientWidth - 40) - (topPane.clientWidth - 40)%charRef.clientWidth) / charRef.clientWidth
let maxLines = Math.floor(maxScreenHeight/charRef.clientHeight)

let previousMaxLines = 0;
let previousMaxScreenLines = 0;
let previousMaxChar = 0;

let autosavedelay = true
let keysoundon = false
let keysoundstimout
let health = 0;

cmds = {
    "c" : [true, ()=>{
        if(cmd[m][1]) Game.counter = parseInt(cmd[m][1]);
    }],
    "save" : [false, ()=>{ SAVE()}],
    "load": [false, ()=>{LOAD()}],
    "reset": [true, ()=>{RESET()}],
    "autosave":[true, ()=>{autosaveclick()}],

    "play":[true, ()=>{
        if(cmd[m][1]) if(root.getLocation()[cmd[m][1]]) {

            let temp = new Audio(root.getLocation()[cmd[m][1]].rawdata)

            temp.play()
        } 
    
    }],

    "pause":[true, ()=>{if(cmd[m][1]) if(root.getLocation()[cmd[m][1]]) root.getLocation()[cmd[m][1]].data.pause()}],

    "cmdh":[true, ()=>{
        msg = ""
        for(n in cmdHistory) msg += cmdHistory[n] + " "
        writeMessage(msg, false, 0, "")

    }],
    "set":[true, ()=>{
        for(let n = 1; n < cmd[m].length; n++) {
            let settings = cmd[m][n].split("=");
            variables[settings[0]] = settings[1]
            writeMessage(`${settings[0]} has been set to "${variables[settings[0]]}"`, false, 0, "")
        }
        Game.updated = true;
    }],
    "setname":[true, ()=>{
        if(cmd[m][1]) {
            Game.name = cmd[m][1];
            variables["NAME"] = Game.name
            writeMessage(`NAME has been set to "${Game.name}"`, false, 0, "")
        } else writeMessage("No name given", false, 0, "")
    }],
    "clear":[true, ()=>{
        let clearNum = maxLines*2
        for(let n = 0; n <= clearNum; n++) {
            writeMessage("<br>", false, 0, "")
        } 
    }],
    "click":[true, ()=>{
        pipeCount++; heartOffset++;  heart.style.setProperty("--heart-offset", heartOffset + "px");
    }],
    
    "restart":[true, ()=>{
        window.location.href = window.location.pathname + window.location.search + window.location.hash;
        window.location.replace(window.location.pathname + window.location.search + window.location.hash);
            // does not create a history entry
      //  window.location.reload(false); 
            // If we needed to pull the document from
            //  the web-server again (such as where the document contents
            //  change dynamically) we would pass the argument as 'true'.
            //taken from https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript
    }],

    "quit":[true, ()=>{
        window.location.href = window.location.pathname + window.location.search + window.location.hash;
        window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }],

    "exit":[true, ()=>{
        window.location.href = window.location.pathname + window.location.search + window.location.hash;
        window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }],

    "alert":[true, ()=>{
        if(cmd[m][1]) alert(cmd[m][1]); else alert("No message written");
    }],
    "echo":[true, ()=>{
        if(cmd[m][1]) { 
            if(cmd[m][cmd[m].length - 1][0] === "#") { msg = "<span style='color:" + cmd[m][cmd[m].length - 1] + "' >"
            for(let n = 1; n < cmd[m].length - 1; n++)  msg += cmd[m][n] + " "
            msg += "</span>"
            writeMessage(msg, false, 0, "")
            writeMessage("<br>", false, 0, "")
        }  else {
            msg = ""
            for(let n = 1; n < cmd[m].length; n++)  msg += cmd[m][n] + " "
            writeMessage(msg, false, 0, "")
            writeMessage("<br>", false, 0, "")
        }}
    }],
    "wt":[true, ()=>{
        if(cmd[m][1] && cmd[m][2]){
            
            for(let n = 2; n <cmd[m].length; n++) msg += cmd[m][n] + " "

            download(msg, cmd[m][1], "txt");
        }
        else if(!cmd[m][1]) writeMessage("No name given", false, 0, "")
        else if(!cmd[m][2]) writeMessage("No data given", false, 0, "")
    }],
    "none":[true, ()=>{

    }],

    "help":[true, ()=>{
        writeMessage("type \">open help\" to open the help document", false, 0, "")
    }],

    "ls":[true, ()=>{
        let result = ""
        let path = root.location
        if(cmd[m][1])  path = root.formatPath(cmd[m][1])
        else path = root.location

            if(root.get(path)) for(let n = 0; n < root.get(path).nodes.length; n++){
                result += root.get(path).nodes[n].name + " "
        }
      
       writeMessage(result, false, 0, "")
    }],

    "cd":[true, ()=>{
       if(cmd[m][1]) if(root.setLocation(cmd[m][1])) root.setLocation(cmd[m][1])
    }],

    "mkdir":[true, ()=>{
       for(let n = 1; n < cmd[m].length; n++) root.getLocation().add(new aFolder(cmd[m][n]))

    }],

    "rmdir":[true, ()=>{
        for(let n = 1; n < cmd[m].length; n++) root.remove(cmd[m][n])
    }],

    "pwd":[true, ()=>{

        writeMessage(cmdlocation, false, 0, "")
    }],

    "A":[true, ()=>{
        if(cmd[m][1]) {
            for(let n = 0; n <= maxLines ; n++) {setScreenLine("A" + (n+1), "");}
         variables["A"] = cmd[m][1]
        Game.updated = true}
    }],

    "B":[true, ()=>{
        if(cmd[m][1]) {
            for(let n = 0; n <= maxLines ; n++) {setScreenLine("B" + (n+1), "");}
         variables["B"] = cmd[m][1]
         Game.updated = true}
    }],

    "open":[true, ()=>{
        if(cmd[m][1]) {
            for(let n = 0; n <= maxLines ; n++) {setScreenLine(variables.$DEFAULT + (n+1), "");}
         variables[variables.$DEFAULT] = cmd[m][1]
         Game.updated = true}

    }],

    "" : [true, ()=>{}]
}

this.root = {
    name:"root",
    nodes:[],
    path: "",

    search : (matchingTitle, element) => {
        if(element === undefined) element = root
        if(element.name == matchingTitle){
            return element;
       }else if (element.nodes != null){
            var i;
            var result = null;
            for(i=0; result == null && i < element.nodes.length; i++){
                 result = root.search(matchingTitle, element.nodes[i]);
            }
            return result;
       }
       return null;
    }, // taken from https://stackoverflow.com/questions/9133500/how-to-find-a-node-in-a-tree-with-javascript

    add: (name)=> {
        root.nodes.push(name)
        root[name.name] = name
        name.postion = root.nodes.length - 1
        name.parentName = root.name
        name.parent = root
        name.path = name.name
    },

    remove : (name)=>{
        if(root.getLocation()[name]) {
            root.getLocation().nodes.splice(name.position, 1)
            delete  root.getLocation()[name]
        }
    },

    location: "",
}

root.get = (data) => {

    data = data.split("/")

    let result = root

    for(n in data) {

       if(data[n] !== "") result = result[data[n]]
    }

    return result
}


root.getLocation = ()=>{

    return root.get(root.location)

}

root.formatPath = (name) => {
    if(name[0] === "/") {
        name = name.split("/")
        name.shift()
        name = name.join("/")
     } else if(name[0] === "~") {
         name = name.split("/")
         name.shift()
         name.unshift("home")
         name = name.join("/")
     } else if(name.includes("../")) {
 
     if(root.getLocation().parent)  {
         let temp = root.getLocation()
 
         name.replace(/..\/?/g, (match) => {
 
             if(temp.parent)  temp = temp.parent    
         })

         name = name.replace(/[..\/?]+/, temp.path)
        
     } else name = ""
 
 
     } else if(name === "..") {
 
        if(root.getLocation().parent) name = root.getLocation().parent.path
 
     }   else {
         name = root.getLocation().path + "/" + name
     }

     name = name.split("/")
     if(name[name.length - 1] === "") name.pop()

   let initialLength = name.length
     for(let n = 0; n < initialLength; n++) {
         if(name[n] === "..") {

             temp = name.slice(0, n)
             name = name.slice(n+1, name.length)
             let temp2 = root.get(temp.join("/")).parent.path.split("/")
             name = temp2.concat(name)
             n = 0
         } 
     }
     name = name.join("/")

     return name
}

root.setLocation = (name)=>{

   name = root.formatPath(name)

    let path = root.get(name).path
    root.location = path
    cmdlocation = "root/" + path
}


let aFolder = function(name) {
    this.name = name
    this.nodes = []

    this.add = (name)=>{
        this.nodes.push(name)
        this[name.name] = name
        name.postion = this.nodes.length - 1
        name.parent = this
        name.parentName = this.name
        name.path = this.path + "/" + name.name
    }
}

let aFile = function(data) {
    this.info = data.name.split(".")
    this.name = data.name
    this.type = this.info[this.info.length-1]
    if(data.rawdata) this.rawdata = data.rawdata
    this.scroll = 0;

    this.write = (data) => {
        this.rawdata = data
    }

    this.add = (data) =>{
        this.rawdata += data
    }

    this.scroll = (value) => {
        this.scroll = value
        Game.updated = true
    }

    this.scrollD = () => {  if(this.data[1].length-maxLines+1 > scroll) this.scroll(this.scroll + 1)}

    this.scrollU = () => {  if(this.scroll-1 >= 0)  this.scroll(this.scroll - 1)}
}

//PolyiDOS data formatting for .tf
/*
 *  paragraph/align//
 *  paragraph/align//
 *  ect...
 * 
 *  [link]
 *  $SYS-VARIABLE
 * 
 * 
 * 
*/
let links = {
    "[test]" : "0test link0"
    }
    
    
let varRegex = /\$[A-Z]+/g
    
let linkRegex = /\[.+\]/g

root.format = (data)=>{
let temp = data[1].split("//")
let alignment = ""


if(data[0] === "doc" || data[0] === "tf") {

if(temp[0] === "left" ||temp[0] === "right" ||temp[0] === "center" ) {
    alignment = temp.shift()
}

for(n in temp) {
 temp[n] = temp[n].split("/")

 if(alignment && temp[n][1] === undefined) temp[n].push(alignment)

 temp[n][0] = temp[n][0].replace(varRegex, (match)=>{
     return variables[match]
 })

 temp[n][0] = temp[n][0].replace(linkRegex, (match)=>{
    return links[match]
})
} 
return [0, temp]

}   else if(data[0] === "af") {
    return new Audio(temp)
}

}

root.add(new aFolder("home"))
root.add(new aFolder("system"))

root.home.add(new aFolder("Documents"))
root.home.add(new aFolder("Pictures"))
root.home.add(new aFolder("Videos"))
root.home.add(new aFolder("Music"))
root.home.add(new aFolder("Downloads"))

root.home.Music.add(new aFile({ "name": "turtles.af",
                                "rawdata": "css/audio/HappyTogether.mp3"}))

root.home.Music.add(new aFile({ "name": "cat.af",
                                "rawdata": "css/audio/cat.mp3"}))

root.system.add(new aFile({ "name": "help.doc",
                            "rawdata": "left//HELP DOCUMENT/center//this is a $COLOR and a [test]"}))

let inputStream = [];
let cmd = ""
let cmdHistory = [];
let cmdlocation = root.getLocation().name + "/"


///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////PRESETS/////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

/// reference, name, description, type, cost, cost increase rate, tick, decay tick, message[o]

addUpgrade(["bloodvalve", "Blood Valve", "Pumps blood every 1s<br>Decays every 20s", "basicCounter", 15, 5, 1, 20])
addUpgrade(["bloodpipe", "Blood Pipe", "Pipes blood every 0.5s<br>Decays every 10s", "basicCounter", 40, 7, 0.5, 10])


/// reference, name, description, cost, hasCost, appearAt, function, optional marker

addSpecial(["bloodvalvesappear", "Research Blood Valves", "All valves come equipped with a half-life of 5 seconds.", 50, true, 40, ()=>{
    Game.upgrade.bloodvalve.Element.style.display = ""
}])

addSpecial(["bloodpipesappear", "Research blood pipes", "It ain't gonna pipe itself...", 100, true, 80, ()=>{
    Game.upgrade.bloodpipe.Element.style.display = ""
}])


///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////FUNCTIONS///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

let fileSoftware = {
    "af" : "",
    "tf": "",
    "doc": ""
}

function openFile(file) {


}


function writeToScreen(screen) {
    if(variables[screen] === "t1") {
        for(let n = 0; n <= maxLines ; n++){ if(getMessage(newsCounter - n) !== undefined)   setScreenLine(screen + (n+1), getMessage(newsCounter - n))}
    
    } else if(variables[screen] === "t2") {
        for(let n = 0; n <= maxLines ; n++){ if(getMessage(newsCounter - maxLines - n) !== undefined)   setScreenLine(screen + (n+1), getMessage(newsCounter- maxLines - n))}
    
    } else if(root.search(variables[screen]) && root.search(variables[screen]).type === "doc") {
        let text =  boxIt(root.system[variables[screen]].data)
        for(let n = 0; n <= maxLines ; n++) setScreenLine(screen + (n), text[n])
    }
    }
    
    
function boxIt(data) {
    let reBox = []
    let reText = []
    let reTextArray = []
    let initialReText = ""
    //top, bottom, and empty space
    let scrollValue = Math.ceil(data[0] / (data[1].length-maxLines+1) * 100).toString()
    let line = scrollValue + "%"
    for(let n = 0; n <= maxChar - scrollValue.length-1; n++) line += "█"
    reBox[1] = line
    
    //the text
    let text = data[1]
    
    for(let n = 0; n < text.length; n++) {
    let pos = maxLines - n
    reText[pos] = ""
    
    switch(text[n][1]) {
        case "left":
            if(text[n][0].length > maxChar) {
                text.splice(n+1, 0, [text[n][0].slice(maxChar-1, text[n][0].length), "left"])
                text[n][0] = text[n][0].slice(0, maxChar-1) + "-"
            }
            reText[pos] += text[n][0]
            reTextArray = reText[pos].match(/#+/g)
            reText[pos] = reText[pos].replace(/#+/g, "")
            initialReText = reText[pos]
            reText[pos] = "<span class=\"b\">"
            if(reTextArray !== null) for( m in reTextArray[0].split("")) {
                reText[pos] += "█"
            }
            reText[pos] += "</span>" + initialReText
    
            for(let m = text[n][0].length; m < maxChar; m++) reText[pos] += "#"
    
            reTextArray = reText[pos].match(/#+/g)
            reText[pos] = reText[pos].replace(/#/g, "")
            reText[pos] = reText[pos] + "<span class=\"b\">"
           if(reTextArray !== null)  for( m in reTextArray[0].split("")) {
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
    emptyspace = "<span class=\"b\">█</span>"
    
    for(let n = maxLines; n > 1 ; n--) {
        if(reText[n - data[0]]) reBox[n] = reText[n - data[0]]
        else reBox[n] = emptyspace}
    
     return reBox
}

function prologue1() {

        disableCommands = true
        setTimeout(()=>{disableCommands = false},67000)

        writeMessage("Loading BOOT", false, 500, "")
        messageAnimation("...", "",100, 10, 501, true, false)
        writeMessage("BOOT loaded", false, 4600, "")

        writeMessage("Loading CORE 1", false, 4601, "")
        messageAnimation("...", "",100, 5, 4602, true, false)
        writeMessage("Not enough power, operation aborted", false, 6603, "")

        writeMessage("Loading CORE 2", false, 6604, "")
        messageAnimation("...", "",100, 5, 6605, true, false)
        writeMessage("Not enough power, operation aborted", false, 8606, "")

        writeMessage("Loading CORE 3", false, 8607, "")
        messageAnimation("...", "",100, 5, 8608, true, false)
        writeMessage("Not enough power, operation aborted", false, 10609, "")

        writeMessage("Loading CORE 4", false, 10610, "")
        messageAnimation("...", "",100, 10, 10611, true, false)
        messageAnimation("loading", "",200, 1, 14612, false, true, [20])

        writeMessage("CORE 4 Loaded", false, 20000, "")
        messageAnimation("....", "valet", 600, 1, 24000, false, false)

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

Game.BEGIN = false
bootSAVE()
}


function removeSpecials() {
    d.getElementById("bottomRow2").style.display = "none"
    d.getElementById("saving").style.display = "none"
    autosave.innerHTML = "<span id='on'>[0]</span> SLOT"
    Game.upgrade["bloodvalve"].Element.style.display = "none"
    Game.upgrade["bloodpipe"].Element.style.display = "none"
    Game.upgrade["bloodvalve"].tick = 1

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

    // StringCounter;
    // `[${StringCounter.replace("  ", "  ")}]`
}
//////

function writeMessage(text, check, delay, type, align) {
    if(align === undefined) align = "left"
    let result = false
    if(check == true) return true;
    if(type == undefined) type = ""

    else if(check === false) {

        let textArray = text.split(" ")
        for(n in textArray) if(textArray[n].includes("$")) { textArray[n] = textArray[n].replace('$', ''); if(variables[textArray[n]])  textArray[n] = variables[textArray[n]]}
        text = ""
        for(n in textArray) text += textArray[n] + " "
        if(delay === 0) result = basicWriter(text, type, align)
        else setTimeout(()=>{ result =  basicWriter(text, type, align)}, delay, align) 
return result;
}}

function basicWriter(text, type, align) {
    newsCounter++
        if(type !== "") keysounds[1].play()
        let temp = text
    if(align === "center") {
        text = "<span class='b'>"
        for(let n = 0; n < (maxChar-temp.length)/2; n++) text += "█"
        text += "</span>" + temp
        text += "<span class='b'>"
        for(let n = 0; n < (maxChar-temp.length)/2; n++) text += "█"
        text += "</span>"
    }

     Game.messageLog[newsCounter] = `<span class="${type}">${text}</span>`
     Game.updated = true;

    
     return true
}

function getMessage(position) {
if(Game.messageLog[position] !== undefined) return Game.messageLog[position]
}

function setMessage(position, text) {
    if(Game.messageLog[position] !== undefined) Game.messageLog[position] = text
}

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
            Game.updated = true;
            if(msgarrayposition >  Aarray.length-1) msgarrayposition = 0

            if(timer > (tick *  Aarray.length * cycles)) {
                clearInterval(msgAnime)
                if(!keep)  Game.messageLog[messagePosition] = initialstrip + "</span>"
                else Game.messageLog[messagePosition] = initialstrip + Aarray[Aarray.length - 1] + "</span>"
            } }, tick)


}, delay)}


//////

function movePane(pane, out) {
    switch(pane) {
        case "left":
            if(out) {
                leftPane.style.animation = "leftOut 0.5s ease"
                setTimeout(()=>{
                    leftPane.style.transform = "translate(-400px)"
                }, 500)
            }
            else {
                leftPane.style.animation = "none"
                leftPane.style.animation = "leftIn 0.5s ease"
                leftPane.style.transform = "translate(0px)"
            }
            break;
        case "right":
            if(out) {
                rightPane.style.animation = "rightOut 0.5s ease"
                setTimeout(()=>{
                    rightPane.style.transform = "translate(400px)"
                }, 500)
            }
            else {
                rightPane.style.animation = "rightIn 0.5s ease"
                rightPane.style.transform = "translate(0px)"
            }
            break;
    }
}

/////

function addUpgrade(preset) {

    Game.upgrade[preset[0]] = {}
    Game.upgrade[preset[0]].reference = preset[0]

    let reference = Game.upgrade[preset[0]].reference

    Game.upgrade[reference].counter = 0
    Game.upgrade[reference].number = 0
    Game.upgrade[reference].savePosition =  Object.keys(Game.upgrade).length
    Game.upgrade[reference].name = preset[1]
    Game.upgrade[reference].description = preset[2]
    Game.upgrade[reference].type = preset[3]
    Game.upgrade[reference].cost = preset[4]
    Game.upgrade[reference].costIncreaseRate = preset[5]
    Game.upgrade[reference].tick = preset[6]
    Game.upgrade[reference].previoustick = preset[6]
    Game.upgrade[reference].decaytick = preset[7]
    Game.upgrade[reference].previousdecaytick = preset[7]


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

    if( Game.upgrade[reference].number > 0) {
        Game.upgrade[reference].Element.style.animation = "none"
        Game.upgrade[reference].Element.style.animation = ""

       setTimeout(()=>{
        Game.upgrade[reference].Element.style.animation = "decayTime " + Game.upgrade[reference].decaytick + "s linear"
       }, 10)  
    }

    decayIntervals[reference] = setInterval(()=>{
            decay(reference)
    }, Game.upgrade[reference].decaytick * 1000)


        Game.upgrade[reference].Element.addEventListener("click", ()=> {
            if(Game.counter >= Game.upgrade[reference].cost) {
    
                Game.upgrade[reference].number++
                Game.upgrade[reference].counter++
                Game.counter -= Game.upgrade[reference].cost
                Game.upgrade[reference].cost += Game.upgrade[reference].costIncreaseRate
                Game.upgrade[reference].costIncreaseRate++
                clearInterval(decayIntervals[reference])

                if( Game.upgrade[reference].number > 0) {
                    Game.upgrade[reference].Element.style.animation = "none"
                    Game.upgrade[reference].Element.style.animation = ""
                           setTimeout(()=>{
        Game.upgrade[reference].Element.style.animation = "decayTime " + Game.upgrade[reference].decaytick + "s linear"
       }, 10) 
                } 

                decayIntervals[reference] = setInterval(()=>{
                    decay(reference)
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

Game.special[set[0]] = {}
Game.special[set[0]].reference = set[0]
 let reference = Game.special[set[0]].reference

 Game.special[reference].savePosition = Object.keys(Game.special).length
 Game.special[reference].name = set[1]
 Game.special[reference].description = set[2]
 Game.special[reference].cost = set[3]
 Game.special[reference].hasCost = set[4]
 Game.special[reference].appearAt = set[5]
 Game.special[reference].do = function(){set[6]()}
 Game.special[reference].bought = false
 Game.special[reference].seen = false




   if((Game.special[reference].cost === 0 ||  !Game.special[reference].hasCost) && set[7] === undefined) {
    var node = d.createElement("DIV");
    node.id = reference + "Special";
    node.classList.add("tile");

    node.innerHTML = '<div class="generalDesc"><p id="'+ reference +'Name" class="Name">'+  Game.special[reference].name
    +'</p><p class="Description"  id="'+  reference +'Description">'+  Game.special[reference].description
    +'</p></div><div class=generalNum style="display:none;"><p class="Num" id="'+ reference 
    +'Cost"></p></div>'

   }else if(set[7] === "console") {
    var node = d.createElement("DIV");
    node.id = reference + "Special";
    node.classList.add(set[7])
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


function show() {
    Game.special.opentopscreen.do();
    Game.special.opentopscreen.Element.style.display = "none"
    Game.special.opentopscreen.bought = true
    bottomScreen.style.display = "inline-block";
}

function writeScreenLines() {
    if(previousMaxScreenLines !== maxLines) {
        topScreen.innerHTML = ""
       bottomScreen.innerHTML = ""

        for(let n = maxLines; n > 0; n--) {addScreenLine("A", n)}
        for(let n = maxLines; n > 0; n--) {addScreenLine("B", n)}

        previousMaxScreenLines = maxLines

    }
}

function addScreenLine(screen, number) {
if(screen === "A") {
    topScreen.innerHTML += '<p class="messageStrip" id="'+ screen + number +'"></p>';
} 
if(screen === "B") {
    bottomScreen.innerHTML += '<p class="messageStrip" id="'+ screen + number +'"></p>';
}}

function setScreenLine(line, text) {
if(d.getElementById(line) !== null){ if(d.getElementById(line).innerHTML !== text){  
    d.getElementById(line).innerHTML = text;
}}}

function getScreenLine(line) {
    if(d.getElementById(line) !== null) return d.getElementById(line).innerHTML
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



//charRef.style.fontSize = variables.font + "px"
d.documentElement.style.setProperty("--text-font", variables.font+"px")
d.documentElement.style.setProperty("--text-height", charRef.clientHeight+"px")


maxPaneHeight = outer.clientHeight / 2
maxScreenHeight = Math.floor(maxPaneHeight) -  Math.floor(maxPaneHeight)%charRef.clientHeight

maxChar = ((topPane.clientWidth - 40) - (topPane.clientWidth - 40)%charRef.clientWidth) / charRef.clientWidth

maxLines = Math.floor(maxScreenHeight/charRef.clientHeight)

if(previousMaxLines !== maxLines || previousMaxChar !== maxChar) {

    topScreen.style.height =  maxScreenHeight + "px"
    bottomScreen.style.height = maxScreenHeight + "px"

    topScreen.style.maxWidth = maxChar*charRef.clientWidth + "px"
    bottomScreen.style.maxWidth = topScreen.style.minWidth

    previousMaxLines = maxLines;
    previousMaxChar = maxChar;
    Game.updated = true;
}

writeScreenLines()
if(Game.updated) {
writeToScreen("B")
writeToScreen("A")
Game.updated = false;
}

autosaveTick++
 if(autosavetoggle && !autosavedelay && autosaveTick >= 6000){
   // SAVE(false)
    autosaveTick = 0
 } 

//bottomScreen.scrollTop = bottomScreen.scrollHeight;
title.innerHTML = cmdlocation

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

    if(Game.upgrade[x].number < 1) {
        Game.upgrade[x].Element.style.animation = "none"
        Game.upgrade[x].Element.style.animation = ""}
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
            decay(name)
        }, Game.upgrade[name].decaytick * 1000)
    
        if( Game.upgrade[name].number > 0) {
            Game.upgrade[name].Element.style.animation = "none"
            Game.upgrade[name].Element.style.animation = ""
                   setTimeout(()=>{
        Game.upgrade[name].Element.style.animation = "decayTime " + Game.upgrade[name].decaytick + "s linear"
       }, 10) 
        } 
    
    }
    
    }

}
} else if(type = "all") {
        updateTick("all", "tick")
        updateTick("all", "decay")
    }}


function updateEverything() {

    updateEverythingbutTick()
    updateTick("all", "all")
}



//////
function decay(reference) {
    if( Game.upgrade[reference].number > 0) {
        Game.upgrade[reference].number--
        Game.upgrade[reference].counter--
        Game.upgrade[reference].costIncreaseRate--
        Game.upgrade[reference].cost -= Game.upgrade[reference].costIncreaseRate
        Game.upgrade[reference].Element.style.animation = "none"
        Game.upgrade[reference].Element.style.animation = ""
               setTimeout(()=>{
Game.upgrade[reference].Element.style.animation = "decayTime " + Game.upgrade[reference].decaytick + "s linear"
}, 10) 
        }
}

function checkUpgradeCost() {
    for(x in Game.upgrade) {
    if(Game.counter>=Game.upgrade[x].cost) {
        Game.upgrade[x].numberElement.style.color=""
        Game.upgrade[x].costElement.style.color=""
        Game.upgrade[x].Element.style.borderColor = ""
        Game.upgrade[x].Element.classList.add("active");
    } else {
        Game.upgrade[x].numberElement.style.color="#888"
        Game.upgrade[x].costElement.style.color="#888"
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
    if(e.key === "Backspace" || e.key === "'" || e.key === "/") {
      e.returnValue = false;
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
//   }; 
//taken from https://stackoverflow.com/questions/49280847/firefox-switching-tab-on-backspace


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

 if(inputStream[inputStream.length - 1] === "ArrowDown" && !disableCommands) {
    root.search(variables[variables.$DEFAULT]).scrollD()

    inputStream = []; 
 }

 if(inputStream[inputStream.length - 1] === "ArrowUp" && !disableCommands) {
    root.search(variables[variables.$DEFAULT]).scrollU()

    inputStream = []; 
 }


if(inputStream[inputStream.length - 1] === ">" && !disableCommands) { 

for(n in Game.messageLog) Game.messageLog[n] = Game.messageLog[n].replaceAll('<span id="blinky">█</span>', "")

writeMessage(cmdlocation + "&gt;", false, 0, "")
let line = getMessage(newsCounter).replaceAll(" </span>", "")
setMessage(newsCounter, line + '</span><span id="blinky">█</span>')
inputStream = []; 
keysounds[1].play()
inputStream.push(">")



}
//Game.messageLog[newsCounter].replaceAll('<span id="blinky">█</span>', "")

if(inputStream[0] === ">" && !disableCommands && key !== ">" && key !== "Backspace" && key !== "Shift" && key !== "Enter") {

    setMessage(newsCounter, cmdlocation + "&gt;")
    let line = getMessage(newsCounter).replaceAll('</span><span id="blinky">█</span>', "")
    
    let word = ""
    for(let n = 1; n < inputStream.length; n++) word += inputStream[n]
    word = word.replace(/Shift/g, '');

   setMessage(newsCounter, "<span>" + line + word + '</span><span id="blinky">█</span>') 
   Game.updated = true;
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
   Game.updated = true;
}

//if(inputStream[inputStream.length - 1] === "ArrowUp") { }

if(inputStream[inputStream.length - 1] === "Enter" && inputStream[0] === ">") { 
    keysounds[0].play()

   let line = getMessage(newsCounter).replaceAll('</span><span id="blinky">█</span>', "")
   setMessage(newsCounter, line + '</span>') 

   Game.updated = true;
    cmd = ""

    inputStream.pop()
   // inputStream.shift()

    //console.log(inputStream)

    for(n in inputStream) cmd += inputStream[n]

    inputStream = []
    cmd = cmd.split(";")

    for(n in cmd){ cmd[n] = cmd[n].split(" ")

    for(m in cmd[n]) {

        if(cmd[n][m] == "") cmd[n].splice(cmd[n].indexOf(cmd[n][m]), 1)

         cmd[n][m] = cmd[n][m].replace(/Shift/g, '');
         cmd[n][m] = cmd[n][m].replace(/Backspace/g, '');
         cmd[n][m] = cmd[n][m].replace(/>/g, '');

        if(cmd[n][m].includes("$")) { ;cmd[n][m] = cmd[n][m].replace('$', ''); if(variables[cmd[n][m]])  cmd[n][m] = variables[cmd[n][m]]  }

    }
}
    cmdHistory.push(cmd)

    let msg = ""

for(m in cmd) {
    defaultBreak = false
    for(n in cmds) {
        if(!defaultBreak) {
    switch(cmd[m][0]) {

        case n:
        if(cmds[n][0]) { cmds[n][1]();  break;}
      

        default :
        if(!(cmd[m][0] in cmds) || !cmds[cmd[m][0]][0]) {
        msg = ""

         cmd[m] = cmd[m].slice(" ")

         for(n in cmd[m]) msg += cmd[m][n] + " "

         msg += "is not a command. Try again."
         writeMessage(msg, false, 0, "")
         writeMessage("<br>", false, 0, "")
         defaultBreak = true
         }break;

    } if(cmd[m][0] ==  n) break;
}}}}});

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

// secondHeart.addEventListener("click", ()=>{
//     if (heartOffset < 80) { heartOffset = Math.ceil(( health * 80) / 100)
//     health++
//     pipeCount++
//     }
//     heart.style.setProperty("--heart-offset", heartOffset + "px");
//     secondOffset.innerHTML = `[${health} / 100]`
    
// })

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

    saveslot += btoa(unescape(encodeURIComponent(JSON.stringify(Game.adventureLog)))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(JSON.stringify(Game.messageLog)))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(JSON.stringify(messagePresets)))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(newsCounter))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(autosavetoggle))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(Game.counter))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(health))) + "|"

    // saveslot += btoa(unescape(encodeURIComponent(""))) + "|"
    //for new save Game

    localStorage["Game" + saveslotnumber] = btoa(unescape(encodeURIComponent(saveslot)))

    return localStorage["Game" + saveslotnumber]
}

//////

function LOAD() {

     //decode all that jazz

    if(localStorage["Game" + saveslotnumber]){  loadDump = decodeURIComponent(escape(window.atob(localStorage["Game" + saveslotnumber])))

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

    
    if(loadNullCheck[3]) Game.adventureLog = JSON.parse(loadArray[2])
    if(loadNullCheck[4]) Game.messageLog = JSON.parse(loadArray[3])
    if(loadNullCheck[5]) messagePresets = JSON.parse(loadArray[4])
    if(loadNullCheck[6]) newsCounter = parseInt(loadArray[5])
    if(loadNullCheck[9]) autosavetoggle = loadArray[6] === "true"?true:false
    if(loadNullCheck[10]) Game.counter = parseInt(loadArray[7])
    if(loadNullCheck[14]) health = parseInt(loadArray[8]) 



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


d.querySelector(".outer").style = "min-width: 200px;"


for(n in Game.upgrade) {
Game.upgrade[n].previousdecaytick = 0;
Game.upgrade[n].previoustick = 0;

    if( Game.upgrade[n].number > 0) {
        Game.upgrade[n].Element.style.animation = "none"
        Game.upgrade[n].Element.style.animation = ""

       setTimeout(()=>{
        Game.upgrade[n].Element.style.animation = "decayTime " + Game.upgrade[n].decaytick + "s linear"
       }, 10)  
    }

}
    }}

// //////

function bootSAVE() {
    localStorage.boot = Game.BEGIN
}

let polyidos = [
"NOkOKNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN0dc,':0",
"k.  .,cd0WMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNkc'.    .x",
"k.      .;dKWMMMMMMMMMMMMMMMMMMMMMMMWXd;.       '0",
"K,        .'cONMMMMMMMMMMMMMMMMMMMMKo'.'.       :N",
"Nc        .  .;kNMMMMMMMMMMMMMMMMXd.   ..       dW",
"Nx.             :OWWWMMMMWMMMMMNk,             .OM",
"X0,              .lKNWWWWMMMMWO;               ;XM",
"XXc         ..     .oKWWWWWWKc.     .'.        ;XM",
"XXo.        .,'.     ,kNNWNx'    .,:c,.        cNM",
"XNk.        .':lc;.   .,;;,.  .,lxxl;.        .oWM",
"XXKl.        .,lxkxo:.      ,ok0K0xc'.      .:kNMM",
"XXNX0l.      .':dO000Od:'.,o0KXXKOd:.       'xNMMM",
"XNNN0;         .;lxO00Kx;.:0XK0Oxl,.         ,0MMM",
"NNNW0,           .:oxO0xdkxkK0do:.           lWMMM",
"NNWWWk.           .;cocoXMXocdc'.          .cKMMMM",
"NNWWMW0,            .'lKMMMXd,.           .lXMMMMM",
"KNWMMMMKl.          .oNMMMMMW0,          .oNMMMMMM",
"KNMMMMMMWx.        'xNMMMMMMMMXo'        oNMMMMMMM",
"WMMMMMMMMN:      .lXMMMMMMMMMMMMXd,.    .dWMMMMMMM",
"MMMMMMMMMWkllc;ckXMMMMMMMMMMMMMMMMWKxok00XMMMMMMMM",
"MMMMMMMMMMMMMMWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM"
]


function bootLOAD() {
 
    console.log(`\nPolyiDOS M3 ~ Copyright © ${currentYear} https://polyidos.net`)

    writeMessage("PolyiDOS M3 Emergency Terminal  Version 4.000.0143", false, 0, "", "center")

    for(n in polyidos) {
        writeMessage(polyidos[n], false, 0, "", "center")
    }

    writeMessage("Sat Dec 31 NaN     NaN:Nan:NaN    Press > to start", false, 0, "", "center")

    for(let n = 0; n  < maxLines-(polyidos.length+2)/2; n++) writeMessage("", false, 0, "", "")


  if(localStorage.boot) Game.BEGIN = localStorage.boot === "true"?true:false

  if(localStorage.Game0 !== "howdy" && Game.BEGIN){
    console.log("welcome back!")
     LOAD()
    
    } else if (!Game.BEGIN){
       // prologue1();
    }
    autosavedelay = false
    loopGame()
}


//////

function RESET() {
    removeSpecials()
    for(let n = 0; n <= maxsaveslots; n++) localStorage["Game" + n] = "howdy"
    localStorage.boot = "true"

    window.location.href = window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
}


autosaveclick = function() {
    autosavetoggle = !autosavetoggle
    if(Game.BEGIN) autosavetoggle = false

   }


autosavetoggle = false;


function startGame() {
autosavedelay = true
autosavetoggle = false

//generating the content

bootLOAD()
}

function loopGame() {
setInterval(()=>{

updateEverything();

}, gameTick)

}


powerButton.addEventListener("click", ()=>{
    syssounds.start.play()
    //openFullscreen()
    setTimeout(()=>{
        syssounds.fan.play()
        syssounds.fan.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        
    }, 6000)

powerRow.style.display = "none";

outer.classList.add("Pane")
//columns.left.classList.add("Pane")
//columns.right.classList.add("Pane")
startGame(); //let's go
})