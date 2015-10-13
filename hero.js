Comet = function(game) {

  Phaser.Sprite.call(this, game, 32, game.world.height - 600, 'dude');
  this.game = game;
  this.game.physics.arcade.enable(this);
  this.body.setSize(this.width - 45, this.height, -10, 0)
  this.anchor.setTo(.5, .5);

  this.numJumps = 0;
  this.direction = 0
  this.cursors = game.input.keyboard.createCursorKeys();
  this.MAX_JUMPS = 2;
  this.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.j_key = game.input.keyboard.addKey(Phaser.Keyboard.J);
  this.wasd = {
    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D)
  };
  this.body.bounce.y = 0;
  this.body.gravity.y = 500;
  this.body.collideWorldBounds = false;
  this.lasers = game.add.group();
  this.lasers.enableBody = true;
  //  Our two animations, walking left and right
  this.wasd.up.onDown.add(jumpCheck)
//  this.cursors.up.onDown.add(jumpCheck)
  this.space.onDown.add(shoot)
  this.animations.add('walk', [4, 5, 6, 7], 10, true);
  this.ship = null;
}

Comet.prototype = Object.create(Phaser.Sprite.prototype)
Comet.prototype.constructor = Comet;


Comet.prototype.update = function() {
  if(this.ship != null) {
    this.ship.move();
  } else {
    this.move();
  }
}

jumpCheck = function() {
  player.jump()
}

shoot = function() {
  player.shoot()
}


Comet.prototype.shoot = function() {
  if(this.ship != null) {
      this.ship.shoot();
  } else {
      x = this.position.x;
      y = this.position.y - (this.height/2.7);
      laser = this.lasers.create(x, y, 'laser');
      laser.scale.set(.75,.75)
      if(this.direction == 0) {
        laser.body.velocity.x = 800;
      } else if(this.direction == 1) {
        laser.body.velocity.x = -800;
        laser.scale.x *= -1;
      }
  }

}

Comet.prototype.jump = function() {
  if(this.numJumps < this.MAX_JUMPS) {
    this.body.velocity.y = -300;
  }
  this.numJumps++;
}

Comet.prototype.swapControl = function(ship) {
    if(this.ship == null) {
        this.ship = ship;
        this.y = -2000;
        this.body.gravity.y = 0;
        this.body.velocity.y = 0;
        this.body.velocity.x = 0;
        this.game.camera.unfollow(this);
    } else {
        this.body.gravity.y = 500;
        var x = this.ship.x;
        var y = this.ship.y - 50;
        this.ship = null;
        this.x = x;
        this.y = y;
        this.game.camera.follow(this);
    }
}

Comet.prototype.move = function() {

  this.body.velocity.x = 0;
  sprint = 1

  if(this.shift.isDown) {
    sprint = 2
  }

  if (/*this.cursors.left.isDown ||*/ this.wasd.left.isDown)
  {
      //  Move to the left
      if(this.direction == 0) {
        this.body.offset.x = 10
        this.scale.x *= -1;
      }
      this.direction = 1
      this.body.velocity.x = -150 * sprint;
      if(this.body.touching.down ||  this.body.blocked.down) {
        this.animations.play('walk');
      } else {
        this.frame = 5;
      }
  }
  else if (/*this.cursors.right.isDown ||*/ this.wasd.right.isDown)
  {
      this.body.offset.x = -10

      //  Move to the right
      if(this.direction == 1) {
        this.scale.x *= -1;
      }
      this.direction = 0
      this.body.velocity.x = 150 * sprint;
      if(this.body.touching.down || this.body.blocked.down) {
        this.animations.play('walk');
      } else {
        this.frame = 5;
      }
  }
  else
  {
      this.frame = 4;
      if(this.direction == 1) {
        this.scale.x *= -1;
      }
  }

  if ((/*this.cursors.up.isDown || */this.wasd.up.isDown) && this.numJumps < this.MAX_JUMPS) {
  }
  //  Allow the player to jump if they are touching the ground.
  if (this.body.touching.down || this.body.blocked.down)
  {
    console.log("touching down");
    this.numJumps = 0;
  }

}
