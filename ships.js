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

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.ships = game.add.group();
    this.ships.enableBody = true;
    this.lasers = game.add.group();
    this.lasers.enableBody = true;
    this.cursors = game.input.keyboard.createCursorKeys();
    this.fireLaserKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.game.time.events.loop(4000, function() {

        var ship = this.ships.create(this.boundsWidth,
                                Math.floor(Math.random() *
                                           (this.boundsHeight - this.shipHeight + 1)),
                                "ship");

        ship.body.velocity.x = -50;
        ship.facingLeft = true;
        ship.userControlled = false;
        ship.inputEnabled = true;

        ship.events.onInputDown.add(function(ship, pointer) {

            if (ship.userControlled) {

                ship.userControlled = false;
                ship.body.velocity.x = -50;
                this.userControlledShip = null;

            } else {

                ship.userControlled = true;
                ship.body.velocity.x = -50;

                if (this.userControlledShip) {
                    this.userControlledShip.userControlled = false;
                    this.userControlledShip.body.velocity.x = -50;
                }

                this.userControlledShip = ship;

            }
        }, this);

    }, this);

    this.fireLaserKey.onDown.add(function(fireLaserKey) {

        if (this.userControlledShip) {

            if (this.userControlledShip.facingLeft) {

                laser = this.lasers.create(
                    this.userControlledShip.x - this.laserWidth,
                    this.userControlledShip.y + this.shipHeight / 2 - this.laserHeight / 2,
                    "laser");

                laser.body.velocity.x = -200;

            } else {

                laser = this.lasers.create(
                    this.userControlledShip.x + this.shipWidth,
                    this.userControlledShip.y + this.shipHeight / 2 - this.laserHeight / 2,
                    "laser");

                laser.body.velocity.x = 200;

            }
        }

    }, this);
}

Ships.prototype.update = function() {

    if (this.userControlledShip) {

        this.userControlledShip.body.velocity.x = 0;
        this.userControlledShip.body.velocity.y = 0;

        if (this.cursors.left.isDown) {

            this.userControlledShip.facingLeft = true;

            if (this.userControlledShip.x >= 0) {
                this.userControlledShip.body.velocity.x = -150;
            }

        } else if (this.cursors.right.isDown) {

            this.userControlledShip.facingLeft = false;

            if (this.userControlledShip.x <= this.boundsWidth - this.shipWidth) {
                this.userControlledShip.body.velocity.x = 150;
            }

        }

        if (this.cursors.up.isDown) {

            if (this.userControlledShip.y >= 0) {
                this.userControlledShip.body.velocity.y = -150;
            }

        } else if (this.cursors.down.isDown) {

            if (this.userControlledShip.y <= this.boundsHeight - this.shipHeight) {
                this.userControlledShip.body.velocity.y = 150;
            }

        }

    }

}
