var start = function() {};

start.prototype = {

    preload: function() {
        game.load.image('start', 'images/main/start.png');
        game.load.image('splash', 'images/main/splash.png');
        game.load.image('title', 'images/main/title.png');
    },

    create: function() {
        var splash = game.add.sprite(0, 0, 'splash');
        var splashScale = getImageScale(800, 600, splash);
        splash.scale.setTo(splashScale, splashScale);

        var title = game.add.sprite(150, 150, 'title');
        scaleTo(500, 400, title);

        var start = game.add.button(300, 450, 'start', function() {
            game.state.start('villageState');
        });
        start.input.useHandCursor = true;
        scaleTo(200, 100, start);
    },
    
    update: function() {
    },
};