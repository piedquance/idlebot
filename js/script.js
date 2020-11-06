let time = document.getElementById("time")
var date = new Date();

// setInterval(()=>{
// date = new Date();
// time.innerHTML = `Now is ${date.toString()}`

// }, 100)

let iteration = 0;

window.addEventListener("load", ()=>{
for(m in mods){
    setTimeout(()=>{mods[m]()}, (parseInt(m)+1)*5000)
} 
}, false);


mods = [
    ()=>{
        console.log(iteration)
        iteration++
    },()=>{
        console.log(iteration)
        iteration++
    }
]