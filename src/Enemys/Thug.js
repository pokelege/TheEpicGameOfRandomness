(function(window) {
Thug = function() {
	this.initialize();
}
Thug._SpriteSheet = new createjs.SpriteSheet({images: ["thug.png"], frames: [[0,0,200,300,0,79.3,291.1],[0,300,200,300,0,70.3,296.1],[0,600,200,300,0,77.3,294.1]]});
var Thug_p = Thug.prototype = new createjs.Sprite();
Thug_p.Sprite_initialize = Thug_p.initialize;
Thug_p.initialize = function() {
	this.Sprite_initialize(Thug._SpriteSheet);
	this.paused = false;
}
window.Thug = Thug;
}(window));

