function Ship(game) {
    this.game = game;
    this.boundsWidth = 800;
    this.boundsHeight = 600;
    this.health = 50;
    this.shipWidth = 160;
    this.shipHeight = 60;
    this.laserWidth = 200;
    this.laserHeight = 20;
    Phaser.Sprite.call(this, game, this.boundsWidth, Math.floor(Math.random() *
               (this.boundsHeight - this.shipHeight + 1)), 'ship');
               this.game.physics.arcade.enable(this);
    this.anchor.setTo(.5, .5);
    this.enableBody = true;
    this.userControlled = false;
    this.body.setSize(this.width - 30, this.height - 20, 0, 0);

    this.body.velocity.x = -50;
    this.facingLeft = true;
    this.inputEnabled = false;
    this.body.immovable = true;

}

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.update = function() {
    if(this.health <= 0) {
        this.alive = false;
        explosion_gen.explode(this.x, this.y, 250, 250);
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
		offsetX: this.x+3
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
        this.userControlled = false;
        this.body.gravity.y = 500;
    } else {
        this.userControlled = true;
        this.body.velocity.x = 0;
        this.scale.x *= -1;
        this.game.camera.follow(this);
    }
}

Ship.prototype.shoot = function() {
    x = this.position.x;
    y = this.position.y;
    laser = lasers.create(x, y, 'laser');
    laser.scale.set(.75,.75)
    laser.body.velocity.x = 800;
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
