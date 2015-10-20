function MotherShip(game, x, y, key, frame) {
    Ship.call(this, game, x, y, key, frame);
    this.maxHealth = 500;
    this.health = this.maxHealth;
    this.laserSprite = 'yellow_laser'
}

MotherShip.prototype = Object.create(Ship.prototype);
MotherShip.prototype.constructor = MotherShip;

MotherShip.prototype.shoot = function() {

    for(var i = 0; i < 10; i ++) {
        var angle = i * 36;
        laser = new Laser(this.game, this.x, this.y, this.laserSprite, false);
        this.game.add.existing(laser);
        lasers.add(laser);
        game.physics.arcade.velocityFromAngle(angle, 500, laser.body.velocity);
    }
}
