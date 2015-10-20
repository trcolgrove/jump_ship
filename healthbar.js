HealthBar = function(game, sprite) {
    Phaser.Sprite.call(this, game, 50, 50, "health_bar_green");
    this.sprite = sprite;
    this.multiplier = 40 / sprite.maxHealth;
};

HealthBar.prototype = Object.create(Phaser.Sprite.prototype);

HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.update = function() {
    this.x = this.sprite.x;
    this.y = this.sprite.y - 50;
    this.width = this.sprite.health * this.multiplier;
}

HealthBarRed = function(game, healthBar, sprite) {
    Phaser.Sprite.call(this, game, 50, 50, "health_bar_red");
    this.healthBar = healthBar;
    this.sprite = sprite;
}

HealthBarRed.prototype = Object.create(Phaser.Sprite.prototype);

HealthBarRed.prototype.constructor = HealthBarRed;

HealthBarRed.prototype.update = function() {
    this.x = this.sprite.x + this.healthBar.width;
    this.y = this.sprite.y - 50;
    this.width = 40 - this.healthBar.width;
}
