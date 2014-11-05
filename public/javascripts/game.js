// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', null, true);
var game_state = {
    main: main,
    waterCollection: waterCollection,
    waterPurification: waterPurification,
};

var waterPurification = new PurificationMinigame(game);

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);  
game.state.add('waterPurification', waterPurification);
game.state.add('waterCollection', waterCollection);

game.state.start('main'); 
