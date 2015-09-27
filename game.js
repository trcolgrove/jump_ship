// Tufts Fall 2015 Comp 23 Project 1

var boundsWidth = 800;
var boundsHeight = 600;

var game = new Phaser.Game(boundsWidth, boundsHeight, Phaser.AUTO, "",
                           {preload: preload, create: create, update: update});

function preload() {
    game.load.image("ship", "assets/ship.png");
    game.load.image("ship", "assets/ship.png");
    game.load.image("laser", "assets/laser.png");
}

var ships;

function create() {
    ships = new Ships(game);
    ships.create();
}

function update() {
    ships.update();
}
