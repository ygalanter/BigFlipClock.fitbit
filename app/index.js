// import libraries
import clock from "clock";
import document from "document";
import {display} from "display";
import * as messaging from "messaging";
import * as fs from "fs";
import { me } from "appbit";
import {preferences} from "user-settings";
import dtlib from "../common/datetimelib"


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

// whether to skip time animation and switch to new time fast
const ANIMATION_DISABLE_ALWAYS = 0
const ANIMATION_DISABLE_ON_SCREEN_WAKEUP = 1
const ANIMATION_ENABLE_ALWAYS = 2
let userSettings;
let screenJustAwoke = true;

// trying to get user settings if saved before
try {
  userSettings = fs.readFileSync("user_settings.json", "json");
} catch (e) {
  userSettings = {timeAnimation: ANIMATION_DISABLE_ON_SCREEN_WAKEUP}
}



// get user time format preference
dtlib.timeFormat = preferences.clockDisplay == "12h" ? 1: 0;

// clock ticks every minute
clock.granularity = "minutes";

// change time animations
function changeTime(position, oldTime, newTime) {
   
    //getting handle on SVG elements for time
    let top_anim_img = document.getElementById(`${position}_top_anim_img`);
    let bottom_anim_img = document.getElementById(`${position}_bottom_anim_img`);
    let top_anim = document.getElementById(`${position}_top_anim`);
    let bottom_anim = document.getElementById(`${position}_bottom_anim`);
    let top_perm_img = document.getElementById(`${position}_top_perm_img`);
    let bottom_perm_img = document.getElementById(`${position}_bottom_perm_img`);
  
    //chanhing time
    top_perm_img.href = `digits/${newTime}top.png`; //new
    bottom_anim_img.href = `digits/${newTime}bottom.png`; //new
  
    // if animation is disabled - we're done here, exiting
    if (userSettings.timeAnimation == ANIMATION_DISABLE_ALWAYS || (userSettings.timeAnimation == ANIMATION_DISABLE_ON_SCREEN_WAKEUP && screenJustAwoke)) {
        return; 
    } 
  
        
    // if we got this far, it means animation is enabled - go for it!
    top_anim_img.href = `digits/${oldTime}top.png`; //old
    bottom_perm_img.href = `digits/${oldTime}bottom.png`; //old
    bottom_anim_img.style.display = "none";
    top_anim.animate('enable');
    setTimeout(function(){bottom_anim_img.style.display = "inline";bottom_anim.animate('enable')},1000);

    
}



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
  
  // if first digit of hours changed - animate it
  if (timeh1 != h1) { 
    changeTime('h1', timeh1, h1)
    timeh1 = h1;
  }
  
  // same as H1 for second hour digit
  if (timeh2 != h2) {
    changeTime('h2', timeh2, h2);
    timeh2 = h2;
  }
  
  
  // same as h1 for first minute digit
  if (timem1 != m1) {
    changeTime('m1', timem1, m1)  
    timem1 = m1;
  }
  
  
  // same as h1 for second minute digit
  if (timem2 != m2) {
    changeTime('m2', timem2, m2)
    timem2 = m2;
  }
  
  // displaying short month name in English
  monthlbl.text = dtlib.getMonthNameShort(dtlib.LANGUAGES.ENGLISH, today.getMonth());
  
  // displaying 0-prepended day of the month
  daylbl.text = dtlib.zeroPad(today.getDate());
  
  // displaying shot day of the week in English
  dowlbl.text = dtlib.getDowNameShort(dtlib.LANGUAGES.ENGLISH, today.getDay());
  
  // displaying AM/PM or 24H
  ampmlbl.text = dtlib.getAmApm(today.getHours());
  
  // resetting screen awoke flag
  screenJustAwoke = false;
} 
 
// assigning clock tick event handler
clock.ontick = () => updateClock();

// and cicking off first time change
updateClock();


// Message is received
messaging.peerSocket.onmessage = evt => {
  
  switch (evt.data.key) {
      case "timeDigitanimation": // if this is animation setting
          userSettings.timeAnimation = JSON.parse(evt.data.newValue).values[0].value;
          break;
  };
      
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};

// on app exit collect settings 
me.onunload = () => {
    fs.writeFileSync("user_settings.json", userSettings, "json");
}

// on display on/off set the flag
display.onchange = () => {
  screenJustAwoke = display.on;
  updateClock();
}
