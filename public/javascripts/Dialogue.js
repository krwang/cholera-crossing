/* jshint browser: true */
/* exported Dialogue */

/**
 * Create a new dialogue involving the npc saying text and the player
 * responding with one of the choices.
 * @constructor
 * @param {Array<Object>} displays Text and other things to display at each step
 * @param {Array<String>} choices
 */
function Dialogue(displays, choices) {
  this.displays = displays;
  this.displayIndex = 0;
  this.choices = choices;
}

/**
 * @return {boolean} Can call next without errors
 */
Dialogue.prototype.canNext = function() {
  return !this.isPlayerChoosing();
};

/**
 * Advance the dialogue
 */
Dialogue.prototype.next = function() {
  if (this.isPlayerChoosing()) {
    throw new Error('Player must choose before advancing dialogue');
  }

  this.displayIndex++;
};

/**
 * Get the current text to display
 * @return {String}
 */
Dialogue.prototype.getDisplayText = function() {
  if (!this.isPlayerChoosing()) {
    var display = this.displays[this.displayIndex];
    if (typeof(display) == 'string') {
      return display;
    }
    return display.text;
  }
  throw new Error('Index passed into getDisplayText is out of bounds, the' +
      ' player should be choosing their action.');
};

/**
 * Get the current group to display
 * @return {Phaser.Group}
 */
Dialogue.prototype.getDisplayGroup = function() {
  if (this.displayIndex < this.displays.length) {
    var display = this.displays[this.displayIndex];
    return display.group;
  }
  return null;
};

/**
 * Get the current group's next state
 * @return {String}
 */
Dialogue.prototype.getDisplayNextState = function() {
  if (this.displayIndex < this.displays.length) {
    var display = this.displays[this.displayIndex];
    return display.nextState;
  }
  return null;
};


/**
 * @return {number} The amount of choices available to the player.
 */
Dialogue.prototype.getChoicesLength = function() {
  return this.choices.length;
};

/**
 * @return {Array<String>} List of the text of all available choices
 */
Dialogue.prototype.getChoicesText = function() {
  if (!this.isPlayerChoosing()) {
    throw new Error('Player is not currently meant to be choosing');
  }
  return this.choices.map(function(choice) {
    return choice.text;
  });
};

/**
 * @return {boolean} Whether the dialogue is completed
 */
Dialogue.prototype.isDialogueFinished = function() {
  return ((!this.displays) ||
           this.displayIndex >= this.displays.length);
};

/**
 * @return {boolean} Whether the dialogue expects the player choices to be
 *                   displayed at this time
 */
Dialogue.prototype.isPlayerChoosing = function() {
  return this.canPlayerChoose() &&
         ((!this.displays) ||
           this.displayIndex >= this.displays.length);
};

/**
 * Whether the player can choose
 * @return {boolean}
 */
Dialogue.prototype.canPlayerChoose = function() {
  return !!this.choices;
};

/**
 * Choose a choice from the available player dialogue choices
 * @param {number} choiceIndex
 * @return {Dialogue} Next dialogue, if applicable
 */
Dialogue.prototype.chooseChoiceIndex = function(choiceIndex) {
  if (choiceIndex < 0 || choiceIndex >= this.getChoicesLength()) {
    throw new Error('Choice index out of bounds');
  }

  if (!this.isPlayerChoosing()) {
    throw new Error('Player is not currently meant to be choosing');
  }

  return {
    dialogue: this.choices[choiceIndex].dialogue,
    nextState: this.choices[choiceIndex].nextState,
    group: this.choices[choiceIndex].group
  };
};

/**
 * Reset the dialogue to initial conditions
 */
Dialogue.prototype.reset = function() {
  this.displayIndex = 0;
};

