var WaterCollection = (function() {

var stage = function(game) {
    this.game = game;
    this.mainGroup;
};

stage.prototype = {

    preload: function() {
        game.load.audio('peaceful-now', 'music/peaceful-now.wav');

        game.load.image('land', 'images/collection_minigame/land.png');
        game.load.image('river', 'images/collection_minigame/river.png');
        game.load.image('river_scene', 'images/collection_minigame/river_scene.png');
        game.load.image('lake', 'images/town/lake.png');
        game.load.image('lake_scene', 'images/collection_minigame/lake_scene.png');
        game.load.image('latrines', 'images/collection_minigame/latrines.png');
        game.load.image('latrines_scene', 'images/collection_minigame/latrines_scene.png');
        game.load.image('house', 'images/town/house.png');
        game.load.image('house2', 'images/town/house2.png');
        game.load.image('house_scene', 'images/collection_minigame/house_scene.png');
        game.load.image('waterbucket', 'images/town/empty_water.png');
        game.load.image('waterPump', 'images/town/waterPump.png');
        game.load.image('waterPump_scene', 'images/collection_minigame/waterPump_scene.png');
        game.load.image('well', 'images/town/well.png');
        game.load.image('well_scene', 'images/collection_minigame/well_scene.png');
        game.load.image('done', 'images/collection_minigame/done.png');
        game.load.image('dog', 'images/town/dog.png');
        game.load.image('black', 'images/collection_minigame/black.png');
        game.load.image('white', 'images/collection_minigame/white.png');
        game.load.image('player', 'images/bunnykid.png');
        game.load.image('home', 'images/town/home.png');
        game.load.image('sidebar', 'images/collection_minigame/sidebar.png');
        game.load.image('text-background', 'images/dialogue/dialogue-text-background.png');
        game.load.image('right-arrow', 'images/dialogue/right-arrow.png');
        game.load.image('speech_bubble', 'images/collection_minigame/speech_bubble.png');
    },

    create: function() {
        if (this.game.music) {
            this.game.music.stop();
        }
        this.game.music = game.add.audio('peaceful-now', 0.5, true);
        this.game.music.play();

        game.add.sprite(0, 0, 'land');
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        mainGroup = new Phaser.Group(this.game, null, 'mainGroup', true);

        river = game.add.button(100, 140, 'river', createImageModal);
        river.name = "river";
        mainGroup.add(river);
        house = game.add.button(320, 150, 'house', createImageModal);
        house.name = "house";
        mainGroup.add(house);
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
            feature.input.useHandCursor = true;
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
        waterbucket = game.add.sprite(10, 300, 'waterbucket');
        waterbucket.inputEnabled = true;
        waterbucket.input.enableDrag();
        waterbucket.input.useHandCursor = true;
        scaleTo(80, 80, waterbucket);
        mainGroup.add(waterbucket);
        done = game.add.button(20, 30, 'dog', this.checkMap);
        scaleTo(80, 180, done);
        mainGroup.add(done);
        done.input.useHandCursor = true;
        var speech_bubble = game.add.button(65, 10, 'speech_bubble', this.checkMap);
        speech_bubble.input.useHandCursor = true;
        scaleTo(110, 110, speech_bubble);
        mainGroup.add(speech_bubble);
        var text = game.add.text(70, 15, "Drag the bowl and click me when you're done!", {
            fill: "#000",
            font: "12px Helvetica Neue",
            wordWrap: true,
            wordWrapWidth: 100,
            align: "center"
        });
        mainGroup.add(text);
        var question = game.add.button(20, 510, 'home', function(button) {
            mainGroup.destroy();
            game.state.start('villageState');
        });
        question.input.useHandCursor = true;
        mainGroup.add(question);
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
        if (!waterSource) {
            
        } else if (features[waterSource.name].safeWater()) {
            waterDistance = calculateDistance(house, waterSource);
            if (waterDistance < 800) {
                winModal(button, "well");
            } else {
                text = "The family has to walk too far!";
                createModal(button);
            }
        } else {
            if (!features[waterSource.name].safeWater(waterSource.x, waterSource.y)) {
                text += features[waterSource.name].explanationWater;
            }
            createModal(button, waterSource.name);
        }
        
        function findClosest(feature) {
            if (feature.x < 325 && feature.x > 100) {
                return river;
            } else if (feature.x <= 100) {
                return null;
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
        explanationWater: "Maybe the lake isn't the best place to get water. It looks like they are a lot of bacteria in the lake that might make your friend sick.",
    },
    river: {
        name: "river",
        description: "This is a river.",
        safeWater: function(x, y) {
            return false;
        },
        explanationWater: "Oh no! The river is a bad place to collect water from. You don't know if it has been dirtied upstream. Try another place.",
    },
    latrines: {
        name: "latrines",
        description: "These are latrines.",
        safeWater: function(x, y) {
            return false;
        },
        explanationWater: "There is no clean water in the latrine.",
    },
    house: {
        name: "house",
        description: "This is a house.",
        safeWater: function(x, y) {
            return false;
        },
        explanationWater: "There's no water at the house.",
    },
    waterPump: {
        name: "water pump",
        description: "This is a water pump. You notice some rust.",
        safeWater: function(x, y) {
            return false;
        },
        explanationWater: "This water spout is rusty. The water is most likely dirty and can make your friend sick.",
    },
    well: {
        name: "well",
        description: "This is a well.",
        safeWater: function(x, y) {
            return true;
        },
        explanationWater: "The well is a perfect place to get water from! Thanks for helping!",
    },
}

var createModal = function(button, featureName) {
    mainGroup.visible = false;
    var feature = features[featureName];
    var modal = new Phaser.Group(button.game, null, 'modal', true);
    var image = new Phaser.Image(button.game, 0, 0, featureName + '_scene');
    var textBackground = new Phaser.Image(button.game, 110, 506, 'text-background');
    scaleTo(800, 600, image);
    modal.add(image);
    modal.add(textBackground);
    modal.add(new Phaser.Text(button.game, 110+12, 506+12, feature.explanationWater, {
        font: '18px Helvetica Neue',
        fill: 'black',
        wordWrap: true,
        wordWrapWidth: textBackground.width - 24
    }));
    modal.add(new Phaser.Button(button.game, 720, 510, 'right-arrow', function(button) {
        mainGroup.visible = true;
        modal.destroy();
        if (feature == "well") {
            game.playerData.completedGames.tablets = true;
            game.state.start('villageState');
        }
    }));
    modal.visible = true;
}

var createImageModal = function(button) {
    mainGroup.visible = false;
    var featureName = button.name;
    var feature = features[featureName];
    var modal = new Phaser.Group(button.game, null, 'modal', true);
    var image = new Phaser.Image(button.game, 0, 0, featureName + '_scene');
    var textBackground = new Phaser.Image(button.game, 110, 506, 'text-background');
    scaleTo(800, 600, image);
    modal.add(image);
    modal.add(textBackground);
    modal.add(new Phaser.Text(button.game, 110+12, 506+12, feature.description, {
        font: '18px Helvetica Neue',
        fill: 'black',
        wordWrap: true,
        wordWrapWidth: textBackground.width - 24
    }));
    modal.add(new Phaser.Button(button.game, 720, 510, 'right-arrow', function(button) {
        mainGroup.visible = true;
        modal.destroy();
    }));
    modal.visible = true;
}

var winModal = function(button, featureName) {
    mainGroup.visible = false;
    var feature = features[featureName];
    var modal = new Phaser.Group(button.game, null, 'modal', true);
    var image = new Phaser.Image(button.game, 0, 0, featureName + '_scene');
    var textBackground = new Phaser.Image(button.game, 110, 506, 'text-background');
    scaleTo(800, 600, image);
    modal.add(image);
    modal.add(textBackground);
    var dog = modal.create(50, 200, 'dog');
    scaleTo(150, 300, dog);
    modal.add(dog);
    modal.add(new Phaser.Text(button.game, 110+12, 506+12, feature.explanationWater, {
        font: '18px Helvetica Neue',
        fill: 'black',
        wordWrap: true,
        wordWrapWidth: textBackground.width - 24
    }));
    modal.add(new Phaser.Button(button.game, 720, 510, 'right-arrow', function(button) {
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
