var MODE_TITLE = "title";
var MODE_TOCOLLIDEORNOTTOCOLLIDE = "tocol";
var MODE_INSTRUCTIONS = "instructions";
var MODE_GAME = "game";
var MODE_GAMEOVER = "gameover";
var MODE_CREDITS = "credits";
var mode = MODE_TITLE;
var TITLEBUTTONSIZE = 12;
var AUDIOBUTTIONSIZE = 6;
var MAINFPS = 30;
var MAXFPS = 60;
var goodCollision = false;
var characterScale = 0.75;
var titleManifest =
[
	{ src: "images/title.jpg", id: "title" },
	{ src: "images/titleAnimation.png", id: "titleAnimation" },
	{ src: "images/toCollide.png", id: "toCollide" },
	{ src: "images/toNotCollide.png", id: "toNotCollide" },
	{ src: "images/titleButtons.jpg", id: "titleButtons" },
	{ src: "images/audio.jpg", id: "audioButton" }
];

var instructionManifest =
	[
		{ src: "images/instructions.jpg", id: "instructions" },
		{ src: "images/credits.jpg", id: "credits" }
	];
var gameManifest =
	[
	{ src: "images/background.jpg", id: "background" },
	{ src: "images/gameover.jpg", id: "gameover" },
	{ src: "images/gameOverAnimation.png", id: "gameOverAnimation" },
	{ src: "images/levelsign.png", id: "levelsign" },
	{ src: "audio/InGame.mp3", id: "music" },
	{ src: "images/character.png", id: "character" },
	{ src: "images/floor.png", id: "floor" },
	{ src: "images/enemy.png", id: "enemy" },
	{ src: "images/health.png", id: "health" },
	{ src: "images/fpsBar.png", id: "fpsBar" },
	{ src: "images/bullet.png", id: "bullet" },
	{ src: "images/hud.png", id: "hud" },
	{ src: "images/hitBadParticle.png", id: "hitBadParticle" },
	{ src: "images/BGParticle.png", id: "BGParticle" },
	{ src: "images/getHealthParticle.png", id: "getHealthParticle" },
	{ src: "images/jamie.jpg", id: "jamie" },
	{ src: "audio/getHealth.mp3", id: "getHealth" },
	{ src: "audio/shoot.mp3", id: "shoot" },
	{ src: "audio/hitBad.mp3", id: "hitBad" },
	{ src: "audio/hitGood.mp3", id: "hitGood" }
	];
var stage;
var titleQueue, titleScreen, playButton, menuButton, creditsButton, audioButton, titleAnimation, toCollide, toNotCollide;

var instructionQueue, instructionScreen, credits;

var gameQueue, backgroundScreen, gameoverScreen, gameOverAnimation, levelFrame, music, getHealth, shoot, hitBad, hitGood, character, enemy, health, fpsBar, bullet, floor, hud, jamie, hitBadParticle, BGParticle, getHealthParticle;

function setUpCanvas()
{
	var canvas = document.getElementById( "game" );
	canvas.width = 800;
	canvas.height = 600;
	stage = new createjs.Stage( canvas );
	stage.enableMouseOver();
}

function startLoad()
{
	titleQueue = new createjs.LoadQueue( true, "assets/" );
	titleQueue.on( "complete", titleLoaded, this );
	titleQueue.loadManifest( titleManifest );
}

function titleLoaded()
{
	titleScreen = new createjs.Bitmap( titleQueue.getResult( "title" ) );

	var playButtonSheet = new createjs.SpriteSheet
		(
	{
		images: [titleQueue.getResult( "titleButtons" )],
		frames:
			{
				regX: 150 / 2,
				regY: 30 / 2,
				width: 150,
				height: 30,
				count: TITLEBUTTONSIZE
			},
		animations:
			{
				Neutral: [0, 0],
				Hover: [1, 1],
				Click: [2, 2]
			}
	}
		);

	playButton = new createjs.Sprite( playButtonSheet );

	var instructionsButtonSheet = new createjs.SpriteSheet
	(
{
	images: [titleQueue.getResult( "titleButtons" )],
	frames:
		{
			regX: 150 / 2,
			regY: 30 / 2,
			width: 150,
			height: 30,
			count: TITLEBUTTONSIZE
		},
	animations:
		{
			Neutral: [3, 3],
			Hover: [4, 4],
			Click: [5, 5]
		}
}
	);

	instructionsButton = new createjs.Sprite( instructionsButtonSheet );


	var menuButtonSheet = new createjs.SpriteSheet
(
{
	images: [titleQueue.getResult( "titleButtons" )],
	frames:
		{
			regX: 150 / 2,
			regY: 30 / 2,
			width: 150,
			height: 30,
			count: TITLEBUTTONSIZE
		},
	animations:
		{
			Neutral: [6, 6],
			Hover: [7, 7],
			Click: [8, 8]
		}
}
);

	menuButton = new createjs.Sprite( menuButtonSheet );

	var creditsButtonSheet = new createjs.SpriteSheet
(
{
	images: [titleQueue.getResult( "titleButtons" )],
	frames:
		{
			regX: 150 / 2,
			regY: 30 / 2,
			width: 150,
			height: 30,
			count: TITLEBUTTONSIZE
		},
	animations:
		{
			Neutral: [9, 9],
			Hover: [10, 10],
			Click: [11, 11]
		}
}
);

	creditsButton = new createjs.Sprite( creditsButtonSheet );

	var audioButtonSheet = new createjs.SpriteSheet
(
{
	images: [titleQueue.getResult( "audioButton" )],
	frames:
		{
			regX: 30 / 2,
			regY: 30 / 2,
			width: 30,
			height: 30,
			count: AUDIOBUTTIONSIZE
		},
	animations:
		{
			OnNeutral:
			{
				frames: [0, 0],
			},
			OnHover:
			{
				frames: [1, 1],
			},
			OnClick:
			{
				frames: [2, 2],
			},
			OffNeutral:
			{
				frames: [3, 3],
			},
			OffHover:
			{
				frames: [4, 4],
			},
			OffClick:
			{
				frames: [5, 5],
			}
		}
}
);

	audioButton = new createjs.Sprite( audioButtonSheet );


	var titleAnimationSheet = new createjs.SpriteSheet
		(
		{
			images: [titleQueue.getResult( "titleAnimation" )],
			frames: 
				{
					regX: 138 / 2,
					regY: 165 / 2,
					width: 138,
					height: 165,
				},
			animations:
				{
					Normal: [0, 59]
				}
		}
		);
	titleAnimation = new createjs.Sprite( titleAnimationSheet, "Normal" );
	titleAnimation.x = stage.canvas.width / 2;
	titleAnimation.y = stage.canvas.height / 2;
	titleAnimation.scaleX = 1.5;
	titleAnimation.scaleY = 1.5;

	var toCollideSheet = new createjs.SpriteSheet
	(
		{
			images: [titleQueue.getResult( "toCollide" )],
			frames:
				{
					regX: 276/2,
					regY: 163/2,
					width: 276,
					height: 163,
				},
			animations:
			{
				Normal: [0, 59]
			}
		}
	);
	toCollide = new createjs.Sprite( toCollideSheet, "Normal" );

	var toNotCollideSheet = new createjs.SpriteSheet
(
	{
		images: [titleQueue.getResult( "toNotCollide" )],
		frames:
			{
				regX: 281 / 2,
				regY: 290 / 2,
				width: 281,
				height: 290,
			},
		animations:
		{
			Normal: [0, 59]
		}
	}
);
	toNotCollide = new createjs.Sprite( toNotCollideSheet, "Normal" );

	instructionQueue = new createjs.LoadQueue( true, "assets/" );
	instructionQueue.on( "complete", instructionsLoaded, this );
	instructionQueue.loadManifest( instructionManifest );
}

function instructionsLoaded()
{
	instructionScreen = new createjs.Bitmap( instructionQueue.getResult( "instructions" ) );
	credits = new createjs.Bitmap( instructionQueue.getResult( "credits" ) );

	gameQueue = new createjs.LoadQueue( true, "assets/" );
	createjs.Sound.alternateExtensions = ["mp3"];
	gameQueue.installPlugin( createjs.Sound );
	gameQueue.on( "complete", gameLoaded, this );
	gameQueue.loadManifest( gameManifest );
}

function gameLoaded()
{

	var characterSheet = new createjs.SpriteSheet
	(
		{
			images: [gameQueue.getResult( "character" )],
			frames:
				{
					regX: 92/2,
					regY: 146 / 2,
					width: 92,
					height: 146,
				},
			animations:
				{
					NeutralFront: [0, 0, "NeutralFront"],
					Run: [1, 4, "RunLoop"],
					RunLoop: [5, 24, "RunLoop"]
				}
		}
	);
	character = new createjs.Sprite( characterSheet, "NeutralFront" );
	character.scaleY = characterScale;
	character.scaleX = characterScale;

	var enemySheet = new createjs.SpriteSheet
		(
		{
			images: [gameQueue.getResult( "enemy" )],
			frames:
				[[0, 0, 173, 134, 0, 109, 83], [0, 0, 173, 134, 0, 109, 83], [178, 0, 183, 144, 0, 114, 87], [0, 149, 195, 155, 0, 120, 93], [200, 149, 205, 166, 0, 125, 98], [0, 320, 217, 178, 0, 131, 104], [222, 320, 228, 189, 0, 137, 109], [0, 514, 240, 199, 0, 143, 114], [245, 514, 250, 211, 0, 148, 120], [0, 730, 265, 224, 0, 155, 127]],
			animations:
				{
					Neutral: [0, 0],
					Die: [1, 9, false]
				}
		}
		);
	enemy = new createjs.Sprite( enemySheet, "Neutral" );
	enemy.on( "animationend", function ( evt ) { if ( evt.name == "Die" ) evt.target.visible = false; } );

	var healthSheet = new createjs.SpriteSheet
	(
		{
			images: [gameQueue.getResult( "health" )],
			frames: [[0, 0, 109, 157, 0, 48.4, 103.15], [109, 0, 109, 158, 0, 48.4, 104.15], [218, 0, 109, 160, 0, 48.4, 106.15], [327, 0, 109, 162, 0, 48.4, 108.15], [0, 162, 112, 163, 0, 51.4, 109.15], [112, 162, 116, 166, 0, 55.4, 112.15], [228, 162, 111, 163, 0, 50.4, 109.15], [339, 162, 109, 161, 0, 48.4, 107.15], [0, 328, 109, 159, 0, 48.4, 105.15], [109, 328, 109, 157, 0, 48.4, 103.15]],
			animations:
			{
				Neutral: [0, 8, "Neutral"]
			}
		}
	);
	health = new createjs.Sprite( healthSheet, "Neutral" );
	var fpsBarSheet = new createjs.SpriteSheet
		(
		{
			images: [gameQueue.getResult( "fpsBar" )],
			frames:
				{
					regX: 0,
					regY: 0,
					width: 110,
					height: 110,
				},
			animations:
				{
					Good: [0, 29],
					Bad: [30, 59],
					ToBad: [60, 89, "Bad"],
					ToGood:[90,119, "Good"]
				}
		}
		);
	fpsBar = new createjs.Sprite( fpsBarSheet, "Good" );
	fpsBar.scaleY = 0.1;
	fpsBar.regY = 100 * 0.1 * 0.5;


	var bulletSheet = new createjs.SpriteSheet
		(
		{
			images: [gameQueue.getResult( "bullet" )],
			frames:
				{
					regX: 0,
					regY: 24 / 2,
					width: 188,
					height: 24,
				},
			animations:
				{
					Normal: [0, 40]
				}
		}
		);
	bullet = new createjs.Sprite( bulletSheet, "Normal" );
	bullet.scaleX = 0.5;

	var hitBadParticleSheet = new createjs.SpriteSheet
	(
		{
			images: [gameQueue.getResult( "hitBadParticle" )],
			frames: [[0, 0, 21, 21, 0, 26.950000000000003, 6.950000000000003], [21, 0, 31, 31, 0, 31.950000000000003, 11.950000000000003], [52, 0, 41, 41, 0, 36.95, 16.950000000000003], [93, 0, 53, 53, 0, 42.95, 22.950000000000003], [146, 0, 63, 63, 0, 47.95, 27.950000000000003], [209, 0, 73, 73, 0, 52.95, 32.95], [282, 0, 85, 85, 0, 58.95, 38.95], [367, 0, 95, 95, 0, 63.95, 43.95], [0, 95, 107, 106, 0, 69.95, 49.95], [107, 95, 117, 117, 0, 74.95, 54.95], [224, 95, 127, 127, 0, 79.95, 59.95], [351, 95, 139, 139, 0, 85.95, 65.95], [0, 234, 149, 149, 0, 90.95, 70.95], [149, 234, 161, 160, 0, 96.95, 76.95], [310, 234, 171, 171, 0, 101.95, 81.95]],
			animations:
				{
					Normal: [0, 14, false]
				}
		}
	);

	hitBadParticle = new createjs.Sprite( hitBadParticleSheet, "Normal" );
	hitBadParticle.on( "animationend", function ( evt ) { evt.target.visible = false; } );

	var floorSheet = new createjs.SpriteSheet
(
	{
		images: [gameQueue.getResult( "floor" )],
		frames:
			{
				regX: 0,
				regY: 41,
				width: 182,
				height: 41,
			},
		animations:
			{
				Normal: [0, 59]
			}
	}
);
	floor = new createjs.Sprite( floorSheet, "Normal" );

	var BGParticleSheet = new createjs.SpriteSheet
	(
		{
			images: [gameQueue.getResult( "BGParticle" )],
			frames:
			{
				regX: 116/2,
				regY: 113/2,
				width: 116,
				height: 113,
			},
			animations:
				{
					Normal: [0, 39]
				}
		}
	);

	BGParticle = new createjs.Sprite( BGParticleSheet, "Normal" );

	var getHealthParticleSheet = new createjs.SpriteSheet
	(
		{
			images: [gameQueue.getResult( "getHealthParticle" )],
			frames: [[0, 0, 9, 8, 0, 5, 1.25], [14, 0, 19, 17, 0, 10, 5.25], [38, 0, 31, 27, 0, 16, 10.25], [74, 0, 41, 37, 0, 21, 15.25], [120, 0, 51, 47, 0, 26, 20.25], [176, 0, 63, 56, 0, 32, 25.25], [244, 0, 73, 65, 0, 37, 29.25], [322, 0, 83, 75, 0, 42, 34.25], [410, 0, 95, 85, 0, 48, 39.25], [0, 90, 105, 95, 0, 53, 44.25], [110, 90, 116, 104, 0, 58, 49.25], [231, 90, 127, 113, 0, 64, 53.25], [363, 90, 137, 123, 0, 69, 58.25], [0, 218, 148, 133, 0, 74, 63.25], [153, 218, 159, 143, 0, 80, 68.25], [317, 218, 169, 152, 0, 85, 73.25], [0, 375, 180, 161, 0, 90, 77.25], [185, 375, 191, 171, 0, 96, 82.25], [0, 551, 201, 181, 0, 101, 87.25], [206, 551, 213, 190, 0, 107, 92.25]],
			animations:
{
	Normal: [0, 19, false]
}
		}
	);

	getHealthParticle = new createjs.Sprite( getHealthParticleSheet, "Normal" );
	getHealthParticle.on( "animationend", function ( evt ) { evt.target.visible = false; } );
	getHealthParticle.scaleX = 0.75;
	getHealthParticle.scaleY = 0.75;

	var hudSheet = new createjs.SpriteSheet
	(
		{
			images: [gameQueue.getResult( "hud" )],
			frames:
				{
					regX: 0,
					regY: 0,
					width: 110,
					height: 110,
				},
			animations:
				{
					Normal:[0,29]
				}
		}
	);

	hud = new createjs.Sprite( hudSheet, "Normal" );
	jamie = new createjs.Bitmap( gameQueue.getResult( "jamie" ) );
	jamie.regX = jamie.getBounds().width;
	jamie.x = stage.canvas.width;

	backgroundScreen = new createjs.Bitmap( gameQueue.getResult( "background" ) );
	gameoverScreen = new createjs.Bitmap( gameQueue.getResult( "gameover" ) );
	levelFrame = new createjs.Bitmap( gameQueue.getResult( "levelsign" ) );
	music = new createjs.Sound.createInstance( "music" );
	music.setVolume( 0.50 );
	getHealth = new createjs.Sound.createInstance( "getHealth" );
	shoot = new createjs.Sound.createInstance( "shoot" );
	hitBad = new createjs.Sound.createInstance( "hitBad" );
	hitGood = new createjs.Sound.createInstance( "hitGood" );

	var gameOverAnimationSheet = new createjs.SpriteSheet
	(
		{
			images: [gameQueue.getResult( "gameOverAnimation" )],
			frames: [[0, 0, 247, 112, 0, 143, 85], [252, 0, 244, 113, 0, 140, 86], [501, 0, 242, 113, 0, 138, 86], [748, 0, 240, 113, 0, 136, 86], [0, 118, 238, 114, 0, 134, 87], [243, 118, 236, 114, 0, 132, 87], [484, 118, 234, 115, 0, 130, 88], [723, 118, 232, 115, 0, 128, 88], [0, 238, 230, 115, 0, 126, 88], [235, 238, 228, 116, 0, 124, 89], [468, 238, 225, 116, 0, 121, 89], [698, 238, 223, 116, 0, 119, 89], [0, 359, 222, 117, 0, 118, 90], [227, 359, 222, 117, 0, 118, 90], [454, 359, 222, 118, 0, 118, 91], [681, 359, 222, 118, 0, 118, 91], [0, 482, 222, 118, 0, 118, 91], [227, 482, 222, 119, 0, 118, 92], [454, 482, 222, 119, 0, 118, 92], [681, 482, 222, 120, 0, 118, 93], [0, 607, 223, 119, 0, 119, 92], [228, 607, 224, 119, 0, 120, 92], [457, 607, 225, 118, 0, 121, 91], [687, 607, 227, 118, 0, 123, 91], [0, 731, 228, 118, 0, 124, 91], [233, 731, 229, 117, 0, 125, 90], [467, 731, 230, 117, 0, 126, 90], [702, 731, 232, 117, 0, 128, 90], [0, 854, 233, 116, 0, 129, 89], [238, 854, 234, 116, 0, 130, 89], [477, 854, 235, 116, 0, 131, 89], [717, 854, 237, 115, 0, 133, 88], [0, 975, 238, 115, 0, 134, 88], [243, 975, 239, 114, 0, 135, 87], [487, 975, 240, 114, 0, 136, 87], [732, 975, 242, 114, 0, 138, 87], [0, 1095, 243, 113, 0, 139, 86], [248, 1095, 244, 113, 0, 140, 86], [497, 1095, 245, 113, 0, 141, 86], [747, 1095, 247, 112, 0, 143, 85], [0, 1213, 244, 112, 0, 140, 85], [249, 1213, 242, 113, 0, 138, 86], [496, 1213, 240, 113, 0, 136, 86], [741, 1213, 238, 113, 0, 134, 86], [0, 1331, 236, 114, 0, 132, 87], [241, 1331, 234, 114, 0, 130, 87], [480, 1331, 232, 115, 0, 128, 88], [717, 1331, 230, 115, 0, 126, 88], [235, 238, 228, 116, 0, 124, 88], [0, 1451, 225, 116, 0, 121, 89], [230, 1451, 223, 116, 0, 119, 89], [458, 1451, 222, 116, 0, 118, 89], [685, 1451, 222, 117, 0, 118, 90], [227, 359, 222, 117, 0, 118, 90], [454, 359, 222, 118, 0, 118, 91], [681, 359, 222, 118, 0, 118, 91], [0, 482, 222, 118, 0, 118, 91], [227, 482, 222, 119, 0, 118, 92], [454, 482, 222, 119, 0, 118, 92], [681, 482, 222, 120, 0, 118, 93], [0, 607, 223, 119, 0, 119, 92], [228, 607, 224, 119, 0, 120, 92], [457, 607, 225, 118, 0, 121, 91], [687, 607, 227, 118, 0, 123, 91], [0, 731, 228, 118, 0, 124, 91], [233, 731, 229, 117, 0, 125, 90], [467, 731, 230, 117, 0, 126, 90], [702, 731, 232, 117, 0, 128, 90], [0, 854, 233, 116, 0, 129, 89], [238, 854, 234, 116, 0, 130, 89], [0, 1573, 235, 116, 0, 131, 89], [717, 854, 237, 115, 0, 133, 88], [240, 1573, 238, 115, 0, 134, 88], [483, 1573, 239, 114, 0, 135, 87], [727, 1573, 240, 114, 0, 136, 87], [0, 1694, 242, 114, 0, 138, 87], [247, 1694, 243, 113, 0, 139, 86], [495, 1694, 244, 113, 0, 140, 86], [744, 1694, 245, 113, 0, 141, 86], [0, 0, 247, 112, 0, 143, 85]],
			animations:
				{
					Normal: [0, 78]
				}
		}
	);
	gameOverAnimation = new createjs.Sprite( gameOverAnimationSheet, "Normal" );
	gameOverAnimation.x = stage.canvas.width / 2;
	gameOverAnimation.y = stage.canvas.height / 2;
}

function removeAll()
{
	createjs.Ticker.setFPS( 30 );
	if ( titleInitialized )
	{
		titleDelete();
	}
	if ( collisionChooserInitialized )
	{
		collisionChooserDelete();
	}
	if ( instructionsInitialized )
	{
		instructionsDelete();
	}

	if ( creditsInitialized )
	{
		creditsDelete();
	}

	if ( gameInitialized )
	{
		gameDelete();
	}

	if ( gameOverInitialized )
	{
		gameOverDelete();
	}

	if ( loadingInitialized )
	{
		loadingDelete();
	}
}


//#region title
var titleInitialized = false;
function titleInit()
{
	stage.addChild( titleScreen );

	stage.addChild( titleAnimation );

	stage.addChild( playButton );
	stage.addChild( instructionsButton );
	stage.addChild( creditsButton );
	playButton.x = stage.canvas.width - ( 150 * 2.5 );
	playButton.y = stage.canvas.height - ( 30 / 2 );
	instructionsButton.x = stage.canvas.width - ( 150 * 1.5 );
	instructionsButton.y = stage.canvas.height - ( 30 / 2 );
	creditsButton.x = stage.canvas.width - ( 150 * 0.5 );
	creditsButton.y = stage.canvas.height - ( 30 / 2 );
	playButton.gotoAndPlay( "Neutral" );
	playButton.on( "mouseout", function playHover( evt ) { playButton.gotoAndPlay( "Neutral" ); }, this );
	playButton.on( "mouseover", function playHover( evt ) { playButton.gotoAndPlay( "Hover" ); }, this );
	playButton.on( "mousedown", function playHover( evt ) { playButton.gotoAndPlay( "Click" ); }, this );
	playButton.on( "click", function playHover( evt ) { playButton.gotoAndPlay( "Neutral" ); mode = MODE_TOCOLLIDEORNOTTOCOLLIDE; }, this );

	instructionsButton.gotoAndPlay( "Neutral" );
	instructionsButton.on( "mouseout", function playHover( evt ) { instructionsButton.gotoAndPlay( "Neutral" ); }, this );
	instructionsButton.on( "mouseover", function playHover( evt ) { instructionsButton.gotoAndPlay( "Hover" ); }, this );
	instructionsButton.on( "mousedown", function playHover( evt ) { instructionsButton.gotoAndPlay( "Click" ); }, this );
	instructionsButton.on( "click", function playHover( evt ) { instructionsButton.gotoAndPlay( "Neutral" ); mode = MODE_INSTRUCTIONS }, this );

	creditsButton.gotoAndPlay( "Neutral" );
	creditsButton.on( "mouseout", function playHover( evt ) { creditsButton.gotoAndPlay( "Neutral" ); }, this );
	creditsButton.on( "mouseover", function playHover( evt ) { creditsButton.gotoAndPlay( "Hover" ); }, this );
	creditsButton.on( "mousedown", function playHover( evt ) { creditsButton.gotoAndPlay( "Click" ); }, this );
	creditsButton.on( "click", function playHover( evt ) { creditsButton.gotoAndPlay( "Neutral" ); mode = MODE_CREDITS }, this );

	stage.addChild( audioButton );
	audioButton.x = ( 30 * 0.5 );
	audioButton.y = stage.canvas.height - ( 30 * 0.5 );
	if ( mute ) audioButton.gotoAndPlay( "OffNeutral" );
	else audioButton.gotoAndPlay( "OnNeutral" );
	audioButton.on( "mouseout", function playHover( evt ) { if ( mute ) audioButton.gotoAndPlay( "OffNeutral" ); else audioButton.gotoAndPlay( "OnNeutral" ); }, this );
	audioButton.on( "mouseover", function playHover( evt ) { if ( mute ) audioButton.gotoAndPlay( "OffHover" ); else audioButton.gotoAndPlay( "OnHover" ); }, this );
	audioButton.on( "mousedown", function playHover( evt ) { if ( mute ) audioButton.gotoAndPlay( "OffClick" ); else audioButton.gotoAndPlay( "OnClick" ); }, this );
	audioButton.on( "click", function playHover( evt ) { mute = mute == false; if ( mute ) audioButton.gotoAndPlay( "OffNeutral" ); else audioButton.gotoAndPlay( "OnNeutral" ); }, this );
	titleInitialized = true;
}
function titleDelete()
{
	stage.removeAllChildren();
	playButton.removeAllEventListeners();
	instructionsButton.removeAllEventListeners();
	creditsButton.removeAllEventListeners();
	audioButton.removeAllEventListeners();
	titleInitialized = false;
}
function titleUpdate()
{
	if ( !titleInitialized )
	{
		removeAll();
		titleInit();
	}
}
//#endregion

//#region collisionChooser
var collisionChooserInitialized = false;
function collisionChooserInit()
{
	var rect = new createjs.Shape();
	rect.graphics.beginFill( "#000000" ).drawRect( 0, 0, stage.canvas.width, stage.canvas.height );
	stage.addChild( rect );

	var rect2 = new createjs.Shape();
	rect2.graphics.beginFill( "#555555" ).drawRect( -1, 0, 1, stage.canvas.height );
	rect2.x = stage.canvas.width / 2;
	stage.addChild( rect2 );

	var to = new createjs.Text( "To", "26px Comic Sans MS", "#FFF" );
	to.regX = to.getMeasuredWidth() / 2;
	to.x = stage.canvas.width / 2;

	var collide = new createjs.Text( "Collide", "20px Comic Sans MS", "#FFF" );
	collide.regX = collide.getMeasuredWidth() / 2;
	collide.x = stage.canvas.width / 4;
	collide.y = stage.canvas.height / 4;

	var or = new createjs.Text( "or", "20px Comic Sans MS", "#FFF" );
	or.regX = or.getMeasuredWidth() / 2;
	or.x = stage.canvas.width / 2;
	or.y = stage.canvas.height / 4;

	var not = new createjs.Text( "Not Collide", "20px Comic Sans MS", "#FFF" );
	not.regX = not.getMeasuredWidth() / 2;
	not.x = stage.canvas.width / 4 * 3;
	not.y = stage.canvas.height / 4;

	var click = new createjs.Text( "<-Click->", "20px Comic Sans MS", "#FFF" );
	click.regX = click.getMeasuredWidth() / 2;
	click.x = stage.canvas.width / 2;
	click.y = stage.canvas.height / 2;

	stage.addChild( to );
	stage.addChild( collide );
	stage.addChild( or );
	stage.addChild( not );
	stage.addChild( click );
	toCollide.x = stage.canvas.width / 4;
	toCollide.y = stage.canvas.height / 4 * 3;
	stage.addChild( toCollide );

	toNotCollide.x = stage.canvas.width / 4 * 3;
	toNotCollide.y = stage.canvas.height / 4 * 3;
	stage.addChild( toNotCollide );
	stage.on( "click", function playHover( evt )
	{ mode = MODE_GAME; goodCollision = evt.stageX < stage.canvas.width /2;
	}, this );
	collisionChooserInitialized = true;
}

function collisionChooserDelete()
{
	stage.removeAllChildren();
	stage.removeAllEventListeners();
	collisionChooserInitialized = false;
}

function collisionChooserUpdate()
{
	if ( !collisionChooserInitialized )
	{
		removeAll();
		collisionChooserInit();
	}
}
//#endregion

//#region credits
var creditsInitialized = false;
function creditsInit()
{
	stage.addChild( credits );
	stage.addChild( menuButton );
	menuButton.x = stage.canvas.width - ( 150 * 0.5 );
	menuButton.y = stage.canvas.height - ( 30 / 2 );
	menuButton.gotoAndPlay( "Neutral" );
	menuButton.on( "mouseout", function playHover( evt ) { menuButton.gotoAndPlay( "Neutral" ); }, this );
	menuButton.on( "mouseover", function playHover( evt ) { menuButton.gotoAndPlay( "Hover" ); }, this );
	menuButton.on( "mousedown", function playHover( evt ) { menuButton.gotoAndPlay( "Click" ); }, this );
	menuButton.on( "click", function playHover( evt ) { menuButton.gotoAndPlay( "Neutral" ); mode = MODE_TITLE }, this );
	creditsInitialized = true;
}

function creditsDelete()
{
	stage.removeAllChildren();
	menuButton.removeAllEventListeners();
	creditsInitialized = false;
}

function creditsUpdate()
{
	if ( !creditsInitialized )
	{
		removeAll();
		creditsInit();
	}
}
//#endregion

//#region instructions
var instructionsInitialized = false;
function instructionsInit()
{
	stage.addChild( instructionScreen );
	stage.addChild( menuButton );
	menuButton.x = stage.canvas.width - ( 150 * 0.5 );
	menuButton.y = stage.canvas.height - ( 30 / 2 );
	menuButton.gotoAndPlay( "Neutral" );
	menuButton.on( "mouseout", function playHover( evt ) { menuButton.gotoAndPlay( "Neutral" ); }, this );
	menuButton.on( "mouseover", function playHover( evt ) { menuButton.gotoAndPlay( "Hover" ); }, this );
	menuButton.on( "mousedown", function playHover( evt ) { menuButton.gotoAndPlay( "Click" ); }, this );
	menuButton.on( "click", function playHover( evt ) { menuButton.gotoAndPlay( "Neutral" ); mode = MODE_TITLE }, this );
	instructionsInitialized = true;
}

function instructionsDelete()
{
	stage.removeAllChildren();
	menuButton.removeAllEventListeners();
	instructionsInitialized = false;
}

function instructionsUpdate()
{
	if ( !instructionsInitialized )
	{
		removeAll();
		instructionsInit();
	}
}
//#endregion

//#region game
var gameInitialized = false;
var GRAVITY = 200;
var life = 30;
var scoreDisplay, lifeDisplay, levelFrameText, levelFrameStaticText;
var levelFrameContainer;
var animated = false;
var levelFrameAnimator;
var mute = false;
var highScore = 0;
var floorArray;
var distance;
var distanceBoundary;
var hitBadParticleArray;
var getHealthParticleArray;
var score;
var lastDistance =
	{
		distance: 0,
		index: 0
	};
var enemyArray;

var healthArray;
var jamieMode;
function BulletInstance( bulletSprite )
{
	this.direction = 1;
	this.sprite = bulletSprite;
};

var bulletArray;

var BGParticleArray;

function levelFrameAniFinished( tween )
{
	levelFrameContainer.alpha = 1;
	levelFrameContainer.visible = false;
	levelFrameAnimator = null;
	animated = true;
}

function showLevelFrame()
{
	levelFrameText.text = Math.floor( highScore );
	levelFrameContainer.visible = true;
	levelFrameAnimator = new createjs.Tween.get( levelFrameContainer, { loop: false } )
	.wait( 2000 )
	.to( { alpha: 0 }, 1000, createjs.Ease.sineIn )
	.call( levelFrameAniFinished );
	animated = false;
}



function gameInit()
{
	stage.addChild( backgroundScreen );
	lastKey = 0;

	jamieHold = false;
	jamieMode = false;
	life = 30;
	lastLife = life;
	scrollspeed = 50;
	time = 0;
	music.play( { loop: -1 });

	BGParticleArray = new Array();

	for ( i = 0; i < 50; i++ )
	{
		BGParticleArray.push( BGParticle.clone() );
		BGParticleArray[i].x = Math.random() * stage.canvas.width;
		BGParticleArray[i].y = Math.random() * stage.canvas.height;
		BGParticleArray[i].scaleX = ( Math.random() * 0.75 ) + 0.25;
		BGParticleArray[i].scaleY = BGParticleArray[i].scaleX;
		BGParticleArray[i].gotoAndPlay( Math.random() * 35 );
		BGParticleArray[i].alpha = BGParticleArray[i].scaleX;
		stage.addChild( BGParticleArray[i] );
	}


	floorArray = new Array();
	floorArray.push( floor.clone() );
	floorArray[0].y = stage.canvas.height / 2;
	floorArray[0].gotoAndPlay( Math.random() * 50 );
	lastDistance.distance = ( floorArray[0].getBounds().width * floorArray[0].scaleX );
	lastDistance.index = 0;
	stage.addChild( floorArray[0] );
	for ( i = 1; i < 10; i++ )
	{
		floorArray.push( floor.clone() );
		floorArray[i].x = ( floorArray[lastDistance.index].getBounds().width * floorArray[lastDistance.index].scaleX ) + floorArray[lastDistance.index].x;
		var generatedDistance = ( ( stage.canvas.height - ( 2 * floorArray[i].getBounds().height * floorArray[i].scaleY ) ) * Math.random() ) + ( 2 * floorArray[i].getBounds().height * floorArray[i].scaleY );
		if ( generatedDistance < floorArray[lastDistance.index].y - character.getBounds().height + ( floorArray[i].getBounds().height * floorArray[i].scaleY ) ) generatedDistance = floorArray[lastDistance.index].y - character.getBounds().height + ( floorArray[i].getBounds().height * floorArray[i].scaleY );
		//var generatedDistance = ( ( Math.random() * 2 ) - 1 ) * character.getBounds().height;
		//generatedDistance += floorArray[lastDistance.index].y;

		//if ( generatedDistance > stage.canvas.height ) generatedDistance = stage.canvas.height;
		//else if ( generatedDistance < 2 * floorArray[i].getBounds().height * floorArray[i].scaleY ) generatedDistance = 2 * floorArray[i].getBounds().height * floorArray[i].scaleY;
		floorArray[i].y = generatedDistance;
		floorArray[i].gotoAndPlay( Math.random() * 50 );
		//floorArray[i].y = ( ( stage.canvas.height - ( 2 * floorArray[i].getBounds().height * floorArray[i].scaleY ) ) * Math.random() ) + ( 2 * floorArray[i].getBounds().height * floorArray[i].scaleY );
		lastDistance.distance += ( floorArray[i].getBounds().width * floorArray[i].scaleX ) + floorArray[i].x;
		lastDistance.index = i;
		stage.addChild( floorArray[i] );
	}

	frontFace = true;
	velocity = new vec2();
	character.x = 100;
	character.y = stage.canvas.height / 4;
	character.scaleX = characterScale;
	character.gotoAndPlay( "NeutralFront" );
	stage.addChild( character );

	healthArray = new Array();
	for ( i = 0; i < 10; i++ )
	{
		healthArray.push( health.clone() );
		healthArray[i].visible = false;
		stage.addChild( healthArray[i] );
	}

	enemyArray = new Array();
	for ( i = 0; i < 20; i++ )
	{
		enemyArray.push( enemy.clone() );
		enemyArray[i].visible = false;
		enemyArray[i].gotoAndPlay( "Neutral" );
		stage.addChild( enemyArray[i] );
	}

	bulletArray = new Array();
	for ( i = 0; i < 3; i++ )
	{
		bulletArray.push( new BulletInstance( bullet.clone() ) );
		bulletArray[i].sprite.visible = false;
		stage.addChild( bulletArray[i].sprite );
	}

	hitBadParticleArray = new Array();
	for ( i = 0; i < enemyArray.length; i++ )
	{
		hitBadParticleArray.push( hitBadParticle.clone() );
		hitBadParticleArray[i].visible = false;
		stage.addChild( hitBadParticleArray[i] );
	}

	getHealthParticleArray = new Array();
	for ( i = 0; i < healthArray.length; i++ )
	{
		getHealthParticleArray.push( getHealthParticle.clone() );
		getHealthParticleArray[i].visible = false;
		stage.addChild( getHealthParticleArray[i] );
	}

	stage.addChild( menuButton );
	menuButton.x = stage.canvas.width - ( 150 * 0.5 );
	menuButton.y = stage.canvas.height - ( 30 / 2 );
	menuButton.gotoAndPlay( "Neutral" );
	menuButton.on( "mouseout", function playHover( evt ) { menuButton.gotoAndPlay( "Neutral" ); }, this );
	menuButton.on( "mouseover", function playHover( evt ) { menuButton.gotoAndPlay( "Hover" ); }, this );
	menuButton.on( "mousedown", function playHover( evt ) { menuButton.gotoAndPlay( "Click" ); }, this );
	menuButton.on( "click", function playHover( evt ) { menuButton.gotoAndPlay( "Neutral" ); mode = MODE_TITLE }, this );

	stage.addChild( audioButton );
	audioButton.x = ( 30 * 0.5 );
	audioButton.y = stage.canvas.height - ( 30 * 0.5 );
	if ( mute ) audioButton.gotoAndPlay( "OffNeutral" );
	else audioButton.gotoAndPlay( "OnNeutral" );
	audioButton.on( "mouseout", function playHover( evt ) { if ( mute ) audioButton.gotoAndPlay( "OffNeutral" ); else audioButton.gotoAndPlay( "OnNeutral" ); }, this );
	audioButton.on( "mouseover", function playHover( evt ) { if ( mute ) audioButton.gotoAndPlay( "OffHover" ); else audioButton.gotoAndPlay( "OnHover" ); }, this );
	audioButton.on( "mousedown", function playHover( evt ) { if ( mute ) audioButton.gotoAndPlay( "OffClick" ); else audioButton.gotoAndPlay( "OnClick" ); }, this );
	audioButton.on( "click", function playHover( evt ) { mute = mute == false; if ( mute ) audioButton.gotoAndPlay( "OffNeutral" ); else audioButton.gotoAndPlay( "OnNeutral" ); }, this );

	score = 0;
	distance = 0;
	distanceBoundary = character.x;


	stage.addChild( hud );

	lifeDisplay = new createjs.Text( "FPS: ", "16px Comic Sans MS", "#000" );
	stage.addChild( lifeDisplay );

	fpsBar.x = lifeDisplay.getBounds().width;
	fpsBar.y = lifeDisplay.getMeasuredHeight() / 2;
	fpsBar.scaleX = life / 30;
	fpsBar.gotoAndPlay( "Good" );
	stage.addChild( fpsBar );

	scoreDisplay = new createjs.Text( "Score: " + distance, "16px Comic Sans MS", "#000" );
	scoreDisplay.x = 0;
	scoreDisplay.y = lifeDisplay.getMeasuredHeight();
	stage.addChild( scoreDisplay );
	hud.scaleX = 3;
	hud.scaleY = ( ( lifeDisplay.getMeasuredHeight() + scoreDisplay.getMeasuredHeight() ) / 100 ) + 0.05;

	lastSpawnEnemyDistance = 0;
	lastSpawnHealthDistance = 0;

	jamie.visible = jamieMode;
	stage.addChild( jamie );

	levelFrameStaticText = new createjs.Text( "High Score", "80px Comic Sans MS", "#FFF" );
	levelFrameStaticText.regX = levelFrameStaticText.getMeasuredWidth() / 2;
	levelFrameStaticText.regY = levelFrameStaticText.getMeasuredHeight();
	levelFrameStaticText.x = levelFrame.image.width / 2;
	levelFrameStaticText.y = levelFrame.image.height / 2;

	levelFrameText = new createjs.Text( Math.floor( highScore ), "80px Comic Sans MS", "#FFF" );
	levelFrameText.regX = levelFrameText.getMeasuredWidth() / 2;
	levelFrameText.regY = 0;
	levelFrameText.x = levelFrame.image.width / 2;
	levelFrameText.y = levelFrame.image.height / 2;

	levelFrameContainer = new createjs.Container();
	levelFrameContainer.addChild( levelFrame, levelFrameText, levelFrameStaticText );
	levelFrameContainer.alpha = 1;
	levelFrameContainer.visible = false;
	stage.addChild( levelFrameContainer );

	gameInitialized = true;
}

function gameDelete()
{
	stage.removeAllChildren();
	stage.removeAllEventListeners();
	music.stop();
	getHealth.stop();
	shoot.stop();
	menuButton.removeAllEventListeners();
	audioButton.removeAllEventListeners();
	createjs.Tween.removeAllTweens();
	scoreDisplay = lifeDisplay = levelFrameText = levelFrameStaticText = levelFrameContainer = levelFrameAnimator = floorArray = enemyArray = healthArray = hitBadParticleArray = getHealthParticleArray = BGParticleArray = null;
	gameInitialized = false;
}

var jamieHold = false;
function jamieToggle()
{
	if ( !jamieHold && jamiePressed )
	{
		jamieMode = jamieMode == false;
		jamieHold = true;
	}
	else if ( jamieHold && !jamiePressed ) jamieHold = false;
}

var lastKey;
function vec2()
{
	this.X = 0;
	this.Y = 0;
}
var velocity;
var damping = 0.1;
var lastSpawnEnemyDistance;
var lastSpawnHealthDistance;
var SCROLLACCELERATION = 5;
function gameUpdate()
{
	if ( !gameInitialized )
	{
		removeAll();
		gameInit();
		showLevelFrame();
	}
	else
	{
		jamieToggle();
		jamie.visible = jamieMode;
		music.setMute( mute );
		if ( jamieMode )
		{
			if ( character.y - 75 >= stage.canvas.height || life < 1 )
			{
				mode = MODE_GAMEOVER;
			}
			else if ( animated )
			{
				if ( Math.random() <= 0.25 ) spawnHealth();
				//enemySpawn -= ( 1 / createjs.Ticker.getFPS() );
				if ( Math.floor( distance * 0.001 ) > lastSpawnEnemyDistance )
				{
					if ( Math.random() <= 0.5 ) spawnEnemy();
					lastSpawnEnemyDistance = Math.floor( distance * 0.001 );
					//enemySpawn = enemySpawnInterval;
				}
				processMovement();
				processCollisions();

				if ( character.x - distanceBoundary > distance )
				{
					distance = character.x - distanceBoundary;
				}

				scoreDisplay.text = "Score: " + Math.floor(( distance / 100 ) + score );
				scrollspeed += SCROLLACCELERATION * ( 1 / life );
				if ( scrollspeed > 500 ) scrollspeed = 500;
			}
			createjs.Ticker.setFPS( 30 );
		}
		else
		{
			if ( character.y - 75 >= stage.canvas.height || life < 1 )
			{
				mode = MODE_GAMEOVER;
			}
			else if ( animated )
			{
				//healthSpawn -= ( 1 / createjs.Ticker.getFPS() );
				if ( Math.floor( distance * 0.0025 ) > lastSpawnHealthDistance )
				{
					if ( Math.random() <= 0.5 ) spawnHealth();
					lastSpawnHealthDistance = Math.floor( distance * 0.0025 );
					//healthSpawn = healthSpawnInterval;
				}
				//enemySpawn -= ( 1 / createjs.Ticker.getFPS() );
				if ( Math.floor( distance * 0.005 ) > lastSpawnEnemyDistance )
				{
					if ( Math.random() <= 0.6 ) spawnEnemy();
					lastSpawnEnemyDistance = Math.floor( distance * 0.005 );
					//enemySpawn = enemySpawnInterval;
				}
				processMovement();
				processCollisions();

				if ( character.x - distanceBoundary > distance )
				{
					distance = character.x - distanceBoundary;
				}

				scoreDisplay.text = "Score: " + Math.floor(( distance / 100 ) + score );
				scrollspeed += SCROLLACCELERATION * ( 1 / createjs.Ticker.getFPS() );
			}
			createjs.Ticker.setFPS( life );
		}
		updateLife();
	}
}
var ACCELERATION = 10;
var scrollspeed;
var shot = false;
var bulletVelocity = 5;
var frontFace = true;
function processMovement()
{
	if ( leftPressed )
	{
		velocity.X -= ( ACCELERATION * scrollspeed ) * ( 1 / createjs.Ticker.getFPS() );
		frontFace = false;
		character.scaleX = -characterScale;
		if ( character.currentAnimation == "NeutralFront" ) character.gotoAndPlay( "Run" );
	}
	else if ( rightPressed )
	{
		frontFace = true;
		velocity.X += ( ACCELERATION * scrollspeed ) * ( 1 / createjs.Ticker.getFPS() );
		character.scaleX = characterScale;
		if ( character.currentAnimation == "NeutralFront" ) character.gotoAndPlay( "Run" );
	}
	else
	{
		character.gotoAndPlay( "NeutralFront" );
	}
	if ( downPressed )
	{
		velocity.Y += ( ACCELERATION * scrollspeed ) * ( 1 / createjs.Ticker.getFPS() );
	}

	for ( i = 0; i < floorArray.length; i++ )
	{
		floorArray[i].x -= scrollspeed * ( 1 / createjs.Ticker.getFPS() );

		if ( ( floorArray[i].getBounds().width * floorArray[i].scaleX ) + floorArray[i].x <= 0 )
		{
			floorArray[i].x = ( floorArray[lastDistance.index].getBounds().width * floorArray[lastDistance.index].scaleX ) + floorArray[lastDistance.index].x;
			if ( jamieMode ) floorArray[i].y = stage.canvas.height;
			else
			{
				var generatedDistance = ( ( stage.canvas.height - ( 2 * floorArray[i].getBounds().height * floorArray[i].scaleY ) ) * Math.random() ) + ( 2 * floorArray[i].getBounds().height * floorArray[i].scaleY );
				if ( generatedDistance < floorArray[lastDistance.index].y - character.getBounds().height + ( floorArray[i].getBounds().height * floorArray[i].scaleY ) ) generatedDistance = floorArray[lastDistance.index].y - character.getBounds().height + ( floorArray[i].getBounds().height * floorArray[i].scaleY );
				//var generatedDistance = ( ( Math.random() * 2 ) - 1 ) * character.getBounds().height;
				//generatedDistance += floorArray[lastDistance.index].y;
				//if ( generatedDistance > stage.canvas.height ) generatedDistance = stage.canvas.height;
				//else if ( generatedDistance < 2 * floorArray[i].getBounds().height * floorArray[i].scaleY ) generatedDistance = 2 * floorArray[i].getBounds().height * floorArray[i].scaleY;
				floorArray[i].y = generatedDistance;
				floorArray[i].gotoAndPlay( Math.random() * 50 );
				//floorArray[i].y = ( ( stage.canvas.height - ( 2 * floorArray[i].getBounds().height * floorArray[i].scaleY ) ) * Math.random() ) + ( 2 * floorArray[i].getBounds().height * floorArray[i].scaleY );
			}
			lastDistance.distance += ( floorArray[i].getBounds().width * floorArray[i].scaleX ) + floorArray[i].x;
			lastDistance.index = i;
		}
		floorArray[i].alpha = ( ( floorArray[i].getBounds().width * floorArray[i].scaleX ) + floorArray[i].x ) / ( floorArray[i].getBounds().width * floorArray[i].scaleX );
	}
	for ( i = 0; i < enemyArray.length; i++ )
	{
		if ( enemyArray[i].visible )
		{
			enemyArray[i].x -= scrollspeed * ( 1 / createjs.Ticker.getFPS() );
			if ( ( enemyArray[i].getBounds().width * enemyArray[i].scaleX ) + enemyArray[i].x <= 0 )
			{
				enemyArray[i].visible = false;
			}
		}
	}

	for ( i = 0; i < healthArray.length; i++ )
	{
		if ( healthArray[i].visible )
		{
			healthArray[i].x -= scrollspeed * ( 1 / createjs.Ticker.getFPS() );
			if ( ( healthArray[i].getBounds().width * healthArray[i].scaleX ) + healthArray[i].x <= 0 )
			{
				healthArray[i].visible = false;
			}
		}
	}
	for ( i = 0; i < bulletArray.length; i++ )
	{
		if ( bulletArray[i].sprite.visible )
		{
			bulletArray[i].sprite.x -= ( scrollspeed * ( 1 / createjs.Ticker.getFPS() ) ) - ( bulletArray[i].direction * scrollspeed * bulletVelocity * ( 1 / createjs.Ticker.getFPS() ) );
			if ( ( bulletArray[i].sprite.getBounds().width * bulletArray[i].sprite.scaleX ) + bulletArray[i].sprite.x <= 0 || bulletArray[i].sprite.x >= stage.canvas.width )
			{
				bulletArray[i].sprite.visible = false;
			}
		}
	}

	if ( firePressed && !shot )
	{
		for ( i = 0; i < bulletArray.length; i++ )
		{
			if ( !bulletArray[i].sprite.visible )
			{
				if ( frontFace )
				{
					bulletArray[i].sprite.x = character.x + ( (character.getBounds().width * characterScale) / 2 );
					bulletArray[i].sprite.y = character.y;
					bulletArray[i].direction = 1;
				}
				else
				{
					bulletArray[i].sprite.x = character.x - ( (character.getBounds().width * characterScale) / 2 ) - ( bulletArray[i].sprite.getBounds().width * bulletArray[i].sprite.scaleX );
					bulletArray[i].sprite.y = character.y;
					bulletArray[i].direction = -1;
				}

				shoot.stop();
				shoot.play();
				bulletArray[i].sprite.gotoAndPlay( Math.random() * 39 );
				bulletArray[i].sprite.visible = true;
				shot = true;
				break;
			}
		}
	}
	else if ( !firePressed && shot ) shot = false;

	for ( i = 0; i < hitBadParticleArray.length; i++ )
	{
		if ( hitBadParticleArray[i].visible )
		{
			hitBadParticleArray[i].x -= scrollspeed * ( 1 / createjs.Ticker.getFPS() );
			if ( ( hitBadParticleArray[i].getBounds().width * hitBadParticleArray[i].scaleX ) + hitBadParticleArray[i].x <= 0 )
			{
				hitBadParticleArray[i].visible = false;
			}
		}
	}

	for ( i = 0; i < getHealthParticleArray.length; i++ )
	{
		if(getHealthParticleArray[i].visible)
		{
			getHealthParticleArray[i].x -= scrollspeed * ( 1 / createjs.Ticker.getFPS() );
			if ( ( getHealthParticleArray[i].getBounds().width * getHealthParticleArray[i].scaleX ) + getHealthParticleArray[i].x <= 0 )
			{
				getHealthParticleArray[i].visible = false;
			}
		}
	}

	for ( i = 0; i < BGParticleArray.length; i++ )
	{
		BGParticleArray[i].x -= scrollspeed * ( 1 / createjs.Ticker.getFPS() ) * BGParticleArray[i].scaleX;
		if ( ( BGParticleArray[i].getBounds().width * BGParticleArray[i].scaleX ) + BGParticleArray[i].x <= 0 )
		{
			BGParticleArray[i].x = ( Math.random() * stage.canvas.width ) + stage.canvas.width;
			BGParticleArray[i].y = Math.random() * stage.canvas.height;
			BGParticleArray[i].scaleX = ( Math.random() * 0.75 ) + 0.25;
			BGParticleArray[i].scaleY = BGParticleArray[i].scaleX;
			BGParticleArray[i].gotoAndPlay( Math.random() * 35 );
			BGParticleArray[i].alpha = BGParticleArray[i].scaleX;
		}
	}

	if ( !jamieMode ) character.x -= scrollspeed * ( 1 / createjs.Ticker.getFPS() );
	velocity.Y += ( GRAVITY * ( 1 / createjs.Ticker.getFPS() ) );
	velocity.X *= Math.pow( damping, ( 1 / createjs.Ticker.getFPS() ) );
	character.x += velocity.X * ( 1 / createjs.Ticker.getFPS() );
	character.y += velocity.Y * ( 1 / createjs.Ticker.getFPS() );
	if ( character.x > stage.canvas.width )
	{
		character.x -= character.x - stage.canvas.width;
		velocity.X = 0;
	}
	distanceBoundary -= scrollspeed * ( 1 / createjs.Ticker.getFPS() );
}

function processCollisions()
{
	for ( i = 0; i < floorArray.length; i++ )
	{
		var collided = ndgmr.checkRectCollision( character, floorArray[i] );
		if ( collided )
		{
			//if( floorArray[i].y -( character.y - ( character.getBounds().height * character.scaleY * 0.5 ) ) <= 0 )
			//{
			//	character.y += collided.height;
			//	velocity.Y = 0;
			//}
			//else if ( (floorArray[i].x + ( floorArray[i].getBounds().width * floorArray[i].scaleX ) ) - ( character.x - ( ( character.getBounds().width * character.scaleX ) / 2 ) ) <= 0 )
			//{
			//	velocity.X = 0;
			//	character.x += collided.width;
			//}
			//else if( floorArray[i].x - (character.x + ((character.getBounds().width * character.scaleX) / 2)) >= 0)
			//{
			//	velocity.X = 0;
			//	character.x -= collided.width;
			//}
			//else
			//{
			//	character.y -= collided.height;
			//	if ( jumpPressed ) velocity.Y = -250;
			//	else velocity.Y = 0;
			//}

			if ( goodCollision )
			{
				var top = Math.abs(( ( floorArray[i].y ) - ( floorArray[i].getBounds().height * floorArray[i].scaleY ) ) - ( character.y + ( character.getBounds().height * character.scaleY * 0.5 ) ) );
				var bottom = Math.abs(( floorArray[i].y ) - ( character.y - ( character.getBounds().height * character.scaleY * 0.5 ) ) );

				var left = Math.abs(( floorArray[i].x ) - ( character.x + ( character.getBounds().width * Math.abs( character.scaleX ) * 0.5 ) ) );

				var right = Math.abs(( ( floorArray[i].x ) + ( floorArray[i].getBounds().width * floorArray[i].scaleX ) ) - ( character.x - ( character.getBounds().width * Math.abs( character.scaleX ) * 0.5 ) ) );

				var result = Math.min( Math.abs( top ), Math.abs( bottom ), Math.abs( left ), Math.abs( right ) );
				//if ( collided.height <= collided.width )
				//{
				//	result = Math.min( top, bottom );
				//}
				//else
				//{
				//	result = Math.min( left, right );
				//}

				switch ( result )
				{
					case ( top ):
						{
							character.y -= collided.height;
							if ( jumpPressed ) velocity.Y = -300;
							else velocity.Y = 0;
							break;
						}
					case ( bottom ):
						{
							character.y += collided.height
							velocity.Y = 0;
							break;
						}
					case ( left ):
						{
							velocity.X = 0;
							character.x -= collided.width;
							break;
						}
					case ( right ):
						{
							velocity.X = 0;
							character.x += collided.width;
							break;
						}
				}
			}
			else
			{
				character.y -= collided.height;
				if ( jumpPressed ) velocity.Y = -300;
				else velocity.Y = 0;
			}
		}

		for ( j = 0; j < healthArray.length; j++ )
		{
			if ( healthArray[j].visible )
			{

				var healthFloorCollision = ndgmr.checkRectCollision( healthArray[j], floorArray[i] );
				if ( healthFloorCollision )
				{
					healthArray[j].y -= healthFloorCollision.height;
				}
			}
		}

		for ( j = 0; j < enemyArray.length; j++ )
		{
			if ( enemyArray[j].visible && enemyArray[j].currentAnimation == "Neutral" )
			{
				var enemyFloorCollision = ndgmr.checkRectCollision( enemyArray[j], floorArray[i] );
				if ( enemyFloorCollision )
				{
					enemyArray[j].y -= enemyFloorCollision.height;
				}
			}
		}
	}

	for ( i = 0; i < healthArray.length; i++ )
	{
		if ( healthArray[i].visible )
		{
			if ( healthArray[i].visible )
			{
				var playerHitHealth = ndgmr.checkRectCollision( character, healthArray[i] );
				if ( playerHitHealth )
				{
					for ( j = 0; j < getHealthParticleArray.length; j++ )
					{
						if ( !getHealthParticleArray[j].visible )
						{
							getHealthParticleArray[j].x = ( character.x + healthArray[i].x ) / 2;
							getHealthParticleArray[j].y = ( character.y + healthArray[i].y ) / 2;
							getHealthParticleArray[j].visible = true;
							getHealthParticleArray[j].gotoAndPlay( "Normal" );
							break;
						}
					}
					getHealth.stop();
					getHealth.play();
					score += 5;
					if ( life < MAXFPS ) life += 1;
					healthArray[i].visible = false;
				}
			}
		}
	}

	for ( i = 0; i < enemyArray.length; i++ )
	{
		if ( enemyArray[i].visible && enemyArray[i].currentAnimation == "Neutral" )
		{
			var playerHitEnemy = ndgmr.checkPixelCollision( character, enemyArray[i], 0 );
			if ( playerHitEnemy )
			{
				if ( !jamieMode )
				{
					for ( j = 0; j < hitBadParticleArray.length; j++ )
					{
						if ( !hitBadParticleArray[j].visible )
						{
							hitBadParticleArray[j].x = ( character.x + enemyArray[i].x ) / 2;
							hitBadParticleArray[j].y = ( character.y + enemyArray[i].y ) / 2;
							hitBadParticleArray[j].visible = true;
							hitBadParticleArray[j].gotoAndPlay( "Normal" );
							break;
						}
					}
					hitBad.stop();
					hitBad.play();
					life -= 2;
					score -= 5;
				}
				enemyArray[i].visible = false;
			}
			else
			{
				for ( j = 0; j < bulletArray.length; j++ )
				{
					if ( bulletArray[j].sprite.visible )
					{
						var bulletHitEnemy = ndgmr.checkPixelCollision( bulletArray[j].sprite, enemyArray[i], 0 );
						if ( bulletHitEnemy )
						{
							hitGood.stop();
							hitGood.play();
							score += 10;
							enemyArray[i].gotoAndPlay( "Die" );
							bulletArray[j].sprite.visible = false;
						}
					}
				}
			}
		}

	}
}

function spawnHealth()
{
	for ( i = 0; i < healthArray.length; i++ )
	{
		if ( !healthArray[i].visible )
		{
			healthArray[i].x = ( stage.canvas.width * 1.1 ) + ( healthArray[i].getBounds().width * healthArray[i].scaleX );
			healthArray[i].y = ( ( stage.canvas.height - ( 2 * healthArray[i].getBounds().height * healthArray[i].scaleY ) ) * Math.random() ) + ( 2 * healthArray[i].getBounds().height * healthArray[i].scaleY );
			healthArray[i].visible = true;
			break;
		}
	}
}

function spawnEnemy()
{
	for ( i = 0; i < enemyArray.length; i++ )
	{
		if ( !enemyArray[i].visible )
		{
			enemyArray[i].x = ( stage.canvas.width * 1.1 ) + ( enemyArray[i].getBounds().width * enemyArray[i].scaleX );
			enemyArray[i].y = ( ( stage.canvas.height - ( 2 * enemyArray[i].getBounds().height * enemyArray[i].scaleY ) ) * Math.random() ) + ( 2 * enemyArray[i].getBounds().height * enemyArray[i].scaleY );
			enemyArray[i].gotoAndPlay( "Neutral" );
			enemyArray[i].visible = true;
			break;
		}
	}
}

var lastLife;
var lifeMoveSpeed = 0.5;
function updateLife()
{
	if ( createjs.Ticker.getFPS() )
	{
		lastLife += ( life - lastLife ) * ( 1 / createjs.Ticker.getFPS() ) * lifeMoveSpeed;
	}
	else
	{
		lastLife += ( life - lastLife ) * lifeMoveSpeed;
	}
	fpsBar.scaleX = lastLife / 30;
	if(life < 20 && (fpsBar.currentAnimation == "Good" || fpsBar.currentAnimation == "ToGood"))
	{
		fpsBar.gotoAndPlay( "ToBad" );
	}
	else if ( life >= 20 && ( fpsBar.currentAnimation == "Bad" || fpsBar.currentAnimation == "ToBad" ) )
	{
		fpsBar.gotoAndPlay( "ToGood" );
	}
}

//#endregion

//#region game over
var gameOverInitialized = false;
var resultsContainer, finalScore, realScore, distanceTraveled;

function gameOverInit()
{
	stage.addChild( gameoverScreen );
	stage.addChild( menuButton );
	menuButton.x = stage.canvas.width - ( 150 * 0.5 );
	menuButton.y = stage.canvas.height - ( 30 / 2 );
	menuButton.gotoAndPlay( "Neutral" );
	menuButton.on( "mouseover", function playHover( evt ) { menuButton.gotoAndPlay( "Neutral" ); }, this );
	menuButton.on( "mouseout", function playHover( evt ) { menuButton.gotoAndPlay( "Hover" ); }, this );
	menuButton.on( "mousedown", function playHover( evt ) { menuButton.gotoAndPlay( "Click" ); }, this );
	menuButton.on( "click", function playHover( evt ) { menuButton.gotoAndPlay( "Neutral" ); mode = MODE_TITLE }, this );


	realScore = new createjs.Text( "Raw Score: " + score, "16px Comic Sans MS", "#FFF" );
	distanceTraveled = new createjs.Text( "Distance Traveled: " + Math.floor(( distance / 100 ) ) + " * 100 px", "16px Comic Sans MS", "#FFF" );

	if ( highScore < ( distance / 100 ) + score ) highScore = ( distance / 100 ) + score;

	finalScore = new createjs.Text( "Final Score: " + Math.floor(( distance / 100 ) + score ), "16px Comic Sans MS", "#FFF" );

	realScore.regX = realScore.getMeasuredWidth() / 2;
	realScore.x = 0;

	distanceTraveled.regX = distanceTraveled.getMeasuredWidth() / 2;
	distanceTraveled.x = 0;
	distanceTraveled.y = realScore.getMeasuredHeight();

	finalScore.regX = finalScore.getMeasuredWidth() / 2;
	finalScore.x = 0;
	finalScore.y = distanceTraveled.y + distanceTraveled.getMeasuredHeight();

	resultsContainer = new createjs.Container();
	resultsContainer.addChild( finalScore, realScore, distanceTraveled );
	resultsContainer.regY = ( finalScore.y + finalScore.getMeasuredHeight() ) / 2;
	resultsContainer.x = stage.canvas.width / 2;
	resultsContainer.y = stage.canvas.height / 2;
	stage.addChild( resultsContainer );
	gameOverAnimation.y = ( finalScore.y + resultsContainer.y + stage.canvas.height ) / 2;
	stage.addChild( gameOverAnimation );
	gameOverInitialized = true;
}

function gameOverDelete()
{
	stage.removeAllChildren();
	menuButton.removeAllEventListeners();
	finalScore = realScore = distanceTraveled = resultsContainer = null;
	gameOverInitialized = false;
}

function gameOverUpdate()
{
	if ( !gameOverInitialized )
	{
		removeAll();
		gameOverInit();
	}
}

//#endregion

//#region loading
var loadingInitialized = false;
var barBorder, progressBar, loadingText, backgroundColor;
var loadingTextWidth;
function loadingInit()
{
	backgroundColor = new createjs.Shape();
	backgroundColor.graphics.beginFill( "#000" ).drawRect( 0, 0, stage.canvas.width, stage.canvas.height );
	backgroundColor.x = 0;
	backgroundColor.y = 0;
	stage.addChild( backgroundColor );


	loadingText = new createjs.Text( "Loading", "80px Comic Sans MS", "#FFF" );
	loadingTextWidth = loadingText.getMeasuredWidth();
	var loadingTextHeight = loadingText.getMeasuredHeight();
	loadingText.regX = loadingTextWidth / 2;
	loadingText.regY = loadingTextHeight;
	loadingText.x = stage.canvas.width / 2;
	loadingText.y = stage.canvas.height / 2;
	stage.addChild( loadingText );



	barBorder = new createjs.Shape();
	barBorder.graphics.beginStroke( "#FFF" ).drawRect( 0, 0, loadingTextWidth, 10 );
	barBorder.x = ( stage.canvas.width / 2 ) - ( loadingTextWidth / 2 );
	barBorder.y = ( stage.canvas.height / 2 ) + ( loadingTextHeight / 2 );
	stage.addChild( barBorder );

	progressBar = new createjs.Shape();
	progressBar.graphics.beginFill( "#FFF" ).drawRect( 0, 0, 0, 10 );
	progressBar.x = ( stage.canvas.width / 2 ) - ( loadingTextWidth / 2 );
	progressBar.y = ( stage.canvas.height / 2 ) + ( loadingTextHeight / 2 );
	stage.addChild( progressBar );

	loadingInitialized = true;
}

function loadingDelete()
{
	stage.removeAllChildren();
	backgroundColor = loadingText = barBorder = progressBar = null;
	loadingInitialized = false;
}

function loadingUpdate( queue )
{
	if ( !loadingInitialized )
	{
		removeAll();
		loadingInit();
	}
	else
	{
		if ( queue == null ) progressBar.graphics.beginFill( "#FFF" ).drawRect( 0, 0, 0, 10 );
		else progressBar.graphics.beginFill( "#FFF" ).drawRect( 0, 0, loadingTextWidth * queue.progress, 10 );

	}
}
//#endregion

gamestate =
	{
		"title":
			function ()
			{
				if ( titleQueue != null && titleQueue.loaded ) titleUpdate();
				else loadingUpdate( titleQueue );
			},
		"tocol":
			function()
			{
				if ( titleQueue != null && titleQueue.loaded ) collisionChooserUpdate();
				else loadingUpdate( titleQueue );
			},
		"instructions":
			function ()
			{
				if ( instructionQueue != null && instructionQueue.loaded ) instructionsUpdate();
				else loadingUpdate( instructionQueue );
			},
		"credits":
			function ()
			{
				if ( instructionQueue != null && instructionQueue.loaded ) creditsUpdate();
				else loadingUpdate( instructionQueue );
			},
		"game":
			function ()
			{
				if ( gameQueue != null && gameQueue.loaded ) gameUpdate();
				else loadingUpdate( gameQueue );
			},
		"gameover":
			function ()
			{
				if ( gameQueue != null && gameQueue.loaded ) gameOverUpdate();
				else loadingUpdate( gameQueue );
			}
	}

function loop()
{
	gamestate[mode]();
	stage.update();
}

function main()
{
	setUpCanvas();
	startLoad();
	createjs.Ticker.addEventListener( "tick", loop );
	createjs.Ticker.setFPS( MAINFPS );
}

var KEYCODE_LEFT = 37;
var KEYCODE_UP = 38;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;

var KEYCODE_A = 65;
var KEYCODE_W = 87;
var KEYCODE_D = 68;
var KEYCODE_S = 83;
var KEYCODE_J = 74;
var KEYCODE_SPACE = 32;


var leftPressed = false;
var rightPressed = false;
var jumpPressed = false;
var downPressed = false;
var firePressed = false;
var jamiePressed = false;
function handleKeyDown( evt )
{
	if ( !evt ) { var evt = window.event; }
	switch ( evt.keyCode )
	{
		case KEYCODE_LEFT:
			{
				leftPressed = true;
				console.log( "left key down" );
				break;
			}
		case KEYCODE_RIGHT:
			{
				rightPressed = true;
				console.log( "right key down" );
				break;
			}
		case KEYCODE_UP:
			{
				jumpPressed = true;
				console.log( "up key down" );
				break;
			}
		case KEYCODE_DOWN:
			{
				downPressed = true;
				console.log( "down key down" );
				break;
			}

		case KEYCODE_A:
			{
				leftPressed = true;
				console.log( "A key down" );
				break;
			}
		case KEYCODE_W:
			{
				jumpPressed = true;
				console.log( "W key down" );
				break;
			}
		case KEYCODE_D:
			{
				rightPressed = true;
				console.log( "D key down" );
				break;
			}
		case KEYCODE_S:
			{
				downPressed = true;
				console.log( "S key down" );
				break;
			}
		case KEYCODE_J:
			{
				jamiePressed = true;
				console.log( "J key down" );
				break;
			}
		case KEYCODE_SPACE:
			{
				firePressed = true;
				console.log( "Space key down" );
				break;
			}
		default:
			{
				console.log( "unknown key code " + evt.keyCode + " down" );
				break;
			}
	}
	lastKey = evt.keyCode;
}

function handleKeyUp( evt )
{
	if ( !evt ) { var evt = window.event; }
	switch ( evt.keyCode )
	{
		case KEYCODE_LEFT:
			{
				leftPressed = false;
				console.log( "left key up" );
				break;
			}
		case KEYCODE_RIGHT:
			{
				rightPressed = false;
				console.log( "right key up" );
				break;
			}
		case KEYCODE_UP:
			{
				jumpPressed = false;
				console.log( "up key up" );
				break;
			}
		case KEYCODE_DOWN:
			{
				downPressed = false;
				console.log( "down key up" );
				break;
			}
		case KEYCODE_A:
			{
				leftPressed = false;
				console.log( "A key up" );
				break;
			}
		case KEYCODE_W:
			{
				jumpPressed = false;
				console.log( "W key up" );
				break;
			}
		case KEYCODE_D:
			{
				rightPressed = false;
				console.log( "D key up" );
				break;
			}
		case KEYCODE_S:
			{
				downPressed = false;
				console.log( "S key up" );
				break;
			}
		case KEYCODE_J:
			{
				jamiePressed = false;
				console.log( "J key up" );
				break;
			}
		case KEYCODE_SPACE:
			{
				firePressed = false;
				console.log( "Space key up" );
				break;
			}
		default:
			{
				console.log( "unknown key code " + evt.keyCode + " up" );
				break;
			}
	}
}

if ( !!( window.addEventListener ) )
{
	window.addEventListener( "DOMContentLoaded", main );
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
}
else
{ //MSIE
	window.attachEvent( "onload", main );
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
}