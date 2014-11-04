/* jshint browser: true */
/* exported Dialogue */
/* global ConversationState */

/**
 * Create a new dialogue involving the npc saying text and the player
 * responding with one of the choices.
 * @constructor
 * @param {String} text
 * @param {Array<String>} choices
 */
function Dialogue(text, choices) {
  this.text = text;
  this.displayTexts = [];
  this.displayIndex = 0;

  var displayIndex = 0;
  var words = this.text.split(' ');
  for (var i = 0; i < this.words.length; i++) {
    var displayText = [];
    var displayLength = 0;
    while (displayLength < ConversationState.maxLength) {
      displayText.push(words[i]);
      displayLength += words[i].length;
      i++;
    }
    this.displayTexts[displayIndex] = displayText.join(' ');
    displayIndex++;
  }
  this.choices = choices;
}

/**
 * Advance the dialogue
 */
Dialogue.prototype.next = function() {
  this.displayIndex++;
};

/**
 * Get the current text to display
 * @return {String}
 */
Dialogue.prototype.getDisplayText = function() {
  if (!this.isPlayerChoosing()) {
    return this.displayText[this.displayIndex];
  }
  throw new Error('Index passed into getDisplayText is out of bounds, the' +
      ' player should be choosing their action.');
};

/**
 * @return {number} The amount of choices available to the player.
 */
Dialogue.prototype.getChoicesLength = function() {
  return this.choices.length;
};

/**
 * @param {number} index Choice index for text retrieval
 * @return {String} Display text of choice
 */
Dialogue.prototype.getChoiceText = function(index) {
  return this.choices[index].getText();
};

/**
 * @return {boolean} Whether the dialogue expects the player choices to be
 *                   displayed at this time
 */
Dialogue.prototype.isPlayerChoosing = function() {
  return this.displayIndex >= this.displayText.length;
};

