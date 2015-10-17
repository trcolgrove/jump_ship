var gameOver = function(game){};

gameOver.prototype = {
	init: function(){
	},
  	create: function(){
        var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, align: "center" };
        text = game.add.text(game.width/2, game.height/2, "Game Over", style);
        text.anchor.set(0.5);
	},
	playTheGame: function(){
		this.game.state.start("TheGame");
	}
}
