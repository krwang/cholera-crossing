var PurificationMinigame = function(game) {
	this.game = game;
    this.queue = [];
    this.firewoodLeft = 8;
    this.containersLeft = 20;
    this.score = 0;
    this.gameStarted = false;
};

var instructions = "Your mom needs your help deciding what water is safe to drink " + 
                   "and what water needs to be boiled before drinking. Be careful, " + 
                   "you only have a limited amount of firewood so you won't be able " +
                   "to boil all the water.";

PurificationMinigame.prototype = {

   preload: function() { 
        // Function called first to load all the assets
        // game.load.audio('fashion-life', 'music/fashion-life.wav');

        game.load.image('background', 'images/filtration_minigame/filtration_background.png');
        game.load.image('toolbar_top', 'images/filtration_minigame/toolbar_top.png');
        game.load.image('toolbar_bottom', 'images/filtration_minigame/toolbar_bottom.png');
        game.load.image('arrow_left', 'images/filtration_minigame/arrow_left.png');
        game.load.image('arrow_down', 'images/filtration_minigame/arrow_down.png');
        game.load.image('textbox100x210', 'images/filtration_minigame/textbox100x210.png');
        game.load.image('textbox125x250', 'images/filtration_minigame/textbox125x250.png');
        game.load.image('textbox100x225', 'images/filtration_minigame/textbox100x225.png');
        game.load.image('bowl', 'images/filtration_minigame/bowl.png');
        game.load.image('tank', 'images/filtration_minigame/tank.png');
        game.load.image('bucket', 'images/filtration_minigame/bucket.png');
        game.load.image('boiling_pot', 'images/filtration_minigame/boiling_pot.png');
        game.load.image('mom', 'images/filtration_minigame/catmom.png');
        game.load.image('helpButton', 'images/filtration_minigame/help_button.png');
        game.load.image('startButton', 'images/filtration_minigame/start_button.png');
        game.load.image('text-background', 'images/dialogue/dialogue-text-background.png');
        game.load.image('right-arrow', 'images/dialogue/right-arrow.png');
    },

    create: function() { 
        // Function called after 'preload' to setup the game
        this.score = 0;
        this.firewoodLeft = 8;
        this.containersLeft = 20;
        this.queue = [];

        this.background = game.add.sprite(0, 0, 'background');
        this.toolbar_top = game.add.sprite(0, 0, 'toolbar_top');
        this.toolbar_bottom = game.add.sprite(0, 500, 'toolbar_bottom');

        this.mom = game.add.sprite(25, 175, 'mom');
        this.boiler = game.add.sprite(50, 375, 'boiling_pot');

        this.scoreText = game.add.text(10, 5, "Your Score: " + this.score);
        this.lastScoreText = game.add.text(10, 35, "");

        this.tempText = game.add.text(450, 510, "");
        this.sourceText = game.add.text(450, 540, "");
        this.purityText = game.add.text(450, 570, "");

        this.containersLeftText = game.add.text(25, 520, "");
        this.fuelLeftText = game.add.text(25, 550, "");

        this.showHelpText();

        // if (this.game.music) {
        //     this.game.music.stop();
        // }
        // this.game.music = game.add.audio('fashion-life', 0.5, true);
        // this.game.music.play();
    },

    showHelpText: function() {
        this.gameStarted = false;
        if (this.help) {
            this.help.destroy();
        }

        if (this.queue.length == 0) {
            this.createNewContainer(400);
        }

        this.boil_textbox = game.add.sprite(5, 245, 'textbox100x210');
        this.boil_arrow = game.add.sprite(90, 350, 'arrow_down');
        this.boil_text = game.add.text(10, 250, "Drag containers here to boil the water");
        this.boil_text.wordWrap = true;
        this.boil_text.wordWrapWidth = 250;

        this.direct_textbox = game.add.sprite(490, 250, 'textbox125x250');
        this.direct_arrow = game.add.sprite(435, 275, 'arrow_left');
        this.direct_text = game.add.text(500, 250, "Drag containers here if it is safe to drink without boiling");
        this.direct_text.wordWrap = true;
        this.direct_text.wordWrapWidth = 250;

        this.hover_textbox = game.add.sprite(547, 395, 'textbox100x225');
        this.hover_arrow = game.add.sprite(490, 425, 'arrow_left');
        this.hover_text = game.add.text(550, 400, "Hover over the containers to see details");
        this.hover_text.wordWrap = true;
        this.hover_text.wordWrapWidth = 250;

        this.startButton = game.add.button(350, 125, 'startButton', this.startGame, this);
        this.startButton.input.useHandCursor = true;
    },

    startGame: function(button) {
        button.destroy();
        this.boil_textbox.destroy();
        this.boil_text.destroy();
        this.boil_arrow.destroy();
        this.direct_textbox.destroy();
        this.direct_arrow.destroy();
        this.direct_text.destroy();
        this.hover_textbox.destroy();
        this.hover_arrow.destroy();
        this.hover_text.destroy();
        
        this.help = game.add.button(726, 5, "helpButton", this.showHelpText, this);

        this.hitBox = new Phaser.Rectangle(325, 200, 175, 150);
        this.containersLeftText.setText("Containers Needed: " + this.containersLeft);
        this.fuelLeftText.setText("Firewood Left: " + this.firewoodLeft);

        this.gameStarted = true;
        if (this.queue.length < 2) {
            this.createNewContainer();
        }
    },
    
    update: function() {
        // Function called 60 times per second
        if (this.gameStarted) {
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
            container = game.add.sprite(800, 400, this.randomContainer());
        }
        else {
            container = game.add.sprite(x, 400, this.randomContainer());
        }
        this.assignRandomAttributes(container);
        this.bindDrag(container);
        this.bindHover(container);
        this.queue.push(container); 
    },

    randomContainer: function() {
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
        container.original_x = container.x;
        this.queue.splice(this.queue.indexOf(container), 1);        
    },

    stopDrag: function(container) {
        container.pickedUp = false;
        if (!this.gameStarted) {
            container.x = container.original_x;
            container.y = 400;
            this.queue.push(container);
        }
        else {
            if (this.firewoodLeft > 0 && Phaser.Rectangle.intersects(container.getBounds(), this.boiler.getBounds())) {
                container.destroy();
                this.firewoodLeft -= 1;
                this.containersLeft -= 1;
                this.fuelLeftText.setText("Firewood Left: " + this.firewoodLeft);
                this.containersLeftText.setText("Containers Needed: " + this.containersLeft);
                this.lastScoreText.setText("Last move: 50");
                this.score += 50;
                this.scoreText.setText("Your Score: " + this.score);
                if (this.containersLeft > 0) {
                    this.createNewContainer();
                }
                if (this.firewoodLeft == 0) {
                    this.boiler.destroy();
                }
            }
            else if (this.hitBox && this.hitBox.contains(container.x, container.y)) {
                container.destroy();
                this.containersLeft -= 1;
                this.containersLeftText.setText("Containers Needed: " + this.containersLeft);
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
        }

    },

    calculateScore: function(container) {
        var dirtiness = container.dirtiness / 100;
        var squared = Math.pow(dirtiness, 2);
        var score = Math.floor((2 - squared) * 50);
        this.lastScoreText.setText("Last move: " + score);
        return score;
    },

    endGame: function() {
        var thisGame = this;
        this.gameStarted = false;

        var background = this.game.add.sprite(0, 0, 'background');
        scaleTo(800, 600, background);

        var mom = game.add.sprite(25, 175, 'mom');
        var textBackground = this.game.add.sprite(110, 506, 'text-background');
        this.game.add.text(110+12, 506+12, 'Thanks for your help bottling water! Always make sure water is safe before drinking it. ' +
            'Take these water purification tablets. Use them to treat water that might not be clean!', {
            font: '18px Helvetica Neue',
            fill: 'black',
            wordWrap: true,
            wordWrapWidth: textBackground.width - 24
        });
        this.game.add.button(720, 510, 'right-arrow', this.returnToHome);    
    },

    returnToHome: function() {
        game.playerData.completedGames.tablets = true;
        this.game.state.start('villageState');

    },

}
