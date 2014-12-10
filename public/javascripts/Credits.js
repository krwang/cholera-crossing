function Credits(game) {
  this.game = game;
  this.dialogueView = new DialogueView(this.game, function(results) {
    this.game.state.start(results.nextState);
  }.bind(this));
}

Credits.prototype.preload = function() {
  this.game.load.image('splash', 'images/main/splash.png');
  this.game.load.image('white', 'images/main/white.png');
  this.game.load.image('credits', 'images/main/credits.png');
  this.game.load.image('restart', 'images/filtration_minigame/start_button.png');
};

Credits.prototype.create = function() {
  var splash = game.add.sprite(0, 0, 'splash');
  scaleTo(800, 600, splash);
  var white = game.add.sprite(0, 0, 'white');
  white.alpha = 0.7;
  var credits = game.add.sprite(300, 50, 'credits');
  scaleTo(200, 100, credits);
  game.add.text(25, 150, "6.073/CMS.611 Creating Video Games\n" +
    "Fall 2014\n" +
    "Eduardo Gonzalez, Liz Rita, Rachel Wang, Justin Martinez, Kevin Wang, James Hobin, Lenny Martinez, Devin Neal\n\n" +
    "Game Engine: Phaser\n" +
    "Music: Derek Flechter\n", {
      fill: "#000000",
      font: "24px Helvetica Neue",
      wordWrap: true,
      wordWrapWidth: 750,
  });

  var restart = game.add.button(325, 500, 'restart', function() {
    game.state.start('start');
  });
  scaleTo(150, 100, restart);
  restart.input.useHandCursor = true;


};
