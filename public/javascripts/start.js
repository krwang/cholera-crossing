var start = function() {};

start.prototype = {

    preload: function() {
        game.load.image('next', 'images/doctor_minigame/right_arrow.png');
        game.load.image('player', 'images/bunnykid.png');
    },

    create: function() {
        game.add.sprite(100, 100, 'player');
        game.add.text(350, 200, "Saving\nAnimal\nVillage", {
            fill: "#000000",
            font: "60px Open Sans",
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