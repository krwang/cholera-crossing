/* jshint browser: true */
/* global LabelButton, Phaser */

/**
 * Create a new ConversationState
 *
 * @constructor
 * @param {Phaser.Game} game Global game object
 */
function ConversationState(game) {
  this.game = game;

  this.x = 10;
  this.y = this.game.height - 96;
  this.buttonHeight = 40;
  this.buttonPadding = 8;

  this.playerSprite = null;
  this.npcSprite = null;
}

/**
 * Pre-load any assets required by the conversation
 */
ConversationState.prototype.preload = function() {
  this.game.load.image('button-background',
                       'images/main/conversation-button-background.png');
  this.game.load.image('text-background',
                       'images/main/conversation-text-background.png');

  this.conversation = this.game.playerData.conversation;
  if (!this.conversation) {
    throw new Error('ConversationState must be provided a conversation');
  }
};

/**
 * Create sprites and other game objects
 */
ConversationState.prototype.create = function() {
  var textStyle = {
      'font': '16px Arial',
      'fill': 'black'
  };
  this.textBackground = this.game.add.image(this.x, this.y, 'text-background');
  this.text = this.game.add.text(this.x + 5, this.y + 5, '', textStyle);
  // TODO: Draw images for player and npc
  // this.playerSprite = this.game.add.sprite('asdf');
  // this.npcSprite = this.game.add.sprite('fdsa');
  this.updateState();
};

/**
 * Update the conversation state the ConversationState is drawing
 */
ConversationState.prototype.updateState = function() {
  if (this.conversation.isPlayerChoosing()) {
    this.text.visible = false;
    this.textBackground.visible = false;
    // this.choicesGroup.visible = true;

    this.displayPlayerChoices();
  } else if (!this.conversation.isDone()) {
    this.text.visible = true;
    this.textBackground.visible = true;
    // this.choicesGroup.visible = false;

    this.text.text = this.conversation.getDisplayText();
  } else {
    this.game.playerData.conversation = null;
    this.game.state.start(this.conversation.getNextState());
  }
};

/**
 * Create the choices UI and register event listeners for the eventual choice
 */
ConversationState.prototype.displayPlayerChoices = function() {
  var choicesText = this.conversation.getChoicesText();

  var conversationState = this;
  var choiceButtons = [];

  function chooseCallback() {
    conversationState.conversation.chooseChoiceIndex(this.choiceIndex);
    conversationState.updateState();

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
    this.game.add.existing(choiceButton);
  }
};

/**
 * Update the Conversation
 */
ConversationState.prototype.update = function() {
  if (this.game.input.mouse.button !== Phaser.Mouse.NO_BUTTON ||
      this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACE) ||
      this.game.input.keyboard.justPressed(Phaser.Keyboard.B)) {
    if (this.conversation.canNext()) {
      this.conversation.next();
      this.updateState();
    }
  }
};
