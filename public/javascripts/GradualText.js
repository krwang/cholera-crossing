/* global Phaser */

function GradualText(game, x, y, text, style) {
  Phaser.Text.call(this, game, x, y, '', style);
  this.hiddenText = text;
  this.displayProgress = 0;
}

/**
 * Advance the text by one character
 */
GradualText.prototype.advanceText = function() {
  this.displayProgress += 1;
  this.text = this.hiddenText.slice(
      0,
      this.displayProgress
  );
};

/**
 * Update the scrolling position. Should be called every frame.
 * @param {number} time Current time in ms
 */
GradualText.prototype.update = function(time) {
  if (!this.visible) {
    this.displayProgress = 0;
    this.text = '';
    return;
  }

  if (this.isDone()) {
    var scrollQuickly = this.game.input.keyboard.isDown(
        Phaser.Keyboard.SPACEBAR
    );
    var scrollRate = scrollQuickly ? GradualText.FAST_SCROLL :
                                     GradualText.NORMAL_SCROLL;
    if (time - this.lastUpdate > scrollRate) {
      this.advanceText();
      this.lastUpdate = time;
    }
  }
};

/**
 * @return {boolean} If the scrolling has completed
 */
GradualText.prototype.isDone = function() {
  return this.displayProgress >= 1;
};

/** Normal scrolling rate */
GradualText.NORMAL_SCROLL = 80;
/** Faster scrolling rate */
GradualText.FAST_SCROLL = 30;
