/* global Conversation, Dialogue */

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
  this.waterPurificationDialogue = new Conversation(new Dialogue(
      ['Doop doop purify water conversation goes here'],
      [{text: 'YES I WILL PURIFY', nextState: 'waterPurification'},
       {text: 'On second thought nah', nextState: 'villageState'}]
  ));

  this.waterCollectionDialogue = new Conversation(new Dialogue(
      ['The villagers need advice on where to pick up their water, can you ' +
       'help?'],
      [{text: 'Yes, I\'ll make them an offer they can\'t refuse',
        nextState: 'waterCollection'},
       {text: 'On second thought nah', nextState: 'villageState'}]
  ));
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
    this.game.playerData.conversation = self.waterPurificationDialogue;
    this.game.state.start('conversationState');
  });

  this.game.add.button(325, 25, 'mg2', function() {
    this.game.playerData.conversation = self.waterCollectionDialogue;
    this.game.state.start('conversationState');
  });
};

/**
 * Update the Village
 */
VillageState.prototype.update = function() {
};
