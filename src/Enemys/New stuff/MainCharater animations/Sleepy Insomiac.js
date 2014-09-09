(function(window) {
Insomiac = function() {
	this.initialize();
}
Insomiac._SpriteSheet = new createjs.SpriteSheet({images: ["Sleepy Insomiac.png"], frames: [[0,0,300,400,0,192.5,405],[0,400,300,400,0,209.5,403]]});
var Insomiac_p = Insomiac.prototype = new createjs.Sprite();
Insomiac_p.Sprite_initialize = Insomiac_p.initialize;
Insomiac_p.initialize = function() {
	this.Sprite_initialize(Insomiac._SpriteSheet);
	this.paused = false;
}
window.Insomiac = Insomiac;
}(window));

