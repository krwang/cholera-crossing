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
}

/**
 * Pre-load any assets required by the game
 */
VillageState.prototype.preload = function() {
  game.load.audio('african-skies', 'music/african-skies.mp3');

  game.load.image('up', 'images/dialogue/up-arrow.png');
  game.load.image('down', 'images/dialogue/down-arrow.png');
  game.load.image('left', 'images/dialogue/left-arrow.png');
  game.load.image('right', 'images/dialogue/right-arrow.png');

  game.load.image('town_map', 'images/town/town_map.png');
  game.load.image('house', 'images/town/house.png');
  game.load.image('house2', 'images/town/house2.png');
  game.load.image('house3', 'images/town/house3.png');
  game.load.image('hospital', 'images/town/hospital.png');
  game.load.image('mayor_office', 'images/town/mayor_office.png');
  game.load.image('splash', 'images/main/splash.png');
  game.load.image('well', 'images/town/well.png');
  game.load.image('lake', 'images/town/lake.png');
  game.load.image('fire', 'images/town/campfire.png');
  game.load.image('land', 'images/collection_minigame/land.png');
  game.load.image('taskbar', 'images/town/taskbar.png');
  game.load.image('player', 'images/town/scaled/bunnykid.png');
  game.load.image('feet', 'images/town/feet.png');
  game.load.image('giraffe_doctor', 'images/doctor_minigame/giraffedoctor.png');
  game.load.image('mayor', 'images/main/owlmayor.png');
  game.load.image('hospital_room', 'images/doctor_minigame/hospital_room.png');

  game.load.image('npc_bg1', 'images/town/npc_bg1.png');
  game.load.image('npc_bg2', 'images/town/npc_bg2.png');
  game.load.image('npc_bg3', 'images/town/npc_bg3.png');
  game.load.image('caged_monster', 'images/start_dialogue/mayor_office_monster_caged_background.png');

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
  game.load.image('map', 'images/town/map.png');
  game.load.image('home', 'images/town/home.png');

  game.load.image('paper', 'images/town/paper.png');
  game.load.image('matches', 'images/town/matches.png');
  game.load.image('waterbucket', 'images/town/empty_water.png');
  
  game.load.image('tablets', 'images/town/tablets.png');
  game.load.image('bottle', 'images/town/dirty_water.png');
  game.load.image('list', 'images/town/list.png');

  game.load.image('startButton', 'images/filtration_minigame/start_button.png');

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

  game.load.physics('village_collisions', 'images/village_collisions.json');
};

/**
 * Create sprites and other game objects
 */
VillageState.prototype.create = function() {
  game.physics.startSystem(Phaser.Physics.P2JS);

  var self = this;

  if (!game.music) {
    game.music = game.add.audio('african-skies', 0.25, true);
    game.music.play();
  }
  if (game.music.key != 'african-skies') {
    game.music.stop();
    game.music = game.add.audio('african-skies', 0.25, true);
    game.music.play();
  }

  var collectionGroup = new Phaser.Group(this.game, null, 'collectionGroup', true);
  var collectionBg = collectionGroup.create(0, 0, 'npc_bg1');
  scaleTo(800, 600, collectionBg);
  var collection_p1 = collectionGroup.create(100, 150, 'player');
  var collection_p2 = collectionGroup.create(600, 150, 'mom');
  scaleTo(150, 300, collection_p1);
  scaleTo(150, 300, collection_p2);
  collection_p2.scale.x *= -1;
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
  var flamingo_group2 = npc_group2.create(500, 150, 'flamingo');
  scaleTo(400, 300, flamingo_group2);
  var player_group = npc_group2.create(100, 150, 'player');
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
      'currently stuck here. Can you go take it to him?', group: npc_group2}],
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
      {text: 'Here are some matches Kojo. Be sure to only use these with adult supervision.', group: npc_group3}],
      [{text: 'Got it, thanks!', nextState: 'villageState'}]
    );
  } else {
    this.dogDialogue = new Dialogue(
      [{text: 'If you don\'t know if your water is dirty, be sure to boil it. It is better to be safe than sorry.', group: npc_group3}],
      [{text: 'Thanks for the tip!', nextState: 'villageState'}]);
  }

  this.game.add.tileSprite(0, 0, 1600, 1200, 'town_map');
  this.game.world.setBounds(0, 0, 1600, 1300);

  house = this.game.add.sprite(440, 300, 'house');
  scaleTo(300, 300, house);
  house2 = this.game.add.sprite(80, 500, 'house2');
  scaleTo(300, 300, house2);
  house3 = this.game.add.sprite(645, 1000, 'house3');
  scaleTo(300, 300, house3);
  hospital = this.game.add.sprite(965, 60, 'hospital');
  scaleTo(500, 300, hospital);
  well = this.game.add.sprite(850, 700, 'well');
  scaleTo(300, 300, well);
  mayor_office = this.game.add.sprite(1300, 420, 'mayor_office');
  scaleTo(300, 300, mayor_office);
  dog = this.game.add.sprite(100, 950, 'dog');
  scaleTo(100, 200, dog);
  if (!self.game.playerData.inventory.waterbucket) {
    monkey = this.game.add.sprite(800, 430, 'monkeybucket');
  } else {
    monkey = this.game.add.sprite(800, 430, 'monkey');
  }
  scaleTo(100, 200, monkey);
  flamingo = this.game.add.sprite(1200, 450, 'flamingo');
  scaleTo(100, 200, flamingo);

  var features = [house, house2, house3, hospital, mayor_office, well, dog, monkey, flamingo];
  for (var i = 0; i < features.length; i++) {
    var feature = features[i];
    feature.x += feature.width/2
    feature.y += feature.height/2

    game.physics.p2.enableBody(feature);
    feature.body.static = true;
    feature.body.clearShapes();
    feature.body.loadPolygon('village_collisions', feature.key);
  }

  var lake = this.game.add.sprite(1100, 1000, 'lake');
  scaleTo(500, 300, lake);

  var fire = this.game.add.sprite(150, 980, 'fire');
  scaleTo(150, 150, fire);

  var playerSpriteX = game.playerData.location ? game.playerData.location.x : 1450;
  var playerSpriteY = game.playerData.location ? game.playerData.location.y : 630;

  playerSprite = this.game.add.sprite(playerSpriteX, playerSpriteY, 'player');
  game.physics.p2.enableBody(playerSprite);
  playerSprite.body.clearShapes();
  playerSprite.body.loadPolygon('village_collisions', playerSprite.key)
  playerSprite.body.collideWorldBounds = true;

  playerSprite.body.onBeginContact.add(function(body, shapeA, shapeB, equation) {
    self.saveLocation(body);
    switch (body){

      case house.body: 
        self.game.playerData.dialogue = self.waterPurificationDialogue;
        self.game.state.start('dialogueState');
        break;

      case house2.body:
        self.game.playerData.buildingJustEntered = VillageState.BuildingEnum.HOUSE_2;
        self.game.state.start('doctorMinigame');
        break;

      case house3.body:
        self.game.playerData.buildingJustEntered = VillageState.BuildingEnum.HOUSE_3;
        self.game.state.start('doctorMinigame');
        break;

      case hospital.body:
        self.game.playerData.buildingJustEntered = VillageState.BuildingEnum.HOSPITAL;
        self.game.state.start('doctorMinigame');
        break;

      case well.body:
        self.game.playerData.dialogue = self.waterCollectionDialogue;
        self.game.state.start('dialogueState');
        break;

      case mayor_office.body:
        self.game.state.start('mayorDialogueState');
        break;

      case dog.body:
        self.game.playerData.inventory.matches = true;
        self.game.playerData.dialogue = self.dogDialogue;
        self.game.state.start('dialogueState');
        break;

      case monkey.body:
        if (!self.game.playerData.inventory.waterbucket) {
            self.game.playerData.inventory.waterbucket = true;
            self.game.playerData.dialogue = self.monkeyBucketDialogue;
            self.game.state.start('dialogueState');
        } else {
            self.game.playerData.inventory.waterbucket = true;
            self.game.playerData.dialogue = self.monkeyBucketDialogue;
            self.game.state.start('dialogueState');
        }
        break;

      case flamingo.body:
        self.game.playerData.inventory.paper = true;
        self.game.playerData.dialogue = self.flamingoDialogue;
        self.game.state.start('dialogueState');
        break;
    }
  }, this);

  cursors = game.input.keyboard.createCursorKeys();
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
    var x = 310 + 100*i;
    var inventoryImage = this.game.add.sprite(x, 520, 'item');
    scaleTo(60, 60, inventoryImage);
    inventoryImage.fixedToCamera = true;
  }

  var i = 0;
  Object.keys(inventory).forEach(function(key) {
    if (inventory[key]) {
      var x = 315 + 100*i;
      var inventoryImage = this.game.add.sprite(x, 525, key);
      scaleTo(50, 50, inventoryImage);
      inventoryImage.fixedToCamera = true;
      i++;
    }
  });

  var completedGames = game.playerData.completedGames;

  for (var j = 0; j < 3; j++) {
    var x = 20 + 90*j;
    var clueImage = this.game.add.sprite(x, 520, 'clue');
    scaleTo(60, 60, clueImage);
    clueImage.fixedToCamera = true;
  }

  var j = 0;
  Object.keys(completedGames).forEach(function(key) {
    if (completedGames[key]) {
      var x = 25 + 90*j;
      var clueImage = this.game.add.sprite(x, 525, key);
      scaleTo(50, 50, clueImage);
      clueImage.fixedToCamera = true;
      j++;
    }
  });

  var help_group = new Phaser.Group(this.game, null, 'help_group', true);
  var help_bg = new Phaser.Image(this.game, 0, 0, 'caged_monster');
  scaleTo(800, 600, help_bg);
  help_group.add(help_bg);
  help_group.visible = false;

  this.helpDialogue = new Dialogue(
    [{text: 'Use the arrow keys to travel around the village and see if you can gather evidence that Sal is innocent. Talk to other villagers or explore buildings to find clues!', group: help_group}],
    [{text: 'Okay, I\'m on it!',
        nextState: 'villageState'}]
  );

  var helpImage = this.game.add.button(720, 520, 'help', function() {
    self.saveLocation(mayor_office.body);
    self.game.playerData.dialogue = self.helpDialogue;
    self.game.state.start('dialogueState');
  });
  scaleTo(60, 60, helpImage);
  helpImage.fixedToCamera = true;
  helpImage.input.useHandCursor = true;

  var mapGroup = new Phaser.Group(this.game, null, 'mapGroup', true);
  var map = game.add.sprite(0, 0, 'map');
  scaleTo(800, 600, map);
  mapGroup.add(map);
  var mapButton = game.add.button(720, 520, 'home', function() {
    mapGroup.visible = false;
    helpImage.visible = true;
  });
  scaleTo(60, 60, mapButton)
  mapButton.input.useHandCursor = true;
  mapGroup.add(mapButton);
  mapGroup.visible = false;

  var homeImage = this.game.add.button(630, 520, 'home', function() {
    mapGroup.visible = true;
    helpImage.visible = false;

  });
  scaleTo(60, 60, homeImage);
  homeImage.fixedToCamera = true;
  homeImage.input.useHandCursor = true;
};

/**
 * Update the Village
 */
VillageState.prototype.update = function() {
  var self = this;
  var SPEED = 200;
  playerSprite.body.setZeroVelocity();
  playerSprite.body.setZeroRotation();
  if ((cursors.up.isDown || this.up.input.pointerOver()) && playerSprite.y > playerSprite.height/2) {
    playerSprite.body.velocity.y = -1*SPEED;
  }
  if ((cursors.down.isDown || this.down.input.pointerOver()) && playerSprite.y < 1200 - playerSprite.height/2) {
    playerSprite.body.velocity.y = SPEED;
  }
  if ((cursors.left.isDown || this.left.input.pointerOver()) && playerSprite.x > playerSprite.width/2) {
    playerSprite.body.velocity.x = -1*SPEED;
  }
  if ((cursors.right.isDown || this.right.input.pointerOver()) && playerSprite.x < 1600 - playerSprite.width/2) {
    playerSprite.body.velocity.x = SPEED;
  }
};

VillageState.prototype.saveLocation = function(body) {
  this.game.playerData.location = {
    x: body.x,
    y: Math.min(body.y + playerSprite.height/2, 1200 - playerSprite.height/2)
  }
}