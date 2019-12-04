var config = {
    type: Phaser.AUTO,
    width: 720,
    height: 1280,
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
    this.load.spritesheet('hero', 'img/herof.png', { frameWidth: 55, frameHeight: 95 });
}


function create () {
    //this.cameras.main.setBounds(0, 0, 720, 1280).setName('main');
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

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

    player = this.physics.add.sprite(100, 450, 'hero');
    player.y=0;
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
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
    if (cursors.left.isDown)  {
        player.setVelocityX(-200);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
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

    this.cameras.main.scrollY = player.y -400;
}