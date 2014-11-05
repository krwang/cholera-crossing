// Creates a new 'main' state that wil contain the game
var main = function() { };  
main.prototype = {

    preload: function() {
        game.load.image('mg1', 'images/main/mg1.png');
        game.load.image('mg2', 'images/main/mg2.png');
        game.load.image('mg3', 'images/main/mg3.png');
    },

    create: function() { 
        game.add.button(125, 25, 'mg1', function() {
            this.game.state.start('waterPurification');
        });
        game.add.button(325, 25, 'mg2', function() {
            this.game.state.start('waterCollection');
        });
    },
    
    update: function() {
    },
};