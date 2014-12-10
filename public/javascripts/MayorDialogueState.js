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

  var completedGames = game.playerData.completedGames;
  Object.keys(completedGames).forEach(function(key) {
    if (completedGames[key]) {
      numCompleted += 1;
    }
  });

  switch (numCompleted) {
    case 3:
      var finalDialogue = new Dialogue([{
        text: 'That\'s quite a lot of evidence. What is in the water?'
      }], [{
        text: 'Cholera is a disease I read about once. It is caused by ' +
          'bad bacteria in water.',
        dialogue: new Dialogue([{
          text: 'With all this evidence, I think we have to set the monster free. I\'m sorry, Sal.',
          group: mayorOfficeMonsterUncagedGroup
        },
        {
          text: 'It\'s alright. Thank you for helping me, Kojo.'
        }],
        [{
          text: 'You\'re welcome, friend.',
          nextState: 'credits'
        }])}]);
      break;
    default:
      var finalDialogue = new Dialogue([{
        text: 'I\'m afraid that\'s not enough evidence.'
      }],
      [{
        text: 'I guess I\'ll come back with more information next time.',
        nextState: 'villageState'
      }]);
      break;
  }
  
  var finalChoices = [{text: "That's all I have.", dialogue: finalDialogue}];

  switch (completedGames.tablets) {
    case false:
      var nextChoices3 = finalChoices;
      break;
    case true:
      var nextChoices3 = [{
        text: 'I helped boil and clean water. A lot of people ' +
            'didn\'t boil their water, even if it was dirty. ' +
            'It\'s the water that is making people sick.',
        dialogue: new Dialogue([{text: "Anything else?"}], finalChoices)
      }];
      break;
  }

  switch (completedGames.bottle) {
    case false:
      var nextChoices2 = nextChoices3;
      break;
    case true:
      var nextChoices2 = [{
        text: 'While I was collecting water with my friend, ' +
            'I realized that a lot of the places that ' +
            'people were collecting water from were dirty!',
        dialogue: new Dialogue([{text: "I'm following, go on."}], nextChoices3)
      }];
      break;
  }

  switch (completedGames.list && this.game.playerData.doctorMinigameState == DoctorMinigame.StateEnum.FINISHED) {
    case false:
      var nextChoices = nextChoices2;
      break;
    case true:
      var nextChoices = [{
        text: 'From helping out the doctor I learned that ' +
              'some people got sick because they drank river water.',
        dialogue: new Dialogue([{text: "Ok, continue."}], nextChoices2)
      }];
      break;
  }

  var doctorProceedDialogue = new Dialogue(
    [{
      text: 'Alright, proceed.',
    }], nextChoices
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
