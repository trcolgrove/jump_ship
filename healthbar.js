HealthBar = function(game, sprite, x, y) {
    Phaser.Sprite.call(this, game, x, y, "health_bar_green");
    this.sprite = sprite;
    this.multiplier = 20 / sprite.maxHealth;
};

HealthBar.prototype = Object.create(Phaser.Sprite.prototype);

HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.update = function() {
    this.width = this.sprite.health * this.multiplier;
}
