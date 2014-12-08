// A subclass of Phaser.Button intended to add a text label.
// Adapted from code provided by user XekeDeath on
// http://www.html5gamedevs.com/topic/2847-button-text/

/* jshint browser: true */
/* global Phaser */
/* export LabelButton */

/**
 * @constructor
 * @extends Phaser.Button
 * @param {Phaser.Game} game Current game instance.
 * @param {number} x - X position of the LabelButton.
 * @param {number} y - Y position of the LabelButton.
 * @param {string} key - The image key as defined in the Game.Cache to use as
 *                         the texture for this LabelButton.
 * @param {string} label - The text label to draw on this LabelButton
 * @param {function} callback - The function to call when this LabelButton is
 *                              pressed.
 * @param {object} callbackContext - The context in which the callback will
 *                                   be called (usually 'this').
 * @param {string|number} overFrame - This is the frame or frameName that
 *                                    will be set when this button is in an
 *                                    over state. Give either a number to use a
 *                                    frame ID or a string for a frame name.
 * @param {string|number} outFrame - This is the frame or frameName that will
 *                                   be set when this button is in an out
 *                                   state. Give either a number to use a frame
 *                                   ID or a string for a frame name.
 * @param {string|number} downFrame - This is the frame or frameName that
 *                                    will be set when this button is in a down
 *                                    state. Give either a number to use a
 *                                    frame ID or a string for a frame name.
 * @param {string|number} upFrame - This is the frame or frameName that will
 *                                  be set when this button is in an up state.
 *                                  Give either a number to use a frame ID or a
 *                                  string for a frame name.
 */
function LabelButton(game, x, y, key, label, callback, callbackContext,
                     overFrame, outFrame, downFrame, upFrame) {

  Phaser.Button.call(this, game, x, y, key, callback, callbackContext,
                     overFrame, outFrame, downFrame, upFrame);

  var labelStyle = {
      'font': '18px Helvetica Neue',
      'fill': 'black',
      'wordWrap' : true,
      'wordWrapWidth' : this.width - 24
  };
  this.label = new Phaser.Text(game, 0, 0, label, labelStyle);

  // Center both the button and the label
  this.anchor.setTo(0.5, 0.5);
  this.label.anchor.setTo(0.5, 0.5);


  this.addChild(this.label);
  this.setLabel(label);
}

LabelButton.prototype = Object.create(Phaser.Button.prototype);
/**
 * Manual reference to constructor because JavaScript is strange
 */
LabelButton.prototype.constructor = LabelButton;

/**
 * Set the label of this LabelButton
 * @param {string} label
 */
LabelButton.prototype.setLabel = function(label) {
  this.label.setText(label);
};
