var game = new Phaser.Game(800, 574, Phaser.AUTO, '', { preload: preload,
                          create: create, update: update });
var audio;
function preload() {
    game.load.image('sky', 'assets/space-2.png');
    game.load.image("ship", "assets/ship.png");
    game.load.image("doors", "assets/doors.png");
    game.load.image('ground', 'assets/platforms128x128.png');
    game.load.image('laser', 'assets/laser.png');
    game.load.image('gameTiles', 'assets/platforms128x128.png');
    game.load.spritesheet('asteroids', 'assets/asteroids.png', 256, 256)
    game.load.spritesheet('dude', 'assets/comet_spritesheet.png', 61, 86.25);
    game.load.audio('ultra', ['assets/ultraa.mp3']);
    game.load.audio('laser_sound', 'assets/laser_shoot.wav');
    game.load.audio('boom_sound', 'assets/explosion.wav');
    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('explosion1', 'assets/explosion.png', 96, 96);
    game.load.spritesheet('smoke_particle', 'assets/smokeparticle.png')
}
var player;
var platforms;
var cursors;
var ships;
var hijackShip = null;
var collidingShip = null;
var score = 0;
var scoreText;
var particles;
function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 2000, game.world.height);
    background = game.add.tileSprite(0, 0, 2400, game.world.height, 'sky');

    //  A simple background for our game

    //music = game.add.audio('ultra');
    //music.play();
    //  The platforms group contains the ground and the 2 ledges we can jump on
    // platforms = game.add.group();
    ships = game.add.group();
    particles = game.add.group();

    boom_sound = game.add.audio('boom_sound');
    laser_sound = game.add.audio('laser_sound');

    map = game.add.tilemap('level1');

    map.addTilesetImage('platforms','gameTiles');
    map.addTilesetImage('doors', 'doors');

    thickLayer = map.createLayer('thick_platforms');
    map.setCollisionBetween(1, 200, true, 'thick_platforms');

    thinLayer = map.createLayer('thin_platforms');
    map.setCollisionBetween(1, 200, true, 'thin_platforms');

    doors = map.createLayer('door_layer');
    //map.setCollisionBetween(1, 200, true, 'door_layer');

    asteroids = game.add.group();

    createAsteroids();

    thinLayer.getTiles(0, 0, game.world.width, game.world.height).forEach(
        function(tile) {
            tile.collideUp = true;
            tile.collideLeft = false;
            tile.collideRight = false;
            tile.collideDown = false;
            tile.faceUp = true;
            tile.faceDown = false;
            tile.faceLeft = false;
            tile.faceRight = false;
        });

    thinLayer.enableBody = true;

    //  We will enable physics for any object that is created in this group
    thickLayer.enableBody = true;



/*
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 50);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;


    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;


    //  Our controls.
    ledge = platforms.create(800, 300, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(1500, 300, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(2300, 200, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(2800, 500, 'ground');
    ledge.body.immovable = true;

*/
    // The player and its settings
    player = new Comet(game);
    game.add.existing(player);
    player.scale.set(.75,.75);
    game.camera.follow(player);

    explosion_gen = new Explosions(game);

    shipFactory = new Ships(game);
    shipFactory.create();

    game.world.bringToTop(thinLayer);
    game.world.bringToTop(thickLayer);
    game.world.bringToTop(ships);
    game.world.bringToTop(player);
    //  Our controls.

    this.j_key = game.input.keyboard.addKey(Phaser.Keyboard.J);

    this.j_key.onDown.add(function() {

        if(collidingShip != null) {
            hijackShip = collidingShip;
            player.swapControl(hijackShip);
            hijackShip.swapControl();
        } else {
            player.ship.swapControl(hijackShip);
            player.swapControl(hijackShip);
            hijackShip = null;
        }
    });
}

function createAsteroids() {
  //create doors

  asteroids = game.add.group();
  asteroids.enableBody = true;
  var i = 0
  result = findObjectsByType('asteroid', map, 'asteroid_layer');
  result.forEach(function(element) {
     asteroid_sprite = map.createFromObjects('asteroid_layer', element.gid,
     'asteroids', i, true, true, asteroids, Phaser.Sprite, true);
     //createFromTiledObject(element, asteroids);
     i++;
  });

}

function findObjectsByType(type, map, layer) {
  var result = new Array();
  map.objects[layer].forEach(function(element){

    if(element.properties.type === type) {

      //Phaser uses top left, Tiled bottom left so we have to adjust
      //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
      //so they might not be placed in the exact position as in Tiled
      element.y -= map.tileHeight;
      result.push(element);
    }
  });
  return result;
}

function createFromTiledObject(element, group) {
  var sprite = group.create(element.x, element.y, element.properties.sprite);

    //copy all properties to the sprite
    Object.keys(element.properties).forEach(function(key){
      sprite[key] = element.properties[key];
    });
}

function update() {
    collidingShip = null;
    explosion_gen.update();
    this.game.physics.arcade.collide(player, ships, function(p, ship){
        collidingShip = ship;
    }, null, player);
    game.physics.arcade.collide(player, thickLayer);
    game.physics.arcade.collide(player, thinLayer);

    //game.physics.arcade.collide(player, platforms);
    player.update();
    shipFactory.update();
    ships.update();
}
