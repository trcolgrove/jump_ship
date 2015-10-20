function Laser(game, x, y, key, friendly) {
    this.game = game;
    this.friendly = friendly;
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.createdAt = game.time.now;

    Phaser.Sprite.call(this, game, x, y, key);
    if(key == 'red_laser_double') {
        this.power = 7;
    } else if (key == 'green_laser') {
        this.power = 10;
    } else {
        this.power = 5;
    }

}

Laser.prototype = Object.create(Phaser.Sprite.prototype);
Laser.prototype.constructor = Laser;

Laser.prototype.kill = function() {
    this.destroy();
}

Laser.prototype.update = function() {
    if(!this.inCamera && game.time.now - this.createdAt > 500) {
        this.kill();
    }
}
