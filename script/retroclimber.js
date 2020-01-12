var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: true //Allow to stop the music when we are not on the game window
    }
};

var game = new Phaser.Game(config);

//create global variables
var player;
var platforms;
var cursors;
var keys;
var music;
var ennemy;
var sens = 0;
var vie = 3;
var mechants;
var self;
var gameOverText;
var gagneText;
var score = 0;

//function which load all the medias
function preload () {
    this.load.image('sky', 'img/sky3.jpg');
    this.load.image('ground', 'img/tile1.png');
    this.load.image('groundf', 'img/groundf.png');
    this.load.image('murv', 'img/murv.png');
    this.load.image('clef', 'img/cl.png');
    this.load.image('porte', 'img/porte.png');
    this.load.spritesheet('hero1', 'img/3.png', { frameWidth: 30, frameHeight: 36 });
    this.load.spritesheet('mechant','img/mechant.png', { frameWidth: 30, frameHeight: 40 });
    this.load.audio('miami', 'sound/miamisong.mp3');
    this.load.audio('bruit_hit', 'sound/bruit_hit.wav');
}


function create () {
    //Theme song
    music = this.sound.add('miami');
    music.play();
    
    //This allow the camera to go lower
    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    //Center the camera to the bottom
    this.cameras.main.scrollY = 505;

    //Create the platforms on which the hero will walk on
    platforms = this.physics.add.staticGroup();
    platforms.create(50, 200, 'ground');
    platforms.create(550, 210, 'ground');
    platforms.create(500, 210, 'ground');

    
    platforms.create(300, 300, 'ground');
    platforms.create(350, 300, 'ground');
    platforms.create(400, 300, 'ground');

    platforms.create(80, 430, 'ground');
    platforms.create(130, 430, 'ground');
    platforms.create(180, 430, 'ground');

    platforms.create(350, 480, 'ground');
   
    platforms.create(400, 520, 'ground');
    platforms.create(450, 520, 'ground');

    platforms.create(270, 575, 'ground');

    platforms.create(20, 650, 'ground');
    platforms.create(70, 650, 'ground');
    platforms.create(120, 650, 'ground');
    
    platforms.create(150, 780, 'ground');//
    platforms.create(200, 780, 'ground');

    platforms.create(500, 890, 'ground');
    platforms.create(550, 890, 'ground');

    platforms.create(370, 810, 'ground');
    platforms.create(370, 860, 'ground');
    platforms.create(370, 910, 'ground');
    platforms.create(370, 960, 'ground');
    platforms.create(370, 1010, 'ground');
    platforms.create(370, 1060, 'ground');
    platforms.create(370, 1210, 'ground');

    
    platforms.create(250, 910, 'ground');
    platforms.create(300, 910, 'ground');
    
    platforms.create(450, 1010, 'ground');//

    platforms.create(170, 1020, 'ground');


    platforms.create(80, 1150, 'ground');
    platforms.create(130, 1150, 'ground');

    platforms.create(500, 1150, 'ground');
    
    //create the border at the top and the bottom
    platforms.create(350, 1280, 'groundf');
    platforms.create(350, 0, 'groundf');

    //create the border at the left and the right
    platforms.create(-15, 620, 'murv');
    platforms.create(615, 620, 'murv');

    //Create the door
    porte = this.physics.add.image(525,145, 'porte');
    porte.body.setAllowGravity(false);

    //Create the hero
    player = this.physics.add.sprite(20, 1200, 'hero1');
    player.setBounce(0.1);

    //if true the sprites is locked at 800px and can't go to the bottom
    player.setCollideWorldBounds(false);

    //create a var ennemy which will be the reference for the mechants movements
    ennemy = this.physics.add.sprite(20, 50, 'mechant');
    ennemy.body.setAllowGravity(false);
    
    //launch the reference birds
    ennemy.setVelocityX(200);
    ennemy.setVisible(true);
    
    //add a collider to allow the hero to walk on platforms otherwise, he will go through
    this.physics.add.collider(player, platforms);
    //add a property to lauch the end of the game if we win
    this.physics.add.overlap(player, porte, gagne, null, this);

    //create the keys
    keys = this.physics.add.group([{
        key: 'clef',
        setXY: { x: 90, y: 1100}
    },
    {
        key: 'clef',
        setXY: { x: 460, y: 960 }
    },
    {
        key: 'clef',
        setXY: { x: 155, y: 725 }
    },
    {
        key: 'clef',
        setXY: { x: 345, y: 420 }
    }

]);
    this.physics.add.collider(keys, platforms);
    
    //set a little bounce to all the keys
    keys.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    //allow the hero to collect the keys
    this.physics.add.overlap(player, keys, collectKey, null, this);

    //create a group of birds
    mechants = this.physics.add.group();
    for(var i=0; i<10; i++){
        if(i==1){
            mechants.add(this.physics.add.sprite(30, 180, 'mechant'));
        }else if(i==2){
            mechants.add(this.physics.add.sprite(30, 350, 'mechant'));  
        }else if(i==3){
            mechants.add(this.physics.add.sprite(30, 450, 'mechant'));
        }
        else if(i==6){
            mechants.add(this.physics.add.sprite(30, 180, 'mechant'));
        }
        else{
            mechants.add(this.physics.add.sprite(30, 50+200*i, 'mechant'));
        }
    }
   
    // espace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    scoreText = this.add.text(10, 10).setText('Clés : 0').setScrollFactor(0);
    vieText = this.add.text(10, 25).setText('Vie : 3').setScrollFactor(0);
    gameOverText = this.add.text(190, 350,'Game Over', {fontFamily: '"Agency FB"', fontSize: '60px', fill: '#FFF'}).setScrollFactor(0).setVisible(false);
    gagneText = this.add.text(210, 350,'You Win', {fontFamily: '"Agency FB"', fontSize: '60px', fill: '#FFF'}).setScrollFactor(0).setVisible(false);

    //create animations for the hero when he goes left and right and for the birds
    this.anims.create({
        key:'go',
        frames: this.anims.generateFrameNumbers('mechant', { start: 0, end: 2 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key:'gor',
        frames: this.anims.generateFrameNumbers('mechant', { start: 3, end: 5 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('hero1', { start: 3, end: 5 }),
        frameRate: 9,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'hero1', frame: 0 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('hero1', { start: 0, end: 2 }),
        frameRate: 9,
        repeat: -1
    });
    self = this;
    ennemy.anims.play('go');

    //add bird group's properties
    mechants.children.iterate(function(child){
        self.physics.add.collider(child,platforms);
        child.body.setAllowGravity(false);
        child.anims.play('go', true);
        child.setVelocityX(200);
        self.physics.add.overlap(player, child, hitBird, null, self)
    }); 

    cursors = this.input.keyboard.createCursorKeys();
}

//when the hero pick a key up
function collectKey (player, key) {
    key.disableBody(true, true);
    score += 1;
    scoreText.setText('Clés: ' + score);
}

//when the hero touch the door with all the keys
function gagne(){
    setTimeout(() => {
        if(score==4){
            self.physics.pause();
            gagneText.setVisible(true);
        } 
    }, 200); //timeout to let hero touch the center of the door
    
}

//when the hero touch a bird, he left a life
function hitBird(player,piaf){
    this.sound.play('bruit_hit');
    piaf.disableBody(true,true);
    vie -=1;
    vieText.setText('Vie : ' + vie);
}

function update () {
    //if the hero doesn't have life anymore
    if(vie<=0){
        this.physics.pause();
        gameOverText.setVisible(true);
    }
    self = this;

    //make the birds turn when they meet the wall
     for(var i=0; i<mechants.getLength(); i++){
         if(sens == 0){
             mechants.getChildren()[i].anims.play('go', true);
             mechants.getChildren()[i].setVelocityX(200);
            //  if(this.physics.collide(mechants.getChildren()[i],platforms)){   
            //      sens+=1;
            //  }
         }else{
             mechants.getChildren()[i].anims.play('gor', true);
             mechants.getChildren()[i].setVelocityX(-200);
            //  if(this.physics.collide(mechants.getChildren()[i],platforms)){
            //      sens-=1;
            //  }
         }
     }
    //make the reference bird turn when it hit a wall and change the sens for the other birds
    if(sens == 0){
        ennemy.anims.play('go', true);
        ennemy.setVelocityX(200);
        if(this.physics.collide(ennemy,platforms)){   
            sens+=1;
        }
    }else{
        ennemy.anims.play('gor', true);
        ennemy.setVelocityX(-200);
        if(this.physics.collide(ennemy,platforms)){
            sens-=1;
        }
    }
    //make the player go to the left, right and to the top
    if (cursors.left.isDown && player.x > 15)  {
        player.setVelocityX(-200);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown && player.x < 575) {
        player.setVelocityX(200);
        player.anims.play('right', true);
    }
    else  {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down && player.y>36) {
        player.setVelocityY(-770);
        // player.setVelocityY(-1500);

    }

    //Limit the scrollY camera to the limit of the game
    if(player.y>400 && player.y<905){
        this.cameras.main.scrollY = player.y -400;
    }
}