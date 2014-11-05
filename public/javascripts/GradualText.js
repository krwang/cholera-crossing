var GradualText = function(game, x, y, text, style){
  var gradualText = new Phaser.Text(game, x, y, "", style);
  gradualText.hiddenText = text;
  gradualText.displayProgress = 0.0;
  gradualText.update = function(){  
  	if (this.visible == false && this.displayProgress != 0.0){
  		this.displayProgress = 0.0;
  		this.text = this.hiddenText.slice(0, this.displayProgress * this.hiddenText.length);
  		return;
  	}
  	else if (this.displayProgress < 1) {
  		scroll = this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ? GradualText.FAST_SCROLL : GradualText.NORMAL_SCROLL;
	  	this.displayProgress += scroll;
	  	this.text = this.hiddenText.slice(0, this.displayProgress * this.hiddenText.length);
	  	return;
	  }
  };
  return gradualText;
};

// static scroll speed constants
GradualText.NORMAL_SCROLL = 0.002;
GradualText.FAST_SCROLL = 0.005;