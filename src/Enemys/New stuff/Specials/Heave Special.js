(function(window) {
Koolaid_Jug = function() {
	this.initialize();
}
Koolaid_Jug._SpriteSheet = new createjs.SpriteSheet({images: ["Heave Special.png"], frames: [[0,0,112,114,0,49.95,96.05],[112,0,137,139,0,61.95,108.05],[249,0,154,155,0,70.95,116.05],[0,155,159,159,0,72.95,118.05],[159,155,155,154,0,70.95,116.05],[314,155,139,137,0,62.95,107.05],[0,314,114,112,0,49.95,95.05],[114,314,139,137,0,62.95,107.05],[253,314,155,154,0,70.95,116.05],[0,468,160,160,0,72.95,119.05],[160,468,233,185,0,93.95,88.05]]});
var Koolaid_Jug_p = Koolaid_Jug.prototype = new createjs.Sprite();
Koolaid_Jug_p.Sprite_initialize = Koolaid_Jug_p.initialize;
Koolaid_Jug_p.initialize = function() {
	this.Sprite_initialize(Koolaid_Jug._SpriteSheet);
	this.paused = false;
}
window.Koolaid_Jug = Koolaid_Jug;
}(window));

