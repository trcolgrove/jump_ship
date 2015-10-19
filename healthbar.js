HealthBar = function(game, sprite, x, y, width, height) {
    this.game = game;
    this.sprite = sprite;
    this.xValue = x;
    this.yValue = y;
    this.userWidth = width;
    this.userHeight = height;
    this.multiplier = this.userWidth / this.sprite.maxHealth;
    this.bar = this.game.add.bitmapData(width, height);
}

HealthBar.prototype = Object.create(Phaser.Sprite.prototype);

HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.update = function() {
    this.bar.context.clearRect(0, 0, this.bar.width, this.bar.height);
    this.bar.context.fillRect(0, 0, this.sprite.health * this.multiplier, this.userHeight);
    this.bar.dirty = true;
}
