﻿(function(window) {
Buffin = function() {
	this.initialize();
}
Buffin._SpriteSheet = new createjs.SpriteSheet({images: ["Buffin.png"], frames: [[0,0,500,300,0,206.5,303.6],[500,0,500,300,0,206.5,287.6],[1000,0,500,352,0,206.5,326.6],[1500,0,500,397,0,206.5,373.6],[0,397,500,442,0,206.5,420.6],[500,397,500,488,0,206.5,467.6],[1000,397,500,534,0,206.5,514.6],[1500,397,500,579,0,206.5,561.6],[0,976,500,625,0,206.5,608.6],[500,976,500,670,0,206.5,655.6],[1000,976,500,716,0,206.5,702.6],[1500,976,500,762,0,206.5,749.6],[0,1738,500,762,0,206.5,749.6],[500,1738,500,762,0,206.5,749.6],[1000,1738,500,762,0,206.5,749.6],[1500,1738,500,716,0,206.5,702.6],[0,2500,500,670,0,206.5,655.6],[500,2500,500,625,0,206.5,608.6],[1000,2500,500,579,0,206.5,561.6],[1500,2500,500,534,0,206.5,514.6],[0,3170,500,488,0,206.5,467.6],[500,3170,500,442,0,206.5,420.6],[1000,3170,500,397,0,206.5,373.6],[1500,3170,500,352,0,206.5,326.6]]});
var Buffin_p = Buffin.prototype = new createjs.Sprite();
Buffin_p.Sprite_initialize = Buffin_p.initialize;
Buffin_p.initialize = function() {
	this.Sprite_initialize(Buffin._SpriteSheet);
	this.paused = false;
}
window.Buffin = Buffin;
}(window));

