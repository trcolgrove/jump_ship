var startScreen = {

    preload: function() {
        this.game.load.image("start_screen", "art/start.png");
    },

    create: function() {

        var startScreenSprite = game.add.sprite(0, 0, "start_screen");
        var spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spaceBar.onDown.add(function(spaceBar) {
            game.state.start("TheGame");
        });

    }

}
