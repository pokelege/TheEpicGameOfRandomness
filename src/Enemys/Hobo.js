(function(window) {
Hobo = function() {
	this.initialize();
}
Hobo._SpriteSheet = new createjs.SpriteSheet({images: ["hobo.png"], frames: [[0,0,200,300,0,79.65,297.85],[0,300,200,300,0,92.65,271.85],[0,600,200,300,0,68.65,288.85]]});
var Hobo_p = Hobo.prototype = new createjs.Sprite();
Hobo_p.Sprite_initialize = Hobo_p.initialize;
Hobo_p.initialize = function() {
	this.Sprite_initialize(Hobo._SpriteSheet);
	this.paused = false;
}
window.Hobo = Hobo;
}(window));

