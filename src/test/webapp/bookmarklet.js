/**
 * 
 */

function clickGin () {
	console.log("Click gin");
	document.getElementById("gin").click();
	window.setTimeout( enterPin, 200 );
}

function enterPin () {
	console.log("Enter PIN");
	document.getElementById("pin1").click();
	document.getElementById("pinOK").click();
	window.setTimeout( clickStart, 200 );
}

function clickStart () {
	document.getElementById( "startGame" ).click();
}

window.setTimeout( clickGin, 20 );

