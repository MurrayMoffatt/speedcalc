# speedcalc
Pokemon Go Speed/Distance Calculator
## Description
speedcalc is an app implemented as a website that is used to calculate speed and distance in Pokemon Go for hatching eggs. It is meant to be accessed via a mobile phone.
## Requirements
speedcalc must be placed on a website and then accessed by a browser on your phone. So you'll need a website (with associated web server and domain name). The website must be SSL protected (this is a requirement of the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) that speedcalc uses).
## Installation
Copy the files in the speedcalc [src](src/) folder to a web server. You might like to create a sub-directory within the website and place the files there.
## Instructions
1. Start the Pokemon Go app on your phone and wait a few seconds for it to record your location.
2. Use a browser on your phone to open the speedcalc website (the very first time you do this you will be told that the site wants to use your device's location, allow this request) and press the "Start" button.
3. Travel to your destination (no more than 1.4km from where you start and no more than 8 minutes in duration, speedcalc will tell you if you break these rules).
4. When the Status on the speedcalc website says "Good to go" press the "Stop" button (if the Status says "Too soon, wait xx:xx" then wait until the Status changes).
5. Open the Pokemon Go app and wait 30 secs to get the distance credited to your eggs/buddy.
6. Repeat from step 2.
## Screenshots
![Start screen](/res/images/speedcalc-1.png?raw=true "Start screen")
![In progress screen](/res/images/speedcalc-2.png?raw=true "In progress screen")
## Rational
To hatch eggs in Pokemon Go you have to travel. While the game is open on your phone it frequently records your location and from that calculates the distance you've traveled. This is added to the egg's total distance travelled and when a certain distance is reached (1km, 5km, 7km or 10km, dependant on the egg type) the egg hatches and a Pokemon appears. A good article that explains egg hatching mechanics can be found at [https://www.imore.com/how-to-hatch-eggs-pokemon-go](https://www.imore.com/how-to-hatch-eggs-pokemon-go)

When walking around with the game open on your phone this system works well, but what if you can't be bothered spending a lot of time walking and would rather quickly drive in a car or ride a bike to get the required distance?

If you try driving with the game open on your phone then you will quickly see that it detects this and tells you that you're travelling too fast and it won't count the distance towards your eggs. Maybe we can simply open the game so it records our location, close the game so it can't detect our location, jump into a car and drive somewhere, reopen the game and get it to make a second location measurement and add the distance travelled to our eggs?

Nice try, but the game wants you to *walk* to hatch eggs, so it has some restrictions in place to stop you from simply travelling quickly in a vehicle. Each time the game records your location it compares the current location and time with the previously recorded location and time. If the current location is more than 1.4km from the previous location, or the current time is more than 8 minutes from the previous time, then it considers that you're moving too fast and the measurement isn't added to the egg's distance.

How do we get around these validity checks? We have to make sure that we don't travel more than 1.4km, or allow more than 8 minutes to elapse, between location checks. This is where speedcalc helps you. It shows you exactly how far you've travelled and for how long and if it's safe to open the Pokemon Go app after you've travelled.
