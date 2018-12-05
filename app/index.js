// import libraries
import clock from "clock";
import document from "document";
import {display} from "display";
import {preferences as user_settings} from "user-settings";
import dtlib from "../common/datetimelib";
import { FitbitFlip } from 'fitbit-flip';
import asap from "fitbit-asap/app"
import {preferences} from "fitbit-preferences";

// get handle on textboxes for date, DoW, AM/PM
let monthlbl = document.getElementById("month");
let daylbl = document.getElementById("day");
let dowlbl = document.getElementById("dow");
let ampmlbl = document.getElementById("ampm");

// get a handle of animations
const hour1 = new FitbitFlip({id: "hour1", img_width: 84,img_height: 67, duration: 1});
const hour2 = new FitbitFlip({id: "hour2", img_width: 84,img_height: 67, duration: 1});
const minute1 = new FitbitFlip({id: "minute1", img_width: 84,img_height: 67, duration: 1});
const minute2 = new FitbitFlip({id: "minute2", img_width: 84,img_height: 67, duration: 1});


// intially time is not set
let timeh1 = 0;
let timeh2 = 0;
let timem1 = 0;
let timem2 = 0;
let initialized = false;

// whether to skip time animation and switch to new time fast
const ANIMATION_DISABLE_ALWAYS = 0
const ANIMATION_DISABLE_ON_SCREEN_WAKEUP = 1
const ANIMATION_ENABLE_ALWAYS = 2
let screenJustAwoke = true;

// trying to get user settings if saved before
if (isNaN(preferences.timeAnimation)) preferences.timeAnimation = ANIMATION_DISABLE_ON_SCREEN_WAKEUP;

// get user time format preference
dtlib.timeFormat = user_settings.clockDisplay == "12h" ? 1: 0;

// clock ticks every minute
clock.granularity = "minutes";

// change time animations
function changeTime(elem, oldTime, newTime) {
   
    //chanhing time
    elem.startStaticImage = `digits/${newTime}top.png`; //new
    elem.endImage = `digits/${newTime}bottom.png`; //new
    elem.startImage = `digits/${oldTime}top.png`; //old
    elem.endStaticImage = `digits/${oldTime}bottom.png`; //old

    // if animation is disabled set animation duration to 0 otherwise to 1
    if (preferences.timeAnimation == ANIMATION_DISABLE_ALWAYS || (preferences.timeAnimation == ANIMATION_DISABLE_ON_SCREEN_WAKEUP && screenJustAwoke)) {
      elem.duration = 0
    } else {
      elem.duration = 1
    }
       
    elem.flip();
  
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
  
  if (timeh1 != h1 || !initialized) { 
    changeTime(hour1, timeh1, h1)
    timeh1 = h1;
  }
  
  if (timeh2 != h2 || !initialized) {
    changeTime(hour2, timeh2, h2);
    timeh2 = h2;
  }
  
  if (timem1 != m1 || !initialized) {
    changeTime(minute1, timem1, m1)  
    timem1 = m1;
  }
  
  if (timem2 != m2 || !initialized) {
    changeTime(minute2, timem2, m2)
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
  
  // resetting screen awoke & initialized flag
  screenJustAwoke = false;
  initialized =true;
} 
 
// assigning clock tick event handler
clock.ontick = updateClock;


// Message is received
asap.onmessage = data  => {
  switch (data.key) {
      case "timeDigitanimation": // if this is animation setting
          preferences.timeAnimation = JSON.parse(data.newValue).values[0].value;
          break;
  };
      
}


// on display on/off set the flag
display.onchange = () => {
  screenJustAwoke = display.on;
  updateClock();
}
