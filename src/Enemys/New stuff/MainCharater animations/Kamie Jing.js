(function(window) {
Kamie_Jing = function() {
	this.initialize();
}
Kamie_Jing._SpriteSheet = new createjs.SpriteSheet({images: ["Kamie Jing.png"], frames: [[0,0,200,300,0,107,296.95],[200,0,200,300,0,90,300.95],[0,300,200,300,0,99,291.95],[200,300,200,300,0,80,291.95],[0,600,200,300,0,61,291.95],[200,600,200,300,0,42,291.95]]});
var Kamie_Jing_p = Kamie_Jing.prototype = new createjs.Sprite();
Kamie_Jing_p.Sprite_initialize = Kamie_Jing_p.initialize;
Kamie_Jing_p.initialize = function() {
	this.Sprite_initialize(Kamie_Jing._SpriteSheet);
	this.paused = false;
}
window.Kamie_Jing = Kamie_Jing;
}(window));

