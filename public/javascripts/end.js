var end = function() {};

end.prototype = {

    preload: function() {
        game.load.image('restart', 'images/doctor_minigame/right_arrow.png');
    },

    create: function() { 
        game.add.text(25, 25, "You won! Click below to restart the game.", {
            fill: "#000000",
            font: "12px Open Sans",
            wordWrap: true,
            wordWrapWidth: 750,
        });
        game.add.button(700, 500, 'restart', function() {
            game.state.start('start');
        });
    },
    
    update: function() {
    },
};