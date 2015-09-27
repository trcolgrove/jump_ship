// Tufts Fall 2015 Comp 23 Project 1

var boundsWidth = 800;
var boundsHeight = 600;

var game = new Phaser.Game(boundsWidth, boundsHeight, Phaser.AUTO, "",
                           {preload: preload, create: create, update: update});

function preload() {
    game.load.image("ship", "assets/ship.png");
    game.load.image("laser", "assets/laser.png");
}

var ships;
var shipWidth = 160;
var shipHeight = 60;
var userControlledShip = null;
var lasers;
var laserWidth = 200;
var laserHeight = 20;
var cursors;
var fireLaserKey;   // Space bar

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    ships = game.add.group();
    ships.enableBody = true;
    lasers = game.add.group();
    lasers.enableBody = true;
    cursors = game.input.keyboard.createCursorKeys();
    fireLaserKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.time.events.loop(4000, function() {

        var ship = ships.create(boundsWidth,
                                Math.floor(Math.random() * (boundsHeight - shipHeight + 1)),
                                "ship");

        ship.body.velocity.x = -50;
        ship.facingLeft = true;
        ship.userControlled = false;
        ship.inputEnabled = true;

        ship.events.onInputDown.add(function(ship, pointer) {

            if (ship.userControlled) {

                ship.userControlled = false;
                ship.body.velocity.x = -50;
                userControlledShip = null;

            } else {

                ship.userControlled = true;
                ship.body.velocity.x = -50;

                if (userControlledShip) {
                    userControlledShip.userControlled = false;
                    userControlledShip.body.velocity.x = -50;
                }

                userControlledShip = ship;

            }
        }, this);

    }, this);

    fireLaserKey.onDown.add(function(fireLaserKey) {

        if (userControlledShip) {

            if (userControlledShip.facingLeft) {

                laser = lasers.create(userControlledShip.x - laserWidth,
                                      userControlledShip.y + (shipHeight / 2) - (laserHeight / 2),
                                      "laser");

                laser.body.velocity.x = -200;

            } else {

                laser = lasers.create(userControlledShip.x + shipWidth,
                                      userControlledShip.y + (shipHeight / 2) - (laserHeight / 2),
                                      "laser");

                laser.body.velocity.x = 200;

            }
        }

    }, this);
}

function update() {

    if (userControlledShip) {

        userControlledShip.body.velocity.x = 0;
        userControlledShip.body.velocity.y = 0;

        if (cursors.left.isDown) {

            userControlledShip.facingLeft = true;

            if (userControlledShip.x >= 0) {
                userControlledShip.body.velocity.x = -150;
            }

        } else if (cursors.right.isDown) {

            userControlledShip.facingLeft = false;

            if (userControlledShip.x <= boundsWidth - shipWidth) {
                userControlledShip.body.velocity.x = 150;
            }

        }

        if (cursors.up.isDown) {

            if (userControlledShip.y >= 0) {
                userControlledShip.body.velocity.y = -150;
            }

        } else if (cursors.down.isDown) {

            if (userControlledShip.y <= boundsHeight - shipHeight) {
                userControlledShip.body.velocity.y = 150;
            }

        }

    }

}
