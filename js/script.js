let a = (code) => {
if(code === "fnm29q34u34uwszhetgn43uh9tgnzaPU4nutnzATg48atn9ganwt4p9tpogzwpo8tfg4wz9tgzwtg4n9wt4") {
let time = document.getElementById("time")
let date = new Date();


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


if (document.addEventListener) {
    document.addEventListener('contextmenu', function(e) {
      alert("You've tried to open context menu"); //here you draw your own menu
      e.preventDefault();
    }, false);
  } else {
    document.attachEvent('oncontextmenu', function() {
      alert("You've tried to open context menu");
      window.event.returnValue = false;
    });
  }


  window.document.addEventListener('keydown', e => {
    if(e.key === "Backspace" || e.key === "'" || e.key === "/" || e.key === "Tab" || e.key === "i") {
      e.returnValue = false;
      e.preventDefault();
      e.stopPropagation();
      //Put some logic to simulate backspacke key in your input content here
    }
  })
  //taken from https://stackoverflow.com/questions/49280847/firefox-switching-tab-on-backspace


}}


a("fnm29q34u34uwszhetgn43uh9tgnzaPU4nutnzATg48atn9ganwt4p9tpogzwpo8tfg4wz9tgzwtg4n9wt4");

a = null;