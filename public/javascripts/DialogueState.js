/* jshint browser: true */
/* global DialogueView */

/**
 * Create a new DialogueState
 *
 * @constructor
 * @param {Phaser.Game} game Global game object
 */
function DialogueState(game) {
  this.game = game;

  var dialogueState = this;
  this.dialogueView = new DialogueView(this.game, function(result) {
    dialogueState.game.state.start(result.nextState);
  });
}

/**
 * Pre-load any assets required by the dialogue
 */
DialogueState.prototype.preload = function() {
  this.dialogueView.preload();
};

/**
 * Create sprites and other game objects
 */
DialogueState.prototype.create = function() {
  this.dialogueView.create();
};

/**
 * Update the Dialogue
 */
DialogueState.prototype.update = function() {
  this.dialogueView.update();
};
