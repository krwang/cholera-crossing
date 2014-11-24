var WaterCollection = (function() {

var stage = function(game) {
    this.game = game;
};

stage.prototype = {

    preload: function() {
        game.load.image('land', 'images/collection_minigame/land.png');
        game.load.image('river', 'images/collection_minigame/river.png');
        game.load.image('lake', 'images/collection_minigame/lake.png');
        game.load.image('latrines', 'images/collection_minigame/latrines.png');
        game.load.image('house', 'images/collection_minigame/house.png');
        game.load.image('waterbucket', 'images/collection_minigame/waterbucket.png');
        game.load.image('rustyWater', 'images/collection_minigame/waterPump.png');
        game.load.image('well', 'images/collection_minigame/well.png');
        game.load.image('done', 'images/collection_minigame/done.png');
        game.load.image('black', 'images/collection_minigame/black.png');
        game.load.image('white', 'images/collection_minigame/white.png');
        game.load.image('player', 'images/bunnykid.png');
        game.load.image('question', 'images/collection_minigame/question.png');
        game.load.image('sidebar', 'images/collection_minigame/sidebar.png');
    },

    create: function() {
        game.add.sprite(0, 0, 'land');
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        river = game.add.button(100, 140, 'river', createImageModal);
        river.name = "river";
        house = game.add.button(320, 150, 'house', createImageModal);
        house.name = "house";
        game.add.text(325, 275, "Neighbor's House", {
            fill: "#ffffff",
            font: "12px Open Sans",
            wordWrap: true,
            wordWrapWidth: 750,
        });
        lake = game.add.button(600, 200, 'lake', createImageModal);
        lake.name = "lake";
        latrines = game.add.button(400, 450, 'latrines', createImageModal);
        latrines.name = "latrines";
        rustyWater = game.add.button(450, 300, 'rustyWater', createImageModal);
        rustyWater.name = "rustyWater";
        // rustyWater.scale.setTo(0.1, 0.1);
        well = game.add.button(660, 500, 'well', createImageModal);
        well.name = "well";

        featureSprites = [river, house, lake, latrines, rustyWater, well];

        for (var i = 0; i < featureSprites.length; i++) {
            var feature = featureSprites[i];
            var scale = getImageScale(feature);
            feature.scale.setTo(scale, scale);
        }
        river.scale.setTo(0.5, 0.7);
        lake.scale.setTo(0.2, 0.2);

        var instructions = "One of your neighboring families needs your help! " + 
        "The local doctor has seen several people from their family over the past few weeks and " + 
        "guesses that they've come been drinking contaminated water.";
        var instructions2 = "Help each family figure out where to collect water and where to defecate by dragging the water bucket " +
        "and the toilet to a new location. Examine each " +
        "location carefully!";

        var start = new Phaser.Group(this.game, null, 'instructions', true);
        start.add(new Phaser.Image(this.game, 0, 0, 'black'));
        start.add(new Phaser.Button(this.game, 350, 500, 'done', function(button) {
            start.visible = false;
            start2.visible = true;
        }));
        start.add(new Phaser.Text(this.game, 25, 25, instructions, {
            fill: "#ffffff",
            font: "30px Open Sans",
            wordWrap: true,
            wordWrapWidth: 750,
        }));
        start.visible = true;
        var start2 = new Phaser.Group(this.game, null, 'instructions2', true);
        start2.add(new Phaser.Image(this.game, 0, 0, 'black'));
        start2.add(new Phaser.Button(this.game, 350, 500, 'done', function(button) {
            start2.visible = false;
        }));
        start2.add(new Phaser.Text(this.game, 25, 25, instructions2, {
            fill: "#ffffff",
            font: "30px Open Sans",
            wordWrap: true,
            wordWrapWidth: 750,
        }));
        start2.visible = false;

        var sidebar = game.add.sprite(0, 0, 'sidebar');
        waterbucket = game.add.sprite(10, 150, 'waterbucket');
        waterbucket.inputEnabled = true;
        waterbucket.input.enableDrag();
        done = game.add.button(10, 25, 'done', this.checkMap);
        done.scale.setTo(0.8, 0.8);
        var question = game.add.button(20, 450, 'question', function(button) {
            start.visible = true;
        });
        question.scale.setTo(0.03, 0.03);

        // var player = game.add.sprite(0, 0, 'player');
        // player.scale.setTo(0.3, 0.3);
        function getImageScale(image) {
            return 100/Math.min(image.height, image.width);
        }
        
    },
    
    update: function() {
        for (var i = 0; i < featureSprites.length; i++) {
            feature = featureSprites[i];
            if (calculateDistance(waterbucket, feature) < 40) {
                waterbucket.x = feature.x + feature.width/2 - waterbucket.width/2;
                waterbucket.y = feature.y + feature.height/2 - waterbucket.height/2;
            }
        }
    },

    checkMap: function(button) {
        waterSource = findClosest(waterbucket);
        text = "";
        if (features[waterSource.name].safeWater()) {
            waterDistance = calculateDistance(house, waterSource);
            if (waterDistance < 800) {
                winModal(button);
            } else {
                text = "The family has to walk so far. :(";
                createModal(button);
            }
        } else {
            if (!features[waterSource.name].safeWater(waterSource.x, waterSource.y)) {
                text += "The " + features[waterSource.name].name + " is not a safe location to collect water from. " + features[waterSource.name].explanationWater;
            }
            createModal(button);
        }
        
        function findClosest(feature) {
            if (feature.x < 325) {
                return river;
            }
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
        description: "This is a lake.",
        safeWater: function(x, y) {
            return false;
        },
        explanationWater: "It looks like there's a lot of bacteria in the lake.",
    },
    river: {
        name: "river",
        description: "This is a river.",
        safeWater: function(x, y) {
            return false;
        },
        explanationWater: "Careful! You don't know if the river's been contaminated with excreta upstream.",
    },
    latrines: {
        name: "latrines",
        description: "These are latrines.",
        safeWater: function(x, y) {
            return false;
        },
        explanationWater: "It doesn't look like there's any water here.",
    },
    house: {
        name: "house",
        description: "This is a house.",
        safeWater: function(x, y) {
            return false;
        },
        explanationWater: "There's no clean water at the house!",
    },
    rustyWater: {
        name: "rusty water fountain",
        description: "This is a water fountain. You notice some rust on the fountain.",
        safeWater: function(x, y) {
            return false;
        },
        explanationWater: "This water looks too rusty!",
    },
    well: {
        name: "drinking fountain",
        description: "This is a drinking fountain.",
        safeWater: function(x, y) {
            return true;
        },
        explanationWater: "",
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

var createImageModal = function(button) {
    // var image = 
    var featureName = button.name;
    var feature = features[featureName];
    var modal = new Phaser.Group(button.game, null, 'modal', true);
    modal.add(new Phaser.Image(button.game, 0, 0, 'white'));
    var image = new Phaser.Image(button.game, 25, 25, featureName);
    var scale = getImageScale(image);
    image.scale.setTo(scale, scale);
    modal.add(image);
    modal.add(new Phaser.Text(button.game, 25, 325, feature.description, {
        fill: "#000000",
        font: "30px Open Sans",
        wordWrap: true,
        wordWrapWidth: 750,
    }));
    modal.add(new Phaser.Button(button.game, 650, 400, 'done', function(button) {
        modal.destroy();
    }));
    modal.visible = true;
    function getImageScale(image) {
        return 200/Math.max(image.height, image.width);
    }
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
    modal.add(new Phaser.Button(button.game, 650, 400, 'done', function() {
        modal.destroy();
        game.playerData.completedGames.push('collection');
        game.state.start('villageState');
    }));
    modal.visible = true;
}

var calculateDistance = function(sprite1, sprite2) {
    x1 = sprite1.x + (sprite1.width/2);
    x2 = sprite2.x + (sprite2.width/2);
    y1 = sprite1.y + (sprite1.height/2);
    y2 = sprite2.y + (sprite2.height/2);
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

return stage;
})();
