
/**
 * @constructor
 * @param {Phaser.Game} game
 * @param {Phaser.Sprite} player - player to move
 */
function VillagePather(game, player) {
  this.game = game;
  this.player = player;

  var startPos = {x: 400, y: 300};
  this.doctorMinigamePath = [
    startPos,
    {x: 525, y: 125}
  ];
  this.mayorDialoguePath = [
    startPos,
    {x: 300, y: 300}
  ];
  this.waterCollectionPath = [
    startPos,
    {x: 325, y: 125}
  ];
  this.waterPurificationPath = [
    startPos,
    {x: 125, y: 125}
  ];
  this.velocity = 0.2;
}

/**
 * Move the player along a specific path
 * @param {string} pathName
 * @param {boolean} reverse
 * @param {Function} onComplete - Function to call on completion of path.
 */
VillagePather.prototype.playPath = function(pathName, reverse, onComplete) {
  console.log('playPath: ' + pathName);

  var pathElements = null;
  switch (pathName) {
    case 'waterPurification':
      pathElements = this.waterPurificationPath;
      break;
    case 'doctorMinigame':
      pathElements = this.doctorMinigamePath;
      break;
    case 'waterCollection':
      pathElements = this.waterCollectionPath;
      break;
    default:
      throw new Error('unknown path name: ' + pathName);
  }

  if (reverse) {
    pathElements = pathElements.reverse();
  }
  var firstPos = pathElements[0];
  var lastX = firstPos.x;
  var lastY = firstPos.y;
  this.player.x = firstPos.x;
  this.player.y = firstPos.y;

  var tweens = [];
  for (var i = 1; i < pathElements.length; i++) {
    var pos = pathElements[i];
    var dist = Math.sqrt((pos.x - lastX) * (pos.x - lastX) +
                         (pos.y - lastY) * (pos.y - lastY));

    tweens.push(this.game.add.tween(this.player).to({x: pos.x, y: pos.y},
                                                    dist / this.velocity));

    lastX = pos.x;
    lastY = pos.y;
  }
  // Chain together all tweens
  if (tweens.length > 1) {
    tweens[0].chain.apply(tweens[0], tweens.slice(1));
  }
  tweens[0].start();
  if (onComplete) {
    tweens[tweens.length - 1].onComplete.addOnce(onComplete);
  }
};

