/* global VillageState, WaterCollection, PurificationMinigame, DoctorMinigame */
/* global Phaser, PlayerData, DialogueState, StartDialogueState, start, end */
/* global MayorDialogueState */


// Initialize Phaser and create a game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', null, true);

var gameStates = {
  dialogueState: DialogueState,
  villageState: VillageState,
  waterCollection: WaterCollection,
  waterPurification: PurificationMinigame,
  doctorMinigame: DoctorMinigame,
  startDialogueState: StartDialogueState,
  mayorDialogueState: MayorDialogueState,
  start: start,
  end: end
};

game.music = undefined;

/**
 * Game-global registry of player-related data
 */
game.playerData = new PlayerData();

// Add all registered states to the game object
Object.keys(gameStates).forEach(function(stateName) {
  var stateConstructor = gameStates[stateName];
  game.state.add(stateName, stateConstructor);
});

game.state.start('villageState');

WebFontConfig = {
    google: {
      families: ['Gloria+Hallelujah::latin']
    }
};
