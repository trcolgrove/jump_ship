
function SmokeParticle(game, x, y) {
  Phaser.Particle.call(this, game, x, y, 'smoke_particle');
  //this.animations.add('smokeAnim');
  this.bringToTop();
}

SmokeParticle.prototype = Object.create(Phaser.Particle.prototype);
SmokeParticle.prototype.constructor = SmokeParticle;

var explosion_names = ['explosion1'];
Explosions = function(game) {
    this.game = game;
    this.emitter = game.add.emitter(0, 0, 100);
    this.emitter.particleClass = SmokeParticle;
    this.emitter.gravity = 0;
    this.explosions = this.game.add.group();
    this.emitter.setXSpeed(-250,250);
    this.emitter.setYSpeed(-250,250);
    this.emitter.makeParticles();
}

Explosions.prototype.explode = function(x, y, width, height) {
    this.emitter.x = x;
    this.emitter.y = y;
    this.game.world.bringToTop(emitter);
    this.game.world.bringToTop(this.explosions);
    indx = Math.random() % explosion_names.length;
    explosion_name = explosion_names[indx];
    explosion_sprite = this.explosions.create(x, y, 'explosion1');
    explosion_sprite.anchor.setTo(.5,.5);
    explosion_sprite.width = width;
    explosion_sprite.height = height;
    explosion_sprite.animations.add('explode', null, 24, false);
    explosion_sprite.animations.play('explode', null, false, true);
    boom_sound.play();
    /*this.emitter.forEach(function(smokeParticle) {
        //smokeParticle.play('smokeAnim');
    });*/

    this.emitter.start(true, 500, null, 50);
}

Explosions.prototype.update = function() {
    emitter = this.emitter;
    this.emitter.forEachAlive(function(p){
        p.alpha= p.lifespan / emitter.lifespan;
    });
}
