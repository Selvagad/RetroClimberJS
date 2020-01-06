var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var player;
var platforms;
var cursors;

function preload () {
    this.load.image('sky', 'img/sky3.jpg');
    this.load.image('ground', 'img/tile1.png');
    this.load.image('groundf', 'img/groundf.png');
    this.load.image('clef', 'img/clef.png');
    this.load.spritesheet('hero', 'img/herof.png', { frameWidth: 54.6, frameHeight: 95 });
}


function create () {
    //this.cameras.main.setBounds(0, 0, 720, 1280).setName('main');
    //This allow the camera to go lower
    //this.cameras.main.setBounds(0, 0, 600, 1280);
    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    //Center the camera to the bottom
    this.cameras.main.scrollY = 505;
    
    clef = this.physics.add.staticGroup();
    clef.create(350,1100,'clef');

    platforms = this.physics.add.staticGroup();
    platforms.create(50, 250, 'ground');

    platforms.create(400, 540, 'ground');
    platforms.create(450, 540, 'ground');

    platforms.create(150, 720, 'ground');
    platforms.create(200, 720, 'ground');

    platforms.create(250, 910, 'ground');
    platforms.create(300, 910, 'ground');

    platforms.create(450, 1090, 'ground');
    platforms.create(500, 1090, 'ground');

    platforms.create(350, 1280, 'groundf');

    // platforms.create(800, 600, 'ground');
    // platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(20, 1200, 'hero');
    player.setBounce(0.1);

    //if true the sprites is locked at 800px and can't go to the bottom
    player.setCollideWorldBounds(false);
    this.physics.add.collider(player, platforms);
    espace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('hero', { start: 5, end: 9 }),
        frameRate: 9,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'hero', frame: 0 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 4 }),
        frameRate: 9,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
}

function update () {
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
    if (cursors.up.isDown && player.body.touching.down) {
        console.log(this);
        player.setVelocityY(-400);
    }

    //Limit the scrollY camera to the limit of the game
    if(player.y>400 && player.y<910){
        this.cameras.main.scrollY = player.y -400;
    }
}