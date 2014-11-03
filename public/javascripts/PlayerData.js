/* jshint browser: true */
/* exported PlayerData */

/**
 * A PlayerData object, used to coordinate information between states.
 * @constructor
 */
function PlayerData() {
  this.location = null;
  this.completedGames = [];
  this.inventory = [];
  this.conversation = null;
}
