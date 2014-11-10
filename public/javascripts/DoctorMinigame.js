var doctorText1 = "Hi my name is Jeffery!";

var DoctorMinigame = function(game) {
	this.game = game;
};

DoctorMinigame.prototype = {
  preload: function() {
      game.load.image('bear1', 'images/doctor_minigame/bear1.png');
      game.load.image('bear2', 'images/doctor_minigame/bear2.png');
      game.load.image('bear3', 'images/doctor_minigame/bear3.png');
      game.load.image('bear4', 'images/doctor_minigame/bear4.png');
      game.load.image('bear5', 'images/doctor_minigame/bear5.png');
      game.load.image('left_arrow', 'images/doctor_minigame/left_arrow.png');
      game.load.image('right_arrow', 'images/doctor_minigame/right_arrow.png');
  },

  create: function() {
      this.bear1 = game.add.sprite(0, 0, 'bear1');
      this.bear1.scale.x = 0.3;
      this.bear1.scale.y = 0.3;
      this.bear2 = game.add.sprite(100, 0, 'bear2');
      this.bear2.scale.x = 0.3;
      this.bear2.scale.y = 0.3;
      // this.bear3 = game.add.sprite(300, 100, 'bear3');
      // this.bear3.scale.x = 0.3;
      // this.bear3.scale.y = 0.3;
      // this.bear4 = game.add.sprite(500, 300, 'bear4');
      // this.bear4.scale.x = 0.3;
      // this.bear4.scale.y = 0.3;
      this.bear5 = game.add.sprite(0, 0, 'bear5');
      this.bear5.scale.x = 0.3;
      this.bear5.scale.y = 0.3;

      var start = new Phaser.Group(this.game, null, 'instructions', true);
      this.instructionsText = new GradualText(this.game, 25, 25, doctorText1, {
          fill: "#000000",
          font: "12px Open Sans",
          wordWrap: true,
          wordWrapWidth: 750,
      });
      start.add(this.bear1);
      start.add(this.instructionsText);

      var second = new Phaser.Group(this.game, null, 'second', true);
      second.add(this.bear5);

      var third = new Phaser.Group(this.game, null, 'third', true);
      third.add(this.bear2);

      var firstScreen = new StoryboardScreen(start, this.instructionsText);
      var secondScreen = new StoryboardScreen(second);
      var thirdScreen = new StoryboardScreen(third);
      firstScreen.addNext(secondScreen);
      secondScreen.addNext(thirdScreen);
      firstScreen.show();
  },
  
  update: function() {

  },
}