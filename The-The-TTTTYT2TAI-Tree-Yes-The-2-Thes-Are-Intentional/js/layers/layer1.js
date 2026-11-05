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
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 22)) mult = mult.times(upgradeEffect('p', 22))
        if (hasUpgrade('q', 11)) mult = mult.times(4)    
        if (hasMilestone('p', 0)) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade('q', 21)) exp = exp.add(0.1) 
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration() {
        passiveGenGain = new Decimal(0)
        if(hasMilestone("q",0)) passiveGenGain = passiveGenGain.add(0.01)
        return passiveGenGain
    },

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
        tooltip(){if (options.showAdvancedTooltips) return("x(sqrt(P*) + 1) points per second")},
        unlocked(){return (hasUpgrade(this.layer, 11))},
        cost: new Decimal(1),
        effect() {
        return player[this.layer].points.root(2).add(1)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
    },
    22: {
       title: "A Nice Gain",
        description: "Boost P* based on points",
        tooltip(){if (options.showAdvancedTooltips) return("x(log2(points)) P* gain")},
        unlocked(){return (hasUpgrade(this.layer, 12))},
        cost: new Decimal(2),
        effect() {
        return player.points.add(1).log(2)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
    },
    21: {
       title: "Clockwise Loop",
        description: "Boost points based on points",
        tooltip(){if (options.showAdvancedTooltips) return("x(points^1/4) points gain")},
        unlocked(){return (hasUpgrade(this.layer, 22))},
        cost: new Decimal(100),
        effect() {
        return player.points.root(4).add(1)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
    },
    31: {
       title: "Low Tide",
        description: "Boost points based on a low wave in relation to points",
        tooltip(){if (options.showAdvancedTooltips) return("x(sin(sqrt(x)+π) + 0.25(points^1/4)) points gain")},
        unlocked(){return (hasUpgrade("q", 13))},
        cost: new Decimal(2500),
        effect() {
        return player.points.root(2).add(3.1415).sin().add(player.points.root(10).times(0.25).add(1))
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
    },
    32: {
       title: "High Tide",
        description: "Boost points based on a higher wave in relation to points",
        tooltip(){if (options.showAdvancedTooltips) return("x(sin(sqrt(x)) + 0.75(points^1/4)) points gain")},
        unlocked(){return (hasUpgrade("q", 13))},
        cost: new Decimal(75000),
        effect() {
        return player.points.root(2).sin().add(player.points.root(10).times(0.75).add(1))
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
        //"LTide": {
        //    direction: UP,
        //    width: 10,
        //    height: 80,
        //    borderStyle() {return {'border-width': "1px"},{'border-radius':"0px"}},
        //    progress() {return player.points.root(10).add(3.1415).sin().add(1).times(0.5)}
        //},
        //"HTide": {
        //    direction: UP,
        //    width: 10,
        //    height: 80,
        //    borderStyle() {return {'border-width': "1px"},{'border-radius':"0px"}},
        //    progress() {return player.points.root(10).sin().add(1).times(0.5)}
        //},
    },
    tabFormat: {
        "Main": {
            content:[
            "main-display","prestige-button","blank","resource-display","blank","h-line","blank",
            //["row",[["upgrade","11"],["upgrade","12"]]],
            //["row",[["upgrade","21"],["upgrade","22"]]],
            //["row",[["bar","LTide"],["upgrade","31"],["upgrade","32"],["bar","HTide"]]],
            "upgrades",
            "blank",
            ]
        },
        "Milestones": {
            content:[
            ["bar","P*MileBar"],"blank","best-display","blank",
            "milestones",
            ]
        },
    },
    doReset(resettingLayer){
        if (layers[resettingLayer].row <= layers[this.layer].row) return;
        if (resettingLayer == "tag" && hasUpgrade('tag', "tree_1_3")) return;

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