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

  this.x = 10;
  this.y = this.game.height - 96;
  this.buttonHeight = 40;
  this.buttonPadding = 8;

  this.previousGroup = null;
}

/**
 * Pre-load any assets required by the dialogue
 */
DialogueView.prototype.preload = function() {
  this.game.load.image('button-background',
                       'images/main/dialogue-button-background.png');
  this.game.load.image('text-background',
                       'images/main/dialogue-text-background.png');

  this.dialogue = this.game.playerData.dialogue;
  if (!this.dialogue) {
    throw new Error('DialogueView must be provided a dialogue');
  }
};

/**
 * Create sprites and other game objects
 */
DialogueView.prototype.create = function() {
  var textStyle = {
      'font': '16px Arial',
      'fill': 'black'
  };
  this.textBackground = this.game.add.image(this.x, this.y, 'text-background');
  this.text = new GradualText(this.game, this.x + 5, this.y + 5, '', textStyle);
  this.game.add.existing(this.text);

  // TODO: Draw images for player and npc
  // this.playerSprite = this.game.add.sprite('asdf');
  // this.npcSprite = this.game.add.sprite('fdsa');
  this.updateState();
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
    }

    if (this.dialogue.isPlayerChoosing()) {
      this.text.visible = false;
      this.textBackground.visible = false;
      // this.choicesGroup.visible = true;

      this.displayPlayerChoices();
    } else {
      this.text.visible = true;
      this.textBackground.visible = true;
      // this.choicesGroup.visible = false;

      this.text.hiddenText = this.dialogue.getDisplayText();
      this.text.resetProgress();
    }
  } else {
    if (this.onDone) {
      this.onDone();
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
  var choiceButtons = [];

  function chooseCallback() {
    var choiceResult = dialogueView.dialogue
                                    .chooseChoiceIndex(this.choiceIndex);
    dialogueView.nextState = choiceResult.nextState;
    dialogueView.dialogue = choiceResult.dialogue;
    dialogueView.updateState();

    choiceButtons.forEach(function(choiceButton) {
      choiceButton.destroy();
    });
  }

  for (var i = 0; i < choicesText.length; i++) {
    var x = this.game.width / 2;
    var y = this.y + i * (this.buttonHeight + this.buttonPadding);
    // This will probably leak an insignificant amount of memory
    var choiceButton = new LabelButton(this.game, x, y, 'button-background',
                                       choicesText[i], chooseCallback,
                                       {choiceIndex: i});
    choiceButtons.push(choiceButton);
    this.game.add.existing(choiceButton);
  }
};

/**
 * Update the Dialogue
 */
DialogueView.prototype.update = function() {
  if (this.game.input.mouse.button !== Phaser.Mouse.NO_BUTTON ||
      this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) ||
      this.game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) ||
      this.game.input.keyboard.justPressed(Phaser.Keyboard.B)) {
    if (this.text.isDone() && this.dialogue.canNext()) {
      this.dialogue.next();
      this.updateState();
    }
  }
};
