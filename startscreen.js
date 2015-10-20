var startScreen = function(game) {};

startScreen.prototype = {

    preload: function() {
        this.game.load.image("start_screen", "assets/art/start.png");
    },

    create: function() {

        var startScreenSprite = this.add.sprite(0, 0, "start_screen");
        var spaceBar = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        spaceBar.onDown.add(function(spaceBar) {
            this.game.state.start("TheGame");
        });

    }

}