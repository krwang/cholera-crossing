var doctorText1 = "Hi my name is Jeffery!";

var DoctorMinigame = function(game) {
	this.game = game;
};

DoctorMinigame.prototype = {
  preload: function() {
      game.load.image('cat_happy', 'images/doctor_minigame/vectorcat-happy.png');
      game.load.image('cat_stomachache', 'images/doctor_minigame/vectorcat-stomachache.png');
      game.load.image('cat_thirsty', 'images/doctor_minigame/vectorcat-thirsty.png');
      game.load.image('cat_unhealthy', 'images/doctor_minigame/vectorcat-unhealthy.png');
      game.load.image('left_arrow', 'images/doctor_minigame/left_arrow.png');
      game.load.image('right_arrow', 'images/doctor_minigame/right_arrow.png');
  },

  create: function() {
      this.cat1 = game.add.sprite(0, 0, 'cat_happy');
      this.cat1.scale.x = 0.5;
      this.cat1.scale.y = 0.5;
      this.cat2 = game.add.sprite(0, 0, 'cat_stomachache');
      this.cat2.scale.x = 0.5;
      this.cat2.scale.y = 0.5;
      this.cat3 = game.add.sprite(0, 0, 'cat_thirsty');
      this.cat3.scale.x = 0.5;
      this.cat3.scale.y = 0.5;
      this.cat4 = game.add.sprite(0, 0, 'cat_unhealthy');
      this.cat4.scale.x = 0.5;
      this.cat4.scale.y = 0.5;

      var start = new Phaser.Group(this.game, null, 'instructions', true);
      this.instructionsText = new Phaser.Text(this.game, 25, 25, doctorText1, {
          fill: "#000000",
          font: "12px Open Sans",
          wordWrap: true,
          wordWrapWidth: 750,
      });
      start.add(this.cat1);
      start.add(this.instructionsText);

      var second = new Phaser.Group(this.game, null, 'second', true);
      second.add(this.cat2);

      var third = new Phaser.Group(this.game, null, 'third', true);
      third.add(this.cat3);

      var fourth = new Phaser.Group(this.game, null, 'fourth', true);
      fourth.add(this.cat4);

      var firstScreen = new StoryboardScreen(start);
      var secondScreen = new StoryboardScreen(second);
      var thirdScreen = new StoryboardScreen(third);
      var fourthScreen = new StoryboardScreen(fourth);
      firstScreen.addNext(secondScreen);
      secondScreen.addNext(thirdScreen);
      thirdScreen.addNext(fourthScreen);
      firstScreen.show();
  },
  
  update: function() {

  },
}
