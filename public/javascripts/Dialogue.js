/* jshint browser: true */
/* exported Dialogue */

/**
 * Create a new dialogue involving the npc saying text and the player
 * responding with one of the choices.
 * @constructor
 * @param {Array<String>} displayTexts Text to display at each step
 * @param {Array<String>} choices
 */
function Dialogue(displayTexts, choices) {
  this.displayTexts = displayTexts;
  this.displayIndex = 0;
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
    return this.displayTexts[this.displayIndex];
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
  return this.choices[index].text;
};

/**
 * @return {boolean} Whether the dialogue expects the player choices to be
 *                   displayed at this time
 */
Dialogue.prototype.isPlayerChoosing = function() {
  return this.displayIndex >= this.displayTexts.length;
};

