var game = new Phaser.Game(800, 574, Phaser.AUTO, 'the_game');

var audio;
var gameState = {};

gameState.preload = function() {
    game.load.image('sky', 'assets/images/space-2.png');
    game.load.image('nebula', 'assets/images/space-3.jpg');
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
    game.load.audio('level1_music', ['assets/music/level1.mp3']);
    game.load.audio('laser_sound', 'assets/sfx/laser_shoot.wav');
    game.load.audio('boom_sound', 'assets/sfx/explosion.wav');
    game.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level2', 'assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('explosion1', 'assets/sprites/explosion.png', 96, 96);
    game.load.spritesheet('smoke_particle', 'assets/sprites/smokeparticle.png');
    game.load.audio('ship_laser_sound', 'assets/sfx/ship_laser.wav');
    game.load.image("health_bar_green", "assets/sprites/health_bar_green.png");
    game.load.image("health_bar_red", "assets/sprites/health_bar_red.png");
    game.load.image("mothership", "assets/sprites/mothership.png")
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

gameState.init = function(levelData) {
    this.levelData = levelData;
}

gameState.create = function() {
    gameState.setControls();

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 10000, game.world.height);

    if(this.levelData == "level2") {
        background = game.add.tileSprite(0, 0, 2400, game.world.height, 'nebula');
    } else {
        background = game.add.tileSprite(0, 0, 2400, game.world.height, 'sky');
    }

    particles = game.add.group();

    this.initGameAudio();
    this.initTileMap();

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

    healthBarRed = new HealthBarRed(game, healthBar, player);
    game.add.existing(healthBarRed);

    explosion_gen = new Explosions(game);

    //shipFactory = new Ships(game);
    //shipFactory.create();

    lasers = game.add.group();
    lasers.enableBody = true;

    game.world.bringToTop(thinLayer);
    game.world.bringToTop(thickLayer);
    game.world.bringToTop(ships);
    game.world.bringToTop(player);
    game.world.bringToTop(lasers);

    music.loop = true;
    music.play();
}

gameState.setControls = function() {

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
        } else if (hijackShip != null && player.ship != null){
            player.ship.swapControl(hijackShip);
            player.swapControl(hijackShip);
            hijackShip = null;
        }
    });
    controls.up.onDown.add(function() { player.jump(); });
    controls.space.onDown.add(function() { player.shoot()});

}


gameState.initTileMap = function() {
    map = game.add.tilemap(this.levelData);

    map.addTilesetImage('platforms','platformTiles');
    map.addTilesetImage('doors', 'doors');

    thickLayer = map.createLayer('thick_platforms');
    map.setCollisionBetween(1, 200, true, 'thick_platforms');

    thinLayer = map.createLayer('thin_platforms');
    map.setCollisionBetween(1, 200, true, 'thin_platforms');

    doors = map.createLayer('door_layer');

    this.createAsteroids();
    this.createShips();
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

gameState.initGameAudio = function() {
    music = game.add.audio('level1_music');
    boom_sound = game.add.audio('boom_sound');
    laser_sound = game.add.audio('laser_sound');
    ship_laser_sound = game.add.audio('ship_laser_sound');
}

gameState.createShips = function() {
    ships = game.add.group();
    bosses = game.add.group();
    ships.enableBody = true;
    result = this.findObjectsByType('ship', map, 'enemies');
    map.createFromObjects('enemies', 86,
       'ship', 2, true, true, ships, Ship, false);
    map.createFromObjects('enemies', 89,
        'destroyer', 2, true, true, ships, Ship, false);

    map.createFromObjects('enemies', 92,
        'mothership', 2, true, true, bosses, MotherShip, true);
    bosses.forEachAlive(function(boss) {
        boss.y += 150;
    });
}

gameState.createAsteroids = function() {
  //create doors

  asteroids = game.add.group();
  asteroids.enableBody = true;
  var i = 0
  result = this.findObjectsByType('asteroid', map, 'asteroid_layer');
  result.forEach(function(element) {
     asteroid_sprite = map.createFromObjects('asteroid_layer', element.gid,
     'asteroids', i, true, true, asteroids, Phaser.Sprite, true);
     i++;
  });

}


gameState.findObjectsByType = function(type, map, layer) {
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

gameState.createFromTiledObject = function(element, group) {
  var sprite = group.create(element.x, element.y, element.properties.sprite);
    //copy all properties to the sprite
    Object.keys(element.properties).forEach(function(key){
      sprite[key] = element.properties[key];
    });
}

gameState.update = function() {
    if(player.x > 8000 || (hijackShip && hijackShip.x > 8000)) {
        if(this.levelData == 'level1') {
            music.stop();
            hijackShip = null;
            player.x = 10;
            game.state.start("TheGame", true, false, "level2");
        } else if (this.levelData == 'level2') {
            music.stop();
            game.state.start("Victory");
        }
    }
    background.x = game.camera.x;
    collidingShip = null;
    explosion_gen.update();
    game.physics.arcade.collide(player, ships, function(p, ship){
        collidingShip = ship;
    }, null, player);
    game.physics.arcade.collide(player, thickLayer);
    game.physics.arcade.collide(player, thinLayer);

    player.update();
    //shipFactory.update();
    ships.update();

    game.physics.arcade.overlap(ships, lasers, function(ship, laser){
        if(ship.userControlled != laser.friendly){
            ship.hit(laser.power);
            laser.destroy();
        }
    });
    game.physics.arcade.overlap(bosses, lasers, function(boss, laser){
        if(laser.friendly){
            boss.hit(laser.power);
            laser.destroy();
        }
    });
    game.physics.arcade.collide(player, lasers, function(player, laser) {
        player.hit(laser.power);
        laser.destroy();
    });
    this.enemyFire();
    this.updateEnemyPositions();
}

gameState.enemyFire = function() {
    ships.forEachAlive(shootAtPlayer, this);
    bosses.forEachAlive(shootAtPlayer, this);
}

function shootAtPlayer(enemy) {
    if (game.time.now > enemy.nextShotAt && !enemy.userControlled) {
       if(enemy.position.distance(player) <= 800 ||
       (hijackShip != null && enemy.position.distance(hijackShip) <= 800)) {
           enemy.shoot();
       }
       enemy.nextShotAt = game.time.now + (Math.random()*2000)%2000;
     }
}

gameState.updateEnemyPositions = function() {
    ships.forEachAlive(function (enemy) {
        enemy.updatePosition();
    });
}

game.state.add("StartScreen", startScreen);
game.state.add("TheGame", gameState);
game.state.add("GameOver", gameOver);
game.state.add("Victory", victoryScreen);
game.state.start("StartScreen");
