function Laser(game, x, y, key, friendly, power) {
    this.game = game;
    this.friendly = friendly;
    Phaser.Sprite.call(this, game, x, y, key);
    this.power = power;
}

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;
