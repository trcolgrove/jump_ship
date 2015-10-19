var game = new Phaser.Game(800, 574, Phaser.AUTO, '', { preload: preload,
                          create: create, update: update});
var audio;

function preload() {
    game.load.image('sky', 'assets/images/space-2.png');
    game.load.spritesheet("ship", "assets/sprites/sport_ship.png", 200, 58);
    game.load.spritesheet("destroyer", "assets/sprites/destroyer.png", 200, 58);
    game.load.image("doors", "assets/sprites/doors.png");
    game.load.image('red_laser', 'assets/sprites/red_laser.png');
    game.load.image('red_laser_double', 'assets/sprites/red_laser_double.png');
    game.load.image('blue_laser', 'assets/sprites/blue_laser.png');
    game.load.image('yellow_laser', 'assets/sprites/yellow_laser.png');
    game.load.image('green_laser', 'assets/sprites/green_laser.png');
    game.load.image('platformTiles', 'assets/sprites/platforms128x128.png');
    game.load.spritesheet('asteroids', 'assets/sprites/asteroids.png', 256, 256)
    game.load.spritesheet('comet_hero', 'assets/sprites/comet_spritesheet.png', 61, 86.25);
    game.load.audio('ultra', ['assets/music/ultra.mp3']);
    game.load.audio('laser_sound', 'assets/sfx/laser_shoot.wav');
    game.load.audio('boom_sound', 'assets/sfx/explosion.wav');
    game.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('explosion1', 'assets/sprites/explosion.png', 96, 96);
    game.load.spritesheet('smoke_particle', 'assets/sprites/smokeparticle.png');
    game.load.audio('ship_laser_sound', 'assets/sfx/ship_laser.wav');
    game.load.image("health_bar_green", "assets/sprites/health_bar_green.png");
    game.load.image("health_bar_red", "assets/sprites/health_bar_red.png");
    game.state.add("GameOver", gameOver);
}

var music;
var player;
var platforms;
var cursors;
var ships;
var lasers;
var controls;
var hijackShip = null;
var collidingShip = null;
var particles;
var explosion_gen;



function create() {

    setControls();

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 10000, game.world.height);
    background = game.add.tileSprite(0, 0, 2400, game.world.height, 'sky');

    particles = game.add.group();

    initGameAudio();
    initTileMap();

    //enable physics for tile layers
    thinLayer.enableBody = true;
    thickLayer.enableBody = true;

    // The player and its settings
    player = new Comet(game);
    game.add.existing(player);
    player.scale.set(.75,.75);
    game.camera.follow(player);

    healthBar = new HealthBar(game, player);
    game.add.existing(healthBar);

    healthBarRed = new HealthBarRed(game, healthBar);
    game.add.existing(healthBarRed);

    explosion_gen = new Explosions(game);

    shipFactory = new Ships(game);
    shipFactory.create();

    lasers = game.add.group();
    lasers.enableBody = true;

    game.world.bringToTop(thinLayer);
    game.world.bringToTop(thickLayer);
    game.world.bringToTop(ships);
    game.world.bringToTop(player);
    game.world.bringToTop(lasers);

    //music.play();
    music.loop = true;
}

function setControls() {

    controls = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
      shift : game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
      space : game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
      j_key : game.input.keyboard.addKey(Phaser.Keyboard.J),
    };

    controls.j_key.onDown.add(function() {
        if(collidingShip != null) {
            hijackShip = collidingShip;
            player.swapControl(hijackShip);
            hijackShip.swapControl();
        } else if (hijackShip != null){
            player.ship.swapControl(hijackShip);
            player.swapControl(hijackShip);
            hijackShip = null;
        }
    });
    controls.up.onDown.add(function() { player.jump(); });
    controls.space.onDown.add(function() { player.shoot()});

}


function initTileMap() {
    map = game.add.tilemap('level1');

    map.addTilesetImage('platforms','platformTiles');
    map.addTilesetImage('doors', 'doors');

    thickLayer = map.createLayer('thick_platforms');
    map.setCollisionBetween(1, 200, true, 'thick_platforms');

    thinLayer = map.createLayer('thin_platforms');
    map.setCollisionBetween(1, 200, true, 'thin_platforms');

    doors = map.createLayer('door_layer');

    createAsteroids();
    createShips();
    //enable tile map collisions
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

}

function initGameAudio() {
    music = game.add.audio('ultra');
    boom_sound = game.add.audio('boom_sound');
    laser_sound = game.add.audio('laser_sound');
    ship_laser_sound = game.add.audio('ship_laser_sound');
}

function createShips() {
    ships = game.add.group();
    ships.enableBody = true;
    result = findObjectsByType('ship', map, 'enemies');
    map.createFromObjects('enemies', 86,
       'ship', 2, true, true, ships, Ship, true);
    map.createFromObjects('enemies', 89,
       'destroyer', 2, true, true, ships, Ship, true);

    ships.forEach(function(ship, index, group) {
        
        console.log(ship);

        healthBar = new HealthBar(game, ship);
        game.add.existing(healthBar);

        healthBarRed = new HealthBarRed(game, healthBar);
        game.add.existing(healthBarRed);
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
    game.physics.arcade.collide(player, ships, function(p, ship){
        collidingShip = ship;
    }, null, player);
    game.physics.arcade.collide(player, thickLayer);
    game.physics.arcade.collide(player, thinLayer);

    player.update();
    shipFactory.update();
    ships.update();

    game.physics.arcade.collide(ships, lasers, function(ship, laser){
        ship.hit(10);
        laser.destroy();
    });
    game.physics.arcade.collide(player, lasers, function(player, laser) {
        player.hit(10);
        laser.destroy();
    });
    enemyFire();
}

function enemyFire() {
    ships.forEachAlive(function (enemy) {
      if (game.time.now > enemy.nextShotAt && !enemy.userControlled) {
         if(enemy.position.distance(player) <= 800 ||
         (hijackShip != null && enemy.position.distance(hijackShip) <= 800)) {
             enemy.shoot();
         }
         enemy.nextShotAt = game.time.now + (Math.random()*2000)%2000;
       }
    }, this);
}
