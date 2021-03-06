function Ship(game, x, y, key, frame) {
    this.game = game;
    this.autoCull = true;
    this.maxHealth = 50;
    this.startTime = game.time.now;
    this.health = 50;
    this.shipHeight = 60;
    this.path = [{x: 0, y: 0}];
    this.pathIndx = 0;
    this.nextShotAt = game.time.now + 5;
    this.origin = null;
    this.targetPosition = {x: x, y: y};
    Phaser.Sprite.call(this, game, x, y, key);
    this.game.physics.arcade.enable(this);
    this.frame = frame; //set the ship to enemy contolled frame
    this.anchor.setTo(.5, .5);
    this.enableBody = true;
    this.userControlled = false;
    this.body.setSize(this.width - 30, this.height - 20, 0, 0);

    this.facingLeft = true;
    this.inputEnabled = false;
    this.body.immovable = true;
    this.collideWorldBounds = false;
    if(key == "ship") {
        this.laserSprite = 'red_laser_double';

    } else if(key == "destroyer") {
        this.laserSprite = 'green_laser';
    }

    this.healthBar = new HealthBar(game, this);
    game.add.existing(this.healthBar);

    this.healthBarRed = new HealthBarRed(game, this.healthBar, this);
    game.add.existing(this.healthBarRed);
}

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.kill = function() {
    this.alive = false;
    explosion_gen.explode(this.x, this.y, 250, 250);
    this.destroy();
    this.healthBar.destroy();
    this.healthBarRed.destroy();
}

Ship.prototype.update = function() {

    if(this.alive == false && this.y >= (this.game.height - 30)) {
        this.kill();
    }
    else if(this.health <= 0) {
        if(this.userControlled) {
            this.swapControl();
            player.swapControl();
        }
        this.kill();
        return;
    }

    if(game.time.now - this.startTime > 1000 && !this.userControlled) {
        this.updatePosition();
    }
}

Ship.prototype.updatePosition = function() {

    if(this.origin == null) {
        this.y += 50;
        this.origin = {x: this.x, y: this.y};
        this.pathIndx = 0;
        this.targetPosition.x = this.origin.x;
        this.targetPosition.y = this.origin.y;
    }

    if(this.position.distance(this.targetPosition) <= 100) {
        this.targetPosition.x = this.path[this.pathIndx].x + this.origin.x;
        this.targetPosition.y = this.path[this.pathIndx].y + this.origin.y;

        this.pathIndx = (this.pathIndx + 1) % this.path.length;

        this.game.physics.arcade.moveToObject(
            this,
            this.targetPosition,
            50,
            null
        );
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
    var friendly = this.userControlled;
    var x = this.position.x;
    var y = this.position.y;
    ship_laser_sound.play();
    laser = new Laser(this.game, x, y, this.laserSprite, friendly);
    game.add.existing(laser);
    lasers.add(laser);
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
