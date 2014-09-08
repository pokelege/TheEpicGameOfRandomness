(function(window) {
Baker = function() {
	this.initialize();
}
Baker._SpriteSheet = new createjs.SpriteSheet({images: ["Baker.png"], frames: [[0,0,200,300,0,87.3,288.3],[0,300,250,300,0,85.3,290.3],[0,600,200,300,0,89.3,292.3]]});
var Baker_p = Baker.prototype = new createjs.Sprite();
Baker_p.Sprite_initialize = Baker_p.initialize;
Baker_p.initialize = function() {
	this.Sprite_initialize(Baker._SpriteSheet);
	this.paused = false;
}
window.Baker = Baker;
}(window));

