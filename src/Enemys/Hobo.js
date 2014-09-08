(function(window) {
Hobo = function() {
	this.initialize();
}
Hobo._SpriteSheet = new createjs.SpriteSheet({images: ["Hobo.png"], frames: [[0,0,69,93,0,23.9,20.1],[69,0,92,107,0,38.9,19.1],[161,0,76,100,0,27.9,22.1]]});
var Hobo_p = Hobo.prototype = new createjs.Sprite();
Hobo_p.Sprite_initialize = Hobo_p.initialize;
Hobo_p.initialize = function() {
	this.Sprite_initialize(Hobo._SpriteSheet);
	this.paused = false;
}
window.Hobo = Hobo;
}(window));

