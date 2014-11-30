/* jshint browser: true */
/* global GradualText, LabelButton, Phaser */

/**
 * Create a new DialogueView
 *
 * @constructor
 * @param {Phaser.Game} game Global game object
 * @param {function} onDone Callback to execute when dialogue finishes
 */
function DialogueView(game, onDone) {
  this.game = game;
  this.onDone = onDone;

  this.width = this.game.width - 20;
  this.height = 96;

  this.x = 10;
  this.y = this.game.height - this.height;

  this.buttonHeight = 40;
  this.buttonPadding = 8;

  this.leftButton = null;
  this.rightButton = null;

  this.group = null;
  this.previousGroup = null;

}

/**
 * Pre-load any assets required by the dialogue
 */
DialogueView.prototype.preload = function() {
  this.game.load.image('button-background',
                       'images/dialogue/dialogue-button-background.png');
  this.game.load.image('text-background',
                       'images/dialogue/dialogue-text-background.png');
  this.game.load.image('left-arrow',
                       'images/dialogue/left-arrow.png');
  this.game.load.image('player-left-arrow',
                       'images/dialogue/player-left-arrow.png');
  this.game.load.image('right-arrow',
                       'images/dialogue/right-arrow.png');
};

/**
 * Create sprites and other game objects
 */
DialogueView.prototype.create = function() {
  this.preload();
  this.dialogue = this.game.playerData.dialogue;
  this.lastDialogue = null;
  if (!this.dialogue) {
    throw new Error('DialogueView must be provided a dialogue');
  }
  this.dialogue.reset();

  this.group = new Phaser.Group(this.game, null, 'dialogueView', true);

  this.textBackground = this.game.add.image(this.x, this.y + this.height / 2,
                                            'text-background');
  this.textBackground.x = this.x + this.width / 2;
  this.textBackground.anchor.setTo(0.5, 0.5);

  this.group.add(this.textBackground);

  var textStyle = {
      'font': '18px Helvetica Neue',
      'fill': 'black',
      'wordWrap': true,
      'wordWrapWidth': this.textBackground.width - 24
  };

  this.text = new GradualText(
      this.game,
      this.x - this.textBackground.width / 2 + this.width / 2 + 12,
      this.y - this.textBackground.height / 2 + this.height / 2 + 12,
      '',
      textStyle
  );

  this.game.add.existing(this.text);

  this.group.add(this.text);

  this.leftButton = this.game.add.button(this.x, this.y + this.height / 2,
                                         'left-arrow',
                                         this.goBack.bind(this));
  this.leftButton.anchor.setTo(0, 0.5);
  this.group.add(this.leftButton);

  this.playerLeftButton = this.game.add.button(this.x, this.y + this.height / 2,
                                         'player-left-arrow',
                                         this.goBack.bind(this));
  this.playerLeftButton.anchor.setTo(0, 0.5);
  this.group.add(this.playerLeftButton);

  this.rightButton = this.game.add.button(this.x + this.width -
                                          this.leftButton.width,
                                          this.y + this.height / 2,
                                          'right-arrow',
                                          this.goForwards.bind(this));
  this.rightButton.anchor.setTo(0, 0.5);

  this.group.add(this.rightButton);

  this.updateState();
};

/**
 * Go forward one step if possible
 */
DialogueView.prototype.goForwards = function() {
  if (this.dialogue.canNext()) {
    this.dialogue.next();
    this.updateState();
  }
};

/**
 * Go forward one step if possible
 */
DialogueView.prototype.goBack = function() {
  if (this.choicesGroup) {
    this.choicesGroup.destroy();
  }

  if (this.dialogue.displayIndex > 0) {
    this.dialogue.displayIndex -= 1;
    this.updateState();
  } else {
    if (!this.lastDialogue) {
      return;
    }
    this.dialogue = this.lastDialogue;
    this.lastDialogue = null;
    this.dialogue.displayIndex = this.dialogue.displays.length - 1;
    this.updateState();
  }
};

/**
 * Update dialogue element visibilities
 * @param {boolean} playerChoosing
 */
DialogueView.prototype.updateVisibility = function(playerChoosing) {
  this.text.visible = !playerChoosing;
  this.textBackground.visible = !playerChoosing;
  this.rightButton.visible = !playerChoosing;
  this.leftButton.visible = !playerChoosing;
  this.playerLeftButton.visible = playerChoosing;
};

/**
 * Update the dialogue state the DialogueView is drawing
 */
DialogueView.prototype.updateState = function() {
  if (this.dialogue) {

    var displayGroup = this.dialogue.getDisplayGroup();
    if (displayGroup) {
      if (this.currentBackgroundGroup) {
        this.currentBackgroundGroup.visible = false;
      }
      this.currentBackgroundGroup = displayGroup;
      this.currentBackgroundGroup.visible = true;
      this.game.world.bringToTop(this.group);
    }

    if (this.dialogue.isPlayerChoosing()) {
      this.updateVisibility(true);
      this.displayPlayerChoices();
    } else {
      this.updateVisibility(false);

      this.text.hiddenText = this.dialogue.getDisplayText();
      this.text.resetProgress();
      if (this.choicesGroup) {
        this.choicesGroup.destroy();
        this.choicesGroup = null;
      }
    }
  } else {
    if (this.onDone) {
      this.group.setAllChildren('visible', false);
      this.group.setAll('visible', false);
      if (this.currentBackgroundGroup) {
        this.currentBackgroundGroup.visible = false;
      }
      this.onDone({
        nextState: this.nextState
      });
    }
    this.game.playerData.dialogue = null;
  }
};

/**
 * Create the choices UI and register event listeners for the eventual choice
 */
DialogueView.prototype.displayPlayerChoices = function() {
  var choicesText = this.dialogue.getChoicesText();

  var dialogueView = this;

  this.choicesGroup = new Phaser.Group(this.game, null, 'choice-buttons', true);
  function chooseCallback() {
    dialogueView.choicesGroup.destroy();
    dialogueView.choicesGroup = null;

    var choiceResult = dialogueView.dialogue
                                   .chooseChoiceIndex(this.choiceIndex);
    dialogueView.nextState = choiceResult.nextState;
    dialogueView.lastDialogue = dialogueView.dialogue;
    dialogueView.dialogue = choiceResult.dialogue;
    dialogueView.updateState();
  }

  var buttonHeight = (this.buttonHeight + this.buttonPadding) *
                      choicesText.length;

  for (var i = 0; i < choicesText.length; i++) {
    var x = this.game.width / 2;
    var y = this.y + this.height / 2 - buttonHeight / 2 +
            (i + 0.5) * (this.buttonHeight + this.buttonPadding);
    // This will probably leak an insignificant amount of memory
    var choiceButton = new LabelButton(this.game, x, y, 'button-background',
                                       choicesText[i], chooseCallback,
                                       {choiceIndex: i});
    this.choicesGroup.add(choiceButton);
  }
};

/**
 * Update the Dialogue
 */
DialogueView.prototype.update = function() {
  // this code allows advancing the text using keyboard input/ clicking on the
  // main dialogue box. it also causes a bug with text skipping if any of these buttons
  // are pressed when clicking on the actual arrow button. for this module to work 
  // independently of the dialogueState, this would have to be inserted in the update of
  // whatever state it is being used in, so for now is just commented out to prevent
  // different behavior in different use cases

  // if (this.text.isDone()) {
  //   var mouseDown = this.game.input.mouse.button !== Phaser.Mouse.NO_BUTTON &&
  //                   this.game.input.x > this.textBackground.x -
  //                                       this.textBackground.width / 2 &&
  //                   this.game.input.x < this.textBackground.x +
  //                                       this.textBackground.width / 2;
  //   if (mouseDown ||
  //       this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) ||
  //       this.game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) ||
  //       this.game.input.keyboard.justPressed(Phaser.Keyboard.B)) {
  //       this.goForwards();
  //   }
  // }
};
