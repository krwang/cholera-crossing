var start = function() {};

start.prototype = {

    preload: function() {
        game.load.image('next', 'images/doctor_minigame/right_arrow.png');
        game.load.image('splash', 'images/main/splash.png');
        game.load.image('player', 'images/bunnykid.png');
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
    },

    create: function() {
        var splash = game.add.sprite(0, 0, 'splash');
        var splashScale = getImageScale(800, 600, splash);
        splash.scale.setTo(splashScale, splashScale);
        var player = game.add.sprite(100, 250, 'player');
        var playerScale = getImageScale(100, 200, player);
        player.scale.setTo(playerScale, playerScale);
        game.add.text(350, 200, "Saving\nAnimal\nVillage", {
            fill: "#ffffff",
            font: "60px Gloria Hallelujah",
            wordWrap: true,
            wordWrapWidth: 750,
        });
        game.add.button(600, 300, 'next', function() {
            game.state.start('villageState');
        });
    },
    
    update: function() {
    },
};