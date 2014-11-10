/* global Phaser */

function GradualText(game, x, y, text, style) {
  Phaser.Text.call(this, game, x, y, '', style);
  this.hiddenText = text;
  this.displayProgress = 0;
  this.lastUpdate = this.game.time.now;
}

GradualText.prototype = Object.create(Phaser.Text.prototype);

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
 */
GradualText.prototype.update = function() {
  console.log('GradualText.update');
  var time = this.game.time.now;

  if (!this.visible) {
    console.log('Invisible');
    this.displayProgress = 0;
    this.text = '';
    return;
  }

  if (!this.isDone()) {
    console.log('Maybe advancing');
    var scrollQuickly = this.game.input.keyboard.isDown(
        Phaser.Keyboard.SPACEBAR
    );
    var scrollRate = scrollQuickly ? GradualText.FAST_SCROLL :
                                     GradualText.NORMAL_SCROLL;
    if (time - this.lastUpdate > scrollRate) {
      console.log('Scroll!');
      this.advanceText();
      this.lastUpdate = time;
    } else {
      console.log('No scroll!');
    }
  }
};

/**
 * @return {boolean} If the scrolling has completed
 */
GradualText.prototype.isDone = function() {
  console.log(this.displayProgress + ' ? ' + this.hiddenText.length);
  return this.displayProgress >= this.hiddenText.length;
};

/**
 * Reset the progress of the text scrolling
 */
GradualText.prototype.resetProgress = function() {
  this.displayProgress = 0;
  this.lastUpdate = this.game.time.now;
  this.text = '';
};

/** Normal scrolling rate */
GradualText.NORMAL_SCROLL = 50;
/** Faster scrolling rate */
GradualText.FAST_SCROLL = 30;
