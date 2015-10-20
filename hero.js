Comet = function(game) {
  Phaser.Sprite.call(this, game, 32, game.world.height - 600, 'comet_hero');
  this.game = game;
  this.game.physics.arcade.enable(this);
  this.body.setSize(this.width - 45, this.height, -10, 0)
  this.anchor.setTo(.5, .5);
  this.health = 100;
  this.numJumps = 0;
  this.cursors = game.input.keyboard.createCursorKeys();
  this.MAX_JUMPS = 2;

  this.body.bounce.y = 0;
  this.body.gravity.y = 500;
  this.body.collideWorldBounds = false;
  //  Our two animations, walking left and right
//  this.cursors.up.onDown.add(jumpCheck)
  this.animations.add('walk', [4, 5, 6, 7], 10, true);
  this.ship = null;
}

Comet.prototype = Object.create(Phaser.Sprite.prototype)
Comet.prototype.constructor = Comet;

Comet.prototype.kill = function() {
    explosion_gen.explode(this.x, this.y, 250, 250);
    this.visible = false;
    this.alive = false;
    this.game.time.events.add(800, function() {
        music.stop();
        this.game.state.start("GameOver");

        //this.game.state.start("GameOver", true, false);
    });
}

Comet.prototype.update = function() {

    if(this.y >= (this.game.height - 30) || this.health <= 0) {

        if(this.alive == true) {
            this.kill();
        }

    }

    if(this.ship != null) {
    this.ship.move();
    } else {
    this.move();
    }
}

Comet.prototype.shoot = function() {
    if(this.ship != null) {
      this.ship.shoot();
    } else {
      laser_sound.play();
      x = this.position.x;
      y = this.position.y - (this.height/2.7);
      laser = new Laser(this.game, x, y, 'red_laser', true);
      game.add.existing(laser);
      lasers.add(laser);
      laser.scale.set(.75,.75);
        if(this.scale.x > 0) {
            laser.body.velocity.x = 800;
        }
        else if(this.scale.x < 0) {
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

Comet.prototype.hit = function(damage) {
    this.health -= damage;
}

Comet.prototype.move = function() {
  this.body.velocity.x = 0;
  sprint = 1

  if(controls.shift.isDown) {
    sprint = 2
  }

  if (controls.left.isDown)
  {
      this.body.offset.x = 10
      //  Move to the left
      if(this.scale.x > 0) {
        this.scale.x *= -1;
      }
      this.body.velocity.x = -150 * sprint;
      if(this.body.touching.down ||  this.body.blocked.down) {
        this.animations.play('walk');
      } else {
        this.frame = 5;
      }
  }

  else if (controls.right.isDown)
  {
      this.body.offset.x = -10

      //  Move to the right
      if(this.scale.x < 0) {
        this.scale.x *= -1;
      }
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
  }

  if ((controls.up.isDown) && this.numJumps < this.MAX_JUMPS) {
  }
  //  Allow the player to jump if they are touching the ground.
  if (this.body.touching.down || this.body.blocked.down)
  {
      this.numJumps = 0;
  }

}
