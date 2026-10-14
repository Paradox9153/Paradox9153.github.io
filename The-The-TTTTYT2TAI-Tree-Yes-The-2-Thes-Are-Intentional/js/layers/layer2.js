addLayer("q", {
    name: "prestige2test", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#8400ffff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "P2", // Name of prestige currency
    baseResource: "P*", // Name of resource prestige is based on
    baseAmount() {return player["p"].points}, // Get the current amount of baseResource
    branches: ["p"],
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    canBuyMax: true,
    requires: 1000,
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, 
    resetsNothing() {return false},
    layerShown(){return true},
    upgrades: {
    11: {
        title: "Another Begining",
        description: "Multiply P* points",
        tooltip(){if (options.showAdvancedTooltips) return("x4 P* gain")},
        cost: new Decimal(1),
    },
    },
}),
addLayer("ran", {
    name: "ran", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "⚄", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(10),
        dicetimer: new Decimal(10),
        last_roll: new Decimal(0)
    }},
    color: "#ff8080",
    resource: "⚄ units", // Name of prestige currency
    baseResource: "P*",
    baseAmount() {return player["p"].points},
    branches: ["q"],
    requires: new Decimal(1),
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    layerShown(){return (player["q"].total.gte(2))},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, 
    resetsNothing() {return false},

    update(diff) {if (player[this.layer].dicetimer>0) player[this.layer].dicetimer = Math.max(0, player[this.layer].dicetimer - diff) },
    clickables: {
    11: {
        display() {return "Click to roll Dice \n\n" + Math.ceil(player[this.layer].dicetimer) + "s"},
        effect() {
            return 0
        },
        canClick() {return (player[this.layer].dicetimer == 0)},
        onClick() {
            player[this.layer].dicetimer = Math.max(0,player[this.layer].dicetimer + 1),
            player[this.layer].last_roll = Math.floor(Math.random() * 6) + 1,
            player[this.layer].points = player[this.layer].points.add(player[this.layer].last_roll)
        },
    },
    },
    upgrades: {
    
    },
    tabFormat: {
        "Main": {
            content:[
            "main-display",
            ["display-text",
            function() {return 'Last roll +' + format(player[this.layer].last_roll) + ' ⚄ units'}
            ],
            "blank","h-line","blank",["clickable","11",{'width': '200px', 'height': '200px'}],"blank",
            ]
        },
    },   
})