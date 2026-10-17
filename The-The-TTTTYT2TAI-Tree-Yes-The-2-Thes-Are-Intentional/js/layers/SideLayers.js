addLayer("Test", {
    name: "TestandControls", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "???", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(2),
    }},
    color: "#ffaa55",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    type:"none",
    resource:"H",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return false},
    upgrades: {
    11: {
        title: "Reset",
        description: "Warning: will reset "+"??? and P* and P2",
        unlocked(){return (!hasUpgrade(this.layer, 11)) },
        currencyInternalName: "points",
        cost() {return(player.points)},
    },
    12: {
        title: "Confirm Reset",
        description: "Warning: will reset "+"??? and P* and P2",
        style() {if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#4d4d4dff' 
                    } 
                    else return {
                            'background-color':'#d76161ff'  
                        } },
        unlocked(){return (hasUpgrade(this.layer, 11)) },
        onPurchase(){layerDataReset(this.layer),layerDataReset("p"),layerDataReset("q")},
        currencyInternalName: "points",
        cost() {return(player.points)},
    },
},
    bars: {
            H: {
                fillStyle: {'background-color' : "#FFFFFF"},
                baseStyle: {'background-color' : "#000000ff"},
                textStyle: {'color': '#04e050'},
                borderStyle() {return {'border-radius': "0px"}},
                direction: RIGHT,
                width: 500,
                height: 200,
                progress() {
                    return (player.points.log10().div(10))
                },
                display() {
                    return format(player.points) + " / 1e10 points"
                },
                unlocked: true,

            },
        },
    tabFormat: {
        "Test": {
            content:[
            "upgrades","blank",
            ["bar","H"]
            ]
        },
    },
})