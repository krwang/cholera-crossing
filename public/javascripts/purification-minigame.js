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

var animalStates = ['bottle_green', 'bottle_blue', 'bottle_red'];

PurificationMinigame.prototype = {

   preload: function() { 
        // Function called first to load all the assets
        game.load.image('bottle_blue', 'images/water_minigame/bottle_blue.png');
        game.load.image('bottle_red', 'images/water_minigame/bottle_red.png');
        game.load.image('bottle_green', 'images/water_minigame/bottle_green.png');
        game.load.image('water_bottle_diagram', 'images/water_minigame/water_bottle_diagram.png');
        game.load.image('conveyor_belt', 'images/water_minigame/conveyor_belt.png');
        game.load.image('boiling_pot', 'images/water_minigame/boiling_pot.png');
    },

    create: function() { 
        // Function called after 'preload' to setup the game

        this.diagram = game.add.sprite(600, 0, 'water_bottle_diagram');
        this.boiler = game.add.sprite(600, 350, 'boiling_pot');

        this.conveyors["a"] = new Conveyor(game.add.sprite(0, 150, 'conveyor_belt'), 75);
        this.conveyors["b"] = new Conveyor(game.add.sprite(0, 300, 'conveyor_belt'), 225);
        this.conveyors["c"] = new Conveyor(game.add.sprite(0, 450, 'conveyor_belt'), 375);

        for (var i = 0; i < 3; i++) {
            this.addBottleToConveyor(this.conveyors["a"], i * 100, this.conveyors["a"].position);
            this.addBottleToConveyor(this.conveyors["b"], i * 100, this.conveyors["b"].position);
            this.addBottleToConveyor(this.conveyors["c"], i * 100, this.conveyors["c"].position);
        }

        this.scoreText = game.add.text(0, 0, "Your Score: " + this.score);

        this.graphics = game.add.graphics(0, 0);
        this.graphics.beginFill(0xfff000);
        this.graphics.drawRect(0, 0, this.game.width, this.game.height);
        this.graphics.endFill();

        this.startButton = game.add.button(300, 400, 'startButton', startGame, this);

        this.instructionText = game.add.text(50, 50, 'Instructions here');
    },
    
    update: function() {
        // Function called 60 times per second
        if (!this.startButton.game) {
            this.instructionText.destroy();
            this.graphics.destroy();
            for (var key in this.conveyors) {
                var conveyor = this.conveyors[key];
                for (var j = 0; j < conveyor.bottles.length; j++) {
                    var bottle = conveyor.bottles[j];
                    if (!bottle.pickedUp) {
                        bottle.x += 1;
                        if (bottle.x == 350) {
                            if (bottle.key == 'bottle_red') {
                                conveyor.animal.destroy();
                                conveyor.animalState < 2 ? conveyor.animalState++ : conveyor.animalState += 0;
                                conveyor.animal = game.add.sprite(450, conveyor.position, animalStates[conveyor.animalState]);

                            }
                            bottle.destroy();
                            conveyor.bottles.splice(j, 1);
                            this.addBottleToConveyor(conveyor, 0, conveyor.position);
                        }
                    }
                    else {
                        bottle.original_x += 1;
                        if (bottle.original_x == 350) {
                            this.addBottleToConveyor(conveyor, 0, conveyor.position);
                        }
                    }
                }
            }
        }
    },

    addBottleToConveyor: function(conveyor, x, y) {
        var bottle = game.add.sprite(x, y, randomBottle());

        bottle.inputEnabled = true;
        bottle.input.enableDrag();
        bottle.events.onDragStart.add(this.startDrag, this);
        bottle.events.onDragStop.add(this.stopDrag, this);

        conveyor.bottles.splice(0, 0, bottle);       
    },

    startDrag: function(bottle) {
        bottle.pickedUp = true;
        bottle.original_x = bottle.x;
        bottle.original_y = bottle.y;        
    },

    stopDrag: function(bottle) {
        bottle.pickedUp = false;
        if (Phaser.Rectangle.intersects(bottle.getBounds(), this.boiler.getBounds())) {
            this.score += 10;
            this.scoreText.text = "Your Score: " + this.score;
            var containingConveyor = findBottle(bottle, this.conveyors);
            bottle.destroy();
            containingConveyor.bottles.splice(containingConveyor.bottles.indexOf(bottle), 1);
            if (containingConveyor.bottles.length < 5) {
                this.addBottleToConveyor(containingConveyor, 0, containingConveyor.position);           
            }
        }
        else {
            if (bottle.original_x < 350) {
                bottle.x = bottle.original_x;
                bottle.y = bottle.original_y;
            }
            else {
                bottle.destroy();
                findAndDestroy(bottle, this.conveyors);
            }     
        }
    },

}

function startGame(button) {
    button.destroy();
}

function findAndDestroy(bottle, conveyors) {
    for (var key in conveyors) {
        if (conveyors[key].bottles.indexOf(bottle) != -1) {
            conveyors[key].bottles.splice(conveyors[key].bottles.indexOf(bottle), 1);
            break;
        }
    }
}

function findBottle(bottle, conveyors) {
    for (var key in conveyors) {
        if (conveyors[key].bottles.indexOf(bottle) != -1) {
            return conveyors[key];
        }
    }
}

function randomBottle() {
    var random = Math.random();
    if (random <= .33) {
        return 'bottle_blue';
    } else if (random >= .66) {
        return 'bottle_red';
    } else {
        return 'bottle_green';
    }
}

var Conveyor = function(sprite, position) {
    this.sprite = sprite;
    this.bottles = [];
    this.position = position;
    this.animalState = 0;
    this.animal = game.add.sprite(450, position, animalStates[0]);
}