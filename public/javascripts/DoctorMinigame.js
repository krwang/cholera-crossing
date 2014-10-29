function DoctorMinigameState() {
	this.playerData = null;
};

DoctorMinigameState.prototype = {
  init: function(playerData){
  	this.playerData = playerData;
  }
}