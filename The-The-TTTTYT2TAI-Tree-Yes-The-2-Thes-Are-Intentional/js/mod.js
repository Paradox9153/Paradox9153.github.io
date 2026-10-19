let modInfo = {
	name: "TTTTYT2TAI!",
	id: "9153id",
	author: "Paradox9153",
	pointsName: "points",
	modFiles: ["tree.js","layers/SideLayers.js","layers/layer1.js","layers/layer2.js"],
	
	discordName: "test835",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1.2",
	name: "Small things mostly",
}

//let changelog = changelog
// changelog is in modchangelog.js file
	

	

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything","rollDice"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	let tidegain = new Decimal(1) 

	if (hasUpgrade('p', 11)) gain = gain.add(1)
	if (hasUpgrade('p', 12)) gain = gain.times(upgradeEffect('p', 12))
	if (hasUpgrade('p', 21)) gain = gain.times(upgradeEffect('p', 21))
	if (hasUpgrade('p', 31)) tidegain = tidegain.add(upgradeEffect('p', 31))
	if (hasUpgrade('p', 32)) tidegain = tidegain.add(upgradeEffect('p', 32))
	gain = gain.times(tidegain)	

	if (hasUpgrade('q', 12)) gain = gain.times(upgradeEffect('q', 12))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

function rollDice(n,dicemult) {
    let rolls = []
	let rollSum1 = 0
	let rollSum2 = 0
	let rollText = ""
	let rollTextS = ""
    for (let i = 0; i < n; i++){
		let rollVal = (Math.floor(Math.random() * 6) + 1)
		let fullRollVal = rollVal*dicemult
        rolls.push(fullRollVal)
		rollSum1 = rollSum1 + rollVal
		rollSum2 = rollSum2 + fullRollVal
		if (i>0) rollText = rollText + " + "
		rollText = `${rollText + rollVal}`
        }
	if (n>1) rollTextS = "s"
    return [rolls,[rollSum1,rollSum2],rollText,rollTextS]
    }
