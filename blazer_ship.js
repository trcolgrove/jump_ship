function BlazerShip(game, x, y, key, frame) {
    Ship.call(this, game, x, y, key, frame);
    this.laserSprite = 'red_laser_double';
}

BlazerShip.prototype = Object.create(Ship.prototype);
BlazerShip.prototype.constructor = BlazerShip;
