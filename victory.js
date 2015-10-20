var victoryScreen = function(game){};

victoryScreen.prototype = {
	init: function(){
	},
  	create: function(){
        var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, align: "center"};
        text = game.add.text(game.width/2, game.height/2, "Victory", style);
        text.anchor.set(0.5);

        var spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spaceBar.onDown.add(function(spaceBar) {
            game.state.start("StartScreen");
        });
	},
	playTheGame: function(){
            game.state.start("StartScreen");
	}
}
