/*******************************************
Pokemon Go Speed/Distance Calculator Scripts
********************************************

History
-------
17/08/2018 Murray Moffatt
  Initial coding.
25/08/2018 Murray Moffatt
  Changes to support the new CSS classes added.
****************************************/

// Global variables
var currentState = "stopped";
var startTime;
var startLatitude = 0;
var startLongitude = 0;
var currentLatitude = 0;
var currentLongitude = 0;
var currentAccuracy = 0;
var geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 60000,
  maximumAge: 0
}
var watchID;
var metersPerMinute = 175;
var metersPerSecond = metersPerMinute / 60;

$(document).ready(function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getStartLocation, geolocationStartError, geolocationOptions);
  } else {
    $("#errormsg").html("Your browser does not support Geolocation");
  }

  $("#btnStartStop").click(function() {
    buttonClick();
  });
});


/****************************************
Support functions
****************************************/
function getStartLocation(position) {
  startLatitude = position.coords.latitude;
  startLongitude = position.coords.longitude;
  startTime = new Date();
}


function getCurrentLocation(position) {
  currentLatitude = position.coords.latitude;
  currentLongitude = position.coords.longitude;
  currentAccuracy = position.coords.accuracy;
  updateStatus();
}


function geolocationStartError(err) {
  $("#errormsg").html("There was an error obtaining your position!<br><br>Error: " + err.code + " - " + err.message + "<br><br>Either your browser doesn't support the Geolocation service or you have disabled it.");
  $("#btnStartStop").hide();
}


function geolocationRunningError(err) {
  $("#errormsg").html("Geolocation Error: " + err.code + " - " + err.message).show();
}


function buttonClick() {
  switch(currentState) {
    case "stopped":
      $("#instructions").hide();
      $("#status").show().html("Starting, don't move yet!");
      $("#btnStartStop").text("Stop");
      currentState = "running";
      navigator.geolocation.getCurrentPosition(getStartLocation, geolocationStartError, geolocationOptions);
      watchID = navigator.geolocation.watchPosition(getCurrentLocation, geolocationStartError, geolocationOptions);
      break;
    case "running":
      navigator.geolocation.clearWatch(watchID);
      $("#instructions").show();
      $("#status").hide();
      $("#btnStartStop").text("Start");
      currentState = "stopped";
      currentLatitude = 0;
      currentLongitude = 0;
      break;
  }
}


function updateStatus() {
  var currentTime = new Date();
  var duration = Math.round((currentTime - startTime) / 1000);
  var minutes = Math.floor(duration / 60);
  var seconds = duration - minutes * 60;
  var minutesSeconds = str_pad_left(minutes,"0",1) + ":" + str_pad_left(seconds,"0",2);
  var meters = Math.round(distance(startLongitude, startLatitude, currentLongitude, currentLatitude));
  var maxMeters = metersPerSecond * duration;
  $("#errormsg").hide();
  var status = "Start Lat: " + startLatitude + "<br>Start Long: " + startLongitude + "<br>" +
    "Current Lat: " + currentLatitude + "<br>Current Long: " + currentLongitude + "<br>" +
    "Current Accuracy: " + Math.round(currentAccuracy) + " meters<br>" +
    "Duration: " + minutesSeconds + "<br>Distance: " + meters + " meters<br>Status: ";
  if (duration > (60 * 8)) {
    status += "<span class=\"statusnotok\">More than 8 minutes</span>";
  } else if (meters > 1400) {
    status += "<span class=\"statusnotok\">Too far</span>";
  } else if (meters > (metersPerSecond * duration)) {
    var waitTime = Math.round((meters / metersPerMinute) * 60) - duration;
    minutes = Math.floor(waitTime / 60);
    seconds = waitTime - minutes * 60;
    waitTime = str_pad_left(minutes,"0",2) + ":" + str_pad_left(seconds,"0",2);
    status += "<span class=\"statusnotok\">Too soon, wait " + waitTime + "</span>";
  } else {
    status += "<span class=\"statusok\">Good to go</span>";
  }
  $("#status").html(status);
}


function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad();
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  d = d * 1000; // Distance in meters
  return d;
}


/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}


function str_pad_left(string,pad,length) {
  return (new Array(length+1).join(pad)+string).slice(-length);
}
