/* global Dialogue, DialogueView, Phaser */
/* exported MayorDialogueState */

function MayorDialogueState(game) {
  this.game = game;
  this.dialogueView = new DialogueView(this.game, function(results) {
    this.game.state.start(results.nextState);
  }.bind(this));
}

/**
 * Game state preload function
 */
MayorDialogueState.prototype.preload = function() {
  this.game.load.image('mayorOfficeMonsterCagedBackground',
                       'images/start_dialogue/mayor_office_monster_caged_background.png');
  this.game.load.image('mayorOfficeMonsterUncagedBackground',
                       'images/start_dialogue/mayor_office_monster_uncaged.png');
  this.dialogueView.preload();
};

/**
 * Wire up the dialogue view
 */
MayorDialogueState.prototype.create = function() {
  var startDialogue = this.createDialogue();
  this.game.playerData.dialogue = startDialogue;
  this.dialogueView.create();
};

/**
 * Create the gigantic dialogue
 * @return {Dialogue}
 */
MayorDialogueState.prototype.createDialogue = function() {
  function createBackgroundGroup(name) {
    var group = new Phaser.Group(this.game, null, name + 'Group', true);
    var sprite = this.game.add.sprite(0, 0, name + 'Background');
    group.add(sprite);
    group.visible = false;
    this.game.add.existing(group);
    return group;
  }

  var mayorOfficeMonsterCagedGroup =
                    createBackgroundGroup('mayorOfficeMonsterCaged');
  var mayorOfficeMonsterUncagedGroup =
                    createBackgroundGroup('mayorOfficeMonsterUncaged');

  var numCompleted = 0;
  console.log(numCompleted);

  var completedGames = game.playerData.completedGames;
  Object.keys(completedGames).forEach(function(key) {
    if (completedGames[key]) {
      numCompleted += 1;
    }
  });
  console.log(numCompleted);

  switch (numCompleted) {
    case 3:
      var finalDialogue = new Dialogue([{
        text: 'I think, that with all this evidence we have to ' +
              'set the monster free. I\'m so sorry.',
        group: mayorOfficeMonsterUncagedGroup
      },
      {
        text: 'It\'s alright. Thank you for helping me, Kojo.'
      }],
      [{
        text: 'You\'re welcome, friend.',
        nextState: 'credits'
      }]);
      break;
    default:
      var finalDialogue = new Dialogue([{
        text: 'Is that all the evidence you have?'
      }],
      [{
        text: 'I guess I will come back with more information.',
        nextState: 'villageState'
      }]);
      break;
  }
  
  switch (completedGames.tablets) {
    case true:
      var nextDialogue3 = finalDialogue;
      break;
    case false:
      var nextDialogue3 = new Dialogue([{
        text: 'While I was collecting water with my friend, ' +
            'I realized that a lot of the places that ' +
            'people were collecting water from were dirty!',
        dialogue: finalDialogue
      }]);
      break;
  }

  switch (completedGames.bottle) {
    case false:
      var nextDialogue2 = nextDialogue3;
      break;
    case true:
      var nextDialogue2 = new Dialogue([{
        text: 'While I was collecting water with my friend, ' +
            'I realized that a lot of the places that ' +
            'people were collecting water from were dirty!',
        dialogue: nextDialogue3
      }]);
      break;
  }

  switch (completedGames.list) {
    case false:
      var nextDialogue = nextDialogue2;
      break;
    case true:
      var nextDialogue = new Dialogue([{
        text: 'From helping out the doctor I learned that ' +
              'some people got sick because they drank river water.',
        dialogue: nextDialogue2
      }]);
      break;
  }

  var doctorProceedDialogue = new Dialogue(
    [{
      text: 'Alright, proceed.',
      dialogue: nextDialogue
    }]
  );

  switch (numCompleted) {
    case 0:
      var startChoices = [{
        text: 'No…I\'ll explore the town more.',
        nextState: 'villageState'
      }];
      break;
    case 1:
      var startChoices = [{
        text: 'I think I\'m starting to get an idea of what\'s happening!',
        dialogue: doctorProceedDialogue
      }];
      break;
    case 2:
      var startChoices = [{
        text: 'I think I\'m almost there!',
        dialogue: doctorProceedDialogue
      }];
      break;
    case 3:
      var startChoices = [{
        text: 'I do! I can prove that the monster has not hurt the village!',
        dialogue: doctorProceedDialogue
      }];
      break;
  }

  var startDialogue = new Dialogue(
    [{
      text: 'So, Kojo, do you know what is actually hurting Gora Gora?',
      group: mayorOfficeMonsterCagedGroup,
    }], startChoices
  );

  return startDialogue;
};
