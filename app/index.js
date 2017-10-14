// import libraries
import clock from "clock";
import document from "document";
import {display} from "display";
import {preferences} from "user-settings";
import dtlib from "../common/datetimelib"

//getting handle on SVG elements for time
let h1_top_anim_img = document.getElementById("h1_top_anim_img");
let h1_bottom_anim_img = document.getElementById("h1_bottom_anim_img");
let h1_top_anim = document.getElementById("h1_top_anim");
let h1_bottom_anim = document.getElementById("h1_bottom_anim");
let h1_top_perm_img = document.getElementById("h1_top_perm_img");
let h1_bottom_perm_img = document.getElementById("h1_bottom_perm_img");


let h2_top_anim_img = document.getElementById("h2_top_anim_img");
let h2_bottom_anim_img = document.getElementById("h2_bottom_anim_img");
let h2_top_anim = document.getElementById("h2_top_anim");
let h2_bottom_anim = document.getElementById("h2_bottom_anim");
let h2_top_perm_img = document.getElementById("h2_top_perm_img");
let h2_bottom_perm_img = document.getElementById("h2_bottom_perm_img");

let m1_top_anim_img = document.getElementById("m1_top_anim_img");
let m1_bottom_anim_img = document.getElementById("m1_bottom_anim_img");
let m1_top_anim = document.getElementById("m1_top_anim");
let m1_bottom_anim = document.getElementById("m1_bottom_anim");
let m1_top_perm_img = document.getElementById("m1_top_perm_img");
let m1_bottom_perm_img = document.getElementById("m1_bottom_perm_img");

let m2_top_anim_img = document.getElementById("m2_top_anim_img");
let m2_bottom_anim_img = document.getElementById("m2_bottom_anim_img");
let m2_top_anim = document.getElementById("m2_top_anim");
let m2_bottom_anim = document.getElementById("m2_bottom_anim");
let m2_top_perm_img = document.getElementById("m2_top_perm_img");
let m2_bottom_perm_img = document.getElementById("m2_bottom_perm_img");

// get handle on textboxes for date, DoW, AM/PM
let monthlbl = document.getElementById("month");
let daylbl = document.getElementById("day");
let dowlbl = document.getElementById("dow");
let ampmlbl = document.getElementById("ampm");


// intially time is not set
let timeh1 = 0;
let timeh2 = 0;
let timem1 = 0;
let timem2 = 0;

// get user time format preference
dtlib.timeFormat = preferences.clockDisplay == "12h" ? 1: 0;

// clock ticks every minute
clock.granularity = "minutes";

// clock tick
function updateClock() {
  if (!display.on) return; // if display is off - don't do anything
  
  let today = new Date(); // get current date/time
  
  // obtaining hours in user-preferred format and split them into 2 digits
  let hours = dtlib.format1224hour(today.getHours());
  let h1 = Math.floor(hours/10);
  let h2 = hours % 10;
  
  // obtaining minutes and split them into 2 digits
  let mins = today.getMinutes();
  let m1 = Math.floor(mins/10);
  let m2 = mins % 10;
  
  // if first digit og hours changed - animate it
  if (timeh1 != h1) { 

    h1_top_perm_img.href = `digits/${h1}top.png`; //new
    h1_top_anim_img.href = `digits/${timeh1}top.png`; //old
    h1_bottom_perm_img.href = `digits/${timeh1}bottom.png`; //old
    h1_bottom_anim_img.style.display = "none";
    h1_bottom_anim_img.href = `digits/${h1}bottom.png`; //new
    h1_top_anim.animate = true;
    setTimeout(function(){h1_bottom_anim_img.style.display = "inline";h1_bottom_anim.animate = true},1000);
    
    timeh1 = h1;
  }
  
  // same as H1 for second hour digit
  if (timeh2 != h2) {
    
    h2_top_perm_img.href = `digits/${h2}top.png`; //new
    h2_top_anim_img.href = `digits/${timeh2}top.png`; //old
    h2_bottom_perm_img.href = `digits/${timeh2}bottom.png`; //old
    h2_bottom_anim_img.style.display = "none";
    h2_bottom_anim_img.href = `digits/${h2}bottom.png`; //new
    h2_top_anim.animate = true;
    setTimeout(function(){h2_bottom_anim_img.style.display = "inline";h2_bottom_anim.animate = true},1000);    
    
    timeh2 = h2;
  }
  
  
  // same as h1 for first minute digit
  if (timem1 != m1) {
    
    m1_top_perm_img.href = `digits/${m1}top.png`; //new
    m1_top_anim_img.href = `digits/${timem1}top.png`; //old
    m1_bottom_perm_img.href = `digits/${timem1}bottom.png`; //old
    m1_bottom_anim_img.style.display = "none";
    m1_bottom_anim_img.href = `digits/${m1}bottom.png`; //new
    m1_top_anim.animate = true;
    setTimeout(function(){m1_bottom_anim_img.style.display = "inline";m1_bottom_anim.animate = true},1000);    
    
    timem1 = m1;
  }
  
  
  // same as h1 for second minute digit
  if (timem2 != m2) {
    
    m2_top_perm_img.href = `digits/${m2}top.png`; //new
    m2_top_anim_img.href = `digits/${timem2}top.png`; //old
    m2_bottom_perm_img.href = `digits/${timem2}bottom.png`; //old
    m2_bottom_anim_img.style.display = "none";
    m2_bottom_anim_img.href = `digits/${m2}bottom.png`; //new
    m2_top_anim.animate = true;
    setTimeout(function(){m2_bottom_anim_img.style.display = "inline";m2_bottom_anim.animate = true},1000);    
    
    timem2 = m2;
  }
  
  // displaying short month name in English
  monthlbl.innerText = dtlib.getMonthNameShort(dtlib.LANGUAGES.ENGLISH, today.getMonth());
  
  // displaying 0-prepended day of the month
  daylbl.innerText = dtlib.zeroPad(today.getDate());
  
  // displaying shot day of the week in English
  dowlbl.innerText = dtlib.getDowNameShort(dtlib.LANGUAGES.ENGLISH, today.getDay());
  
  // displaying AM/PM or 24H
  ampmlbl.innerText = dtlib.getAmApm(today.getHours());
} 
 
// assigning clock tick event handler
clock.ontick = () => updateClock();

// and cicking off first time change
updateClock();
