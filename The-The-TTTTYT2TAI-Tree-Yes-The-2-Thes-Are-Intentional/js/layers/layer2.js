addLayer("q", {
    name: "prestige2test", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        sequels: new Decimal(0),
    }},
    color: "#8400ffff",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    base: new Decimal (10),
    resource: "P2", // Name of prestige currency
    baseResource: "P*", // Name of resource prestige is based on
    baseAmount() {return player["p"].points}, // Get the current amount of baseResource
    branches: ["p"],
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    canBuyMax: true,
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

    update(diff){
        if(hasUpgrade("tag","tree_2_2")){
            let seqGain= new Decimal(0)
            seqGain=seqGain.add(player["q"].points)
            player["q"].sequels = player["q"].sequels.add(seqGain.times(diff))
        }
    },

    upgrades: {
    11: {
        title: "Another Begining",
        description: "Multiply P* points<br>x4",
        tooltip(){if (options.showAdvancedTooltips) return("x4 P* gain")},
        cost: new Decimal(1),
    },
    12: {
        title: "Backwards Help",
        description: "Boost points gain based on best P2",
        tooltip(){if (options.showAdvancedTooltips) return("x(P2/5)+1 points gain")},
        cost: new Decimal(3),
        effect() {
        return player[this.layer].best.div(5).add(1)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
    },
    13: {
        title: "More To See",
        description: "Unlock More P* Upgrades",
        tooltip(){if (options.showAdvancedTooltips) return("Unlock 3rd Row of P* Upgrades")},
        cost: new Decimal(10),
    },
    21: {
        title: "Higher Power",
        description: "Slightly Boost P*s gain exponent<br>+^0.1",
        tooltip(){if (options.showAdvancedTooltips) return("+^0.1 P* gain")},
        cost: new Decimal(20),
    },
    },
    milestones: {
        0: {
            requirementDescription: "5 P2",
            effectDescription: "Gain 1% Of P* Automatically",
            done() {return player[this.layer].points.gte(5) },
            style(){return{"width":"45vw"}},
        },
    },
    tabFormat: {
        "Main": {
            content:[
            "main-display",
            ["display-text",
            function() {return `${hasUpgrade("tag", "tree_2_2") ? `You have ${format(player[this.layer].sequels)} sequels which boost points by x${format(player[this.layer].sequels.divide(100).add(1))}`:""}`}
            ],
            function() {if(hasUpgrade("tag", "tree_2_2")){return "blank"}},
            "prestige-button","blank","resource-display","blank","h-line","blank",
            "upgrades",
            "blank",
            ]
        },
        "Milestones": {
            content:[
            "milestones",
            ]
        },
    },
}),

addLayer("ran", {
    name: "ran", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "⚄", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        dicetimer: new Decimal(10),
        last_roll: [[0],0,"0",""]
    }},
    color: "#ff8080",
    resource: "⚄ units", // Name of prestige currency
    baseResource: "P2",
    baseAmount() {return player["q"].points},
    branches: ["q"],
    requires: new Decimal(25),
    exponent: 1,
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    layerShown(){return (player["q"].total.gte(15) || player["ran"].unlocked == true)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('ran', 11)) mult = mult.times(2)
        return mult
    },
    gainDiceCount() { // Calculate Dice amount
        diceCount = new Decimal(1)
        if (hasUpgrade('ran', 12)) diceCount = diceCount.add(upgradeEffect('ran', 12))
        return diceCount
    },
    row: 1, 
    resetsNothing() {return false},
    

    update(diff) {
    if (player[this.layer].dicetimer>0) player[this.layer].dicetimer = Math.max(0, player[this.layer].dicetimer - diff) 
    },

    automate(){
        if (player["q"].points.gte(25)) player["ran"].unlocked = true 
        if (hasUpgrade("tag","tree_2_3") && (player[this.layer].dicetimer == 0)){
            player[this.layer].dicetimer = Math.max(0,player[this.layer].dicetimer + 10)
            player[this.layer].last_roll = rollDice(diceCount,tmp["ran"].gainMult)
            addPoints("ran",player[this.layer].last_roll[1][1])
        }
    },
    
    clickables: {
    11: {
        display() {return `Click to roll Dice <br><br>${format(player[this.layer].dicetimer)}s`},
        effect() {
            return 0
        },
        canClick() {return (player[this.layer].dicetimer == 0)},
        onClick() {
            player[this.layer].dicetimer = Math.max(0,player[this.layer].dicetimer + 10)
            player[this.layer].last_roll = rollDice(diceCount,tmp["ran"].gainMult)
            addPoints("ran",player[this.layer].last_roll[1][1])
        },
    },
    },
    upgrades: {
    11: {
        title: "Blured Vision",
        description: "Double ⚄ unit gain",
        tooltip(){if (options.showAdvancedTooltips) return("x2 ⚄ unit gain")},
        cost: new Decimal(20),
    },
    12: {
        title: "Just Roll More Dice",
        description: "P2 Boosts ⚄ rolled",
        tooltip(){if (options.showAdvancedTooltips) return("+⌊P2/20⌋ ⚄ rolled")},
        unlocked(){return (hasUpgrade(this.layer, 11))},
        cost: new Decimal(100),
        effect() {
        return player["q"].points.div(20).floor()
        },
        effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id)) },
    },
    },
    tabFormat: {
        "Main": {
            content:[
            "main-display",
            //["display-text",
            //function() {return `t${player[this.layer].total} b${player[this.layer].best}`}
            //],
            ["display-text",
            function() {return `Last roll${player[this.layer].last_roll[3]} ${player[this.layer].last_roll[2]}`}
            ],
            "blank",
            ["display-text",
            function() {return `+${player[this.layer].last_roll[1][0]} x ${tmp["ran"].gainMult}`}
            ],
            ["display-text",
            function() {return `+${player[this.layer].last_roll[1][1]} ⚄ units`}
            ],
            "blank","h-line","blank",["clickable","11",{'width': '200px', 'height': '200px','font-size':'14px'}],"blank","upgrades",
            ]
        },
    },

    glowColor:"#a0404080",
    shouldNotify(){
        return (player[this.layer].dicetimer == 0 && !hasUpgrade("tag","tree_2_3"))
    },
      
    
    doReset(resettingLayer){
        if (resettingLayer == "tag") {

            layerDataReset(this.layer)

        } else {
            if (layers[resettingLayer].row <= layers[this.layer].row) return;
        }
    }

}),

addLayer("tag", {
    name: "tag", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🏷", // This appears on the layer's node. Default is the id with the first letter capitalized
    // nodeStyle: {'color':"rgba(0, 0, 0, 0.8)"},
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        tags: ["0"]
    }},
    color: "#c2578e",
    resource: "Tags", // Name of prestige currency
    baseResource: "⚄ units",
    baseAmount() {return player["ran"].points},
    branches: ["ran"],
    requires: new Decimal(25),
    exponent: 1,
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    layerShown(){return (player["ran"].total.gte(100) || player["tag"].unlocked == true)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainDiceCount() { // Calculate Dice amount
    },
    row: 1, 
    resetsNothing() {return false},
    
    upgrades: {
        "tree_1_3": {
            title: "Broken Star",
            description: "Unlock more P* upgrades and 🏷 doesn't reset P*",
            tooltip(){if (options.showAdvancedTooltips) return("4th Row of P* Upgrades<br>🏷 doesnt reset P*")},
            unlocked(){return true},
            cost: new Decimal(10)
        },
        "tree_2_2": {
            title: "Its Not A Sequel, OK?",
            description: "P2s generate Sequels",
            tooltip(){if (options.showAdvancedTooltips) return("+P2 sequels/sec")},
            unlocked(){return true},
            style(){},
            canAfford(){return (hasUpgrade(this.layer, "tree_1_3"))},
            cost: new Decimal(1),
            effect() {
            return (player["q"].points)
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+"/sec" },
            branches(){
                if (hasUpgrade(this.layer, "tree_1_3")) {
                    return [["tree_1_3","white"]]
                } else return [["tree_1_3","hsl(0, 10%, 60%)"]]
            },
        },
        "tree_2_3": {
            title: "Infinite Fall",
            description: "Automatically roll Dice",
            tooltip(){if (options.showAdvancedTooltips) return("this thing rolls your dice -> o/")},
            unlocked(){return true},
            style(){},
            canAfford(){return (hasUpgrade(this.layer, "tree_2_2"))},
            cost: new Decimal(1),
            branches(){
                if (hasUpgrade(this.layer, "tree_2_2")) {
                    return [["tree_2_2","white"]]
                } else return [["tree_2_2","hsl(0, 10%, 60%)"]]
            },
        },
    },

    prestigeButtonText(){return `
        ${player["tag"].points.lt(1e3) ? "Reset for " : ""}+<b>${formatWhole(tmp["tag"].resetGain)}</b> Tag units!${player["tag"].points.lt(1e3) ? `<br><br>Next at ${(tmp["tag"].roundUpCost ? formatWhole(tmp["tag"].nextAt) : format(tmp["tag"].nextAt))} ${tmp["tag"].baseResource}` : ""}
        `
    },
    microtabs: {
        stuff: {
            "Tree" : {
                content: createBadGrid(5,5,"tree",["1_3","2_2","2_3"]) //createBadGrid's ids must be sorted because im lazy
            }
        }    
    },
    tabFormat: {
        "Main": {
            content:[
            "main-display","prestige-button","blank","resource-display","blank","h-line","blank",
            ["microtabs","stuff"],
            "blank",
            ]
        },
    },
})