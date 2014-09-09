(function(window) {
Clown_Shark = function() {
	this.initialize();
}
Clown_Shark._SpriteSheet = new createjs.SpriteSheet({images: ["Clown Shark.png"], frames: [[0,0,156,132,0,74.14999999999998,126.80000000000001],[156,0,132,124,0,65.14999999999998,108.80000000000001],[0,132,381,333,0,282.15,307.8]]});
var Clown_Shark_p = Clown_Shark.prototype = new createjs.Sprite();
Clown_Shark_p.Sprite_initialize = Clown_Shark_p.initialize;
Clown_Shark_p.initialize = function() {
	this.Sprite_initialize(Clown_Shark._SpriteSheet);
	this.paused = false;
}
window.Clown_Shark = Clown_Shark;
}(window));

