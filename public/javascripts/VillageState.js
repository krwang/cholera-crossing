/* global Dialogue */

/**
 * Create a new VillageState
 * @constructor
 * @param {Phaser.Game} game
 */
function VillageState(game) {
  this.game = game;

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

  this.doctorMinigameDialogue = new Dialogue(
      ['Hi PLAYER, I have been getting quite a few patients lately! It must \n' +
      'be related to this monster incident. Unfortunately, I couldn\'t save all \n' +
      'of them. If they had come to me earlier on, I could have given them proper \n'+
      'treatment!'],
      [{text:'How horrible! Is there anything I can do to help?', dialogue: new Dialogue([
      'I have written down the symptoms that I have been seeing alot of lately. \n' +
      'Could you go ask the villagers if they are having any of these symptoms, and \n' +
      'tell them to come to me right away if they are?'],
      [{text: 'Yes, I\'m curious to know what is happening',
        nextState: 'doctorMinigame'},
       {text: 'No, I have other things to investigate', nextState: 'villageState'}])}]
  );
}

/**
 * Pre-load any assets required by the game
 */
VillageState.prototype.preload = function() {
  this.game.load.image('mg1', 'images/main/mg1.png');
  this.game.load.image('mg2', 'images/main/mg2.png');
  this.game.load.image('mg3', 'images/main/mg3.png');
};

/**
 * Create sprites and other game objects
 */
VillageState.prototype.create = function() {
  var self = this;
  this.game.add.button(125, 25, 'mg1', function() {
    this.game.playerData.dialogue = self.waterPurificationDialogue;
    this.game.state.start('dialogueState');
  });

  this.game.add.button(325, 25, 'mg2', function() {
    this.game.playerData.dialogue = self.waterCollectionDialogue;
    this.game.state.start('dialogueState');
  });

  this.game.add.button(525, 25, 'mg3', function() {
    this.game.playerData.dialogue = self.doctorMinigameDialogue;
    this.game.state.start('dialogueState');
  });
};

/**
 * Update the Village
 */
VillageState.prototype.update = function() {
};
