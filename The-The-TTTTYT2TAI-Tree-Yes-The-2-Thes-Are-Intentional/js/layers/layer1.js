addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P*", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ffaa55cc",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "P*", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 22)) mult = mult.times(upgradeEffect('p', 22))
        if (hasUpgrade('q', 11)) mult = mult.times(4)    
        if (hasMilestone('p', 0)) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
    11: {
        title: "Start From Zero",
        description: "Start generating points",
        tooltip(){if (options.showAdvancedTooltips) return("+1 points per second")},
        cost: new Decimal(0),
    },
    12: {
        title: "Manual Acceleration",
        description: "Boost points gain based on P*",
        tooltip(){if (options.showAdvancedTooltips) return("x([P*]+1) points per second")},
        unlocked(){return (hasUpgrade(this.layer, 11))},
        cost: new Decimal(1),
         effect() {
        return player[this.layer].points.add(1)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
    },
    22: {
       title: "A Nice Gain",
        description: "Boost P* based on points",
        tooltip(){if (options.showAdvancedTooltips) return("x(log2(points)) P* gain")},
        unlocked(){return (hasUpgrade(this.layer, 12))},
        cost: new Decimal(1),
         effect() {
        return player.points.add(1).log(2)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
    },
    },
    milestones: {
        0: {
            requirementDescription: "20 P*",
            effectDescription: "2x P* Gain",
            done() {return player[this.layer].points.gte(20) },
            style(){return{"width":"45vw"}},
        },
        1: {
            requirementDescription: "2000 P*",
            effectDescription: 'Keep "Start From Zero" Upgrade',
            done() {return player[this.layer].points.gte(2000) },
            style(){return{"width":"45vw"}},
        },
    },
    bars: {
        "P*MileBar": {
            direction: RIGHT,
            width: 500,
            height: 20,
            borderStyle() {return {'border-width': "1px"},{'border-radius':"0px"}},
            progress() {return 0.5}
        },
    },
    tabFormat: {
        "Main": {
            content:[
            "main-display","prestige-button","blank","resource-display","blank","h-line","blank","upgrades","blank",
            ]
        },
        "Milestone": {
            content:[
            ["bar","P*MileBar"],"blank","best-display","blank",
            "milestones",
            ]
        },
    },
    doReset(resettingLayer){
        if (layers[resettingLayer].row <= layers[this.layer].row) return;
        
        let keepS = [player[this.layer].best]

        let keepU = []
        if (layers[resettingLayer].row >= 1) {
            if(hasMilestone("p",1)) keepU.push(11)
        }

        let keepM = player[this.layer].milestones
        

        let keep = [keepS,keepU,keepM]

        layerDataReset(this.layer, keep)
        player[this.layer].best = keep[0][0]
        player[this.layer].upgrades = keep[1]
        player[this.layer].milestones = keep[2]
    },
})