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



  var monsterSobbingDialogue = new Dialogue(
      [{
        text: 'Can you prove that Sal isn\'t to blame? Use the arrow keys to explore the village. Bring back any evidence you find.'
      }],
      [{
        text: 'I\'ll figure it out and I\'ll be back!',
        nextState: 'villageState'
      }]
  );

  var mayorWhyDialogue = new Dialogue(
      [{
        text: 'What? Then why did you bring him here?'
      }],
      [{
        text: 'So you can convince everyone that he is innocent!',
        dialogue: monsterSobbingDialogue
      }]
  );

  var wahhhhhDialogue = new Dialogue(
      [
      {
        text: 'Good work, Kojo. You helped us capture the monster that was making everyone sick!',
        group: mayorOfficeMonsterCagedGroup
      }],
      [{
        text: 'No, it wasn’t him!',
        dialogue: mayorWhyDialogue
      }]
  );

  var willYouHelpDialogue = new Dialogue(
      [{
        text: 'Everyone is saying I made villagers get sick. They\'re trying to '
        + 'chase me out of town! Can you help me clear my name?',
              group: monsterListeningGroup,
      }],
      [{
        text: 'Of course! I know someone who can help!',
        group: mayorOfficeOutsideGroup,
        dialogue: wahhhhhDialogue,
      }]
  );

  var startDialogue = new Dialogue(
    [
      {
        text: 'Oh no! I’ve been spotted! Please don’t hurt me! I didn’t do it!',
        group: monsterHidingGroup
      },
    ],
    [{
      text: 'Huh? Why would I hurt you? Why were people chasing ' +
            'you?',
      dialogue: willYouHelpDialogue
    }]
  );

  return startDialogue;
};
