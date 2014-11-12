var WaterCollection = (function() {

var stage = function(game) {
    this.game = game;
};

stage.prototype = {

    preload: function() {
        game.load.image('grass', 'images/collection_minigame/grass.png');
        game.load.image('river', 'images/collection_minigame/river.png');
        game.load.image('lake', 'images/collection_minigame/lake.png');
        game.load.image('latrines', 'images/collection_minigame/latrines.png');
        game.load.image('house', 'images/collection_minigame/house.png');
        game.load.image('waterbucket', 'images/collection_minigame/waterbucket.png');
        game.load.image('toilet', 'images/collection_minigame/toilet.png');
        game.load.image('dumpster', 'images/collection_minigame/dumpster.png');
        game.load.image('rustyWater', 'images/collection_minigame/rustyWater.jpg');
        game.load.image('cleanWater', 'images/collection_minigame/cleanWater.jpg');
        game.load.image('done', 'images/collection_minigame/done.png');
        game.load.image('black', 'images/collection_minigame/black.png');
    },

    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        grass = game.add.sprite(0, 0, 'grass');
        river = game.add.sprite(100, 0, 'river');
        river.name = "river";
        house = game.add.sprite(320, 150, 'house');
        house.name = "house";
        game.add.text(300, 200, "Neighbor's House", {
            fill: "#ffffff",
            font: "12px Open Sans",
            wordWrap: true,
            wordWrapWidth: 750,
        });
        lake = game.add.sprite(700, 225, 'lake');
        lake.name = "lake";
        latrines = game.add.sprite(480, 500, 'latrines');
        latrines.name = "latrines";
        dumpster = game.add.sprite(550, 100, 'dumpster');
        dumpster.name = "dumpster";
        rustyWater = game.add.sprite(400, 300, 'rustyWater');
        rustyWater.name = "rustyWater";
        cleanWater = game.add.sprite(660, 450, 'cleanWater');
        cleanWater.name = "cleanWater";

        featureSprites = [river, house, lake, latrines, dumpster, rustyWater, cleanWater];

        waterbucket = game.add.sprite(175, 10, 'waterbucket');
        waterbucket.inputEnabled = true;
        waterbucket.input.enableDrag();
        toilet = game.add.sprite(275, 10, 'toilet');
        toilet.inputEnabled = true;
        toilet.input.enableDrag();
        done = game.add.button(25, 25, 'done', this.checkMap);

        var instructions = "One of your neighboring families needs your help! " + 
        "The local doctor has seen several people from their family over the past few weeks and " + 
        "guesses that they've come been drinking contaminated water. " +
        "Help each family figure out where to collect water and where to defecate by dragging the water bucket " +
        "and the toilet to a new location. Examine each " +
        "location carefully! Click done when you've chosen your locations!";
        var start = new Phaser.Group(this.game, null, 'instructions', true);
        start.add(new Phaser.Image(this.game, 0, 0, 'black'));
        start.add(new Phaser.Button(this.game, 350, 500, 'done', function(button) {
            start.destroy();
        }));
        start.add(new Phaser.Text(this.game, 25, 25, instructions, {
            fill: "#ffffff",
            font: "30px Open Sans",
            wordWrap: true,
            wordWrapWidth: 750,
        }));
        start.visible = true;
    },
    
    update: function() {
        for (var i = 0; i < featureSprites.length; i++) {
            feature = featureSprites[i];
            if (calculateDistance(waterbucket, feature) < 40) {
                waterbucket.x = feature.x;
                waterbucket.y = feature.y;
            }
            if (calculateDistance(toilet, feature) < 40) {
                toilet.x = feature.x;
                toilet.y = feature.y;
            }
        }
    },

    checkMap: function(button) {
        waterSource = findClosest(waterbucket);
        excretaSink = findClosest(toilet);
        text = "";
        if (features[waterSource.name].safeWater() && features[excretaSink.name].safeExcreta()) {
            waterDistance = calculateDistance(house, waterSource);
            excretaDistance = calculateDistance(house, excretaSink);
            if (waterDistance + excretaDistance < 800) {
                winModal(button);
            } else {
                text = "The family has to walk so far. :(";
                createModal(button);
            }
        } else {
            if (!features[waterSource.name].safeWater(waterSource.x, waterSource.y)) {
                text += "The " + features[waterSource.name].name + " is not a safe location to collect water from. " + features[waterSource.name].explanationWater;
            }
            if (!features[excretaSink.name].safeExcreta(excretaSink.x, excretaSink.y)) {
                text += "\n\n" +  "The " + features[excretaSink.name].name + " is not a safe place to defecate. " + features[excretaSink.name].explanationExcreta;
            }
            createModal(button);
        }
        
        function findClosest(feature) {
            shortestDistance = 1000;
            closestFeature = null;
            for (var i = 0; i < featureSprites.length; i++) {
                if (calculateDistance(feature, featureSprites[i]) < shortestDistance) {
                    shortestDistance = calculateDistance(feature, featureSprites[i]);
                    closestFeature = featureSprites[i];
                }
            }
            return closestFeature;
        }
    },
};

var features = {
    lake: {
        name: "lake",
        description: "This is a description",
        safeWater: function(x, y) {
            return false;
        },
        safeExcreta: function(x, y) {
            return false;
        },
        explanationWater: "It looks like there's a lot of bacteria in the lake.",
        explanationExcreta: "There's a lot of bacteria in the lake, so it might not be the safest place to go.",
    },
    river: {
        name: "river",
        description: "This is a river.",
        safeWater: function(x, y) {
            return false;
        },
        safeExcreta: function(x, y) {
            return false;
        },
        explanationWater: "Careful! You don't know if the river's been contaminated with excreta upstream.",
        explanationExcreta: "You don't want to contaminate the river for others -- once the water moves downstream, other families might accidentally drink water from the river and become sick.",
    },
    latrines: {
        name: "latrines",
        description: "These are latrines.",
        safeWater: function(x, y) {
            return false;
        },
        safeExcreta: function(x, y) {
            return true;
        },
        explanationWater: "It doesn't look like there's any water here.",
        explanationExcreta: "",
    },
    house: {
        name: "house",
        description: "This is a house.",
        safeWater: function(x, y) {
            return false;
        },
        safeExcreta: function(x, y) {
            return false;
        },
        explanationWater: "There's no clean water at the house!",
        explanationExcreta: "It's better to defecate a little farther away from the house.",
    },
    rustyWater: {
        name: "rusty water fountain",
        description: "This is a house.",
        safeWater: function(x, y) {
            return false;
        },
        safeExcreta: function(x, y) {
            return false;
        },
        explanationWater: "This water looks too rusty!",
        explanationExcreta: "Probably shouldn't defecate here in the open...",
    },
    dumpster: {
        name: "dumpster",
        description: "This is a house.",
        safeWater: function(x, y) {
            return false;
        },
        safeExcreta: function(x, y) {
            return true;
        },
        explanationWater: "It doesn't look like there's any water here.",
        explanationExcreta: "",
    },
    cleanWater: {
        name: "drinking fountain",
        description: "This is a drinking fountain.",
        safeWater: function(x, y) {
            return true;
        },
        safeExcreta: function(x, y) {
            return false;
        },
        explanationWater: "",
        explanationExcreta: "Don't contaminate public drinking water!",
    },
}

var createModal = function(button) {
    var modal = new Phaser.Group(button.game, null, 'modal', true);
    modal.add(new Phaser.Image(button.game, 0, 0, 'black'));
    modal.add(new Phaser.Text(button.game, 25, 25, text, {
        fill: "#ffffff",
        font: "30px Open Sans",
        wordWrap: true,
        wordWrapWidth: 750,
    }));
    modal.add(new Phaser.Button(button.game, 650, 400, 'done', function(button) {
        modal.destroy();
    }));
    modal.visible = true;
}

var winModal = function(button) {
    var modal = new Phaser.Group(button.game, null, 'modal', true);
    modal.add(new Phaser.Image(button.game, 0, 0, 'black'));
    modal.add(new Phaser.Text(button.game, 25, 25, "You win!", {
        fill: "#ffffff",
        font: "30px Open Sans",
        wordWrap: true,
        wordWrapWidth: 750,
    }));
    console.log(button.game);
    modal.add(new Phaser.Button(button.game, 650, 100, 'done', function() {
        modal.destroy();
        game.state.start('villageState');
    }));
    modal.visible = true;
}

var calculateDistance = function(sprite1, sprite2) {
    x1 = sprite1.x + (sprite1.width/2);
    x2 = sprite2.x + (sprite2.width/2);
    y1 = sprite1.y + (sprite1.height/2);
    y2 = sprite2.y + (sprite2.height/2);
    console.log(x1, x2);
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

return stage;
})();
