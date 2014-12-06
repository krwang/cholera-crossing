var WaterCollection = (function() {

var stage = function(game) {
    this.game = game;
    this.mainGroup
};

stage.prototype = {

    preload: function() {
        game.load.image('land', 'images/collection_minigame/land.png');
        game.load.image('river', 'images/collection_minigame/river.png');
        game.load.image('river_scene', 'images/collection_minigame/river_scene.png');
        game.load.image('lake', 'images/town/lake.png');
        game.load.image('lake_scene', 'images/collection_minigame/lake_scene.png');
        game.load.image('latrines', 'images/collection_minigame/latrines.png');
        game.load.image('latrines_scene', 'images/collection_minigame/latrines_scene.png');
        game.load.image('house', 'images/town/house.png');
        game.load.image('house2', 'images/town/house2.png');
        game.load.image('house_scene', 'images/filtration_minigame/filtration_background.png');
        game.load.image('waterbucket', 'images/collection_minigame/waterbucket.png');
        game.load.image('waterPump', 'images/town/waterPump.png');
        game.load.image('waterPump_scene', 'images/collection_minigame/waterPump_scene.png');
        game.load.image('well', 'images/town/well.png');
        game.load.image('well_scene', 'images/collection_minigame/well_scene.png');
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

        mainGroup = new Phaser.Group(this.game, null, 'mainGroup', true);

        river = game.add.button(100, 140, 'river', createImageModal);
        river.name = "river";
        mainGroup.add(river);
        house = game.add.button(320, 150, 'house', createImageModal);
        house.name = "house";
        mainGroup.add(house);
        game.add.text(325, 275, "Neighbor's House", {
            fill: "#ffffff",
            font: "12px Open Sans",
            wordWrap: true,
            wordWrapWidth: 750,
        });
        lake = game.add.button(600, 200, 'lake', createImageModal);
        lake.name = "lake";
        mainGroup.add(lake);
        latrines = game.add.button(400, 450, 'latrines', createImageModal);
        latrines.name = "latrines";
        mainGroup.add(latrines);
        waterPump = game.add.button(450, 300, 'waterPump', createImageModal);
        waterPump.name = "waterPump";
        mainGroup.add(waterPump);
        well = game.add.button(660, 500, 'well', createImageModal);
        well.name = "well";
        mainGroup.add(well);

        featureSprites = [river, house, lake, latrines, waterPump, well];

        for (var i = 0; i < featureSprites.length; i++) {
            var feature = featureSprites[i];
            switch (feature.name) {
                case "river":
                    river.scale.setTo(0.5, 0.7);
                    break;
                case "lake":
                    lake.scale.setTo(0.2, 0.2);
                    break;
                case "latrines":
                    scaleTo(200, 200, latrines);
                    break;
                default:
                    scaleTo(100, 100, feature);
            }
        }

        var sidebar = game.add.sprite(0, 0, 'sidebar');
        mainGroup.add(sidebar);
        waterbucket = game.add.sprite(10, 150, 'waterbucket');
        waterbucket.inputEnabled = true;
        waterbucket.input.enableDrag();
        mainGroup.add(waterbucket);
        done = game.add.button(10, 25, 'done', this.checkMap);
        done.scale.setTo(0.8, 0.8);
        mainGroup.add(done);
        var question = game.add.button(20, 450, 'question', function(button) {
            start.visible = true;
        });
        question.scale.setTo(0.03, 0.03);
        mainGroup.add(question);

        // var player = game.add.sprite(0, 0, 'player');
        // player.scale.setTo(0.3, 0.3);

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
    waterPump: {
        name: "water pump",
        description: "This is a water pump. You notice some rust.",
        safeWater: function(x, y) {
            return false;
        },
        explanationWater: "This water looks too rusty!",
    },
    well: {
        name: "well",
        description: "This is a well.",
        safeWater: function(x, y) {
            return true;
        },
        explanationWater: "",
    },
}

var createModal = function(button) {
    mainGroup.visible = false;
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
        mainGroup.visible = true;
    }));
    modal.visible = true;
}

var createImageModal = function(button) {
    mainGroup.visible = false;
    var featureName = button.name;
    var feature = features[featureName];
    var modal = new Phaser.Group(button.game, null, 'modal', true);
    var image = new Phaser.Image(button.game, 0, 0, featureName + '_scene');
    var scale = getImageScale(800, 600, image);
    image.scale.setTo(scale, scale);
    modal.add(image);
    modal.add(new Phaser.Text(button.game, 25, 25, feature.description, {
        fill: "#ffffff",
        font: "30px Open Sans",
        wordWrap: true,
        wordWrapWidth: 750,
    }));
    modal.add(new Phaser.Button(button.game, 650, 400, 'done', function(button) {
        mainGroup.visible = true;
        modal.destroy();
    }));
    modal.visible = true;
}


var winModal = function(button) {
    mainGroup.visible = false;
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
        game.playerData.completedGames.tablets = true;
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
