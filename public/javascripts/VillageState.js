/* global Dialogue, Phaser, VillagePather */

/**
 * Create a new VillageState
 * @constructor
 * @param {Phaser.Game} game
 */
function VillageState(game) {
  this.game = game;

  this.width = this.game.width - 20;
  this.height = this.game.height;

  this.x = 0;
  this.y = this.game.height - this.height;

  // var willHelpDialogue = new Dialogue(
  //     ["Thank you so much! You see, this angry mob thinks that I'm to " +
  //      "blame for the recent attacks on their village.",
  //      "I keep trying to tell them that the \"attacked\" villagers are " +
  //      "really just suffering from cholera, but they refuse to believe me.",
  //      "Please convince them as soon as possible!"],
  //     []
  // );

  // var initialDialogue = new Dialogue(
  //     ["Hi! You look like a cool cat. Can you help me out?"],
  //     [{text: "Fine, whatever", dialogue: willHelpDialogue}]
  // );
  this.waterPurificationDialogue = new Dialogue(
      ['Doop doop purify water conversation goes here'],
      [{text: 'YES I WILL PURIFY', nextState: 'waterPurification'},
       {text: 'On second thought nah', nextState: 'villageState'}]
  );

  this.waterCollectionDialogue = new Dialogue(
      ['The villagers need advice on where to pick up their water, can you ' +
       'help?',
       'Test'
       ],
      [{text: 'Yes, I\'ll make them an offer they can\'t refuse',
        nextState: 'waterCollection'},
       {text: 'On second thought nah', nextState: 'villageState'}]
  );
}

/**
 * Pre-load any assets required by the game
 */
VillageState.prototype.preload = function() {
  this.game.load.image('mg1', 'images/main/mg1.png');
  this.game.load.image('mg2', 'images/main/mg2.png');
  this.game.load.image('mg3', 'images/main/mg3.png');

  game.load.image('map', 'images/collection_minigame/land.png');
  game.load.image('taskbar', 'images/main/taskbar.png');
  game.load.image('player', 'images/bunnykid.png');
  game.load.image('giraffe_doctor', 'images/doctor_minigame/giraffedoctor.png');
  game.load.image('mayor', 'images/main/owlmayor.png');
  game.load.image('hospital_room', 'images/doctor_minigame/hospital_room.png');

};

/**
 * Create sprites and other game objects
 */
VillageState.prototype.create = function() {
  var self = this;

  var doctorGroup = new Phaser.Group(this.game, null, 'doctorGroup', true);

  this.hospital_room = doctorGroup.create(0, 0, 'hospital_room');
  this.hospital_room.scale.x = 0.5;
  this.hospital_room.scale.y = 0.5;

  this.doctor = doctorGroup.create(0, 0, 'giraffe_doctor');
  this.doctor.x = this.x + this.width / 2 + 210;
  this.doctor.y = this.y + 150;
  this.doctor.scale.x = -0.5;

  this.doctor.scale.y = 0.5;

  
  doctorGroup.visible = false;

  this.doctorMinigameDialogue = new Dialogue(
      [{text: 'Hi PLAYER, I have been getting quite a few patients lately! It must ' +
       'be related to this monster incident.', group: doctorGroup},
       {text: 'Unfortunately, I couldn\'t save all of them. If they had come to me ' +
       'earlier on, I could have given them proper treatment!', group: doctorGroup}],
      [
       {
        text: 'How horrible! Is there anything I can do to help?',
        dialogue: new Dialogue(
          [{text: 'I have written down the symptoms that I have been seeing alot of ' +
           'lately.', group: doctorGroup},
           {text: 'Could you go ask your friends if they are having any of these ' +
           'symptoms, and tell them to come to me right away if they are?', group: doctorGroup}],
          [{
             text: 'Yes, I\'m curious to know what is happening',
             nextState: 'doctorMinigame'
           },
           {
             text: 'No, I have other things to investigate',
             nextState: 'villageState'
           }
          ]
        )
       }
      ]
  );

  this.game.add.tileSprite(0, 0, 1600, 1000, 'map');

  this.game.add.button(125, 125, 'mg1', function() {
    self.villagePather.playPath('waterPurification', false,
      function() {
        // On complete play dialogue
        self.game.playerData.dialogue = self.waterPurificationDialogue;
        self.game.state.start('dialogueState');
      }
    );
  });

  this.game.add.button(325, 125, 'mg2', function() {
    self.villagePather.playPath('waterCollection', false,
      function() {
        self.game.playerData.dialogue = self.waterCollectionDialogue;
        self.game.state.start('dialogueState');
      }
    );
  });

  this.game.add.button(525, 125, 'mg3', function() {
    self.villagePather.playPath('doctorMinigame', false,
      function() {
        self.game.playerData.dialogue = self.doctorMinigameDialogue;
        self.game.state.start('dialogueState');
      }
    );
  });

  mayor = this.game.add.sprite(300, 300, 'mayor');
  mayor.scale.setTo(0.2, 0.2);

  // taskbar
  taskbar = this.game.add.sprite(0, 500, 'taskbar');
  taskbar.fixedToCamera = true;
  taskbarText = this.game.add.text(20, 525, "You have " + game.playerData.completedGames.length + " clues from completing minigames.", {
    fill: "#000000",
    font: "20px Open Sans",
    wordWrap: true,
    wordWrapWidth: 750,
  });
  taskbarText.fixedToCamera = true;

  this.playerSprite = this.game.add.sprite(400, 300, 'player');
  this.playerSprite.scale.setTo(0.2, 0.2);

  this.villagePather = new VillagePather(this.game, this.playerSprite);
};

/**
 * Update the Village
 */
VillageState.prototype.update = function() {
};
