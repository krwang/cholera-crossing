// Creates a new 'main' state that wil contain the game
var main = function() { };  
main.prototype = {

    preload: function() {
        game.load.image('mg1', 'images/main/mg1.png');
        game.load.image('mg2', 'images/main/mg2.png');
        game.load.image('mg3', 'images/main/mg3.png');
        game.load.image('map', 'images/main/map.jpg');
        game.load.image('player', 'images/doctor_minigame/bear1.png');
        game.load.image('mayor', 'images/doctor_minigame/owlmayor.png');
    },

    create: function() {
        game.add.tileSprite(0, 0, 1600, 1000, 'map');
        game.world.setBounds(0, 0, 1600, 1000);
        game.physics.startSystem(Phaser.Physics.P2JS);
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        player.scale.setTo(0.1, 0.1);
        game.physics.p2.enable(player);
        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player);
        game.add.button(125, 25, 'mg1', function() {
            this.game.state.start('waterPurification');
        });
        game.add.button(325, 25, 'mg2', function() {
            this.game.state.start('waterCollection');
        });
    },
    
    update: function() {
        player.body.setZeroVelocity();
        if (cursors.up.isDown) {
            player.body.moveUp(300)
        } else if (cursors.down.isDown) {
            player.body.moveDown(300);
        } if (cursors.left.isDown) {
            player.body.velocity.x = -300;
        } else if (cursors.right.isDown) {
            player.body.moveRight(300);
        }
    },

    render: function() {
    }
};