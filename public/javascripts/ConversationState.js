/**
 * Create a new ConversationState
 *
 * @constructor
 * @param {PlayerData} playerData Data passed in from Game State
 */
function ConversationState(playerData) {
  this.playerSprite = null;
  this.npcSprite = null;
  this.conversation = playerData.getConversation();
  if (!this.conversation) {
    this.exit();
  }
}

/**
 * Pre-load any assets required by the conversation
 */
ConversationState.prototype.preload = function() {
};

/**
 * Create sprites and other game objects
 */
ConversationState.prototype.create = function() {
  this.conversationText = this.game.add.text(this.x, this.y, '');
  this.playerSprite = this.game.add.sprite('asdf');
  this.npcSprite = this.game.add.sprite('fdsa');
};

/**
 * Update the conversation state the ConversationState is drawing
 */
ConversationState.prototype.updateState = function() {
  if (this.conversation.isPlayerChoosing()) {
    this.displayPlayerChoices();
  } else if (!this.conversation.isDone()) {
    this.conversationText.text = this.conversation.getDisplayText();
  } else {
    this.exit();
  }
};

/**
 * Update the Conversation
 */
ConversationState.prototype.update = function() {
};

/**
 * Exit the conversation
 */
ConversationState.prototype.exit = function() {
  this.game.state.start(this.playerData.nextState);
};
