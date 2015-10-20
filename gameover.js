var gameOver = function(game){};

gameOver.prototype = {
	init: function(){
	},
    preload: function() {
        this.game.load.image("game_over", "art/gameover.png");
    },
  	create: function(){
        var startScreenSprite = game.add.sprite(0, 0, "game_over");
        var spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBar.onDown.add(function(spaceBar) {
            game.state.start("TheGame", true, false, "level1");
        });
	}
}
