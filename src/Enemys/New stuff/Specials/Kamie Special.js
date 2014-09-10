(function(window) {
Sound_Wave = function() {
	this.initialize();
}
Sound_Wave._SpriteSheet = new createjs.SpriteSheet({images: ["Kamie Special.png"], frames: [[0,0,38,149,0,-14.25,122.1],[38,0,110,216,0,-16.25,146.1],[0,216,179,273,0,-16.25,174.1],[0,489,244,319,0,-16.25,198.1]]});
var Sound_Wave_p = Sound_Wave.prototype = new createjs.Sprite();
Sound_Wave_p.Sprite_initialize = Sound_Wave_p.initialize;
Sound_Wave_p.initialize = function() {
	this.Sprite_initialize(Sound_Wave._SpriteSheet);
	this.paused = false;
}
window.Sound_Wave = Sound_Wave;
}(window));

