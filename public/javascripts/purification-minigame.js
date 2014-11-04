var PurificationMinigame = function(game) {
	this.game = game;
    this.bottles = {
        conveyor_a: [],
        conveyor_b: [],
        conveyor_c: [],
    };
};

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
        this.boiler = game.add.sprite(600, 400, 'boiling_pot');

        this.conveyor_a = game.add.sprite(0, 150, 'conveyor_belt');
        this.conveyor_b = game.add.sprite(0, 300, 'conveyor_belt');
        this.conveyor_c = game.add.sprite(0, 450, 'conveyor_belt');
        for (var i = 0; i < 3; i++) {
            addBottleToConveyor(this.bottles["conveyor_a"], i * 100, 75);
            addBottleToConveyor(this.bottles["conveyor_b"], i * 100, 225);
            addBottleToConveyor(this.bottles["conveyor_c"], i * 100, 375);
        }
    },
    
    update: function() {
        // Function called 60 times per second
        for (var key in this.bottles) {
            for (var j = 0; j < this.bottles[key].length; j++) {
                var bottle = this.bottles[key][j];
                if (!bottle.pickedUp) {
                    bottle.x += 0.5;
                    if (bottle.x == 300) {
                        bottle.destroy();
                        this.bottles[key].splice(j, 1);
                        switch(key) {
                            case 'conveyor_a':
                                addBottleToConveyor(this.bottles[key], 0, 75);
                                break;
                            case 'conveyor_b':
                                addBottleToConveyor(this.bottles[key], 0, 225);
                                break;
                            case 'conveyor_c':
                                addBottleToConveyor(this.bottles[key], 0, 375);
                                break;
                        }
                    }
                }
                else {
                    bottle.original_x += 0.5;
                    if (bottle.original_x == 300) {
                        switch(key) {
                            case 'conveyor_a':
                                addBottleToConveyor(this.bottles[key], 0, 75);
                                break;
                            case 'conveyor_b':
                                addBottleToConveyor(this.bottles[key], 0, 225);
                                break;
                            case 'conveyor_c':
                                addBottleToConveyor(this.bottles[key], 0, 375);
                                break;
                        }
                    }
                }
            }
        }
    },
}

function addBottleToConveyor(conveyor, x, y) {
    var bottle = game.add.sprite(x, y, randomBottle());

    bottle.inputEnabled = true;
    bottle.input.enableDrag();
    bottle.events.onDragStart.add(startDrag, this);
    bottle.events.onDragStop.add(stopDrag, this);

    conveyor.splice(0, 0, bottle);
}

function startDrag(bottle) {
    bottle.pickedUp = true;
    bottle.original_x = bottle.x;
    bottle.original_y = bottle.y;
}

function stopDrag(bottle) {
    bottle.pickedUp = false;
    if (bottle.original_x < 300) {
        bottle.x = bottle.original_x;
        bottle.y = bottle.original_y;
    }
    else {
        bottle.destroy();
        findAndDestroy(bottle);
    }
}

function findAndDestroy(bottle) {
    for (var key in this.bottles) {
        if (this.bottles[key].indexOf(bottle) != -1) {
            this.bottles[key].splice(this.bottles[key].indexOf(bottle), 1);
            console.log(this.bottles[key]);
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