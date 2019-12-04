var config = {
    type: Phaser.AUTO,
    width: 720,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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
    this.load.image('ground', 'img/tile2.png');
    this.load.spritesheet('hero', 'img/herof.png', { frameWidth: 55, frameHeight: 95 });
}


function create () {
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground');
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'hero');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

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
        player.setVelocityY(-330);
    }
}