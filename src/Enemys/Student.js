(function(window) {
Student = function() {
	this.initialize();
}
Student._SpriteSheet = new createjs.SpriteSheet({images: ["Student.png"], frames: [[0,0,200,300,0,100.95,292.45],[0,300,200,300,0,94.95,293.45],[0,600,200,300,0,104.95,291.45]]});
var Student_p = Student.prototype = new createjs.Sprite();
Student_p.Sprite_initialize = Student_p.initialize;
Student_p.initialize = function() {
	this.Sprite_initialize(Student._SpriteSheet);
	this.paused = false;
}
window.Student = Student;
}(window));

