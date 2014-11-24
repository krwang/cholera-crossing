var PurificationMinigame = function(game) {
	this.game = game;
    this.conveyors = {
        a: undefined,
        b: undefined,
        c: undefined,
    };
    this.scoreText;
    this.score = 0;
};

var animalStates = ['healthy_cat', 'sick_cat', 'very_sick_cat'];
// var instructions = "The water purification facility needs your help! The facility has hired new " + 
//                     "employees and they need to be trained about what water needs to be purified " +
//                     "and what water can be left untouched. Your goal is to make sure that the animals " +
//                     "at the end of the facility lines do not get infected. The three types of water are " +
//                     "shown below.";
var instructions = "Your friends need some help figuring out if their water is clean to drink or not." +
                   "Help them sort the clean water from the dirty by inspecting the water.";

PurificationMinigame.prototype = {

   preload: function() { 
        // Function called first to load all the assets
        game.load.image('background', 'images/filtration_minigame/filtration_background.png');

        game.load.image('bottle', 'images/filtration_minigame/bottle_blue.png');
        game.load.image('bowl', 'images/filtration_minigame/bowl.png');
        game.load.image('tank', 'images/filtration_minigame/tank.png');
        game.load.image('bucket', 'images/filtration_minigame/bucket.png');
        game.load.image('water_bottle_diagram', 'images/filtration_minigame/water_bottle_diagram.png');
        game.load.image('conveyor_belt', 'images/filtration_minigame/conveyor_belt.png');
        game.load.image('boiling_pot', 'images/filtration_minigame/boiling_pot.png');
        game.load.image('mom', 'images/filtration_minigame/catmom.png')
        game.load.image('healthy_cat', 'images/filtration_minigame/vectorcat-happy.png');
        game.load.image('sick_cat', 'images/filtration_minigame/vectorcat-stomachache.png');
        game.load.image('very_sick_cat', 'images/filtration_minigame/vectorcat-unhealthy.png');

        game.load.image('startButton', 'images/collection_minigame/done.png');
    },

    create: function() { 
        // Function called after 'preload' to setup the game
        this.background = game.add.sprite(0, 0, 'background');

        this.diagram = game.add.sprite(650, 50, 'water_bottle_diagram');
        this.boiler = game.add.sprite(600, 400, 'boiling_pot');

        this.conveyors["a"] = new Conveyor(game.add.sprite(0, 250, 'conveyor_belt'), 175);
        this.conveyors["b"] = new Conveyor(game.add.sprite(0, 400, 'conveyor_belt'), 325);
        this.conveyors["c"] = new Conveyor(game.add.sprite(0, 550, 'conveyor_belt'), 475);

        for (var i = 0; i < 2; i++) {
            this.addContainerToConveyor(this.conveyors["a"], i * 200, this.conveyors["a"].position);
            this.addContainerToConveyor(this.conveyors["b"], i * 200, this.conveyors["b"].position);
            this.addContainerToConveyor(this.conveyors["c"], i * 200, this.conveyors["c"].position);
        }

        this.scoreText = game.add.text(0, 0, "Your Score: " + this.score);

        this.graphics = game.add.graphics(0, 0);
        this.graphics.beginFill(0x000000);
        this.graphics.drawRect(0, 0, this.game.width, this.game.height);
        this.graphics.endFill();

        this.startButton = game.add.button(300, 400, 'startButton', this.startGame, this);

        this.instructionText = game.add.text(50, 50, instructions);
        this.instructionKey = game.add.sprite(550, 275, 'water_bottle_diagram');
        this.instructionText.fill = 'white';
        this.instructionText.wordWrap = true;
        this.instructionText.wordWrapWidth = 700;
    },

    startGame: function(button) {
        button.destroy();
        this.instructionKey.destroy();
    },

    endGame: function() {
        this.gameEnd = true;
        this.graphics = game.add.graphics(0, 0);
        this.graphics.beginFill(0x000000);
        this.graphics.drawRect(0, 0, this.game.width, this.game.height);
        this.graphics.endFill();

        this.endGameText = game.add.text(100, 100, "A cat became deathly ill! Your score: " + this.score);
        this.endGameText.fill = 'white';

        this.endButton = game.add.button(300, 400, 'startButton', this.returnToHome, this);
    },
    
    update: function() {
        // Function called 60 times per second
        if (!this.startButton.game && !this.gameEnd) {
            this.instructionText.destroy();
            this.graphics.destroy();
            this.updateAllBottles(this.conveyors);
        }
    },

    updateAllBottles: function(conveyors) {
        for (var key in conveyors) {
            var conveyor = conveyors[key];
            for (var j = 0; j < conveyor.containers.length; j++) {
                if (!this.gameEnd) {
                    var container = conveyor.containers[j];
                    if (!container.pickedUp) {
                        this.advanceBottle(conveyor, container, j);
                    }
                    else {
                        container.original_x += 1;
                        if (container.original_x == 350) {
                            this.addContainerToConveyor(conveyor, 0, conveyor.position);
                        }
                    }                   
                }

            }
        }
    },

    advanceBottle: function(conveyor, container, container_index) {
        container.x += 1;
        if (container.x == 0) {
            container.visible = true;
        }
        else if (container.x == 350) {
            if (container.key == 'bowl') {
                 this.contaminateAnimal(conveyor);
            }
            else if (container.key == 'bucket') {
                if (Math.random() >= 0.9) {
                    this.contaminateAnimal(conveyor);
                }
            }
            if (!this.gameEnd) {
                container.destroy();
                conveyor.containers.splice(container_index, 1);
                this.addContainerToConveyor(conveyor, 0, conveyor.position);
            }
        }
    },

    contaminateAnimal: function(conveyor) {
        conveyor.animal.destroy();
        conveyor.animalState <= 2 ? conveyor.animalState++ : conveyor.animalState += 0;
        if (conveyor.animalState > 2) {
            this.endGame();
        }
        else {
            conveyor.animal.destroy();
            conveyor.animal = game.add.sprite(450, conveyor.position, animalStates[conveyor.animalState]);                                    
        }
    },

    addContainerToConveyor: function(conveyor, x, y) {
        if (conveyor.containers[0] && conveyor.containers[0].x <= x + 40) {
            x -= 40;
        }
        var container = game.add.sprite(x, y, randomContainer());
        if (container.key == 'bowl') {
            container.y += 60;
        }
        
        if (x < 0) {
            container.visible = false;
        }

        container.inputEnabled = true;
        container.input.enableDrag();
        container.events.onDragStart.add(this.startDrag, this);
        container.events.onDragStop.add(this.stopDrag, this);

        conveyor.containers.splice(0, 0, container);       
    },

    startDrag: function(container) {
        container.pickedUp = true;
        container.original_x = container.x;
        container.original_y = container.y;        
    },

    stopDrag: function(container) {
        container.pickedUp = false;
        if (Phaser.Rectangle.intersects(container.getBounds(), this.boiler.getBounds())) {
            this.score += 10;
            this.scoreText.text = "Your Score: " + this.score;
            var containingConveyor = findBottle(container, this.conveyors);
            container.destroy();
            containingConveyor.containers.splice(containingConveyor.containers.indexOf(container), 1);
            if (containingConveyor.containers.length < 5) {
                this.addContainerToConveyor(containingConveyor, 0, containingConveyor.position);           
            }
        }
        else {
            if (container.original_x < 350) {
                container.x = container.original_x;
                container.y = container.original_y;
            }
            else {
                container.destroy();
                findAndDestroy(container, this.conveyors);
            }     
        }
    },

    returnToHome: function(button) {
        this.gameEnd = false;
        this.game.state.start('villageState');
    },

}

function findAndDestroy(container, conveyors) {
    for (var key in conveyors) {
        if (conveyors[key].containers.indexOf(container) != -1) {
            conveyors[key].containers.splice(conveyors[key].containers.indexOf(container), 1);
            break;
        }
    }
}

function findBottle(container, conveyors) {
    for (var key in conveyors) {
        if (conveyors[key].containers.indexOf(container) != -1) {
            return conveyors[key];
        }
    }
}

function randomContainer() {
    var random = Math.random();
    if (random <= .25) {
        return 'bottle';
    } else if (random <= .5) {
        return 'bowl';
    } else if (random <= .75) {
        return 'tank';
    } else {
        return 'bucket';
    }
}

var Conveyor = function(sprite, position) {
    this.sprite = sprite;
    this.containers = [];
    this.position = position;
    this.animalState = 0;
    this.animal = game.add.sprite(450, position, animalStates[0]);
}
