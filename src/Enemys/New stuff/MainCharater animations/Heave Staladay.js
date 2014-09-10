(function(window) {
Heave_Staliday = function() {
	this.initialize();
}
Heave_Staliday._SpriteSheet = new createjs.SpriteSheet({images: ["Heave Staladay.png"], frames: [[0,0,200,300,0,103.5,294.05],[200,0,200,300,0,90.5,299.05],[0,300,200,300,0,88.5,306.05],[200,300,283,300,0,90.5,299.05]]});
var Heave_Staliday_p = Heave_Staliday.prototype = new createjs.Sprite();
Heave_Staliday_p.Sprite_initialize = Heave_Staliday_p.initialize;
Heave_Staliday_p.initialize = function() {
	this.Sprite_initialize(Heave_Staliday._SpriteSheet);
	this.paused = false;
}
window.Heave_Staliday = Heave_Staliday;
}(window));

