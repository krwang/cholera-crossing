/* jshint browser: true */
/* exported PlayerData */

/**
 * A PlayerData object, used to coordinate information between states.
 * @constructor
 */
function PlayerData() {
  this.location = null;
  this.completedGames = {
    tablets: true, // water collection
    list: true,    // Doctor minigame
    bottle: true,  // water purification
  };
  this.inventory = {
    matches: false,
    paper: false,
    waterbucket: false,
  };
  this.buildingJustEntered = null;
  this.dialogue = null;
  this.doctorMinigameState = DoctorMinigame.StateEnum.NOT_INITIATED;
}
