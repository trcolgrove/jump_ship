Comet = function(game){
  Phaser.Sprite.call(this, game, 32, game.world.height - 150, 'dude');
  game.add.existing(this);
  this.anchor.setTo(.5,.5);
  this.game = game
  this.game.physics.arcade.enable(this);
  this.numJumps = 0;
  this.direction = 0
  this.cursors = game.input.keyboard.createCursorKeys();
  this.MAX_JUMPS = 2;
  this.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
  this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  this.wasd = {
    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D)
  };
  this.body.bounce.y = 0;
  this.body.gravity.y = 500;
  this.body.collideWorldBounds = true;
  this.lasers = game.add.group();
  this.lasers.enableBody = true;
  //  Our two animations, walking left and right
  this.wasd.up.onDown.add(jumpCheck)
//  this.cursors.up.onDown.add(jumpCheck)
  this.space.onDown.add(shoot)
  this.animations.add('walk', [4, 5, 6, 7], 10, true);
}

Comet.prototype = Object.create(Phaser.Sprite.prototype)
Comet.prototype.constructor = Comet;


Comet.prototype.update = function() {
  this.move()
}

jumpCheck = function() {
  player.jump()
}

shoot = function() {
  player.shoot()
}


Comet.prototype.shoot = function() {
  x = this.direction ? this.position.x - (this.width/2) : this.position.x + (this.width/2)
  y = this.position.y + (this.height/2)
  laser = this.lasers.create(x, y, 'laser');
  if(this.direction == 0) {
    laser.body.velocity.x = 800
  } else if(this.direction == 1) {
    laser.body.velocity.x = -800
  }
}

Comet.prototype.jump = function() {
  if(this.numJumps < this.MAX_JUMPS) {
    this.body.velocity.y = -300;
  }
  this.numJumps++;
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
      this.direction = 1
      yourSprite.scale.x *= -1;
      this.body.velocity.x = -150 * sprint;
      if(this.body.touching.down) {
        this.animations.play('walk');
      } else {
        this.frame = 1;
      }
  }
  else if (/*this.cursors.right.isDown ||*/ this.wasd.right.isDown)
  {
      //  Move to the right
      this.direction = 0
      this.body.velocity.x = 150 * sprint;
      if(this.body.touching.down) {
        this.animations.play('walk');
      } else {
        this.frame = 6;
      }
  }
  else
  {
      this.frame = 8;
      if(this.direction == 1) {
        yourSprite.scale.x *= -1;
      }
  }

  if ((/*this.cursors.up.isDown || */this.wasd.up.isDown) && this.numJumps < this.MAX_JUMPS) {

  }
  //  Allow the player to jump if they are touching the ground.
  if (this.body.touching.down)
  {
    this.numJumps = 0
  }

}
