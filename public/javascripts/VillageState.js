/* global Dialogue, Phaser, VillagePather */

/**
 * Create a new VillageState
 * @constructor
 * @param {Phaser.Game} game
 */
function VillageState(game) {
  this.game = game;

  this.width = this.game.width - 20;
  this.height = this.game.height;

  this.x = 0;
  this.y = this.game.height - this.height;

  // var willHelpDialogue = new Dialogue(
  //     ["Thank you so much! You see, this angry mob thinks that I'm to " +
  //      "blame for the recent attacks on their village.",
  //      "I keep trying to tell them that the \"attacked\" villagers are " +
  //      "really just suffering from cholera, but they refuse to believe me.",
  //      "Please convince them as soon as possible!"],
  //     []
  // );

  // var initialDialogue = new Dialogue(
  //     ["Hi! You look like a cool cat. Can you help me out?"],
  //     [{text: "Fine, whatever", dialogue: willHelpDialogue}]
  // );
}

/**
 * Pre-load any assets required by the game
 */
VillageState.prototype.preload = function() {
  game.load.image('up', 'images/dialogue/up-arrow.png');
  game.load.image('down', 'images/dialogue/down-arrow.png');
  game.load.image('left', 'images/dialogue/left-arrow.png');
  game.load.image('right', 'images/dialogue/right-arrow.png');

  game.load.image('town_map', 'images/town/town_map.png');
  game.load.image('house', 'images/town/house.png');
  game.load.image('house2', 'images/town/house2.png');
  game.load.image('house3', 'images/town/house3.png');
  game.load.image('hospital', 'images/town/hospital.png');
  game.load.image('post_office', 'images/town/post_office.png');
  game.load.image('splash', 'images/main/splash.png');
  game.load.image('well', 'images/town/well.png');
  game.load.image('lake', 'images/town/lake.png');
  game.load.image('fire', 'images/town/campfire.png');
  game.load.image('land', 'images/collection_minigame/land.png');
  game.load.image('taskbar', 'images/main/taskbar.png');
  game.load.image('player', 'images/bunnykid.png');
  game.load.image('giraffe_doctor', 'images/doctor_minigame/giraffedoctor.png');
  game.load.image('mayor', 'images/main/owlmayor.png');
  game.load.image('hospital_room', 'images/doctor_minigame/hospital_room.png');

  game.load.image('dog', 'images/town/dog.png');
  game.load.image('flamingo', 'images/town/flamingo.png');
  game.load.image('monkey', 'images/town/monkey.png');
  game.load.image('monkeybucket', 'images/town/monkeybucket.png');

  game.load.image('filtration_house', 'images/filtration_minigame/filtration_background.png');
  game.load.image('boiling_pot', 'images/filtration_minigame/boiling_pot.png');
  game.load.image('mom', 'images/filtration_minigame/catmom.png');

  game.load.image('paper', 'images/town/paper.png');
  game.load.image('matches', 'images/town/matches.png');
  game.load.image('waterbucket', 'images/town/empty_water.png');
  
  game.load.image('tablets', 'images/town/paper.png');
  game.load.image('bottle', 'images/town/dirty_water.png');
  game.load.image('list', 'images/town/list.png');
};

/**
 * Create sprites and other game objects
 */
VillageState.prototype.create = function() {
  var self = this;

  var doctorGroup = new Phaser.Group(this.game, null, 'doctorGroup', true);

  this.hospital_room = doctorGroup.create(0, 0, 'hospital_room');
  this.hospital_room.scale.x = 0.5;
  this.hospital_room.scale.y = 0.5;

  this.doctor = doctorGroup.create(0, 0, 'giraffe_doctor');
  this.doctor.x = this.x + this.width / 2 + 210;
  this.doctor.y = this.y + 150;
  this.doctor.scale.x = -0.5;

  this.doctor.scale.y = 0.5;

  doctorGroup.visible = false;

  this.doctorMinigameDialogue = new Dialogue(
      [{text: 'Hi PLAYER, I have been getting quite a few patients lately! It must ' +
       'be related to this monster incident.', group: doctorGroup},
       {text: 'Unfortunately, I couldn\'t save all of them. If they had come to me ' +
       'earlier on, I could have given them proper treatment!', group: doctorGroup}],
      [
       {
        text: 'How horrible! Is there anything I can do to help?',
        dialogue: new Dialogue(
          [{text: 'I have written down the symptoms that I have been seeing alot of ' +
           'lately.', group: doctorGroup},
           {text: 'Could you go ask your friends if they are having any of these ' +
           'symptoms, and tell them to come to me right away if they are?', group: doctorGroup}],
          [{
             text: 'Yes, I\'m curious to know what is happening',
             nextState: 'doctorMinigame'
           },
           {
             text: 'No, I have other things to investigate',
             nextState: 'villageState'
           }
          ]
        )
       }
      ]
  );

  var collectionGroup = new Phaser.Group(this.game, null, 'collectionGroup', true);
  collectionGroup.create(0, 0, 'land');
  collectionGroup.visible = false;

  this.waterCollectionDialogue = new Dialogue(
      [{text: 'Your neighbor needs advice on where to pick up their water, can you ' +
       'help?', group: collectionGroup},
       {text: 'Make sure to point them to a clean source of water!', group: collectionGroup}
       ],
      [{text: 'Yes, I\'m definitely up for it!',
        nextState: 'waterCollection'},
       {text: 'On second thought nah', nextState: 'villageState'}]
  );

  var purificationGroup = new Phaser.Group(this.game, null, 'purificationGroup', true);
  purificationGroup.create(0, 0, 'filtration_house');
  purificationGroup.create(25, 200, 'mom');
  purificationGroup.create(50, 400, 'boiling_pot');
  purificationGroup.visible = false;

  this.waterPurificationDialogue = new Dialogue(
      [{text: 'Water was just brought to your house and your mom needs your help!', group: purificationGroup},
       {text: 'She wants to make sure that all the water is safe for drinking.'}],
      [{text: 'Of course I\'ll help!', nextState: 'waterPurification'},
       {text: 'I need to take care of other things', nextState: 'villageState'}]
  );

  var npcBackground = new Phaser.Group(this.game, null, 'npcBackground', true);
  var splash = new Phaser.Image(this.game, 0, 0, 'splash');
  scaleTo(800, 600, splash);
  npcBackground.add(splash);
  npcBackground.visible = false;

  this.flamingoDialogue = new Dialogue(
      [{text: 'Here\'s a piece of paper!', group: npcBackground}],
      [{text: 'Got it, thanks!', nextState: 'villageState'}]
  );

  this.monkeyBucketDialogue = new Dialogue(
    [{text: 'Here\'s a bucket!', group: npcBackground}],
    [{text: 'Got it, thanks!', nextState: 'villageState'}]
  );

  this.dogDialogue = new Dialogue(
    [{text: 'Here\'s some matches!', group: npcBackground}],
    [{text: 'Got it, thanks!', nextState: 'villageState'}]
  );

  this.game.add.tileSprite(0, 0, 1600, 1200, 'town_map');
  this.game.world.setBounds(0, 0, 1600, 1300);

  var house = this.game.add.button(450, 300, 'house', function() {
    self.villagePather.playPath('waterPurification', false,
      function() {
        // On complete play dialogue
        self.game.playerData.dialogue = self.waterPurificationDialogue;
        self.game.state.start('dialogueState');
      }
    );
  });
  scaleTo(300, 300, house);
  house.input.useHandCursor = true;

  var house2 = this.game.add.button(80, 500, 'house2', function() {

  });
  scaleTo(300, 300, house2);
  house2.input.useHandCursor = true;

  var house3 = this.game.add.button(600, 980, 'house3', function() {

  });
  scaleTo(300, 300, house3);

  var hospital = this.game.add.button(950, 50, 'hospital', function() {
    self.villagePather.playPath('doctorMinigame', false,
      function() {
        self.game.playerData.dialogue = self.doctorMinigameDialogue;
        self.game.state.start('dialogueState');
      }
    );
  });
  scaleTo(500, 300, hospital);
  hospital.input.useHandCursor = true;

  var well = this.game.add.button(750, 650, 'well', function() {
    self.villagePather.playPath('waterCollection', false,
      function() {
        self.game.playerData.dialogue = self.waterCollectionDialogue;
        self.game.state.start('dialogueState');
      }
    );
  });
  scaleTo(300, 300, well);
  well.input.useHandCursor = true;

  var lake = this.game.add.button(1100, 1000, 'lake', function() {

  });
  scaleTo(500, 300, lake);
  lake.input.useHandCursor = true;

  var post_office = this.game.add.button(1250, 400, 'post_office', function() {

  });
  scaleTo(300, 300, post_office);
  post_office.input.useHandCursor = true;

  var fire = this.game.add.button(150, 980, 'fire', function() {

  });
  scaleTo(150, 150, fire);

  var dog = this.game.add.button(100, 950, 'dog', function() {
    self.game.playerData.inventory.matches = true;
    self.game.playerData.dialogue = self.dogDialogue;
    self.game.state.start('dialogueState');
  });
  scaleTo(100, 200, dog);
  dog.input.useHandCursor = true;

  if (!self.game.playerData.inventory.waterbucket) {
    var monkey = this.game.add.button(800, 430, 'monkeybucket', function() {
      self.game.playerData.inventory.waterbucket = true;
      self.game.playerData.dialogue = self.monkeyBucketDialogue;
      self.game.state.start('dialogueState');
    });
  } else {
    var monkey = this.game.add.button(800, 430, 'monkey', function() {
      self.game.playerData.inventory.waterbucket = true;
      self.game.playerData.dialogue = self.monkeyBucketDialogue;
      self.game.state.start('dialogueState');
    });
  }
  scaleTo(100, 200, monkey);
  monkey.input.useHandCursor = true;

  var flamingo = this.game.add.button(1350, 500, 'flamingo', function() {
      self.game.playerData.inventory.paper = true;
      self.game.playerData.dialogue = self.flamingoDialogue;
      self.game.state.start('dialogueState');
  });
  scaleTo(100, 200, flamingo);
  flamingo.input.useHandCursor = true;

  this.up = this.game.add.sprite(350, 10, 'up');
  this.up.fixedToCamera = true;
  this.up.inputEnabled = true;
  this.up.input.useHandCursor = true;

  this.down = this.game.add.sprite(350, 450, 'down');
  this.down.fixedToCamera = true;
  this.down.inputEnabled = true;
  this.down.input.useHandCursor = true;

  this.left = this.game.add.sprite(10, 200, 'left');
  this.left.fixedToCamera = true;
  this.left.inputEnabled = true;
  this.left.input.useHandCursor = true;

  this.right = this.game.add.sprite(750, 200, 'right');
  this.right.fixedToCamera = true;
  this.right.inputEnabled = true;
  this.right.input.useHandCursor = true;

  // taskbar
  taskbar = this.game.add.sprite(0, 500, 'taskbar');
  taskbar.fixedToCamera = true;

  var inventory = game.playerData.inventory;

  var i = 0;
  Object.keys(inventory).forEach(function(key) {
    if (inventory[key]) {
      var x = 210 + 100*i;
      var inventoryImage = this.game.add.sprite(x, 510, key);
      var scale = getImageScale(80, 80, inventoryImage);
      inventoryImage.scale.setTo(scale, scale);
      inventoryImage.fixedToCamera = true;
      i++;
    }
  });

  var completedGames = game.playerData.completedGames;

  var i = 0;
  Object.keys(completedGames).forEach(function(key) {
    if (completedGames[key]) {
      var x = 10 + 100*i;
      var clueImage = this.game.add.sprite(x, 510, key);
      var scale = getImageScale(80, 80, clueImage);
      clueImage.scale.setTo(scale, scale);
      clueImage.fixedToCamera = true;
      i++;
    }
  });

  this.playerSprite = this.game.add.sprite(400, 300, 'player');
  this.playerSprite.scale.setTo(0.2, 0.2);

  this.villagePather = new VillagePather(this.game, this.playerSprite);
};

/**
 * Update the Village
 */
VillageState.prototype.update = function() {
  if (this.up.input.pointerOver()) {
    this.game.camera.y -= 4;
  } else if (this.down.input.pointerOver()) {
    this.game.camera.y += 4;
  } else if (this.left.input.pointerOver()) {
    this.game.camera.x -= 4;
  } else if (this.right.input.pointerOver()) {
    this.game.camera.x += 4;
  }
};
