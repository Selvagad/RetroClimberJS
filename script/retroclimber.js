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
        disableWebAudio: true //Allow to stop the music when we are not on the page
    }
};

var game = new Phaser.Game(config);

var player;
var platforms;
var cursors;
var keys;
var music;
var ennemy;
var sens = 0;
var vie = 3;

function preload () {
    this.load.image('sky', 'img/sky3.jpg');
    this.load.image('ground', 'img/tile1.png');
    this.load.image('groundf', 'img/groundf.png');
    this.load.image('murv', 'img/murv.png');
    this.load.image('clef', 'img/cl.png');
    // this.load.spritesheet('hero', 'img/herof.png', { frameWidth: 54.6, frameHeight: 95 });
    this.load.spritesheet('hero1', 'img/3.png', { frameWidth: 30, frameHeight: 36 });
    this.load.spritesheet('mechant','img/mechant.png', { frameWidth: 30, frameHeight: 40 });
    this.load.audio('miami', 'img/miamisong.mp3');
}


function create () {
    var score = 0;

    music = this.sound.add('miami');
    music.play();
    
    //This allow the camera to go lower
    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    //Center the camera to the bottom
    this.cameras.main.scrollY = 505;

    platforms = this.physics.add.staticGroup();
    platforms.create(50, 200, 'ground');
    
    platforms.create(400, 520, 'ground');
    platforms.create(450, 520, 'ground');
    
    platforms.create(150, 720, 'ground');
    platforms.create(200, 720, 'ground');
    
    platforms.create(250, 910, 'ground');
    platforms.create(300, 910, 'ground');

    platforms.create(50, 1150, 'ground');
    platforms.create(500, 1150, 'ground');
    
    platforms.create(350, 1280, 'groundf');
    platforms.create(350, 0, 'groundf');

    platforms.create(-15, 620, 'murv');
    platforms.create(615, 620, 'murv');

    player = this.physics.add.sprite(20, 1200, 'hero1');
    player.setBounce(0.1);

    //if true the sprites is locked at 800px and can't go to the bottom
    player.setCollideWorldBounds(false);
    ennemy = this.physics.add.sprite(20, 1100, 'mechant');
    ennemy.body.setAllowGravity(false);
    // this.physics.add.collider(ennemy,platforms);
    ennemy.setBounce(1).setFriction(0);
    this.physics.add.collider(player, platforms);
    this.physics.add.overlap(player, ennemy, hitBird, null, this);

    function hitBird(){
        switch (vie) {
            case 3:
              vie = 2;
              vieText.setText('Vie : ' + vie);
              break;
            case 2:
              vie = 1;
              vieText.setText('Vie : ' + vie);
              break;
            case 1:
              vie = 0;
              vieText.setText('Vie : ' + vie);
              break;
          }
    }

    keys = this.physics.add.group([{
        key: 'clef',
        setXY: { x: 50, y: 900}
    },
    {
        key: 'clef',
        setXY: { x: 400, y: 900 }
    }]);
    this.physics.add.collider(keys, platforms);
        
    keys.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.overlap(player, keys, collectKey, null, this);

    function collectKey (player, key) {
        key.disableBody(true, true);
        score += 1;
        scoreText.setText('Clés: ' + score);
    }   
    espace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    scoreText = this.add.text(5, 10).setText('Clés : 0').setScrollFactor(0);
    vieText = this.add.text(5, 25).setText('Vie : 3').setScrollFactor(0);

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
    
    ennemy.anims.play('go', true);
    ennemy.setVelocityX(200);

    cursors = this.input.keyboard.createCursorKeys();
}

function update () {
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
    //lock player between left border
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
        // player.setVelocityY(-770);
        player.setVelocityY(-1500);

    }

    //Limit the scrollY camera to the limit of the game
    if(player.y>400 && player.y<910){
        this.cameras.main.scrollY = player.y -400;
    }
}