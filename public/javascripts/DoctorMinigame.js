var DoctorMinigame = function(game) {
	this.game = game;
};

DoctorMinigame.prototype = {
  preload: function() {
      game.load.image('grass', 'images/grass.png');
      game.load.image('river', 'images/river.png');
      game.load.image('lake', 'images/lake.png');
      game.load.image('latrines', 'images/latrines.png');
      game.load.image('house', 'images/house.png');
      game.load.image('waterbucket', 'images/waterbucket.png');
  },

  create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.grass = game.add.sprite(0, 0, 'grass');
      this.river = game.add.sprite(100, 0, 'river');
      this.house = game.add.sprite(300, 100, 'house');

      
      this.lake = game.add.sprite(700, 300, 'lake');
      this.latrine = game.add.sprite(500, 500, 'latrines');
      this.waterbucket = game.add.sprite(10, 10, 'waterbucket');
      this.waterbucket.anchor.set(0);
      this.game.physics.arcade.enable(this.waterbucket);
      this.waterbucket.active = false;
      var start = new Phaser.Group(this.game, null, 'instructions', true);
      this.instructionsText = new GradualText(this.game, 25, 25, instructions, {
          fill: "#ffffff",
          font: "12px Open Sans",
          wordWrap: true,
          wordWrapWidth: 750,
      })
      start.add(this.instructionsText);
      var second = new Phaser.Group(this.game, null, 'second', true);
      second.add(this.river);
      var firstScreen = new StoryboardScreen(start, this.instructionsText);
      var secondScreen = new StoryboardScreen(second);
      firstScreen.addNext(secondScreen);
      firstScreen.show();
  },
  
  update: function() {
      if (this.waterbucket.active) {
          if (game.physics.arcade.distanceToPointer(this.waterbucket, game.input.activePointer) > 50) {
              game.physics.arcade.moveToPointer(this.waterbucket, 300);
          } else {
              this.waterbucket.body.velocity.set(0);
          }            
      }
      //this.instructionsText.update(0.01);

  },
}