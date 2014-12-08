/* global Dialogue, Phaser, VillagePather */

VillageState.BuildingEnum = {
  HOSPITAL: 'hospital',
  HOUSE_2: 'house 2',
  HOUSE_3: 'house 3',
}

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
  game.load.image('taskbar', 'images/town/taskbar.png');
  game.load.image('player', 'images/bunnykid.png');
  game.load.image('giraffe_doctor', 'images/doctor_minigame/giraffedoctor.png');
  game.load.image('mayor', 'images/main/owlmayor.png');
  game.load.image('hospital_room', 'images/doctor_minigame/hospital_room.png');

  game.load.image('npc_bg1', 'images/town/npc_bg1.png');
  game.load.image('npc_bg2', 'images/town/npc_bg2.png');
  game.load.image('npc_bg3', 'images/town/npc_bg3.png');

  game.load.image('dog', 'images/town/dog.png');
  game.load.image('flamingo', 'images/town/flamingo.png');
  game.load.image('monkey', 'images/town/monkey.png');
  game.load.image('monkeybucket', 'images/town/monkeybucket.png');
  game.load.image('mom', 'images/filtration_minigame/catmom.png');

  game.load.image('filtration_house', 'images/filtration_minigame/filtration_background.png');
  game.load.image('boiling_pot', 'images/filtration_minigame/boiling_pot.png');
  game.load.image('mom', 'images/filtration_minigame/catmom.png');

  game.load.image('clue', 'images/town/clue.png');
  game.load.image('item', 'images/town/item.png');
  game.load.image('help', 'images/town/help.png');
  game.load.image('home', 'images/town/home.png');

  game.load.image('paper', 'images/town/paper.png');
  game.load.image('matches', 'images/town/matches.png');
  game.load.image('waterbucket', 'images/town/empty_water.png');
  
  game.load.image('tablets', 'images/town/tablets.png');
  game.load.image('bottle', 'images/town/dirty_water.png');
  game.load.image('list', 'images/town/list.png');

  this.game.load.image('big-button-background',
                       'images/dialogue/dialogue-big-button-background.png');
  this.game.load.image('button-background',
                       'images/dialogue/dialogue-button-background.png');
  game.load.image('text-background',
                       'images/dialogue/dialogue-text-background.png');
  game.load.image('left-arrow',
                       'images/dialogue/left-arrow.png');
  game.load.image('player-left-arrow',
                       'images/dialogue/player-left-arrow.png');
  game.load.image('right-arrow',
                       'images/dialogue/right-arrow.png');
};

/**
 * Create sprites and other game objects
 */
VillageState.prototype.create = function() {
  var self = this;

  var collectionGroup = new Phaser.Group(this.game, null, 'collectionGroup', true);
  var collectionBg = collectionGroup.create(0, 0, 'npc_bg1');
  scaleTo(800, 600, collectionBg);
  var collection_p1 = collectionGroup.create(100, 150, 'player');
  var collection_p2 = collectionGroup.create(500, 150, 'mom');
  scaleTo(400, 300, collection_p1);
  scaleTo(400, 300, collection_p2);
  collectionGroup.visible = false;

  if (game.playerData.inventory.waterbucket) {
    this.waterCollectionDialogue = new Dialogue(
      [{text: 'Hello, Kojo. Can you help Korku collect water?', group: collectionGroup},
       {text: 'Just drag the container to places where you can get water.', group: collectionGroup},
       {text: 'Remember that you should collect water that is as clean as possible!', group: collectionGroup},
       ],
      [{text: 'Yes, I\'d love to help!',
        nextState: 'waterCollection'},
       {text: 'Sorry, I forgot I have to do something in the village', nextState: 'villageState'}]
    );
  } else {
    this.waterCollectionDialogue = new Dialogue(
      [{text: 'Where did the bucket go? I think that I saw Bodua running around with it on his head.', group: collectionGroup}],
      [{text: 'I\'ll go look for it!',
        nextState: 'villageState'}]
    );
  }

  var purificationGroup = new Phaser.Group(this.game, null, 'purificationGroup', true);
  purificationGroup.create(0, 0, 'filtration_house');
  purificationGroup.create(400, 200, 'mom');
  purificationGroup.create(50, 400, 'boiling_pot');
  purificationGroup.visible = false;
"Your mom needs your help deciding what water is safe to drink " + 
                   "and what water needs to be boiled before drinking. Be careful, " + 
                   "you only have a limited amount of firewood so you won't be able " +
                   "to boil all the water.";

  if (game.playerData.inventory.matches) {
    this.waterPurificationDialogue = new Dialogue(
      [{text: 'Water was just brought to your house and your mom needs your help!', group: purificationGroup},
       {text: 'She wants to make sure that all the water is safe for drinking.'},
       {text: 'Your mom needs your help deciding what water is safe to drink and what water needs to be boiled before drinking.', group: purificationGroup},
       {text: 'Be careful, you only have a limited amount of firewood so you won\'t be able to boil all the water.', group: purificationGroup}],
      [{text: 'Of course I\'ll help!', nextState: 'waterPurification'},
       {text: 'I need to take care of other things', nextState: 'villageState'}]
    );
  } else {
    this.waterPurificationDialogue = new Dialogue(
      [{text: 'Hey! Kojo, did we run out of matches? I can\'t seem to find them anywhere.', group: collectionGroup}],
      [{text: 'I\'ll go look for some!',
        nextState: 'villageState'}]
    );
  }

  var npc_group1 = new Phaser.Group(this.game, null, 'npc_group1', true);
  var npc_bg1 = new Phaser.Image(this.game, 0, 0, 'npc_bg1');
  scaleTo(800, 600, npc_bg1);
  npc_group1.add(npc_bg1);
  var monkey_group1 = npc_group1.create(100, 150, game.playerData.inventory.waterbucket ? 'monkey' : 'monkeybucket');
  scaleTo(400, 300, monkey_group1);
  var player_group = npc_group1.create(500, 150, 'player');
  scaleTo(400, 300, player_group);
  npc_group1.visible = false;

  var npc_group2 = new Phaser.Group(this.game, null, 'npc_group2', true);
  var npc_bg2 = new Phaser.Image(this.game, 0, 0, 'npc_bg2');
  scaleTo(800, 600, npc_bg2);
  npc_group2.add(npc_bg2);
  var flamingo_group2 = npc_group2.create(100, 150, 'flamingo');
  scaleTo(400, 300, flamingo_group2);
  var player_group = npc_group2.create(500, 150, 'player');
  scaleTo(400, 300, player_group);
  npc_group2.visible = false;

  var npc_group3 = new Phaser.Group(this.game, null, 'npc_group3', true);
  var npc_bg3 = new Phaser.Image(this.game, 0, 0, 'npc_bg3');
  scaleTo(800, 600, npc_bg3);
  npc_group3.add(npc_bg3);
  var dog_group3 = npc_group3.create(100, 150, 'dog');
  scaleTo(400, 300, dog_group3);
  var player_group = npc_group3.create(600, 150, 'player');
  scaleTo(400, 300, player_group);
  npc_group3.visible = false;

  if (!game.playerData.inventory.paper) {
    this.flamingoDialogue = new Dialogue(
      [{text: 'Hey, Kojo. Can you do me a favor? The doctor ordered paper, but I\'m ' + 
      'currently stuck fixing a flat tire. Can you go take it to him?', group: npc_group2}],
        [{text: 'No problem!', nextState: 'villageState'}]
    );
  } else {
      this.flamingoDialogue = new Dialogue(
      [{text: 'Thanks again for delivering the paper for me!', group: npc_group2, nextState: 'villageState'}]
    );
  }

  if (!game.playerData.inventory.waterbucket) {
    this.monkeyBucketDialogue = new Dialogue([],
      [{text: 'Why are you running around with a bucket on your head?', group: npc_group1,
        dialogue: new Dialogue(
          [{text: 'I\'m pretending to be a robot!', group: npc_group1}],
          [{text: 'Oh, I see. But isn\'t that dangerous? I mean, you could hurt yourself if you bump into someone.', group: npc_group1,
          dialogue: new Dialogue(
            [{text: 'Maybe you\'re right. I didn\'t really think of that. Actually, can you take this bucket to Korku? I borrowed it from him.', group: npc_group1}],
            [{text: 'Sure, no problem!', nextState: 'villageState'}]
          )}]
        )
      }]
    );
  } else {
    this.monkeyBucketDialogue = new Dialogue(
      [{text: 'Let\'s go play later, okay?', group: npc_group1}],
      [{text: 'Okay, I\'ll find you later.', nextState: 'villageState'}]
    );
  }

  if (!game.playerData.inventory.matches) {
    this.dogDialogue = new Dialogue(
      [{text: 'Fire is very important. We can use fire to boil water that is safe to drink and even cook our meals.', group: npc_group3},
      {text: ' But it can also be very dangerous. You should never play with fire by yourself.', group: npc_group3},
      {text: 'Be sure to only use these with adult supervision.', group: npc_group3}],
      [{text: 'Got it, thanks!', nextState: 'villageState'}]
    );
  } else {
    this.dogDialogue = new Dialogue(
      [{text: 'If you don\'t know if your water is dirty, be sure to boil it. It is better to be safe than sorry.', group: npc_group3}],
      [{text: 'Thanks for the tip!', nextState: 'villageState'}]);
  }

  this.game.add.tileSprite(0, 0, 1600, 1200, 'town_map');
  this.game.world.setBounds(0, 0, 1600, 1300);

  var house = this.game.add.button(450, 300, 'house', function() {
    // On complete play dialogue
    saveLocation();
    self.game.playerData.dialogue = self.waterPurificationDialogue;
    self.game.state.start('dialogueState');
  });
  scaleTo(300, 300, house);
  house.input.useHandCursor = true;

  var house2 = this.game.add.button(80, 500, 'house2', function() {
    saveLocation();
    self.game.playerData.buildingJustEntered = VillageState.BuildingEnum.HOUSE_2;
    self.game.state.start('doctorMinigame');
  });
  scaleTo(300, 300, house2);
  house2.input.useHandCursor = true;

  var house3 = this.game.add.button(600, 980, 'house3', function() {
    saveLocation();
    self.game.playerData.buildingJustEntered = VillageState.BuildingEnum.HOUSE_3;
    self.game.state.start('doctorMinigame');
  });
  scaleTo(300, 300, house3);

  var hospital = this.game.add.button(950, 50, 'hospital', function() {
    saveLocation();
    self.game.playerData.buildingJustEntered = VillageState.BuildingEnum.HOSPITAL;
    self.game.state.start('doctorMinigame');
  });
  scaleTo(500, 300, hospital);
  hospital.input.useHandCursor = true;

  var well = this.game.add.button(750, 650, 'well', function() {
    saveLocation();
    self.game.playerData.dialogue = self.waterCollectionDialogue;
    self.game.state.start('dialogueState');
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
    saveLocation();
    self.game.playerData.inventory.matches = true;
    self.game.playerData.dialogue = self.dogDialogue;
    self.game.state.start('dialogueState');
  });
  scaleTo(100, 200, dog);
  dog.input.useHandCursor = true;

  if (!self.game.playerData.inventory.waterbucket) {
    var monkey = this.game.add.button(800, 430, 'monkeybucket', function() {
      saveLocation();
      self.game.playerData.inventory.waterbucket = true;
      self.game.playerData.dialogue = self.monkeyBucketDialogue;
      self.game.state.start('dialogueState');
    });
  } else {
    var monkey = this.game.add.button(800, 430, 'monkey', function() {
      saveLocation();
      self.game.playerData.inventory.waterbucket = true;
      self.game.playerData.dialogue = self.monkeyBucketDialogue;
      self.game.state.start('dialogueState');
    });
  }
  scaleTo(100, 200, monkey);
  monkey.input.useHandCursor = true;

  var flamingo = this.game.add.button(1350, 500, 'flamingo', function() {
    saveLocation();
      self.game.playerData.inventory.paper = true;
      self.game.playerData.dialogue = self.flamingoDialogue;
      self.game.state.start('dialogueState');
  });
  scaleTo(100, 200, flamingo);
  flamingo.input.useHandCursor = true;

  var playerSpriteX = game.playerData.location ? game.playerData.location.x : 650;
  var playerSpriteY = game.playerData.location ? game.playerData.location.y : 500;

  playerSprite = this.game.add.sprite(playerSpriteX, playerSpriteY, 'player');
  scaleTo(300, 200, playerSprite);

  cursors = game.input.keyboard.createCursorKeys();
  playerSprite.anchor.setTo(0.5, 0.5);
  this.game.camera.follow(playerSprite);
  this.villagePather = new VillagePather(this.game, playerSprite);

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

  taskbar = this.game.add.sprite(0, 500, 'taskbar');
  taskbar.fixedToCamera = true;

  var inventory = game.playerData.inventory;

  for (var i = 0; i < 3; i++) {
    var x = 310 + 90*i;
    var inventoryImage = this.game.add.sprite(x, 520, 'item');
    scaleTo(70, 70, inventoryImage);
    inventoryImage.fixedToCamera = true;
  }

  var i = 0;
  Object.keys(inventory).forEach(function(key) {
    if (inventory[key]) {
      var x = 315 + 90*i;
      var inventoryImage = this.game.add.sprite(x, 525, key);
      scaleTo(60, 60, inventoryImage);
      inventoryImage.fixedToCamera = true;
      i++;
    }
  });

  var completedGames = game.playerData.completedGames;

  for (var j = 0; j < 3; j++) {
    var x = 20 + 90*j;
    var clueImage = this.game.add.sprite(x, 520, 'clue');
    scaleTo(70, 70, clueImage);
    clueImage.fixedToCamera = true;
  }

  var j = 0;
  Object.keys(completedGames).forEach(function(key) {
    if (completedGames[key]) {
      var x = 25 + 90*j;
      var clueImage = this.game.add.sprite(x, 525, key);
      scaleTo(60, 60, clueImage);
      clueImage.fixedToCamera = true;
      j++;
    }
  });

  var homeImage = this.game.add.sprite(630, 525, 'home');
  scaleTo(60, 60, homeImage);
  homeImage.fixedToCamera = true;

  var helpImage = this.game.add.button(720, 525, 'help', function() {
    saveLocation();
    game.state.start('start');
  });
  scaleTo(60, 60, helpImage);
  helpImage.fixedToCamera = true;

  function saveLocation() {
    game.playerData.location = {
      x: playerSprite.x,
      y: playerSprite.y,
    }
  }
};

/**
 * Update the Village
 */
VillageState.prototype.update = function() {
  if (cursors.up.isDown) {
    playerSprite.y -= 4;
  }
  if (cursors.down.isDown) {
    playerSprite.y += 4;
  }
  if (cursors.left.isDown) {
    playerSprite.x -= 4;
  }
  if (cursors.right.isDown) {
    playerSprite.x += 4;
  }
  if (this.up.input.pointerOver()) {
    playerSprite.y -= 4;
  }
  if (this.down.input.pointerOver()) {
    playerSprite.y += 4;
  }
  if (this.left.input.pointerOver()) {
    playerSprite.x -= 4;
  }
  if (this.right.input.pointerOver()) {
    playerSprite.x += 4;
  }
};
