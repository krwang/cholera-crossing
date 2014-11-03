war PurificationMinigame = function(game) {
	this.game = game;
};

PurificationMinigame.prototype = {

   preload: function() { 
        // Function called first to load all the assets
        game.load.image('bottle_blue', 'images/water_minigame/bottle_blue.png');
        game.load.image('bottle_red', 'images/water_minigame/bottle_red.png');
        game.load.image('bottle_green', 'images/water_minigame/bottle_green.png');
        game.load.image('water_bottle_diagram', 'images/water_minigame/water_bottle_diagram.png');
        game.load.image('conveyor_belt', 'images/water_minigame/conveyor_belt.png');
        game.load.image('boiling_pot', 'images/water_minigame/boiling_pot.png');
    },

    create: function() { 
        // Function called after 'preload' to setup the game
        this.bottle_blue = game.add.sprite(250, 300, 'bottle_blue');
    },
    
    update: function() {
        // Function called 60 times per second
        this.bottle_blue.angle += 1;
    },
}