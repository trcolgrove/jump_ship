function Ship(game, x, y, key, frame) {
    this.game = game;
    this.health = 50;
    this.shipHeight = 60;

    this.nextShotAt = game.time.now + 5;

    Phaser.Sprite.call(this, game, x, y, key);
    this.game.physics.arcade.enable(this);

    this.frame = frame; //set the ship to enemy contolled frame
    this.anchor.setTo(.5, .5);
    this.enableBody = true;
    this.userControlled = false;
    this.body.setSize(this.width - 30, this.height - 20, 0, 0);

    //this.body.velocity.x = -50;
    this.facingLeft = true;
    this.inputEnabled = false;
    this.body.immovable = true;
    this.collideWorldBounds = false;
    if(key == "ship") {
        this.laserSprite = 'green_laser';

    } else if(key == "destroyer") {
        this.laserSprite = 'yellow_laser';
    }
}

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.update = function() {
    if(this.alive == false && this.y >= (this.game.height - 30)) {
        explosion_gen.explode(this.x, this.y, 250, 250);
        this.destroy();
    }
    if(this.health <= 0) {
        this.alive = false;
        explosion_gen.explode(this.x, this.y, 250, 250);
        if(this.userControlled) {
            this.swapControl();
            player.swapControl();
        }
        this.destroy();
        return;
    }
}

Ship.prototype.hit = function(damage) {
    this.health -= damage;
    this.shake();
}

Ship.prototype.shake = function() {
    shakeTween = game.add.tween(this);
    shakeTween.to({
		x: this.x+3
	}, 10, Phaser.Easing.Cubic.None);
	shakeTween.to({
		x: this.x-3
	}, 10, Phaser.Easing.Cubic.None);
	shakeTween.to({
		x: this.x+3
	}, 10, Phaser.Easing.Cubic.None);
	shakeTween.to({
		x: this.x-3
	}, 10, Phaser.Easing.Cubic.None);
	shakeTween.to({
		x: this.x+3
	}, 10, Phaser.Easing.Cubic.None);
    shakeTween.to({
		x: this.x-3
	},10, Phaser.Easing.Cubic.None);
	shakeTween.start();
}

Ship.prototype.swapControl = function() {
    if (this.userControlled) {
        this.frame = 0;
        this.userControlled = false;
        this.body.gravity.y = 500;
        this.alive = false;
    } else {
        this.frame = 1;
        this.userControlled = true;
        this.body.velocity.x = 0;
        this.scale.x *= -1;
        this.game.camera.follow(this);
    }
}

Ship.prototype.shoot = function() {
    ship_laser_sound.play();
    x = this.position.x;
    y = this.position.y;
    laser = lasers.create(x, y, this.laserSprite);
    laser.scale.set(.75,.75);
    if(this.userControlled) {
        laser.body.velocity.x = 800;
    } else {
        laser.scale.x *= -1;
        laser.body.velocity.x = -800;
    }
}

Ship.prototype.move = function() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if (controls.left.isDown) {
        this.facingLeft = true;
        this.body.velocity.x = -150;
    }
    if (controls.right.isDown) {
        this.facingLeft = false;
        this.body.velocity.x = 150;
    }
    if (controls.up.isDown) {
        this.body.velocity.y = -150;
    }
    if (controls.down.isDown) {
        this.body.velocity.y = 150;
    }
}
