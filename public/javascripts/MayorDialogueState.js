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

  var failureDialogue = new Dialogue(
      [{
        text: 'Really? That\'s all?'
      }],
      [{
        text: 'I guess I will come back with more information',
        nextState: 'villageState'
      }]
  );

  var mayorConvincedDialogue = new Dialogue(
      [{
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
      }]
  );


  var maybeLibraryChoices = [{
    text: 'I don\'t know',
    dialogue: failureDialogue
  }];

  // Apparently library doesn't exist and was lies
  if (true || this.game.playerData.completedGames.library) {
    maybeLibraryChoices = [{
      // text: 'I went to the library and found that according to ' +
      //       'the books, the attacked villagers have cholera. ' +
      //       'It\'s a disease caused by bad bacteria in water!',
      text: 'Cholera is a disease I read about once. It is caused by ' +
            'bad bacteria in water.',
      dialogue: mayorConvincedDialogue
    }];
  }

  var maybeLibraryDialogue = new Dialogue(
    [{
      text: 'But what is in the water?'
    }],
    maybeLibraryChoices
  );
  var maybePurificationChoices = [{
    text: 'Oh…that is all I know',
    dialogue: failureDialogue
  }];

  if (this.game.playerData.completedGames.tablets) {
    maybePurificationChoices = [{
      text: 'I helped boil and clean water. A lot of people ' +
            'didn\'t boil their water, even if it was dirty. ' +
            'It\'s the water that is making people sick.',
      dialogue: maybeLibraryDialogue
    }];
  }

  var maybePurificationDialogue = new Dialogue(
    [{
      text: 'Oh dear! That water is indeed very dirty.'
    }],
    maybePurificationChoices
  );


  var maybeCollectionChoices = [{
    text: 'Oh…that is all I know',
    dialogue: failureDialogue
  }];

  if (this.game.playerData.completedGames.bottle) {
    maybeCollectionChoices = [{
      text: 'While I was collecting water with my friend, ' +
            'I realized that a lot of the places that ' +
            'people were collecting water from were dirty!',
      dialogue: maybePurificationDialogue
    }];
  }

  var maybeCollectionDialogue = new Dialogue(
    [{
      text: 'I see. Please continue.'
    }],
    maybeCollectionChoices
  );


  var doctorProceedDialogue = new Dialogue(
    [{
      text: 'Alright, proceed.'
    }],
    [{
      text: 'From helping out the doctor I learned that ' +
            'some people got sick because they drank river water.',
      dialogue: maybeCollectionDialogue
    }]
  );

  var startChoices = [{
    text: 'No…',
    nextState: 'villageState'
  }];

  if (this.game.playerData.completedGames.list && this.game.playerData.doctorMinigameState == DoctorMinigame.StateEnum.FINISHED) {
    startChoices = [{
      text: 'I do! I can prove that the monster has not hurt the village!',
      dialogue: doctorProceedDialogue
    }];
  }

  var startDialogue = new Dialogue(
    [{
      text: 'So, Kojo, do you know what is actually hurting Gora Gora?',
      group: mayorOfficeMonsterCagedGroup
    }],
    startChoices
  );

  return startDialogue;
};
