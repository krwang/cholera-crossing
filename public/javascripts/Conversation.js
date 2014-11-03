/* jshint browser: true */
/* exported Conversation */

/**
 * Create a new conversation
 * @constructor
 * @param {Dialogue} startDialogue
 */
function Conversation(startDialogue) {
  this.dialogue = startDialogue;
}

/**
 * @return {String} The text to be displayed for the current dialogue
 */
Conversation.prototype.getDisplayText = function() {
  return this.dialogue.getDisplayText();
};

/**
 * Advance the conversation
 */
Conversation.prototype.next = function() {
  if (this.isDone()) {
    throw new Error('Conversation is already done');
  }

  if (this.dialogue.isPlayerChoosing()) {
    throw new Error('Player must choose before advancing dialogue');
  }

  this.dialogue.next();
};

/**
 * Choose a choice from the available player dialogue choices
 * @param {number} choiceIndex
 */
Conversation.prototype.chooseChoiceIndex = function(choiceIndex) {
  if (choiceIndex < 0 || choiceIndex >= this.dialogue.getChoicesLength()) {
    throw new Error('Choice index out of bounds');
  }

  if (!this.dialogue.isPlayerChoosing()) {
    throw new Error('Player is not currently meant to be choosing');
  }

  this.dialogue = this.dialogue.choices[choiceIndex].dialogue;
};

/**
 * @return {boolean} Whether the conversation is done
 */
Conversation.prototype.isDone = function() {
  return this.dialogue === null;
};

/**
 * @return {Array<String>} List of the text of all available choices
 */
Conversation.prototype.getChoicesText = function() {
  if (!this.dialogue.isPlayerChoosing()) {
    throw new Error('Player is not currently meant to be choosing');
  }
  var choicesText = [];
  for (var i = 0; i < this.dialogue.getChoicesLength(); i++) {
    choicesText.push(this.dialouge.getChoiceText(i));
  }
};
