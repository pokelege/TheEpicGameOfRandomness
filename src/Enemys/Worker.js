(function(window) {
Worker = function() {
	this.initialize();
}
Worker._SpriteSheet = new createjs.SpriteSheet({images: ["Worker.png"], frames: [[0,0,286,300,0,107.7,297.5],[0,300,366,300,0,93.7,302.5],[0,600,286,300,0,91.7,298.5]]});
var Worker_p = Worker.prototype = new createjs.Sprite();
Worker_p.Sprite_initialize = Worker_p.initialize;
Worker_p.initialize = function() {
	this.Sprite_initialize(Worker._SpriteSheet);
	this.paused = false;
}
window.Worker = Worker;
}(window));

