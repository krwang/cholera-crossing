var instructions = "The three families living closest to you need help! " + 
"The local doctor has seen several of the families over the past few weeks and " + 
"suggests to each of the families that they've come very close to water poisoning. " +
"Help each family figure out where to collect water and where to excete. Examine each " +
"location carefully! Make sure to choose locations close to the houses so the families " +
"don't have to walk too much.";

// Creates a new 'main' state that wil contain the game
var waterCollection = function(game) {
    this.game = game;
};  
waterCollection.prototype = {

    preload: function() {
        game.load.image('grass', 'images/grass.png');
        game.load.image('river', 'images/river.png');
        game.load.image('lake', 'images/lake.png');
        game.load.image('latrines', 'images/latrines.png');
        game.load.image('house', 'images/house.png');
        game.load.image('waterbucket', 'images/waterbucket.png');
    },

    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.grass = game.add.sprite(0, 0, 'grass');
        this.river = game.add.sprite(100, 0, 'river');
        this.house = game.add.sprite(300, 100, 'house');

        
        this.lake = game.add.sprite(700, 300, 'lake');
        this.latrine = game.add.sprite(500, 500, 'latrines');
        this.waterbucket = game.add.sprite(10, 10, 'waterbucket');
        this.waterbucket.anchor.set(0);
        this.game.physics.arcade.enable(this.waterbucket);
        this.waterbucket.active = false;
        var start = new Phaser.Group(this.game, null, 'instructions', true);
        start.add(new Phaser.Text(this.game, 25, 25, instructions, {
            fill: "#ffffff",
            font: "12px Open Sans",
            wordWrap: true,
            wordWrapWidth: 750,
        }));
        start.visible = false;
       
    },
    
    update: function() {
        if (this.waterbucket.active) {
            if (game.physics.arcade.distanceToPointer(this.waterbucket, game.input.activePointer) > 50) {
                game.physics.arcade.moveToPointer(this.waterbucket, 300);
            } else {
                this.waterbucket.body.velocity.set(0);
            }            
        }

    },
};

// var Feature = 

var features = {
    lake: {
        name: "Lake",
        description: "This is a description",
        safe: true,
        explanation: "This is why it's safe.",
    },
    river: {
        name: "River",
        description: "This is a river.",
        safe: false,
        explanation: "Huehuhueheue.",
    },
    latrines: {
        name: "Latrines",
        description: "These are latrines.",
        safe: true,
        explanation: "lalalala",
    }



}

