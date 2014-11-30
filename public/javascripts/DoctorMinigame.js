

var DoctorMinigame = function(game) {
	this.game = game;
  this.width = this.game.width - 20;
  this.height = this.game.height;

  this.x = 0;
  this.y = this.game.height - this.height;

  
};

DoctorMinigame.prototype = {
  preload: function() {
      game.load.image('cat_happy', 'images/doctor_minigame/vectorcat-happy.png');
      game.load.image('cat_stomachache', 'images/doctor_minigame/vectorcat-stomachache.png');
      game.load.image('cat_thirsty', 'images/doctor_minigame/vectorcat-thirsty.png');
      game.load.image('cat_unhealthy', 'images/doctor_minigame/vectorcat-unhealthy.png');
      game.load.image('left_arrow', 'images/doctor_minigame/left_arrow.png');
      game.load.image('right_arrow', 'images/doctor_minigame/right_arrow.png');
      game.load.image('house_scene', 'images/filtration_minigame/filtration_background.png');
      
  },

  create: function() {

      //create the sprites and position them
      this.cat1 = game.add.sprite(0, 0, 'cat_happy');
      this.cat1.x = this.x + this.width / 2;
      this.cat1.y = this.y + this.height / 2;
      this.cat1.scale.x = 0.5;
      this.cat1.scale.y = 0.5;
      this.cat2 = game.add.sprite(0, 0, 'cat_stomachache');
      this.cat2.x = this.x + this.width / 2;
      this.cat2.y = this.y + this.height / 2;
      this.cat2.scale.x = 0.5;
      this.cat2.scale.y = 0.5;
      this.cat3 = game.add.sprite(0, 0, 'cat_thirsty');
      this.cat3.x = this.x + this.width / 2;
      this.cat3.y = this.y + this.height / 2;
      this.cat3.scale.x = 0.5;
      this.cat3.scale.y = 0.5;
      this.cat4 = game.add.sprite(0, 0, 'cat_unhealthy');
      this.cat4.x = this.x + this.width / 2;
      this.cat4.y = this.y + this.height / 2;
      this.cat4.scale.x = 0.5;
      this.cat4.scale.y = 0.5;

      // create the background group to exist across the different dialogue stages
      var background = new Phaser.Group(this.game, null, 'background', true);
      background.create(0, 0, 'house_scene');

      //
      var cat1 = new Phaser.Group(this.game, null, 'cat1', true);
      cat1.visible = false;
      var cat2 = new Phaser.Group(this.game, null, 'cat2', true);
      cat2.visible = false;
      var cat3 = new Phaser.Group(this.game, null, 'cat3', true);
      cat3.visible = false;
      var cat4 = new Phaser.Group(this.game, null, 'cat4', true);
      cat4.visible = false;


      
      //set up the groups for each dialogue stage
      cat1.add(this.cat1);
      cat2.add(this.cat2);
      cat3.add(this.cat3);
      cat4.add(this.cat4);

      // create the dialogue structure
      var dialogue1 = new Dialogue([
        {text:DoctorMinigameDialogues.player_npc1_player_1, 
          group:cat1},
        {text:DoctorMinigameDialogues.player_npc1_npc1_1, 
          group:cat2},
        {text:DoctorMinigameDialogues.player_npc1_player_2, 
          group:cat2},
        {text:DoctorMinigameDialogues.player_npc1_npc1_2, 
          group:cat2},
        {text:DoctorMinigameDialogues.player_npc1_player_3, 
          group:cat2},
        {text:DoctorMinigameDialogues.player_npc1_npc1_3, 
          group:cat3},
        {text:DoctorMinigameDialogues.player_npc1_player_4, 
          group:cat4},
        {text:DoctorMinigameDialogues.player_npc1_npc1_4, 
          group:cat4},
          ]);

      // assign the global dialogue
      this.game.playerData.dialogue = dialogue1;

      // create the dialogue view
      this.dialogueView = new DialogueView(this.game, function(result) {
        this.game.state.start(result.nextState);
      });
      this.dialogueView.create();

      /* storyboard structure, still here just incase it is useful later
      // var second = new Phaser.Group(this.game, null, 'second', true);
      // second.add(this.cat2);
      // var third = new Phaser.Group(this.game, null, 'third', true);
      // third.add(this.cat3);
      // var fourth = new Phaser.Group(this.game, null, 'fourth', true);
      // fourth.add(this.cat4);
      // var firstScreen = new StoryboardScreen(start, dialogue1);
      // var secondScreen = new StoryboardScreen(second);
      // var thirdScreen = new StoryboardScreen(third);
      // var fourthScreen = new StoryboardScreen(fourth);
      // firstScreen.addNext(secondScreen);
      // secondScreen.addNext(thirdScreen);
      // thirdScreen.addNext(fourthScreen);
      // firstScreen.show();
      */
  },
  
  update: function() {

  },
}
