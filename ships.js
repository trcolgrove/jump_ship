// Tufts Fall 2015 Comp 23 Project 1

function Ships(game) {
    this.game = game;
    this.boundsWidth = 800;
    this.boundsHeight = 600;
    this.ships;
    this.shipWidth = 160;
    this.shipHeight = 60;
    this.userControlledShip = null;
    this.lasers;
    this.laserWidth = 200;
    this.laserHeight = 20;
    this.cursors;
    this.fireLaserKey;   // Space bar
}

Ships.prototype.create = function() {
    this.game.time.events.loop(4000, function() {
        ship = new Ship(this.game, 800, Math.random()*this.game.height, 'ship', 2);
        game.add.existing(ship);
        ships.add(ship);
        ship.body.velocity.x = -50;
    });
}

Ships.prototype.update = function() {

}
