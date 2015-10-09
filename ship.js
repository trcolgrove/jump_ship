function Ship(game) {
    this.game = game;
    this.boundsWidth = 800;
    this.boundsHeight = 600;
    this.ships;
    this.shipWidth = 160;
    this.shipHeight = 60;
    this.lasers;
    this.laserWidth = 200;
    this.laserHeight = 20;
    Phaser.Sprite.call(this, game, this.boundsWidth, Math.floor(Math.random() *
               (this.boundsHeight - this.shipHeight + 1)), 'ship');
               this.game.physics.arcade.enable(this);
    this.anchor.setTo(.5, .5);
    this.cursors;
    this.fireLaserKey;   // Space bar
    this.enableBody = true;
    this.userControlled = false;
    this.lasers = game.add.group();
    this.lasers.enableBody = true;
    this.body.setSize(this.width, this.height - 50, 0, 0);
    this.cursors = game.input.keyboard.createCursorKeys();
    this.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
    this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.wasd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };
    this.body.velocity.x = -50;
    this.facingLeft = true;
    this.inputEnabled = false;
    this.body.immovable = true;

}

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.swapControl = function() {
    if (this.userControlled) {
        console.log("aaaaaa");
        this.userControlled = false;
        this.body.gravity.y = 500;
    } else {
        this.userControlled = true;
        this.body.velocity.x = 0;
        game.camera.unfollow(player);
        this.scale.x *= -1;
        this.game.camera.follow(this);
    }
}

Ship.prototype.shoot = function() {
    x = this.position.x;
    y = this.position.y;
    laser = this.lasers.create(x, y, 'laser');
    laser.scale.set(.75,.75)
    laser.body.velocity.x = 800;
}

Ship.prototype.move = function() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if (this.wasd.left.isDown) {
        this.facingLeft = true;
        this.body.velocity.x = -150;
    }
    if (this.wasd.right.isDown) {
        this.facingLeft = false;
        this.body.velocity.x = 150;
    }
    if (this.wasd.up.isDown) {
        this.body.velocity.y = -150;
    }
    if (this.wasd.down.isDown) {
        this.body.velocity.y = 150;
    }
}
