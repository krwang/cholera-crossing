/* global VillageState, WaterCollection, PurificationMinigame, DoctorMinigame */
/* global Phaser, PlayerData, ConversationState */


// Initialize Phaser and create a game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', null, true);

var gameStates = {
  conversationState: ConversationState,
  villageState: VillageState,
  waterCollection: WaterCollection,
  waterPurification: PurificationMinigame,
  doctorMinigame: DoctorMinigame
};

/**
 * Game-global registry of player-related data
 */
game.playerData = new PlayerData();

// Add all registered states to the game object
Object.keys(gameStates).forEach(function(stateName) {
  var constructedState = new gameStates[stateName](game);
  game.state.add(stateName, constructedState);
});

game.state.start('villageState');
