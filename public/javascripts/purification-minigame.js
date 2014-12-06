var PurificationMinigame = function(game) {
	this.game = game;
    this.queue = [];
    this.firewoodLeft = 8;
    this.containersLeft = 20;
    this.score = 0;
};

var animalStates = ['healthy_cat', 'sick_cat', 'very_sick_cat'];
// var instructions = "The water purification facility needs your help! The facility has hired new " + 
//                     "employees and they need to be trained about what water needs to be purified " +
//                     "and what water can be left untouched. Your goal is to make sure that the animals " +
//                     "at the end of the facility lines do not get infected. The three types of water are " +
//                     "shown below.";
var instructions = "Your friends need some help figuring out if their water is clean to drink or not. " +
                   "Help them sort the clean water from the dirty by inspecting the water.";

PurificationMinigame.prototype = {

   preload: function() { 
        // Function called first to load all the assets
        game.load.image('background', 'images/filtration_minigame/filtration_background.png');

        game.load.image('bottle', 'images/filtration_minigame/bottle_blue.png');
        game.load.image('bowl', 'images/filtration_minigame/bowl.png');
        game.load.image('tank', 'images/filtration_minigame/tank.png');
        game.load.image('bucket', 'images/filtration_minigame/bucket.png');
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
        this.hitBox = new Phaser.Rectangle(325, 250, 175, 150);

        this.mom = game.add.sprite(25, 200, 'mom');
        this.boiler = game.add.sprite(50, 400, 'boiling_pot');

        this.createNewContainer(400);
        this.createNewContainer();

        this.scoreText = game.add.text(25, 0, "Your Score: " + this.score);
        this.containerScoreText = game.add.text(450, 275, "");
        this.containersLeftText = game.add.text(25, 520, "Containers Left: " + this.containersLeft);
        this.fuelLeftText = game.add.text(25, 550, "Firewood Left: " + this.firewoodLeft);
        this.tempText = game.add.text(450, 500, "");
        this.sourceText = game.add.text(450, 530, "");
        this.purityText = game.add.text(450, 560, "");

        this.graphics = game.add.graphics(0, 0);
        this.graphics.beginFill(0x000000);
        this.graphics.drawRect(0, 0, this.game.width, this.game.height);
        this.graphics.endFill();

        this.startButton = game.add.button(300, 400, 'startButton', this.startGame, this);

        this.instructionText = game.add.text(50, 50, instructions);
        this.instructionText.fill = 'white';
        this.instructionText.wordWrap = true;
        this.instructionText.wordWrapWidth = 700;
    },

    startGame: function(button) {
        button.destroy();
    },

    endGame: function() {
        this.gameEnd = true;
        this.graphics = game.add.graphics(0, 0);
        this.graphics.beginFill(0x000000);
        this.graphics.drawRect(0, 0, this.game.width, this.game.height);
        this.graphics.endFill();

        this.endGameText = game.add.text(100, 100, "Thanks for your help bottling water! Your score: " + this.score);
        this.endGameText.fill = 'white';

        this.endButton = game.add.button(300, 400, 'startButton', this.returnToHome, this);
    },
    
    update: function() {
        // Function called 60 times per second
        if (!this.startButton.game && !this.gameEnd) {
            this.instructionText.destroy();
            this.graphics.destroy();
            this.updateQueue(this.queue);
        }
    },

    updateQueue: function(queue) {
        if (queue[0].x > 400) {
            queue[0].x -= 1;
        }
        for (var i = 1; i < queue.length; i++) {
            if (!queue[i].pickedUp) {
                if (!this.isCollidingWithNextItemInQueue(queue, i) && queue[i].x > 400) {
                    queue[i].x -= 1;
                }
            }
        }
    },

    isCollidingWithNextItemInQueue: function(queue, index) {
        if (Phaser.Rectangle.intersects(queue[index].getBounds(), queue[index - 1].getBounds())) {
            return true;
        }
        return false;
    },

    createNewContainer: function(x) {
        var container;
        if (arguments.length == 0) {
            container = game.add.sprite(800, 400, randomContainer());
        }
        else {
            container = game.add.sprite(x, 400, randomContainer());
        }
        this.assignRandomAttributes(container);
        this.bindDrag(container);
        this.bindHover(container);
        this.queue.push(container); 
    },

    assignRandomAttributes: function(container) {
        container.dirtiness = 0;

        var tempRandom = Math.random();
        if (tempRandom < .25) {
            container.temperature = 'Hot';
            container.dirtiness += 30;
        }
        else if (tempRandom < .5) {
            container.temperature = 'Warm';
            container.dirtiness += 60;
        }
        else if (tempRandom < .75) {
            container.temperature = 'Cool';
            container.dirtiness += 10;
        }
        else {
            container.temperature = 'Cold';
            container.dirtiness += 5;
        }

        var sourceRandom = Math.random();
        if (sourceRandom < .2) {
            container.source = 'Lake';
            container.dirtiness += 60;
        }
        else if (sourceRandom < .4) {
            container.source = 'River';
            container.dirtiness += 30;
        }
        else if (sourceRandom < .7) {
            container.source = 'Well';
            container.dirtiness += 5;
        }
        else {
            container.source = 'Pump';
            container.dirtiness += 15;
        }

        var purityRandom = Math.random();
        if (purityRandom < .5) {
            container.purity = 'Clear';
            container.dirtiness += 5;
        }
        else if (purityRandom < .25) {
            container.purity = 'Dusty';
            container.dirtiness += 35;
        }
        else {
            container.purity = 'Discolored';
            container.dirtiness += 80;
        }
    },

    bindDrag: function(container) {
        container.inputEnabled = true;
        container.input.enableDrag();
        container.events.onDragStart.add(this.startDrag, this);
        container.events.onDragStop.add(this.stopDrag, this);        
    },

    bindHover: function(container) {
        container.events.onInputOver.add(this.onHoverOver, this);
        container.events.onInputOut.add(this.onHoverOut, this);
    },

    onHoverOver: function(container) {
        this.tempText.setText("Water Temperature: " + container.temperature);
        this.sourceText.setText("Water Source: " + container.source);
        this.purityText.setText("Water Purity: " + container.purity);
    },

    onHoverOut: function(container) {
        this.tempText.setText("");
        this.sourceText.setText("");
        this.purityText.setText("");
    },

    startDrag: function(container) {
        container.pickedUp = true;
        this.queue.splice(this.queue.indexOf(container), 1);        
    },

    stopDrag: function(container) {
        container.pickedUp = false;
        if (Phaser.Rectangle.intersects(container.getBounds(), this.boiler.getBounds())) {
            container.destroy();
            this.firewoodLeft -= 1;
            this.containersLeft -= 1;
            this.fuelLeftText.setText("Firewood Left: " + this.firewoodLeft);
            this.containersLeftText.setText("Containers Left: " + this.containersLeft);
            this.score += 50;
            this.scoreText.setText("Your Score: " + this.score);
            if (this.containersLeft > 0) {
                this.createNewContainer();
            }
            if (this.firewoodLeft == 0) {
                this.boiler.destroy();
            }
        }
        else if (this.hitBox.contains(container.x, container.y)) {
            container.destroy();
            this.containersLeft -= 1;
            this.containersLeftText.setText("Containers Left: " + this.containersLeft);
            this.score += this.calculateScore(container);
            this.scoreText.setText("Your Score: " + this.score);
            if (this.containersLeft > 0) {
                this.createNewContainer();
            }
        }
        else {
            container.y = 400;
            var lastContainer = this.queue[this.queue.length - 1];
            var rightBoundOfLastContainer = lastContainer.x + lastContainer.width;
            if (container.x >= lastContainer.x && container.x <= rightBoundOfLastContainer) {
                container.x = rightBoundOfLastContainer;
                this.queue.push(container);
            }
            else if (lastContainer.x > (400 + container.width)) {
                container.x = 400;
                this.queue.unshift(container);
            }
            else if (container.x <= 400) {
                container.x = rightBoundOfLastContainer;
                this.queue.push(container);
            }
            else {
                this.queue.push(container);  
            }
        }

        if (this.containersLeft == 0) {
            this.endGame();
        }
    },

    calculateScore: function(container) {
        var dirtiness = container.dirtiness / 100;
        var squared = Math.pow(dirtiness, 2);
        var score = Math.floor((2 - squared) * 50);
        this.containerScoreText.setText(score);
        return score;
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
    if (random <= .33) {
        return 'bowl';
    }
    else if (random <= .66) {
        return 'tank';
    }
    else {
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
