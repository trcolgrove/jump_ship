function Hero(game){
  this.game = game;
  this.sprite = null;
  this.numJumps=0;
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
  game.input.keyboard.onPressCallback

}

Hero.prototype.create= function() {
  this.sprite = game.add.sprite(32, game.world.height - 150, 'dude');
  this.game.physics.arcade.enable(this.sprite);

  //  Player physics properties. Give the little guy a slight bounce.
  this.sprite.body.bounce.y = 0;
  this.sprite.body.gravity.y = 500;
  this.sprite.body.collideWorldBounds = true;
  this.lasers = game.add.group();
  this.lasers.enableBody = true;
  //  Our two animations, walking left and right.
  this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
  this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
  this.wasd.up.onDown.add(jumpCheck)
  this.cursors.up.onDown.add(jumpCheck)
  this.space.onDown.add(shoot)

}


Hero.prototype.update = function(platforms) {
  game.physics.arcade.collide(this, platforms);
  game.physics.arcade.collide
  this.move()
}

jumpCheck = function() {
  player.jump()
}

shoot = function() {
  player.shoot()
}

Hero.prototype.shoot = function() {
  x = this.direction ? this.sprite.position.x - (this.sprite.width/2) : this.sprite.position.x + (this.sprite.width/2)
  y = this.sprite.position.y + (this.sprite.height/2)
  laser = this.lasers.create(x, y, 'laser');
  if(this.direction == 0) {
    laser.body.velocity.x = 800
  } else if(this.direction == 1) {
    laser.body.velocity.x = -800
  }
}

Hero.prototype.jump = function() {
  if(this.numJumps < this.MAX_JUMPS) {
    this.sprite.body.velocity.y = -300;
  }
  this.numJumps++;
}

Hero.prototype.move = function() {
  this.sprite.body.velocity.x = 0;

  sprint = 1

  if(this.shift.isDown) {
    sprint = 2
  }

  if (this.cursors.left.isDown || this.wasd.left.isDown)
  {
      //  Move to the left
      this.direction = 1
      this.sprite.body.velocity.x = -150 * sprint;
      if(this.sprite.body.touching.down) {
        this.sprite.animations.play('left');
      } else {
        this.sprite.frame = 1;
      }
  }
  else if (this.cursors.right.isDown || this.wasd.right.isDown)
  {
      //  Move to the right
      this.direction = 0
      this.sprite.body.velocity.x = 150 * sprint;
      if(this.sprite.body.touching.down) {
        this.sprite.animations.play('right');
      } else {
        this.sprite.frame = 6;
      }
  }
  else
  {
      //  Stand still
      this.sprite.frame = 4;
  }

  if ((this.cursors.up.isDown || this.wasd.up.isDown) && this.numJumps < this.MAX_JUMPS) {

  }
  //  Allow the player to jump if they are touching the ground.
  if (this.sprite.body.touching.down)
  {
    this.numJumps = 0
  }

}
