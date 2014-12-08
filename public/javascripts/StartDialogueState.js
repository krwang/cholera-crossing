/* global Dialogue, DialogueView, Phaser */
/* exported StartDialogueState */

function StartDialogueState(game) {
  this.game = game;
  this.dialogueView = new DialogueView(this.game, function(results) {
    this.game.state.start(results.nextState);
  }.bind(this));
}

/**
 * Game state preload function
 */
StartDialogueState.prototype.preload = function() {
  this.game.load.image('monsterRunningBackground',
                       'images/start_dialogue/monster_running_background.png');
  this.game.load.image('monsterHidingBackground',
                       'images/start_dialogue/monster_hiding_background.png');
  this.game.load.image('monsterListeningBackground',
                       'images/start_dialogue/monster_listening_background.png');
  this.game.load.image('monsterStandingBackground',
                       'images/start_dialogue/monster_standing_background.png');
  this.game.load.image('mayorOfficeOutsideBackground',
                       'images/start_dialogue/mayor_office_outside_background.png');
  this.game.load.image('mayorOfficeMonsterCagedBackground',
                       'images/start_dialogue/mayor_office_monster_caged_background.png');
  this.dialogueView.preload();
};

/**
 * Wire up the dialogue view
 */
StartDialogueState.prototype.create = function() {
  var startDialogue = this.createDialogue();
  this.game.playerData.dialogue = startDialogue;
  this.dialogueView.create();
};

/**
 * Create the gigantic dialogue
 * @return {Dialogue}
 */
StartDialogueState.prototype.createDialogue = function() {
  function createBackgroundGroup(name) {
    var group = new Phaser.Group(this.game, null, name + 'Group', true);
    var sprite = this.game.add.sprite(0, 0, name + 'Background');
    group.add(sprite);
    group.visible = false;
    this.game.add.existing(group);
    return group;
  }

  var monsterRunningGroup = createBackgroundGroup('monsterRunning');
  var monsterHidingGroup = createBackgroundGroup('monsterHiding');
  var monsterListeningGroup = createBackgroundGroup('monsterListening');

  var mayorOfficeOutsideGroup = createBackgroundGroup('mayorOfficeOutside');
  var mayorOfficeMonsterCagedGroup =
                    createBackgroundGroup('mayorOfficeMonsterCaged');

  // var mayorOkayWithItDialogue = new Dialogue(
  //   [{
  //     text: 'Hmm, I guess there’d be no reason to keep him here then.'
  //   }],
  //   [{
  //     text: 'I\'ll figure it out!',
  //     nextState: 'villageState'
  //   }]
  // );

  // var mayorUnconvincedDialogue = new Dialogue(
  //   [{
  //     text: 'I’m not so sure…'
  //   }],
  //   [{
  //     text: 'What if I can find out what’s really causing everyone to ' +
  //           'get sick?',
  //     dialogue: mayorOkayWithItDialogue
  //   }]
  // );

  var monsterSobbingDialogue = new Dialogue(
      [{
        text: '...But what else could possibly be ' +
              'causing everyone to get sick?'
      }],
      [{
        text: 'I don’t know, but I\'ll figure it out!',
        nextState: 'villageState'
        // dialogue: mayorOkayWithItDialogue,
      }]
  );

  // var mayorWouldDialogue = new Dialogue(
  //     [],
  //     [{
  //       text: 'Would an evil monster be crying like that?',
  //       dialogue: monsterSobbingDialogue
  //     }]
  // );

  var mayorWhyDialogue = new Dialogue(
      [{
        text: 'What? Then why did you bring him in?'
      }],
      [{
        text: 'So you would convince everyone that he’s innocent!',
        dialogue: monsterSobbingDialogue
      }]
  );

  var wahhhhhDialogue = new Dialogue(
      [
      // {
      //   text: 'WAHHHHH!!!!',
      //   group: mayorOfficeMonsterCagedGroup
      // },
      {
        text: 'Good work. You brought in the monster that was making everyone sick!',
        group: mayorOfficeMonsterCagedGroup
      }],
      [{
        text: 'No, it wasn’t him!',
        dialogue: mayorWhyDialogue
      }]
  );

  // var beforeMayorDialogue = new Dialogue(
  //     [{
  //       text: 'Are you sure this is a good idea?',
  //       group: mayorOfficeOutsideGroup
  //     }],
  //     [{
  //       text: 'Don’t worry! Me and the mayor go way back. He’s a great guy.',
  //       dialogue: wahhhhhDialogue
  //     }]
  // );

  var willYouHelpDialogue = new Dialogue(
      [{
        text: 'Everyone’s blaming me for everyone being sick and ' +
              'so they’re trying to chase me out of town. '+ 
              'Will you help me clear my name?',
              group: monsterListeningGroup,
      }],
      [{
        text: 'Of course! I know just the person to talk to.',
        group: mayorOfficeOutsideGroup,
        dialogue: wahhhhhDialogue,
      }]
  );

  // var expositionDialogue = new Dialogue(
  //     [{
  //       text: 'Everyone’s blaming me for everyone being sick and ' +
  //             'so they’re trying to chase me out of town.'
  //     }],
  //     [{
  //       text: 'That’s terrible!',
  //       dialogue: willYouHelpDialogue
  //     }]
  // );

  // var monsterDoesntThinkDialogue = new Dialogue(
  //     [{
  //       text: 'You don’t think I did it?',
  //       group: monsterListeningGroup
  //     }],
  //     [{
  //       text: 'Did what?',
  //       dialogue: willYouHelpDialogue
  //     }]
  // );

  var startDialogue = new Dialogue(
    [
      {
        text: 'Oh no! I’ve been spotted! Please don’t hurt me! I didn’t do it! I’m innocent!',
        group: monsterHidingGroup
      },
      // {
      //   text: ''
      // }
    ],
    [{
      text: 'Why would I hurt you? And why were those people chasing ' +
            'you?',
      dialogue: willYouHelpDialogue
    }]
  );

  // var startDialogue = new Dialogue(
  //   [{
  //     text: 'That was a close one. I don’t know how much longer I can ' +
  //           'keep running away like this.',
  //     group: monsterRunningGroup
  //   }],
  //   [{
  //     text: 'Excuse me, who are you? I haven’t seen you around the ' +
  //           'village before.',
  //     dialogue: monsterSpottedDialogue
  //   }]
  // );

  return startDialogue;
};
