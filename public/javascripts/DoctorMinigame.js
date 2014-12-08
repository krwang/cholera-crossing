

var DoctorMinigame = function(game) {
	this.game = game;
  this.width = this.game.width - 20;
  this.height = this.game.height;

  this.x = 0;
  this.y = this.game.height - this.height;

  
};

DoctorMinigame.StateEnum = {
  NOT_INITIATED: 'not initiated',
  INITIATED: 'initiated',
  SPOKE_NPC1: 'spoke with npc1',
  SPOKE_NPC2: 'spoke with npc2',
  SPOKE_BOTH: 'spoke with both npcs',
  FINISHED: 'finished'
}

DoctorMinigame.prototype = {
  preload: function() {
      game.load.image('cat_happy', 'images/doctor_minigame/vectorcat-happy.png');
      game.load.image('cat_stomachache', 'images/doctor_minigame/vectorcat-stomachache.png');
      game.load.image('cat_thirsty', 'images/doctor_minigame/vectorcat-thirsty.png');
      game.load.image('cat_unhealthy', 'images/doctor_minigame/vectorcat-unhealthy.png');
      game.load.image('monkey_1', 'images/doctor_minigame/monkeysrs.png');
      game.load.image('monkey_2', 'images/doctor_minigame/monkeysrs-idle.png');
      game.load.image('monkey_sis', 'images/doctor_minigame/monkeysis.png');
      game.load.image('left_arrow', 'images/doctor_minigame/left_arrow.png');
      game.load.image('right_arrow', 'images/doctor_minigame/right_arrow.png');
      game.load.image('house_scene_1', 'images/doctor_minigame/inside_home_1.png');
      game.load.image('house_scene_2', 'images/doctor_minigame/inside_home_2.png');
      game.load.image('hospital_room', 'images/doctor_minigame/hospital_room.png');
      game.load.image('giraffe_doctor', 'images/doctor_minigame/giraffedoctor.png');
      game.load.image('symptoms_button', 'images/filtration_minigame/help_button.png');
      game.load.image('symptoms_list', 'images/doctor_minigame/symptomsList.png');
  },

  create: function() {

      //create the sprites and position them
      this.cat1 = game.add.sprite(0, 0, 'cat_happy');
      this.cat1.x = this.x + this.width / 2 + 70;
      this.cat1.y = this.y + this.height / 2;
      this.cat1.scale.x = 0.5;
      this.cat1.scale.y = 0.5;
      this.cat2 = game.add.sprite(0, 0, 'cat_stomachache');
      this.cat2.x = this.x + this.width / 2 + 70;
      this.cat2.y = this.y + this.height / 2;
      this.cat2.scale.x = 0.5;
      this.cat2.scale.y = 0.5;
      this.cat3 = game.add.sprite(0, 0, 'cat_thirsty');
      this.cat3.x = this.x + this.width / 2 + 70;
      this.cat3.y = this.y + this.height / 2;
      this.cat3.scale.x = 0.5;
      this.cat3.scale.y = 0.5;
      this.cat4 = game.add.sprite(0, 0, 'cat_unhealthy');
      this.cat4.x = this.x + this.width / 2 + 70;
      this.cat4.y = this.y + this.height / 2;
      this.cat4.scale.x = 0.5;
      this.cat4.scale.y = 0.5;

      //create the sprites and position them
      this.monkey1 = game.add.sprite(0, 0, 'monkey_1');
      this.monkey1.x = this.x + this.width / 2 - 100;
      this.monkey1.y = this.y + this.height / 2;
      this.monkey1.scale.x = 0.5;
      this.monkey1.scale.y = 0.5;
      this.monkey2 = game.add.sprite(0, 0, 'monkey_2');
      this.monkey2.x = this.x + this.width / 2 - 100;
      this.monkey2.y = this.y + this.height / 2;
      this.monkey2.scale.x = 0.5;
      this.monkey2.scale.y = 0.5;
      this.monkey3 = game.add.sprite(0, 0, 'monkey_sis');
      this.monkey3.x = this.x + this.width / 2 + 100;
      this.monkey3.y = this.y + this.height / 2 + 160;
      this.monkey3.scale.x = 0.5;
      this.monkey3.scale.y = 0.5;
      this.monkey3.rotation = - Math.PI / 2;
      this.monkey4 = game.add.sprite(0, 0, 'monkey_sis');
      this.monkey4.x = this.x + this.width / 2 + 100;
      this.monkey4.y = this.y + this.height / 2 + 160;
      this.monkey4.scale.x = 0.5;
      this.monkey4.scale.y = 0.5;
      this.monkey4.rotation = - Math.PI / 2;

      // create the background group to exist across the different dialogue stages
      this.background = new Phaser.Group(this.game, null, 'background', true);
      this.house_scene_1 = this.background.create(0, 0, 'house_scene_1');
      this.house_scene_1.scale.x = 0.5
      this.house_scene_1.scale.y = 0.5
     
      this.house_scene_2 = this.background.create(0, 0, 'house_scene_2');
      this.house_scene_2.scale.x = 0.5
      this.house_scene_2.scale.y = 0.5

      this.hospital_room = this.background.create(0, 0, 'hospital_room');
      this.hospital_room.scale.x = 0.5;
      this.hospital_room.scale.y = 0.5;

      var cat1 = new Phaser.Group(this.game, null, 'cat1', true);
      cat1.visible = false;
      var cat2 = new Phaser.Group(this.game, null, 'cat2', true);
      cat2.visible = false;
      var cat3 = new Phaser.Group(this.game, null, 'cat3', true);
      cat3.visible = false;
      var cat4 = new Phaser.Group(this.game, null, 'cat4', true);
      cat4.visible = false;
      var monkey1 = new Phaser.Group(this.game, null, 'monkey1', true);
      monkey1.visible = false;
      var monkey2 = new Phaser.Group(this.game, null, 'monkey2', true);
      monkey2.visible = false;

      //set up the groups for each dialogue stage
      cat1.add(this.cat1);
      cat2.add(this.cat2);
      cat3.add(this.cat3);
      cat4.add(this.cat4);

      monkey1.add(this.monkey1);
      monkey2.add(this.monkey2);
      monkey1.add(this.monkey3);
      monkey2.add(this.monkey4);

      doctorGroup = new Phaser.Group(this.game, null, 'doctorGroup', true);

      this.doctor = doctorGroup.create(0, 0, 'giraffe_doctor');
      this.doctor.x = this.x + this.width / 2 + 210;
      this.doctor.y = this.y + 150;
      this.doctor.scale.x = -0.5;

      this.doctor.scale.y = 0.5;
      
      doctorGroup.visible = false;

      this.symptomsGroup = new Phaser.Group(this.game, null, 'symptomsGroup', true);

      if (this.game.playerData.doctorMinigameState != DoctorMinigame.StateEnum.NOT_INITIATED) {
        //create symptoms list to be shown
        console.log('made button')
        this.symptomsListButton = game.add.button(726, 5, "symptoms_button", showSymptoms, this);
        this.symptomsGroup.add(this.symptomsListButton);
        this.symptomsGroup.bringToTop(this.symptomsListButton);
        this.symptomsGroup.visible = true;
      }

      function showSymptoms(button){
        button.destroy();
        this.symptomsListButton = game.add.button(726, 5, "symptoms_button", hideSymptoms, this);
        this.symptomsGroup.add(this.symptomsListButton);
        this.symptomsGroup.bringToTop(this.symptomsListButton);
        this.symptomsList = game.add.sprite(0, 0, "symptoms_list");
        this.symptomsGroup.add(this.symptomsList);
        this.symptomsGroup.bringToTop(this.symptomsList);
      }

      function hideSymptoms(button){
        this.symptomsList.destroy();
        button.destroy();
        this.symptomsListButton = game.add.button(726, 5, "symptoms_button", showSymptoms, this);
        this.symptomsGroup.add(this.symptomsListButton);
        this.symptomsGroup.bringToTop(this.symptomsListButton);
      }

      var doctorPreDialogue = new Dialogue(
        [{text: "Oh dear, I seem to have run out of paper!",
        group: doctorGroup}],
        [{text: "I\'ll see if I can find some for you Dr. Akwasi!",
          nextState: DoctorMinigame.StateEnum.NOT_INITIATED
        }]
      );

      var doctorDialogue1 = new Dialogue(
        [{text: 'Hi Kojo, you have some paper for me? That\'s great! Now I can get back to helping my patients.', 
          group: doctorGroup},
         {text: 'I have been getting quite a few patients lately! It must ' +
         'be related to this monster incident that everyone\'s been talking about.', 
          group: doctorGroup},
         {text: 'Sadly, I was not able to help them all. If they had only showed up ' +
         'earlier, I could have given them proper treatment!', 
          group: doctorGroup}],
        [{text: 'Oh no! Is there anything I can do to help?',
          dialogue: new Dialogue(
            [{text: 'Hmmm... Just to be safe, Kojo, can you go and check how your friends are feeling? '
             , group: doctorGroup}],
            [{
               text: 'Yes, I\'m curious to know what is happening.',
               dialogue: new Dialogue(
                [{text: 'I\'ll give you this list of symptons to look out for. ' + 
                'If they show some or all of these symptoms, tell them to come to me right away!',
                nextState: DoctorMinigame.StateEnum.INITIATED
                }])
             },
             {
               text: 'No, I have other things to investigate.',
               nextState: DoctorMinigame.StateEnum.NOT_INITIATED
             }
            ]
          )
         }
        ]
      );

      var dialogue1 = new Dialogue([],
        [{text: DoctorMinigameDialogues.player_npc1_player_1, 
          group: cat1,
          dialogue: new Dialogue(
            [{text:DoctorMinigameDialogues.player_npc1_npc1_1, 
            group:cat2}],
            [{text:DoctorMinigameDialogues.player_npc1_player_2, 
            group:cat2,
            dialogue: new Dialogue(
              [{text:DoctorMinigameDialogues.player_npc1_npc1_2, 
              group:cat2}],
              [{text:DoctorMinigameDialogues.player_npc1_player_3, 
              group:cat2,
              dialogue: new Dialogue(
                [{text:DoctorMinigameDialogues.player_npc1_npc1_3, 
                group:cat3}],
                [{text:DoctorMinigameDialogues.player_npc1_player_4, 
                group:cat4,
                dialogue: new Dialogue(
                  [{text:DoctorMinigameDialogues.player_npc1_npc1_4, 
                  group:cat2,
                  nextState:DoctorMinigame.StateEnum.SPOKE_NPC1}]
                )}]
              )}]
            )}]
          )
        }]
      );

      var dialogue2 = new Dialogue([],
        [{text:DoctorMinigameDialogues.player_npc2_player_1, 
          group:monkey1,
          dialogue: new Dialogue(
            [{text:DoctorMinigameDialogues.player_npc2_npc2_1, 
            group:monkey1}],
            [{text:DoctorMinigameDialogues.player_npc2_player_2, 
            group:monkey2,
            dialogue: new Dialogue(
              [{text:DoctorMinigameDialogues.player_npc2_npc2_2, 
              group:monkey2}],
              [{text:DoctorMinigameDialogues.player_npc2_player_3, 
              group:monkey2,
              dialogue: new Dialogue(
                [{text:DoctorMinigameDialogues.player_npc2_npc2_3, 
                group:monkey1}],
                [{text:DoctorMinigameDialogues.player_npc2_player_4, 
                group:monkey1,
                dialogue: new Dialogue(
                  [{text:DoctorMinigameDialogues.player_npc2_npc2_4, 
                  group:monkey1,
                  nextState:DoctorMinigame.StateEnum.SPOKE_NPC2}]
                )}]
              )}]
            )}]
          )
        }]
      );

      var doctorDialogue2 = new Dialogue(
        [{text:DoctorMinigameDialogues.player_doctor_doctor_1, 
          group:doctorGroup,
          nextState: DoctorMinigame.StateEnum.FINISHED
        }]
      );

      function startPreDoctorDialogue(result) {
        // assign the global dialogue
        result.dialogueView.game.playerData.dialogue = doctorPreDialogue;

        // show the dialogue view on screen
        result.dialogueView.create();
      }

      function startFirstDoctorDialogue(result) {
        // assign the global dialogue
        result.dialogueView.game.playerData.dialogue = doctorDialogue1;

        // show the dialogue view on screen
        result.dialogueView.create();
      }

      function startNPC1Dialogue(result) {
        // assign the global dialogue
        result.dialogueView.game.playerData.dialogue = dialogue1;

        // show the dialogue view on screen
        result.dialogueView.create();
      }

      function startNPC2Dialogue(result) {
        result.dialogueView.game.playerData.dialogue = dialogue2;
        result.dialogueView.create();
      }

      function startFinishedDoctorDialogue(result) {
        // assign the global dialogue
        result.dialogueView.game.playerData.dialogue = doctorDialogue2;

        // show the dialogue view on screen
        result.dialogueView.create();
      }

      var returnToVillageState = (function(state) {
        return function(result) {
          state.background.visible = false;
          state.symptomsGroup.visible = false;

          // update the player data for this convo
          // nextState is normally used as a literal next state for the game to start,
          // but here we are using it to simply update the player data
          if (result.nextState) {
            state.updateMinigameState(state.game, result.nextState);
          }

          result.dialogueView.game.state.start('villageState');
        }
      })(this);
     
      // create the dialogue view
      this.dialogueView = new DialogueView(this.game, returnToVillageState);

      switch(this.game.playerData.doctorMinigameState) {
        case DoctorMinigame.StateEnum.NOT_INITIATED:
          if (this.game.playerData.buildingJustEntered == VillageState.BuildingEnum.HOSPITAL) {
            if (this.game.playerData.inventory.paper) {
              // start first doctor convo
              this.hospital_room.bringToTop();
              startFirstDoctorDialogue({dialogueView: this.dialogueView});
            }
            else {
              // tell player to find paper
              this.hospital_room.bringToTop();
              startPreDoctorDialogue({dialogueView: this.dialogueView});
            }
          }
          else {
            // needs to enter hospital first, so just send back to village
            returnToVillageState({dialogueView: this.dialogueView});
          }
          break;

        case DoctorMinigame.StateEnum.INITIATED:
          if (this.game.playerData.buildingJustEntered == VillageState.BuildingEnum.HOUSE_2) {
            // start first npc convo
            this.house_scene_1.bringToTop();
            this.symptomsListButton.bringToTop();
            startNPC1Dialogue({dialogueView: this.dialogueView});
          }
          else if (this.game.playerData.buildingJustEntered == VillageState.BuildingEnum.HOUSE_3) {
            // start second npc convo
            this.house_scene_2.bringToTop();
            this.symptomsListButton.bringToTop();
            startNPC2Dialogue({dialogueView: this.dialogueView});
          }
          else {
            // needs to talk to both NPC's first, so send back to village
            returnToVillageState({dialogueView: this.dialogueView});
          }
          break;

        case DoctorMinigame.StateEnum.SPOKE_NPC1:
          if (this.game.playerData.buildingJustEntered == VillageState.BuildingEnum.HOUSE_2) {
            // already spoke to NPC1, send back to village
            returnToVillageState({dialogueView: this.dialogueView});
          }
          else if (this.game.playerData.buildingJustEntered == VillageState.BuildingEnum.HOUSE_3) {
            // start second npc convo
            this.house_scene_2.bringToTop();
            startNPC2Dialogue({dialogueView: this.dialogueView});
          }
          else {
            // needs to talk to both NPC's first, so send back to village
            returnToVillageState({dialogueView: this.dialogueView});
          }
          break;

        case DoctorMinigame.StateEnum.SPOKE_NPC2:
          if (this.game.playerData.buildingJustEntered == VillageState.BuildingEnum.HOUSE_2) {
            // start first npc convo
            this.house_scene_1.bringToTop();
            startNPC1Dialogue({dialogueView: this.dialogueView});
          }
          else if (this.game.playerData.buildingJustEntered == VillageState.BuildingEnum.HOUSE_3) {
            // already spoke to NPC2, send back to village
            returnToVillageState({dialogueView: this.dialogueView});
          }
          else {
            // needs to talk to both NPC's first, so send back to village
            returnToVillageState({dialogueView: this.dialogueView});
          }
          break;

        case DoctorMinigame.StateEnum.SPOKE_BOTH:
          if (this.game.playerData.buildingJustEntered == VillageState.BuildingEnum.HOUSE_2) {
            // already spoke to NPC1, send back to village
            returnToVillageState({dialogueView: this.dialogueView});
          }
          else if (this.game.playerData.buildingJustEntered == VillageState.BuildingEnum.HOUSE_3) {
            // already spoke to NPC2, send back to village
            returnToVillageState({dialogueView: this.dialogueView});
          }
          else {
            // start final doctor dialogue
            this.hospital_room.bringToTop();
            startFinishedDoctorDialogue({dialogueView: this.dialogueView});
          }
          break;
        case DoctorMinigame.StateEnum.FINISHED:
          // start final doctor dialogue
          this.hospital_room.bringToTop();
          startFinishedDoctorDialogue({dialogueView: this.dialogueView});
          break;
        default:
          throw new Error("Error in doctorMinigameState");
      }

      /* storyboard structure, still here just incase it is useful later
      // var second = new Phaser.Group(this.game, null, 'second', true);
      // second.add(this.cat2);
      // var third = new Phaser.Group(this.game, null, 'third', true);
      // third.add(this.cat3);
      // var fourth = new Phaser.Group(this.game, null, 'fourth', true);
      // fourth.add(this.cat4);
      // var firstScreen = new StoryboardScreen(start, dialogue1);
      // var secondScreen = new StoryboardScreen(second);
      // var thirdScreen = new StoryboardScreen(third);
      // var fourthScreen = new StoryboardScreen(fourth);
      // firstScreen.addNext(secondScreen);
      // secondScreen.addNext(thirdScreen);
      // thirdScreen.addNext(fourthScreen);
      // firstScreen.show();
      */
  },
  
  update: function() {

  },

  updateMinigameState: function(game, enumState) {
    if (enumState == DoctorMinigame.StateEnum.SPOKE_NPC1) {
      if (game.playerData.doctorMinigameState == DoctorMinigame.StateEnum.INITIATED) {
        game.playerData.doctorMinigameState = enumState;
      }
      else if (game.playerData.doctorMinigameState == DoctorMinigame.StateEnum.SPOKE_NPC2) {
        game.playerData.doctorMinigameState = DoctorMinigame.StateEnum.SPOKE_BOTH;
      }
    }
    else if (enumState == DoctorMinigame.StateEnum.SPOKE_NPC2) {
      if (game.playerData.doctorMinigameState == DoctorMinigame.StateEnum.INITIATED) {
        game.playerData.doctorMinigameState = enumState;
      }
      else if (game.playerData.doctorMinigameState == DoctorMinigame.StateEnum.SPOKE_NPC1) {
        game.playerData.doctorMinigameState = DoctorMinigame.StateEnum.SPOKE_BOTH;
      }
    }
    else if (enumState == DoctorMinigame.StateEnum.INITIATED) {
      if (game.playerData.doctorMinigameState == DoctorMinigame.StateEnum.NOT_INITIATED) {
        game.playerData.doctorMinigameState = enumState;
        game.playerData.inventory.paper = false;
        game.playerData.completedGames.list = true;
      }
    }
    else if (enumState == DoctorMinigame.StateEnum.FINISHED) {
      if (game.playerData.doctorMinigameState == DoctorMinigame.StateEnum.SPOKE_BOTH) {
        game.playerData.doctorMinigameState = enumState;
      }
    }
  },
}
