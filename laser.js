function Laser(game, x, y, key, friendly) {
    this.game = game;
    this.friendly = friendly;
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
