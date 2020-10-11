
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////VARIABLES///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var countNum = [];
var StringCounter = "";

var d = document;
var heart = d.getElementById("heart");
var counterText = d.getElementById("counter");
var messages = d.getElementById("messages");
var newmessages = d.getElementById("newmessages");
var gameContainer = d.getElementById("gameContainer")
var counterDiv = d.getElementById("counterDiv")
var second = d.getElementById("second")
var secondCounter = d.getElementById("secondCounter")
var secondHeart = d.getElementById("SecondheartColor")
var secondOffset = d.getElementById("secondOffset")
var title = d.querySelector("title")
second.style.display = "none";

var leftPane = d.getElementById("left")
var rightPane = d.getElementById("right")
let EnergySwitch = d.getElementById("EnergySwitch")

var save = d.getElementById("save")
var load = d.getElementById("load")
var reset = d.getElementById("reset")
var autosave = d.getElementById("autosave")
var importS = d.getElementById("import")
var exportS = d.getElementById("export")
var close = d.getElementsByClassName("close");
var rightChildren = 0;
var newsCounter = -1;
let heartOffset = 0;
let pipeCount = 0;

let ExpandToggle = false;
let EnergySwitchToggle = false;
let autosavetoggle = false;
let disableCommands = false;
let saveslot = "";
var audio = {
    "stopIt" : new Audio('css/audio/AUDIO_FILE.mp3'),
    "AllStar":  new Audio('css/audio/AllStar.mp3'),
    "turtles": new Audio('css/audio/HappyTogether.mp3')

}


var exportedUpgrade = []
var exportedSpecial = new Array()
var intervals = []
var decayIntervals = []
var messagePresets = [false]


///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////PRESETS/////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


//cost, increase rate, number of, name, reference, description, tick, data position, decay rate, type, message[optional]
var upgradePresets = [
    [10, 5, 0, "Blood Valve", "blood", "Pumps blood every 1 s<br>Decays every 10 s", 1, 0, 10, "basicCounter"],
    [20, 7, 0, "Blood Pipe", "pipe", "Pipes blood every 0.5 s<br>Decays every 20 s", 0.5, 1, 20, "basicCounter"],

    [10, 5, 0, "Logger", "logger", "Logs a message every second.<br>\"it's useless\" -the dev", 1, 2, 0, "Logger", "yo"]
]

var specialPresets = [
    [30, "SAVING", "Allows you to save.", 0, ()=>{
        d.getElementById("saving").style.display = "flex"
        autosavetoggle = true;
        autosave.innerHTML = "<span id='on'>[ON]</span> AUTOSAVE"
        }, 20, "HELLYEAHSAVING"],

    [50, "Research Blood Valves", "All valves come equipped with a half-life of 5 seconds.", 1, ()=>{
        data.upgrade[0][5].style.display = ""
    }, 40, "bloodvalves"],

    [20, "Activate Viewport", "", 2, ()=>{
        d.getElementById("messages").style.display = "inline-block"
        
        messagePresets[0] =  writeMessage("Visual display non-responsive. Switching to text-based display.", messagePresets[0], 0)
    }, 11, "viewportYEAH"],

    [100, "Upgrade Blood Valves", "Now twice as efficient!", 3, ()=> {

        data.upgrade[0][10] = 0.5

        clearInterval(intervals[0])

        intervals[0] = setInterval(()=>{
            if(data.upgrade[0] !== null && data.upgrade[0] !== undefined &&data.upgrade[0][2] > 0) {
            count(data.upgrade[0][0])
        }}, data.upgrade[0][10] * 1000)

    }, 70, "bloodbetter1"],

    [100, "Research Blood Pipes", "It ain't gonna pipe itself...", 4, ()=>{
        data.upgrade[1][5].style.display = ""
    }, 80, "bloodpipes"],

    [0, "Open", "", 5, ()=>{
        for(n in close){  if(close[n].style !== undefined) {close[n].style.animation = "open-sesame 2s ease"; close[n].style.width = "0%"}}

    }, 10, "opensesame"],

    [0, "Activate Console", "", 6, ()=>{
        d.getElementById("newmessages").style.display = "inline-block"
        disableCommands = true
        setTimeout(()=>{disableCommands = false},13000)
        writeMessage("CONSOLE ACTIVATED", false, 0)
        writeMessage("...", false, 3000)
        writeMessage("...WHO IS THIS?", false, 5000)
        writeMessage("AH, RIGHT. YOU DON'T KNOW HOW TO TYPE", false, 7000)
        writeMessage("TYPE > TO ACTIVATE THE CONSOLE PROMPT", false, 9000)
        writeMessage("THEN WRITE name yourname", false, 11000)
        writeMessage("IN THAT ORDER", false, 13000)

        var nameInterval = setInterval(()=>{

            if(cmdHistory[cmdHistory.length - 1] !== undefined) { if(cmdHistory[cmdHistory.length - 1][0] == ">name") {

                console.log("yo")
                clearInterval(nameInterval)
                data.counter = 10

            }}

        }, 10)



    }, 0, "console"]

]

function removeSpecials() {

    d.getElementById("saving").style.display = "none"
    autosave.innerHTML = "<span id='off'>[OFF]</span> AUTOSAVE"
    data.upgrade[0][5].style.display = "none"
    data.upgrade[1][5].style.display = "none"
    d.getElementById("messages").style.display = "none"
    d.getElementById("newmessages").style.display = "none"
    data.upgrade[0][10] = 1
    for(n in close) { if(close[n].style !== undefined) { close[n].style.animation = ""; close[n].style.width = "50%"}}

    // intervals[0] = setInterval(()=>{
    //     if(data.upgrade[0] !== null && data.upgrade[0] !== undefined) {
    //     count(data.upgrade[0][0])
    //     console.log("Annnnnnd it's gone.")
    // }}, data.upgrade[0][10] * 1000)

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
    messageLog : new Array(),
}


data.messageChecker.fill(false);




///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////FUNCTIONS///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


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
    secondCounter.innerHTML =`[${StringCounter.replace("  ", "  ")}]`
}
//////

function writeMessage(text, check, delay) {

    for(let n = 0; n < newsCounter;n++) {
        if(d.getElementById("strip" + n) != null) {
        if(d.getElementById("strip" + n).style != "") {
            d.getElementById("strip" + n).style = ""
    }}}

    let result = false
    if(check == true) return true;

    else if(check === false) {

        if(delay === 0) {
            newsCounter++

            newmessages.innerHTML += '<p class="messageStrip" id="strip'+ newsCounter 
            +'" style="animation-name:messageLoad;animation-duration:0.5s">'+ text + '</p>';
           setTimeout(()=>{
               if(d.getElementById("strip" + newsCounter != null)) {
            d.getElementById("strip" + newsCounter).style = "";
           }}, 500)
             result =  true;
    
           data.messageLog[newsCounter] = text
        } else {setTimeout(()=>{
            
            newsCounter++

            newmessages.innerHTML += '<p class="messageStrip" id="strip'+ newsCounter 
            +'" style="animation-name:messageLoad;animation-duration:0.5s">'+ text + '</p>';
           setTimeout(()=>{
               if(d.getElementById("strip" + newsCounter != null)) {
            d.getElementById("strip" + newsCounter).style = "";
           }}, 500)
             result =  true;
}, delay)

    } 
return result;
}}


function writeCharacter(char, type) {

if(type === "start") {

    newsCounter++
    newmessages.innerHTML += '<p class="messageStrip" id="strip'+ newsCounter 
        +'" >>'+ char + '<span id="blinky">_</span>';

    if(newsCounter > 0) {
        for(let number = 0; number < newsCounter; number++) {
            let child = d.getElementById("strip" + number)
            if (child.children[(child.children.length - 1)] !== undefined)  {
            if (child.children[child.children.length - 1].innerHTML == '_')  { child.removeChild(child.childNodes[1]) }
        }}
    }

} else if(type === "open") {
d.getElementById("strip" + newsCounter).removeChild(d.getElementById("strip" + newsCounter).childNodes[1])
d.getElementById("strip" + newsCounter).innerHTML += char + '<span id="blinky">_</span>'

} else if(type === "end") {
    d.getElementById("strip" + newsCounter).removeChild(d.getElementById("strip" + newsCounter).childNodes[1])
    data.messageLog[newsCounter] =  d.getElementById("strip" + newsCounter).innerHTML

} else if(type == "erase") {
    d.getElementById("strip" + newsCounter).removeChild(d.getElementById("strip" + newsCounter).childNodes[1])
    d.getElementById("strip" + newsCounter).innerHTML = d.getElementById("strip" + newsCounter).innerHTML.slice(0, this.length - 1)
    d.getElementById("strip" + newsCounter).innerHTML += '<span id="blinky">_</span>'
}}

//////
//Flash remover

setInterval(()=>{
    for(let n = 0; n < newsCounter;n++) {
    if(d.getElementById("strip" + n) != null) {
    if(d.getElementById("strip" + n).style != "") {
        d.getElementById("strip" + n).style = ""
}}}}, 400)

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
    let type = preset[9]
   

 var node = d.createElement("DIV");
 node.id = reference + "Upgrade";
 node.classList.add("tile");

 node.innerHTML = '<div class="generalDesc upgradeDesc"><p class="Name">'+ name 
 +'</p><p class="Desc">'+ description
 +'</p><p class="Cost" id="'+ reference +'UpgradeCost">Cost:' + cost
 +'</p></div> <div class="generalNum upgradeNum"><p class="Num" id="'+ reference +'UpgradeNum">' + number + '</p></div>'

 leftPane.appendChild(node)

 data.upgrade[dataPosition] =        [0, cost , number,
    d.getElementById(reference + "UpgradeCost"),
    d.getElementById(reference + "UpgradeNum"),
    d.getElementById(reference + "Upgrade"),
    increaseRate, reference + "Upgrade", name, description, tick,
    reference+ "UpgradeCost", reference+ "UpgradeNum", false, decayRate, reference]


    if(type === "basicCounter") {

    intervals[dataPosition] = setInterval(()=>{
        if(data.upgrade[preset[7]] !== null && data.upgrade[preset[7]] !== undefined && data.upgrade[preset[7]][2] > 0) {
        count(data.upgrade[preset[7]][0])

    }}, data.upgrade[0][10] * 1000)

    decayIntervals[dataPosition] = setInterval(()=>{
        if(data.upgrade[preset[7]] !== null && data.upgrade[preset[7]] !== undefined) {
        if( data.upgrade[preset[7]][2] > 0) {
        data.upgrade[dataPosition][2]--
        data.upgrade[dataPosition][0]--
        data.upgrade[dataPosition][1] -= data.upgrade[dataPosition][6]
        }
    }}, decayRate * 1000)

        data.upgrade[dataPosition][5].addEventListener("click", ()=> {
            if(data.counter >= data.upgrade[dataPosition][1]) {
    
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
                    data.upgrade[dataPosition][1] -= data.upgrade[dataPosition][6]
                    }
                }}, decayRate * 1000)
                
            }
        })

   // data.upgrade[dataPosition][13] = true
    data.upgrade[dataPosition][5].style.display = "none"

    }   else if(type === "Logger") {

        let LoggerMessage = preset[10]

        data.upgrade[dataPosition][5].addEventListener("click", ()=> {
            if(data.counter >= data.upgrade[dataPosition][1]) {   
                data.upgrade[dataPosition][2]++      
                data.counter -= data.upgrade[dataPosition][1]
                data.upgrade[dataPosition][1] += data.upgrade[dataPosition][6]

            }})

        intervals[dataPosition] = setInterval(()=>{
            if(data.upgrade[preset[7]] !== null && data.upgrade[preset[7]] !== undefined && data.upgrade[preset[7]][2] > 0) {
                
                writeMessage("hey.", false, 0)
        
            }}, data.upgrade[0][10] * 1000)

            data.upgrade[dataPosition][5].style.display = "none"


    } else console.log("welp")


}

for(n in upgradePresets) addUpgrade(upgradePresets[n])


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
   if(cost > 0) {
    node.innerHTML = '<div class="generalDesc"><div class="Name">'+ name 
    +'</div><div class="Desc">'+ description 
    +'</div></div><div class=generalNum><div class="Num" id="'+ reference 
    +'Cost">'+ cost +'</div></div>'
   } else {
    node.innerHTML = '<div class="generalDesc"><div class="Name">'+ name 
    +'</div><div class="Desc">'+ description 
    +'</div></div><div class=generalNum><div class="Num" id="'+ reference 
    +'Cost"></div></div>'


   }
    rightPane.appendChild(node)

    data.special[position] = []
    data.special[position][0] = cost
    data.special[position][1] = d.getElementById(reference + "Special")
    data.special[position][2] = d.getElementById(reference + "Cost")
    data.special[position][3] = position
    data.special[position][4] = false;
    data.special[position][5] = rightChildren - 1
    data.special[position][6] = false;
    data.special[position][1].style.display = "none"

    data.special[position][1].addEventListener("click", ()=> {

        if(data.counter >= data.special[position][0]) {
            data.counter -= data.special[position][0]
            data.special[position][1].style.display = "none"
            data.special[position][4] = true
        specialPresets[position][4]()
        }
    })
}

for(n in specialPresets) addSpecial(specialPresets[n])

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
        data.upgrade[x][5].style.borderColor = "#888"
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
        data.special[x][1].style.borderColor = "#888"
        data.special[x][1].classList.remove("active");
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


let inputStream = [];
let cmd = ""
let cmdHistory = []

document.addEventListener('keydown', (event) => {
  key = event.key;
  inputStream.push(key);
//console.log(inputStream);

if(inputStream[inputStream.length - 1] === ">" && !disableCommands) { inputStream = []; 

inputStream.push(">")
writeCharacter("", "start")
}

if(inputStream[0] === ">" && !disableCommands && key !== ">" && key !== "Backspace" && key !== "Shift" && key !== "Enter") writeCharacter(key, "open")


if(inputStream[inputStream.length - 1] === "Backspace") { inputStream.pop(); inputStream.pop(); writeCharacter("", "erase");  }

//if(inputStream[inputStream.length - 1] === "ArrowUp") { }

if(inputStream[inputStream.length - 1] === "Enter") { 

    writeCharacter("", "end")
    
    cmd = ""

    inputStream.pop()
   // inputStream.shift()

    //console.log(inputStream)

    for(n in inputStream) cmd += inputStream[n]

    inputStream = []

    cmdHistory.push(cmd.split(" "))

    cmd = cmd.split(" ")

   // console.log(cmd)

    for(n in cmd) {
        cmd[n] = cmd[n].replace('Shift', '');
        cmd[n] = cmd[n].replace("Shift", '');
      //  console.log(cmd[n])
    }

   // console.log(cmd)

    let msg = ""

    switch(cmd[0]) {

        case ">save":
        SAVE();
        break;

        case ">autosave":
            autosavetoggle = !autosavetoggle
    
            switch (autosavetoggle) {
                case true:
                writeMessage("AUTOSAVE ACTIVATED", false, 0)
                autosave.innerHTML = "<span id='on'>[ON]</span> AUTOSAVE"
                break;
                case false:
                writeMessage("AUTOSAVE DEACTIVATED", false, 0)
                autosave.innerHTML = "<span id='off'>[OFF]</span> AUTOSAVE"
                break;
            } break;
        

        case ">load":
        LOAD();
        break;

        case ">reset":
        RESET();
        break;

        case ">expand":
            ExpandToggle = !ExpandToggle

            if(ExpandToggle) {
            gameContainer.style.display  = "none";
            counterDiv.style.display = "none";
            newmessages.style.maxHeight = "40vh";
            second.style.display = "flex";
            } else if(!ExpandToggle) {
                gameContainer.style.display  = "";
                counterDiv.style.display = "";
                newmessages.style.maxHeight = "";
                second.style.display = "none";
            }

        case ">c":
        if(cmd[1]) data.counter = parseInt(cmd[1]);
        break;

        case ">h":
      //  console.log(cmdHistory);
        writeMessage(JSON.stringify(cmdHistory), false, 0)
        break;

        case ">v":
            specialPresets[2][4]();
            data.special[2][1].style.display = "none"
            data.special[2][4] = true
        break;


        case ">alert":
        if(cmd[1]) alert(cmd[1]); else alert("No message written");
        break;

        case ">echo":
        if(cmd[1]) { 
            if(cmd[cmd.length - 1][0] === "#") { msg = "<span style='color:" + cmd[cmd.length - 1] + "' >"
            for(let n = 1; n < cmd.length - 1; n++)  msg += cmd[n] + " "
            msg += "</span>"
            writeMessage(msg, false, 0)
            writeMessage("<br>", false, 0)
        }  else {
            msg = ""
            for(let n = 1; n < cmd.length; n++)  msg += cmd[n] + " "
            writeMessage(msg, false, 0)
            writeMessage("<br>", false, 0)
        }}
        break;

        case ">wt":

            if(cmd[1] && cmd[2]){
                
                for(let n = 2; n <cmd.length; n++) msg += cmd[n] + " "

                download(msg, cmd[1], "txt");
            }
            else if(!cmd[1]) writeMessage("No name given", false, 0)
            else if(!cmd[2]) writeMessage("No data given", false, 0)
            break;

        case ">clear":
            let clearNum = 0
            if(ExpandToggle) clearNum = 25
             else clearNum = 10
            for(let n = 0; n <= clearNum; n++) {
                writeMessage("<br>", false, 0)
            } break;

        case ">click":
            pipeCount++; heartOffset++;  heart.style.setProperty("--heart-offset", heartOffset + "px"); break;
        
        case ">r": 
        window.location.href = window.location.pathname + window.location.search + window.location.hash;
        window.location.replace(window.location.pathname + window.location.search + window.location.hash);
            // does not create a history entry
      //  window.location.reload(false); 
            // If we needed to pull the document from
            //  the web-server again (such as where the document contents
            //  change dynamically) we would pass the argument as 'true'.
            //taken from https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript
            break;

        case ">play": 

        if(cmd[1]) if(audio[cmd[1]]) audio[cmd[1]].play(); break;
        

        case ">pause": 
        if(cmd[1]) if(audio[cmd[1]]) audio[cmd[1]].pause(); break;
        

        case ">":break;

        default :
         msg = ""

        cmd[0] = cmd[0].slice(1)

        for(n in cmd) msg += cmd[n] + " "
        msg += "is not a command. Try again."
        writeMessage(msg, false, 0)
        writeMessage("<br>", false, 0)
     //   console.log("Unknown command");
        break;
    }
    
}

});



function download(data, filename, type) {
    var file = new Blob([data], {type: type});
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



///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////TEXT ADVENTURE//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////



let Nodes = {}

function Node(node) {
    Nodes[node["title"]] = {}

   if(node["title"]) Nodes[node["title"]].title = node.title;
   if(node["text"]) Nodes[node["title"]].text = node.text;
   if(node.common) Nodes[node["title"]].common = node.common;
   if(node.Value || node.Value == 0) Nodes[node["title"]].Value = node.Value;
}
//taken from https://stackoverflow.com/questions/456177/function-overloading-in-javascript-best-practices


//////


//You wake up locked in a deserted jail cell, completely alone. There is nothing at all in your cell, useful or otherwise.
Node({"title":"home", "text":"You are in a field. There is nothing around you, useful or otherwise.|D~Look around~look_around|S~Get up~get_up"})

Node({"title":"look_around", "text":"Fields as far as the eye can see.|S~Get up~get_up"})

Node({"common":"get_up", "title":"get_up0","text":"You try to get up. You fail.<br>But maybe if you had more power...", "Value":0})

Node({"common":"get_up", "title":"get_up10", "text":"You get up.|S~Look at yourself[MISSING]~look_at_yourself", "Value":10})

Node({"common":"look_at_yourself", "title":"look_at_yourself0", "text":   "fail" , "Value":  0})

Node({"common":"look_at_yourself", "title":"look_at_yourself10", "text": "ok now what?"   , "Value":  10})


link("home", false);
//Node("look_at_yourself", ["After everything, it's still you— wait, what?"], [])

//////

function link(text, back) {


     if(Nodes[text]) {

        let choice = Nodes[text]


        let textarray = choice.text.split("|")
        let linkarray = []
        for(let n = 1; n < textarray.length; n++) {
            linkarray[n-1] = textarray[n].split("~")
        }


        messages.innerHTML = `<p class='messageStrip line'>${textarray[0]}</p>`


        for(n in linkarray) { if(linkarray[n][0] == "D"){

            messages.innerHTML += `<br> <span class='bracket'> > </span> <a onclick="link('${linkarray[n][2]}',false)">${linkarray[n][1]} </a>`
       
        } else if(linkarray[n][0] == "S") {

            messages.innerHTML += `<br> <span class='bracket'> ></span> <a onclick="linkSplit('${linkarray[n][2]}', false)">${linkarray[n][1]}</a>`

        }
    }
}
        if(back && data.adventureLog.length !== 1) data.adventureLog.pop()

        else data.adventureLog[data.adventureLog.length] = text

        if(data.adventureLog.length !== 1) messages.innerHTML += `<br><br> <a id='back' onclick="link('${data.adventureLog[data.adventureLog.length-2]}',true)">Go Back </a>`

}


function linkSplit(text, back) {
    let choiceNumberOf = 0
    let chosenNode = ""

    for(n in Nodes) { if(Nodes[n].common) { if(Nodes[n].common === text) {

        if(data.counter >= Nodes[n].Value) {

            let choice = Nodes[n]
            let textarray = choice.text.split("|")
            let linkarray = []
            for(let n = 1; n < textarray.length; n++) {
                linkarray[n-1] = textarray[n].split("~")
            }
    
            messages.innerHTML = `<p class='messageStrip line'>${textarray[0]}</p>`
    
    
            for(n in linkarray) { if(linkarray[n][0] == "D"){
    
                messages.innerHTML += `<br> <span class='bracket'> ></span> <a onclick="link('${linkarray[n][2]}', false)">${linkarray[n][1]}</a>`
           
            } else if(linkarray[n][0] == "S") {
    
                messages.innerHTML += `<br> <span class='bracket'> ></span> <a  onclick="linkSplit('${linkarray[n][2]}', false)">${linkarray[n][1]}</a>`
    
            }
        }
        chosenNode = choice.title

        data.adventureLog[data.adventureLog.length] = choice.title
        choiceNumberOf++
    
         }
         if(Nodes[n] !== undefined) if(data.counter <= Nodes[n].Value) writeMessage(`${Nodes[n].Value} Energy Needed`, false, 0)

     }}}


     let constData = data.adventureLog.length

     for(let n = constData - 1; n > constData - 1 - choiceNumberOf; n--)  {
     
     if(data.adventureLog[n] !== chosenNode) data.adventureLog.splice(n, 1) 
     }

     data.counter -= Nodes [ data.adventureLog[data.adventureLog.length - 1 ] ].Value
     writeMessage(`${ Nodes [ data.adventureLog[data.adventureLog.length - 1 ] ].Value} Energy Used`, false, 0)

     if(back) data.adventureLog.splice(data.adventureLog.length-1, 1)
     
     messages.innerHTML += `<br><br> <a id='back' onclick="link('${data.adventureLog[data.adventureLog.length-2]}',true)">Go Back </a>`

 }


////////////////
//////WIRES/////
///////////////


wireItems = d.getElementsByClassName("wiresItem")


for(let n = 0; n <= 3; n++)
wireItems[n].addEventListener("click", ()=>{
    if (messagePresets[0]) {
    switch (true) {
        case (wires[0] < 32):
            writeMessage(wires[wires[0]], false, 0);
            wires[0]++;
            break;
        case (wires[0] >= 32 && wires[0] < 35):
            wireStop();
            break;
        case (wires[0] == 35):
            audio.stopIt.play();
            break;
    }
    }
})

function wireStop() {
    if(wiresPauses) {
        writeMessage(wires[wires[0]], false, 0)
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
    "<span class='link' onclick=' data.counter = 0; if(wiresPauses === false){writeMessage(wires[32], false, 0);wires[0]++;wiresPauses = true}'>eraseCounter.exe</span>",//29
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
    if (heartOffset <= 80){ heartOffset += (1 * 80) / 100
    health++
    }
    heart.style.setProperty("--heart-offset", heartOffset + "px");
    secondOffset.innerHTML = `[${health} / 100]`
    pipeCount++
   // if(heartOffset > 77) heartOffset = 0

})


secondHeart.addEventListener("click", ()=>{
    if (heartOffset <= 80) { heartOffset += (1 * 80) / 100
    health++
    }
    heart.style.setProperty("--heart-offset", heartOffset + "px");
    secondOffset.innerHTML = `[${health} / 100]`
    pipeCount++
})

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////SAVING/LOADING//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////



function SAVE(isClear) {
    if(!autosavetoggle && !isClear) writeMessage("STATE SAVED", false, 0)

    //btoa(unescape(encodeURIComponent(str)))
    //localStorage.firstSave = "true"

    localStorage.data = ""
    saveslot = ""

    for(n in data.upgrade) {

        saveslot +=  btoa(unescape(encodeURIComponent(data.upgrade[n][0]))) + "~"
        saveslot +=  btoa(unescape(encodeURIComponent(data.upgrade[n][1]))) + "~"
        saveslot +=  btoa(unescape(encodeURIComponent(data.upgrade[n][2]))) 
        if(n != data.upgrade.length - 1) saveslot += "?"
    }

    saveslot += "|"

    for(n in data.special) {

        saveslot +=  btoa(unescape(encodeURIComponent(data.special[n][4]))) + "~"
        saveslot +=  btoa(unescape(encodeURIComponent(data.special[n][5]))) + "~"
        saveslot +=  btoa(unescape(encodeURIComponent(data.special[n][6]))) 
        if(n != data.special.length - 1) saveslot += "?"
    }

    saveslot += "|"

    saveslot += btoa(unescape(encodeURIComponent(messages.innerHTML))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(newmessages.innerHTML))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(counterText.innerHTML))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(JSON.stringify(data.adventureLog)))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(JSON.stringify(data.messageLog)))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(JSON.stringify(messagePresets)))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(newsCounter))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(autosavetoggle))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(wires[0]))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(wiresPauses))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(data.counter))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(EnergySwitchToggle))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(heartOffset))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(ExpandToggle))) + "|"
    saveslot += btoa(unescape(encodeURIComponent(health))) 

    // saveslot += btoa(unescape(encodeURIComponent(""))) + "|"
    //for new save data

    localStorage.data = btoa(unescape(encodeURIComponent(saveslot)))

    return localStorage.data
}

//////

let loadDump = ""
let loadArray = []

let test = ""

function LOAD() {
 try {
     

    loadDump = decodeURIComponent(escape(window.atob(localStorage.data)))

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

    if(loadNullCheck[0]) for(n in loadArray[0]) {
        data.upgrade[n][0] = parseInt(loadArray[0][n][0])
        data.upgrade[n][1] = parseInt(loadArray[0][n][1])
        data.upgrade[n][2] = parseInt(loadArray[0][n][2])
}

    if(loadNullCheck[1]) for(n in loadArray[1]) {
        data.special[n][4] = loadArray[1][n][0] === "true"?true:false
        data.special[n][5] = parseInt(loadArray[1][n][1])
        data.special[n][6] = loadArray[1][n][2] === "true"?true:false
}

    

    if(loadNullCheck[2]) messages.innerHTML = loadArray[2]
    if(loadNullCheck[3]) newmessages.innerHTML = loadArray[3]
    if(loadNullCheck[4]) counterText.innerHTML = loadArray[4]
    if(loadNullCheck[5]) data.adventureLog = JSON.parse(loadArray[5])
    if(loadNullCheck[6]) data.messageLog = JSON.parse(loadArray[6])
    if(loadNullCheck[7]) messagePresets = JSON.parse(loadArray[7])
    if(loadNullCheck[8]) newsCounter = parseInt(loadArray[8])
    if(loadNullCheck[10]) wires[0] = parseInt(loadArray[10]) //skip 1
    if(loadNullCheck[11]) wiresPauses = loadArray[11] === "true"?true:false
    if(loadNullCheck[12]) data.counter = parseInt(loadArray[12])
    if(loadNullCheck[13]) EnergySwitchToggle = loadArray[13] === "true"?true:false
    if(loadNullCheck[14]) heartOffset = parseInt(loadArray[14]) 
    if(loadNullCheck[15]) ExpandToggle = loadArray[15] === "true"?true:false
    if(loadNullCheck[16]) health = parseInt(loadArray[16]) 


    link(data.adventureLog.pop(), false)



    removeSpecials()

    for(n in data.special) if(data.special[n][4]) {
        specialPresets[n][4]()
        data.special[n][1].style.display = "none"

         }  else if (data.special[n][6]) data.special[n][1].style.display = ""

            else data.special[n][1].style.display = "none"



    if(loadNullCheck[9]) autosavetoggle = loadArray[9] === "true"?true:false

    switch (autosavetoggle) {
        case true:
        autosave.innerHTML = "<span id='on'>[ON]</span> AUTOSAVE"
        break;
        case false:
        autosave.innerHTML = "<span id='off'>[OFF]</span> AUTOSAVE"
        break;
    }

    if(ExpandToggle) {
        gameContainer.style.display  = "none";
        counterDiv.style.display = "none";
        newmessages.style.maxHeight = "40vh";
        second.style.display = "flex";
        } else if(!ExpandToggle) {
            gameContainer.style.display  = "";
            counterDiv.style.display = "";
            newmessages.style.maxHeight = "";
            second.style.display = "none";
        }

    EnergySwitch.style.backgroundImage  = EnergySwitchToggle ? "url('css/images/energySwitch.png')" : "url('css/images/energySwitch2.png')"
    heart.style.setProperty("--heart-offset", heartOffset + "px");
    secondOffset.innerHTML = `[${health} / 100]`



} catch (error) {
     RESET()
     console.log(`There was an error in load: ${error}`)
     alert(`There was an error on load. Here's your data: ${localStorage.data}`)
     RESET()
}}


function RESET() {

    var CLEARspookInterval = setInterval(()=>{
        d.getElementById("newmessages").style.display = "inline-block"
        writeMessage("ERROR", false, 0);
    },10)

    setTimeout(()=>{
        clearInterval(CLEARspookInterval)
        d.getElementById("newmessages").style.display = "none"
        newmessages.innerHTML = ""
        data.messageLog = new Array()
        newsCounter = -1
    }, 400)

    localStorage.data = ""
    data.counter = 0;
    rightChildren = 0;
    newsCounter = -1;
    wires[0] = 1
    heartOffset = 0;
    health = 0;
    cmdHistory = []

    messagePresets = new Array(10)
    messagePresets.fill(false)


    for(n in intervals) {
        clearInterval(intervals[n])
    }

    wiresPauses = false
    EnergySwitchToggle = false



    EnergySwitch.style.backgroundImage = "url('css/images/energySwitch2.png')"

    removeSpecials()

    leftPane.innerHTML  = ""

    for(n in data.upgrade) {
        
        data.upgrade[n][5].style.display = "none"
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
    for(n in upgradePresets) addUpgrade(upgradePresets[n])

    data.adventureLog = []

    newmessages.innerHTML = ""
   // messages.innerHTML = ""

    autosavetoggle = false

    gameContainer.style.display  = "";
    counterDiv.style.display = "";
    newmessages.style.maxHeight = "";
    second.style.display = "none";
    data.messageChecker = new Array()
    data.messageChecker.fill(false);
    data.messageLog = new Array()
    heart.style.setProperty("--heart-offset", heartOffset + "px");
    autosavetoggle = false
    ExpandToggle = false
    gameContainer.style.display  = "";
    counterDiv.style.display = "";
    newmessages.style.maxHeight = "";
    second.style.display = "none";

    link("home", false)
    SAVE(true)
    removeSpecials()


}

//////



autosave.addEventListener("click", ()=>{
    autosavetoggle = !autosavetoggle
    
    switch (autosavetoggle) {
        case true:
        writeMessage("AUTOSAVE ACTIVATED", false, 0)
        autosave.innerHTML = "<span id='on'>[ON]</span> AUTOSAVE"
        break;
        case false:
        writeMessage("AUTOSAVE DEACTIVATED", false, 0)
        autosave.innerHTML = "<span id='off'>[OFF]</span> AUTOSAVE"
        break;
    }

})
let resetOnce = false
save.addEventListener("click", ()=>{ SAVE(false) })
load.addEventListener("click", ()=>{ LOAD() ; })
reset.addEventListener("click", ()=>{ 
    resetOnce= false
    writeMessage("This will erase all of you data. Are you sure that you want to proceed? [<span class='link' onclick='if(!resetOnce) RESET() '>YES</span>][<span class='link' onclick='if(!resetOnce) {writeMessage(`All right.`, false, 0); resetOnce = true}'>NO</span>]", false, 0)

})
exportS.addEventListener("click", ()=>{ 

    let exportFile = SAVE(false)

    const text = exportFile
    try {
       navigator.clipboard.writeText('"' +text + '"')
       writeMessage("DATA COPIED TO CLIPBOARD", false, 0)
    } catch (err) {
        writeMessage("DATA FAILED TO EXPORT", false, 0)
    }

})

importS.addEventListener("click", ()=>{ 

    try {
        localStorage.data = prompt("Please paste your save data here:\n")
        LOAD()
    } catch (error) {
        alert("There was an error in importing your data. Please try again.")
        console.log(`There was an error in importing: ${error}`)
    }

 })

//////

let decayTick = 800
let tick = 10;
let bloodTick = 500;

// setInterval(()=>{
// if(data.counter > 0) count(0)
// }, decayTick)

 autosavedelay = true;

 setTimeout(()=>{

     LOAD(); 
     autosavedelay = false
 }, 50)

// if(localStorage.firstSave !== "true") RESET()

var date = new Date(); let currentYear = date.getFullYear(); 

console.log(`IdleBot ~~ An incremental game\nCopyright © ${currentYear} https://shutterstacks.net`)

setInterval(()=>{

    count(pipeCount)
    pipeCount = 0

if(data.counter >= 999999999) data.counter = 999999999

 if(autosavetoggle && !autosavedelay) SAVE(false)

//for(n in messagePresets) if(data.counter >= messagePresets[n][1]) data.messageChecker[n] = writeMessage(messagePresets[n][0], data.messageChecker[n], 0);

for(n in specialPresets) {
if(data.counter >= specialPresets[n][5] && !data.special[n][4]) {
      data.special[n][1].style.display = ""
      data.special[n][6] = true;
}}
checkUpgradeCost();
checkSpecialCost();

newmessages.scrollTop = newmessages.scrollHeight;
title.innerHTML = Math.floor(data.counter) + " - IdleBot"

updateData();
}, tick)