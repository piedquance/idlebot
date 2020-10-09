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
var newsCounter = -1;
var stopIt = new Audio('css/audio/AUDIO_FILE.mp3');

var save = d.getElementById("save")
var load = d.getElementById("load")
var clear = d.getElementById("clear")
var autosave = d.getElementById("autosave")
var importS = d.getElementById("import")
var exportS = d.getElementById("export")
var exportedUpgrade = []
var exportedSpecial = new Array()
var intervals = []
var decayIntervals = []
var messagePresets = [false]

//cost, increase rate, number of, reference, description, tick, data position, decay rate
var upgradePresets = [
    [10, 5, 0, "Blood Valve", "blood", "Pumps blood every 1 s<br>Decays every 10 s", 1, 0, 10],
    [20, 7, 0, "Blood Pipe", "pipe", "Pipes blood every 0.5 s<br>Decays every 20 s", 0.5, 1, 20],
]

var specialPresets = [
    [30, "SAVING", "Allows you to save.", 0, ()=>{
        d.getElementById("saving").style.display = "initial"
        autosavetoggle = true;
        autosave.innerHTML = "AUTOSAVE <span id='on'>ON</span>"
        }, 20, "HELLYEAHSAVING"],

    [50, "Research Blood Valves", "All valves come equipped with a half-life of 5 seconds.", 1, ()=>{
        data.upgrade[0][5].style.display = ""
    }, 40, "bloodvalves"],

    [10, "Activate Viewport", "", 2, ()=>{
        d.getElementById("messages").style.display = "inline-block"
        d.getElementById("newmessages").style.display = "inline-block"
        
        messagePresets[0] =  checkMessage("Visual display non-responsive. Switching to text-based display.", messagePresets[0])
    }, 5, "viewportYEAH"],

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

]

function removeSpecials() {

    d.getElementById("saving").style.display = "none"
    autosave.innerHTML = "AUTOSAVE <span id='off'>OFF</span>"
    data.upgrade[0][5].style.display = "none"
    data.upgrade[1][5].style.display = "none"
    d.getElementById("messages").style.display = "none"
    d.getElementById("newmessages").style.display = "none"
    data.upgrade[0][10] = 1

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

function checkMessage(text, check) {
    let result = false
    if(check == true) return true;

    else if(check === false) {

        newsCounter++

        newmessages.innerHTML += '<p class="messageStrip" id="strip'+ newsCounter 
        +'" style="animation-name:messageLoad;animation-duration:0.5s">'+newsCounter+ '~ ' + text + '</p>';
       setTimeout(()=>{
           if(d.getElementById("strip" + newsCounter != null)) {
        d.getElementById("strip" + newsCounter).style = "";
       }}, 500)
         result =  true;

       data.messageLog[newsCounter] = text
    }
    
    return result;
}
//////
//Flash remover

setInterval(()=>{
    for(let n = 0; n < newsCounter;n++)
    if(d.getElementById("strip" + n) != null) {
    if(d.getElementById("strip" + n).style != "") {
        d.getElementById("strip" + n).style = ""
}}}, 500)

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

    data.upgrade[dataPosition][13] = true
    data.upgrade[dataPosition][5].style.display = "none"
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
   
    node.innerHTML = '<div class="generalDesc"><div class="Name">'+ name 
    +'</div><div class="Desc">'+ description 
    +'</div></div><div class=generalNum><div class="Num" id="'+ reference 
    +'Cost">'+ cost +'</div></div>'

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

function link(text, back) {

    if(Nodes.hasOwnProperty(text)) {

        let choice = Nodes[text]

        if(choice[0].length === 1) {

        let array = choice[0][0].split("|")
        let linkarray = []
        for(let n = 1; n < array.length; n++) {
            linkarray[n-1] = array[n].split("~")
        }

        messages.innerHTML = "<p class='messageStrip line'>"+ array[0] +"</p>"

        for(n in linkarray) {
            messages.innerHTML += "<br> <span class='bracket'> ></span> <a class='link' onclick=link('"+ linkarray[n][1] +"',false)>"+ linkarray[n][0] +"</a>"
        }

        if(back) data.adventureLog.splice(data.adventureLog.length-1, 1)
        else data.adventureLog[data.adventureLog.length] = text


        messages.innerHTML += "<br><br> <a id='back' class='link' onclick=link('"+ data.adventureLog[data.adventureLog.length-2] + "',true)>Go Back </a>"
    
    } else {
        let out = false
        for(n in choice[0]) {
            if(!out) {
                if(data.counter >= choice[1][n]) {

                    let array = choice[0][n].split("|")
                    let linkarray = []
                    for(let n = 1; n < array.length; n++) {
                        linkarray[n-1] = array[n].split("~")
                    }
            
                    messages.innerHTML = "<p class='messageStrip line'>"+ array[0] +"</p>"
            
                    for(n in linkarray) {
                        messages.innerHTML += "<br> <span class='bracket'> ></span> <a class='link' onclick=link('"+ linkarray[n][1] +"',false)>"+ linkarray[n][0] +"</a>"
                    }
            
                    if(back) data.adventureLog.splice(data.adventureLog.length-1, 1)
                    else data.adventureLog[data.adventureLog.length] = text
            
            
                    messages.innerHTML += "<br><br> <a id='back' class='link' onclick=link('"+ data.adventureLog[data.adventureLog.length-2] + "',true)>Go Back </a>"
                    data.counter -= choice[1][n]
                    out = true

                    if(choice[1][n] == 0) checkMessage(choice[1][0] + " Energy Needed", false);
                    else checkMessage(choice[1][n] + " Energy Used", false);
                }
            }
        }
    }
}
}

let Nodes = {}

function Node(title, text, options) {
    Nodes[title] = []
    Nodes[title][0] = text;
    Nodes[title][1] = options;
}

heartCon = d.getElementById("heartCont")
heartCon.addEventListener("click", ()=>{

    switch (true) {
        case (wires[0] < 32):
            checkMessage(wires[wires[0]], false);
            wires[0]++;
            break;
        case (wires[0] >= 32 && wires[0] < 35):
            wireStop();
            break;
        case (wires[0] == 35):
            stopIt.play();
            break;
    }

})

function wireStop() {
    if(wiresPauses) {
        checkMessage(wires[wires[0]], false)
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
    "<a onclick='stopIt.play()'>AUDIO_FILE.MP3</a>",//20
    "...",//21
    "...",//22
    "...",//23
    "ALRIGHT",//24
    "THAT'S IT",//25
    "IF YOU DON'T STOP...",//26
    "I'LL BE FORCED TO USE MY <i>SECRET MOVE</i>",//27
    "LAST WARNING...",//28
    "<a onclick=' data.counter = 0; if(wiresPauses === false){checkMessage(wires[32], false);wires[0]++;wiresPauses = true}'>eraseCounter.exe</a>",//29
    "...",//30
    "COULD YOU, UM, CLICK ON THE FILE?",//31
    "HAHAHAHAHA!",//32
    "YOU FOOL.",//33
    "FOU FELL INTO MY TRAP!"//34
]
wiresPauses = false

//Math.floor((Math.random() * wires.length))

checkMessage("<br>", false)
d.getElementById("strip0").style = ""


//You wake up locked in a deserted jail cell, completely alone. There is nothing at all in your cell, useful or otherwise.
Node("home", ["You are in a field. There is nothing around you, useful or otherwise.|Look around~look_around|Get up~get_up"], [])
link("home");

Node("look_around", ["Fields as far as the eye can see.|Get up~get_up"], [])

Node("get_up", ["You get up.|Look at yourself[MISSING]~", "You try to get up. You fail.<br>But maybe if you had more power..."], [10, 0])



//////


let saveslot = "";

function SAVE(isClear) {
    if(!autosavetoggle && !isClear) checkMessage("STATE SAVED", false)

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

    for(let n = 2; n < loadArray.length - 1; n++) {
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


    for(let n = 3; n <= messages.children.length - 4; n += 3) {
        if(messages.children[n].attributes.onclick.value.includes("''")) {
            for(m in Nodes[data.adventureLog[data.adventureLog.length - 1]][0]) {
               if (Nodes[data.adventureLog[data.adventureLog.length - 1]][0][m].split("|")[0] ===  messages.children[0].innerHTML) {
                for(var i = 1; i < Nodes[data.adventureLog[data.adventureLog.length - 1]][0][m].split("|").length; i++) {

                        messages.children[n].attributes.onclick.value = `link("${Nodes[data.adventureLog[data.adventureLog.length - 1]][0][m].split("|")[i].split("~")[1]}",false);`

                        messages.children[n].innerHTML = `${Nodes[data.adventureLog[data.adventureLog.length - 1]][0][m].split("|")[i].split("~")[0]}`

                   }
               }
            }
        } 
    }

    removeSpecials()

    for(n in data.special) if(data.special[n][4]) {
        specialPresets[n][4]()
        data.special[n][1].style.display = "none"

         }  else if (data.special[n][6]) data.special[n][1].style.display = ""

            else data.special[n][1].style.display = "none"



    if(loadNullCheck[9]) autosavetoggle = loadArray[9] === "true"?true:false

    switch (autosavetoggle) {
        case true:
        autosave.innerHTML = "AUTOSAVE <span id='on'>ON</span>"
        break;
        case false:
        autosave.innerHTML = "AUTOSAVE <span id='off'>OFF</span>"
        break;
    }

} catch (error) {
     CLEAR()
     console.log(`There was an error in load: ${error}`)
     alert(`There was an error on load. Here's your data: ${localStorage.data}`)
}
}


function CLEAR() {
    var CLEARspookN = 45
    var CLEARspook = setInterval(()=>{
        d.getElementById("newmessages").style.display = "inline-block"
        d.getElementById("topPane").style.height = CLEARspookN + "vh"
        CLEARspookN += 5
        checkMessage("ERROR", false);
    },10)

    setTimeout(()=>{
        clearInterval(CLEARspook)
        d.getElementById("newmessages").style.display = "none"
        d.getElementById("topPane").style.height = "40vh"
        newmessages.innerHTML = ""
        data.messageLog = new Array()
        newsCounter = -1
    }, 800)

    localStorage.data = ""
    data.counter = 0;
    rightChildren = 0;
    newsCounter = -1;
    wires[0] = 1

    messagePresets = new Array(10)
    messagePresets.fill(false)


    for(n in intervals) {
        clearInterval(intervals[n])
    }

    wiresPauses = false

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

    autosavetoggle = false

    data.messageChecker = new Array()
    data.messageChecker.fill(false);
    data.messageLog = new Array()
    SAVE(true)
    removeSpecials()
    autosavetoggle = false
    link("home")
}

//////

let autosavetoggle = false;

autosave.addEventListener("click", ()=>{
    autosavetoggle = !autosavetoggle
    
    switch (autosavetoggle) {
        case true:
        checkMessage("AUTOSAVE ACTIVATED", false)
        autosave.innerHTML = "AUTOSAVE <span id='on'>ON</span>"
        break;
        case false:
        checkMessage("AUTOSAVE DEACTIVATED", false)
        autosave.innerHTML = "AUTOSAVE <span id='off'>OFF</span>"
        break;
    }

})

save.addEventListener("click", ()=>{ SAVE(false) })
load.addEventListener("click", ()=>{ LOAD() ; })
clear.addEventListener("click", ()=>{ CLEAR() })
exportS.addEventListener("click", ()=>{ 

    let exportFile = SAVE(false)

    const text = exportFile
    try {
       navigator.clipboard.writeText('"' +text + '"')
       checkMessage("DATA COPIED TO CLIPBOARD", false)
    } catch (err) {
        checkMessage("DATA FAILED TO EXPORT", false)
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

// setInterval(()=>{
// if(data.counter > 0) count(0)
// }, decayTick)

 autosavedelay = true;

 setTimeout(()=>{

     LOAD(); 
     autosavedelay = false
 }, 50)

// if(localStorage.firstSave !== "true") CLEAR()

var date = new Date(); let currentYear = date.getFullYear(); 

console.log(`IdleBot ~~ An incremental game\nCopyright © ${currentYear} https://shutterstacks.net`)

setInterval(()=>{

    count(pipeCount)
    pipeCount = 0

 if(autosavetoggle && !autosavedelay) SAVE(false)

//for(n in messagePresets) if(data.counter >= messagePresets[n][1]) data.messageChecker[n] = checkMessage(messagePresets[n][0], data.messageChecker[n]);

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