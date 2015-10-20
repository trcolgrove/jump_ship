function Laser(game, x, y, key, friendly) {
    this.game = game;
    this.friendly = friendly;
    Phaser.Sprite.call(this, game, x, y, key);
}

Laser.prototype = Object.create(Phaser.Sprite.prototype);
Laser.prototype.constructor = Laser;
