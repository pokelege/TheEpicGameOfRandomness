function modeStruct( title, data )
{
	this.title = title;
	this.data = data;
}

//The engine nameSpace
var gameEngine =
{
	mode: "title",
	MAINFPS: 30,
	DT: 1 / 30,
	CANVASWIDTH: 800,
	CANVASHEIGHT: 600,
	stage: null,

	//set up canvas. do not touch
	setUpCanvas: function ()
	{
		var canvas = document.getElementById( "game" );
		canvas.width = gameEngine.CANVASWIDTH;
		canvas.height = gameEngine.CANVASHEIGHT;
		gameEngine.stage = new createjs.Stage( canvas );
		gameEngine.stage.enableMouseOver();
	},

	//The updateModeLooper for your modes. initializer is the initializer, deleter is deleter, updater is updater, queue is the manifest load queue for loading screen and handling of loading assets.
	//Set up these and I'll update 4 U
	updateModeLooper: function ( initializer, deleter, updater, queues )
	{
		this.initialized = false;
		this.queues = queues;
		this.initializer = initializer;
		this.deleter = deleter;
		this.updater = updater;
		this.update = function ()
		{
			var notLoaded = false;
			for ( i = 0; i < this.queues.length; i++ )
			{
				if ( !this.queues[i].loaded ) notLoaded = true;
			}
			if ( this.queues != null && notLoaded )
			{
				gameEngine.loadingUpdate( this.queues );
			}
			else
			{
				if ( this.initialized )
				{
					this.updater();
				}
				else
				{
					gameEngine.removeAll();
					this.initializer();
					this.initialized = true;
				}
			}
		};
	},

	//add your updateModeLoopers to this map
	updateModeLooperArray: new Array(),
	addModeLooper: function ( key, theUpdateModeLooper )
	{
		gameEngine.updateModeLooperArray.push( new modeStruct( key, theUpdateModeLooper ) );
	},

	//call this to delete all stages based on your deleter
	removeAll: function ()
	{
		for ( i = 0; i < gameEngine.updateModeLooperArray.length; i++ )
		{
			gameEngine.updateModeLooperArray[i].data.deleter();
			gameEngine.updateModeLooperArray[i].data.initialized = false;
		}
		if ( gameEngine.loadingInitialized )
		{
			gameEngine.loadingDelete();
		}
	},

	//#region loading
	barBorder: null, progressBar: null, loadingText: null, backgroundColor: null,
	loadingTextWidth: null,
	loadingInitialized: false,
	loadingInit: function ()
	{
		gameEngine.backgroundColor = new createjs.Shape();
		gameEngine.backgroundColor.graphics.beginFill( "#000" ).drawRect( 0, 0, gameEngine.stage.canvas.width, gameEngine.stage.canvas.height );
		gameEngine.backgroundColor.x = 0;
		gameEngine.backgroundColor.y = 0;
		gameEngine.stage.addChild( gameEngine.backgroundColor );


		gameEngine.loadingText = new createjs.Text( "Loading", "80px Comic Sans MS", "#FFF" );
		gameEngine.loadingTextWidth = gameEngine.loadingText.getMeasuredWidth();
		var loadingTextHeight = gameEngine.loadingText.getMeasuredHeight();
		gameEngine.loadingText.regX = gameEngine.loadingTextWidth / 2;
		gameEngine.loadingText.regY = loadingTextHeight;
		gameEngine.loadingText.x = gameEngine.stage.canvas.width / 2;
		gameEngine.loadingText.y = gameEngine.stage.canvas.height / 2;
		gameEngine.stage.addChild( gameEngine.loadingText );



		gameEngine.barBorder = new createjs.Shape();
		gameEngine.barBorder.graphics.beginStroke( "#FFF" ).drawRect( 0, 0, gameEngine.loadingTextWidth, 10 );
		gameEngine.barBorder.x = ( gameEngine.stage.canvas.width / 2 ) - ( gameEngine.loadingTextWidth / 2 );
		gameEngine.barBorder.y = ( gameEngine.stage.canvas.height / 2 ) + ( loadingTextHeight / 2 );
		gameEngine.stage.addChild( gameEngine.barBorder );

		gameEngine.progressBar = new createjs.Shape();
		gameEngine.progressBar.graphics.beginFill( "#FFF" ).drawRect( 0, 0, 0, 10 );
		gameEngine.progressBar.x = ( gameEngine.stage.canvas.width / 2 ) - ( gameEngine.loadingTextWidth / 2 );
		gameEngine.progressBar.y = ( gameEngine.stage.canvas.height / 2 ) + ( loadingTextHeight / 2 );
		gameEngine.stage.addChild( gameEngine.progressBar );
		gameEngine.loadingInitialized = true;
	},

	loadingDelete: function ()
	{
		gameEngine.stage.removeAllChildren();
		gameEngine.backgroundColor = gameEngine.loadingText = gameEngine.barBorder = gameEngine.progressBar = null;
		gameEngine.loadingInitialized = false;
	},

	loadingUpdate: function ( queues )
	{
		if ( gameEngine.loadingInitialized )
		{
			var progress = 0;
			for ( i = 0; i < queues.length; i++ )
			{
				progress += queues[i].progress;
			}
			progress /= queues.length;
			gameEngine.progressBar.graphics.beginFill( "#FFF" ).drawRect( 0, 0, gameEngine.loadingTextWidth * progress, 10 );
		}
		else
		{
			gameEngine.removeAll();
			gameEngine.loadingInit();
		}
	},
	//#endregion

	//the loop, don't touch
	loop: function ()
	{
		for ( var i = 0; i < gameEngine.updateModeLooperArray.length; i++ )
		{
			if ( gameEngine.updateModeLooperArray[i].title == gameEngine.mode )
			{
				gameEngine.updateModeLooperArray[i].data.update();
				break;
			}
		}
		gameEngine.stage.update();
	},

	KEYCODE_LEFT: 37,
	KEYCODE_UP: 38,
	KEYCODE_RIGHT: 39,
	KEYCODE_DOWN: 40,

	KEYCODE_A: 65,
	KEYCODE_W: 87,
	KEYCODE_D: 68,
	KEYCODE_S: 83,
	KEYCODE_J: 74,
	KEYCODE_T: 84,
	KEYCODE_Z: 90,
	KEYCODE_I: 73,
	KEYCODE_X: 88,
	KEYCODE_O: 79,
	KEYCODE_SPACE: 32,


	ArrowLeft: false,
	ArrowRight: false,
	ArrowUp: false,
	ArrowDown: false,
	SpacePressed: false,
	//J key
	JamiePressed: false,
	//T key
	TomPressed: false,

	APressed: false,
	SPressed: false,
	DPressed: false,
	WPressed: false,
	ZPressed: false,
	IPressed: false,
	XPressed: false,
	OPressed: false,

	//handling key downs. Don't touch
	handleKeyDown: function ( evt )
	{
		if ( !evt ) { var evt = window.event; }
		switch ( evt.keyCode )
		{
			case gameEngine.KEYCODE_LEFT:
				{
					gameEngine.ArrowLeft = true;
					console.log( "left key down" );
					break;
				}
			case gameEngine.KEYCODE_RIGHT:
				{
					gameEngine.ArrowRight = true;
					console.log( "right key down" );
					break;
				}
			case gameEngine.KEYCODE_UP:
				{
					gameEngine.ArrowUp = true;
					console.log( "up key down" );
					break;
				}
			case gameEngine.KEYCODE_DOWN:
				{
					gameEngine.ArrowDown = true;
					console.log( "down key down" );
					break;
				}

			case gameEngine.KEYCODE_A:
				{
					gameEngine.APressed = true;
					console.log( "A key down" );
					break;
				}
			case gameEngine.KEYCODE_W:
				{
					gameEngine.WPressed = true;
					console.log( "W key down" );
					break;
				}
			case gameEngine.KEYCODE_D:
				{
					gameEngine.DPressed = true;
					console.log( "D key down" );
					break;
				}
			case gameEngine.KEYCODE_S:
				{
					gameEngine.SPressed = true;
					console.log( "S key down" );
					break;
				}
			case gameEngine.KEYCODE_J:
				{
					gameEngine.JamiePressed = true;
					console.log( "J key down" );
					break;
				}
			case gameEngine.KEYCODE_T:
				{
					gameEngine.TomPressed = true;
					console.log( "T key down" );
					break;
				}
			case gameEngine.KEYCODE_Z:
				{
					gameEngine.ZPressed = true;
					console.log( "Z key down" );
					break;
				}
			case gameEngine.KEYCODE_I:
				{
					gameEngine.IPressed = true;
					console.log( "I key down" );
					break;
				}
			case gameEngine.KEYCODE_X:
				{
					gameEngine.XPressed = true;
					console.log( "X key down" );
					break;
				}
			case gameEngine.KEYCODE_O:
				{
					gameEngine.OPressed = true;
					console.log( "O key down" );
					break;
				}
			case gameEngine.KEYCODE_SPACE:
				{
					gameEngine.SpacePressed = true;
					console.log( "Space key down" );
					break;
				}
			default:
				{
					console.log( "unknown key code " + evt.keyCode + " down" );
					break;
				}
		}
	},

	//handling key up. dont touch
	handleKeyUp: function ( evt )
	{
		if ( !evt ) { var evt = window.event; }
		switch ( evt.keyCode )
		{
			case gameEngine.KEYCODE_LEFT:
				{
					gameEngine.ArrowLeft = false;
					console.log( "left key up" );
					break;
				}
			case gameEngine.KEYCODE_RIGHT:
				{
					gameEngine.ArrowRight = false;
					console.log( "right key up" );
					break;
				}
			case gameEngine.KEYCODE_UP:
				{
					gameEngine.ArrowUp = false;
					console.log( "up key up" );
					break;
				}
			case gameEngine.KEYCODE_DOWN:
				{
					gameEngine.ArrowDown = false;
					console.log( "down key up" );
					break;
				}
			case gameEngine.KEYCODE_A:
				{
					gameEngine.APressed = false;
					console.log( "A key up" );
					break;
				}
			case gameEngine.KEYCODE_W:
				{
					gameEngine.WPressed = false;
					console.log( "W key up" );
					break;
				}
			case gameEngine.KEYCODE_D:
				{
					gameEngine.DPressed = false;
					console.log( "D key up" );
					break;
				}
			case gameEngine.KEYCODE_S:
				{
					gameEngine.SPressed = false;
					console.log( "S key up" );
					break;
				}
			case gameEngine.KEYCODE_J:
				{
					gameEngine.JamiePressed = false;
					console.log( "J key up" );
					break;
				}
			case gameEngine.KEYCODE_T:
				{
					gameEngine.TomPressed = false;
					console.log( "T key up" );
					break;
				}
			case gameEngine.KEYCODE_Z:
				{
					gameEngine.ZPressed = false;
					console.log( "Z key up" );
					break;
				}
			case gameEngine.KEYCODE_I:
				{
					gameEngine.IPressed = false;
					console.log( "I key up" );
					break;
				}
			case gameEngine.KEYCODE_X:
				{
					gameEngine.XPressed = false;
					console.log( "X key up" );
					break;
				}
			case gameEngine.KEYCODE_O:
				{
					gameEngine.OPressed = false;
					console.log( "O key up" );
					break;
				}
			case gameEngine.KEYCODE_SPACE:
				{
					gameEngine.SpacePressed = false;
					console.log( "Space key up" );
					break;
				}
			default:
				{
					console.log( "unknown key code " + evt.keyCode + " up" );
					break;
				}
		}
	},

	main: function ()
	{
		gameEngine.setUpCanvas();
		createjs.Ticker.addEventListener( "tick", gameEngine.loop );
		createjs.Ticker.setFPS( gameEngine.MAINFPS );
		andrewMain();
	}
}

if ( !!( window.addEventListener ) )
{
	window.addEventListener( "DOMContentLoaded", gameEngine.main );
	document.onkeydown = gameEngine.handleKeyDown;
	document.onkeyup = gameEngine.handleKeyUp;
}
else
{ //MSIE
	window.attachEvent( "onload", gameEngine.main );
	document.onkeydown = gameEngine.handleKeyDown;
	document.onkeyup = gameEngine.handleKeyUp;
}

//#region title
var titleManifest =
[
	{ src: "images/title.jpg", id: "title" },
	{ src: "images/playButton.png", id: "playButton" },
	{ src: "images/instructionsButton.png", id: "instructionsButton" },
	{ src: "images/creditsButton.png", id: "creditsButton" },
];
var titleQueue;
var titleScreen, playButton, instructionsButton, creditsButton;
function titleLoaded()
{
	titleScreen = new createjs.Bitmap( titleQueue[0].getResult( "title" ) );
	playButton = new createjs.Bitmap( titleQueue[0].getResult( "playButton" ) );
	playButton.on( "click", function ( evt ) { gameEngine.mode = "characterSelect"; } );
	playButton.regX = playButton.getBounds().width / 2;
	playButton.regY = playButton.getBounds().height / 2;
	playButton.x = gameEngine.CANVASWIDTH / 2;
	playButton.y = gameEngine.CANVASHEIGHT / 2;

	instructionsButton = new createjs.Bitmap( titleQueue[0].getResult( "instructionsButton" ) );
	instructionsButton.on( "click", function ( evt ) { gameEngine.mode = "instructions"; } );
	instructionsButton.regX = instructionsButton.getBounds().width / 2;
	instructionsButton.x = gameEngine.CANVASWIDTH / 2;
	instructionsButton.y = playButton.getTransformedBounds().height + playButton.y + 5;

	creditsButton = new createjs.Bitmap( titleQueue[0].getResult( "creditsButton" ) );
	creditsButton.on( "click", function ( evt ) { gameEngine.mode = "credits"; } );
	creditsButton.regX = creditsButton.getBounds().width / 2;
	creditsButton.x = gameEngine.CANVASWIDTH / 2;
	creditsButton.y = instructionsButton.getTransformedBounds().height + instructionsButton.y + 5;
}

function titleInit()
{
	gameEngine.stage.addChild( titleScreen );
	gameEngine.stage.addChild( playButton );
	gameEngine.stage.addChild( instructionsButton );
	gameEngine.stage.addChild( creditsButton );
}
function titleDelete()
{
	gameEngine.stage.removeAllChildren();
}
function titleUpdate()
{

}
//#endregion

//#region instructions
var instructionsManifest =
	[
		{ src: "images/instructions.jpg", id: "instructions" }
	];
var instructionsQueue;
var instructions;
function instructionsLoaded()
{
	instructions = new createjs.Bitmap( instructionsQueue[0].getResult( "instructions" ) );
}

function instructionsInit()
{
	gameEngine.stage.addChild( instructions );
	gameEngine.stage.on( "click", function ( evt ) { gameEngine.mode = "title"; } );
}

function instructionsDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllChildren();
}
function instructionsUpdate()
{

}
//#endregion

//#region credits
var creditsManifest =
	[
		{ src: "images/credits.jpg", id: "credits" }
	];
var creditsQueue;
var credits;
function creditsLoaded()
{
	credits = new createjs.Bitmap( creditsQueue[0].getResult( "credits" ) );
}

function creditsInit()
{
	gameEngine.stage.addChild( credits );
	gameEngine.stage.on( "click", function ( evt ) { gameEngine.mode = "title"; } );
}

function creditsDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
}
function creditsUpdate()
{

}
//#endregion

//#region gameover
var gameoverManifest =
	[
		{ src: "images/gameover.jpg", id: "gameover" }
	];
var gameoverQueue;
var gameover;
function gameoverLoaded()
{
	gameover = new createjs.Bitmap( gameoverQueue[0].getResult( "gameover" ) );
}

function gameoverInit()
{
	gameEngine.stage.addChild( gameover );
	gameEngine.stage.on( "click", function ( evt ) { gameEngine.mode = "title"; } );
}

function gameoverDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
}
function gameoverUpdate()
{

}
//#endregion

//#region win
var winManifest =
	[
		{ src: "images/win.jpg", id: "win" }
	];
var winQueue;
var win;
function winLoaded()
{
	win = new createjs.Bitmap( winQueue[0].getResult( "win" ) );
}

function winInit()
{
	gameEngine.stage.addChild( win );
	gameEngine.stage.on( "click", function ( evt ) { gameEngine.mode = "credits"; } );
}

function winDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
}
function winUpdate()
{

}
//#endregion

//#region trueWin
var trueWinManifest =
	[
		{ src: "images/win.jpg", id: "trueWin" }
	];
var trueWinQueue;
var trueWin;
function trueWinLoaded()
{
	trueWin = new createjs.Bitmap( trueWinQueue[0].getResult( "trueWin" ) );
}

function trueWinInit()
{
	gameEngine.stage.addChild( trueWin );
	gameEngine.stage.on( "click", function ( evt ) { gameEngine.mode = "credits"; } );
}

function trueWinDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
}
function trueWinUpdate()
{

}
//#endregion

//#region characterSelect
var characterSelectManifest =
	[
		{ src: "images/characterSelect.png", id: "characterSelect" }
	];
var characterSelectQueue;
var characterSelect;
var characterMode = "jamie";
function characterSelectLoaded()
{
	characterSelect = new createjs.Bitmap( characterSelectQueue[0].getResult( "characterSelect" ) );
}

function characterSelectInit()
{
	gameEngine.stage.addChild( characterSelect );
	gameEngine.stage.on( "click", function ( evt ) { if ( evt.stageX < gameEngine.CANVASWIDTH / 2 ) characterMode = "jamie"; else characterMode = "halladay"; gameEngine.mode = "level4" } );
}

function characterSelectDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
}
function characterSelectUpdate()
{

}
//#endregion


//#region mainGame powerStar
var mainGameManifest =
	[
		{ src: "images/jamieChara.png", id: "jamieChara" },
		{ src: "images/fpsBar.png", id: "healthBar" },
		{ src: "images/powerStar.png", id: "powerStar" },
		{ src: "images/easterEgg.png", id: "easterEgg" },
		{ src: "images/pixel.png", id: "pixel" }
	];
var mainGameQueue, jamieChara, pixel, healthBar, powerStar, easterEgg;

var Level1Manifest =
	[

	];
var Level1Queue;

var Level2Manifest =
	[

	];
var Level2Queue;

var Level3Manifest =
	[

	];
var Level3Queue;

var Level4Manifest =
	[
		{ src: "images/enemy.png", id: "enemy" },
		{ src: "images/enemy.png", id: "boss" },
		{ src: "images/level4Building.png", id: "level4Building" },
		{ src: "images/level4BackGround.png", id: "level4BackGround" },
		{ src: "images/level4Train.png", id: "level4Train" },
	];
var Level4Queue, level4Enemy, level4Boss, level4Building, level4BackGround, level4Train;

var Level5Manifest =
	[

	];
var Level5Queue;


function mainGameLoaded()
{
	var jamieCharaSheet = new createjs.SpriteSheet
	(
		{
			images: [mainGameQueue.getResult( "jamieChara" )],
			frames:
				{
					regX: 92 / 2,
					regY: 146,
					width: 92,
					height: 146
				},
			animations:
				{
					Neutral: [0, 0, "Neutral"],
					Run: [1, 4, "RunLoop"],
					RunLoop: [5, 24, "RunLoop"]
				}
		}
	);

	jamieChara = new createjs.Sprite( jamieCharaSheet, "Neutral" );

	var fpsBarSheet = new createjs.SpriteSheet
		(
		{
			images: [mainGameQueue.getResult( "healthBar" )],
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
					ToGood: [90, 119, "Good"]
				}
		}
		);
	healthBar = new createjs.Sprite( fpsBarSheet, "Good" );
	healthBar.scaleY = 0.1;
	healthBar.regY = 100 * 0.1 * 0.5;

	powerStar = new createjs.Bitmap( mainGameQueue.getResult( "powerStar" ) );
	easterEgg = new createjs.Bitmap( mainGameQueue.getResult( "easterEgg" ) );
	pixel = new createjs.Bitmap( mainGameQueue.getResult( "pixel" ) );
}

function level1Loaded()
{
}

function level2Loaded()
{

}

function level3Loaded()
{

}

function level4Loaded()
{
	var enemySheet = new createjs.SpriteSheet
		(
		{
			images: [Level4Queue[0].getResult( "enemy" )],
			frames:
				{
					regX: 367 / 2,
					regY: 311 * 0.80,
					width: 367,
					height: 311
				},
			animations:
				{
					Neutral: [0, 0],
					Die: [1, 9, false]
				}
		}
		);
	level4Enemy = new createjs.Sprite( enemySheet, "Neutral" );
	level4Enemy.scaleX = 0.75;
	level4Enemy.scaleY = 0.75;

	var enemySheet2 = new createjs.SpriteSheet
	(
	{
		images: [Level4Queue[0].getResult( "boss" )],
		frames:
			{
				regX: 367 / 2,
				regY: 311 * 0.20,
				width: 367,
				height: 311
			},
		animations:
			{
				Neutral: [0, 0],
				Die: [1, 9, false]
			}
	}
	);
	level4Boss = new createjs.Sprite( enemySheet2, "Neutral" );
	level4Boss.scaleX = 1.5;
	level4Boss.scaleY = -1.5;
	//level4Boss.regY = level4Boss.getTransformedBounds().width;

	level4Building = new createjs.Bitmap( Level4Queue[0].getResult( "level4Building" ) );
	level4BackGround = new createjs.Bitmap( Level4Queue[0].getResult( "level4BackGround" ) );
	level4Train = new createjs.Bitmap( Level4Queue[0].getResult( "level4Train" ) );
}

function level5Loaded()
{

}

function vec2( x, y )
{
	this.x = x;
	this.y = y;
	this.normalize = function ()
	{
		var magnitude = Math.sqrt(( this.x * this.x ) + ( this.y * this.y ) );
		if ( magnitude === 0 )
		{
			return new vec2( 0, 0 );
		}
		else return new vec2( this.x / magnitude, this.y / magnitude );
	}
	this.length = function ()
	{
		return Math.sqrt(( this.x * this.x ) + ( this.y * this.y ) );
	}
	this.add = function ( addWith )
	{
		return new vec2( addWith.x + this.x, addWith.y + this.y );
	}
	this.subtract = function ( subtractWith )
	{
		return new vec2( this.x - subtractWith.x, this.y - subtractWith.y );
	}
	this.multiply = function ( multiplyWith )
	{
		return new vec2( this.x * multiplyWith, this.y * multiplyWith );
	}
	this.equals = function ( equalWith )
	{
		return ( x === equalWith.x && y === equalWith.y );
	}
}

var camera;
function moveableObject( sprite, initialPosition, velocity )
{
	this.sprite = sprite;
	this.position = initialPosition;
	this.velocity = velocity;
	this.airDistance = 0;

	this.sprite.x = this.position.x;
	this.sprite.y = this.position.y;
}

function shortRangeAttack( x, y, width, height )
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.debugSprite = null;
	this.updateDebugSprite = function ( theSpriteFrom )
	{
		var pixelTest = this.debugSprite;
		pixelTest.x = this.x + theSpriteFrom.x;
		pixelTest.y = this.y + theSpriteFrom.y;
		pixelTest.scaleX = this.width;
		pixelTest.scaleY = this.height;
	}

	this.collideSprite = function ( theSpriteFrom, theSpriteTo )
	{
		if ( this.debugSprite )
		{
			return ndgmr.checkPixelCollision( this.debugSprite, theSpriteTo, 0 );
		}
		else
		{
			var pixelTest = pixel.clone();
			pixelTest.x = this.x + theSpriteFrom.x;
			pixelTest.y = this.y + theSpriteFrom.y;
			pixelTest.scaleX = this.width;
			pixelTest.scaleY = this.height;
			return ndgmr.checkPixelCollision( pixelTest, theSpriteTo, 0 );
		}
	}
}

function moveableAttacker( moveable, attacker )
{
	this.moveable = moveable;
	this.attacker = attacker;
}

function cage( top, bottom, left, right )
{
	this.top = top;
	this.bottom = bottom;
	this.left = left;
	this.right = right;

	this.contain = function ( moveable )
	{
		if ( moveable )
		{
			if ( moveable.position.x > this.right )
			{
				moveable.position.x = this.right;
			}
			if ( moveable.position.x < this.left )
			{
				moveable.position.x = this.left;
			}
			if ( moveable.position.y > this.bottom )
			{
				moveable.position.y = this.bottom;
			}
			if ( moveable.position.y < this.top )
			{
				moveable.position.y = this.top;
			}
		}
	}
	this.containCamera = function ( camera )
	{
		if ( camera )
		{
			if ( camera.x + gameEngine.CANVASWIDTH > this.right )
			{
				camera.x = this.right - gameEngine.CANVASWIDTH;
			}
			if ( camera.x < this.left )
			{
				camera.x = this.left;
			}
			if ( camera.y + gameEngine.CANVASHEIGHT > this.bottom )
			{
				camera.y = this.bottom - gameEngine.CANVASHEIGHT;
			}
			if ( camera.y < this.top )
			{
				camera.y = this.top;
			}
		}
	}
}

function moveableBackdrop( sprite, depth, initialPosition, velocity, seperation, loopVertical, loopHorizonatal )
{
	this.sprite = sprite;
	this.depth = depth;
	this.seperation = seperation;
	this.velocity = velocity;
	this.loopVertical = loopVertical;
	this.loopHorizontal = loopHorizonatal;
	this.array = new Array();

	this.array.push( this.sprite.clone() );
	this.array[0].x = initialPosition.x;
	this.array[0].y = initialPosition.y;


	if ( seperation )
	{
		if ( loopHorizonatal )
		{
			var currentX = initialPosition.x;
			var currentY = initialPosition.y;
			currentX -= seperation.x;
			currentY -= seperation.y;
			while ( currentX >= -gameEngine.CANVASWIDTH )
			{
				var spriteTest = this.sprite.clone();
				spriteTest.x = currentX;
				spriteTest.y = currentY;
				this.array.push( spriteTest );
				currentX -= seperation.x;
				currentY -= seperation.y;
			}

			currentX = initialPosition.x;
			currentY = initialPosition.y;
			currentX += seperation.x;
			currentY += seperation.y;
			while ( currentX <= gameEngine.CANVASWIDTH * 2 )
			{
				var spriteTest = this.sprite.clone();
				spriteTest.x = currentX;
				spriteTest.y = currentY;
				this.array.push( spriteTest );
				currentX += seperation.x;
				currentY += seperation.y;
			}
		}
		if ( loopVertical )
		{
			var currentX = initialPosition.x;
			var currentY = initialPosition.y;
			currentX -= seperation.x;
			currentY -= seperation.y;
			while ( currentY >= -gameEngine.CANVASHEIGHT )
			{
				var spriteTest = this.sprite.clone();
				spriteTest.x = currentX;
				spriteTest.y = currentY;
				this.array.push( spriteTest );
				currentX -= seperation.x;
				currentY -= seperation.y;
			}

			currentX = initialPosition.x;
			currentY = initialPosition.y;
			currentX += seperation.x;
			currentY += seperation.y;
			while ( currentY <= gameEngine.CANVASHEIGHT * 2 )
			{
				var spriteTest = this.sprite.clone();
				spriteTest.x = currentX;
				spriteTest.y = currentY;
				this.array.push( spriteTest );
				currentX += seperation.x;
				currentY += seperation.y;
			}
		}
	}

	this.move = function ( deltaPos )
	{
		for ( var i = 0; i < this.array.length; i++ )
		{
			this.array[i].x += ( deltaPos.x * depth ) + ( depth * velocity.x * gameEngine.DT );
			this.array[i].y += ( deltaPos.y * depth ) + ( depth * velocity.y * gameEngine.DT );
			if ( this.loopHorizontal )
			{
				if ( this.array[i].x > gameEngine.CANVASWIDTH * 2 )
				{
					this.array[i].x -= gameEngine.CANVASWIDTH * 3;
				}
				else if ( this.array[i].x < -gameEngine.CANVASWIDTH )
				{
					this.array[i].x += gameEngine.CANVASWIDTH * 3;
				}
			}

			if ( this.loopVertical )
			{
				if ( this.array[i].y > gameEngine.CANVASHEIGHT * 2 )
				{
					this.array[i].y -= gameEngine.CANVASHEIGHT * 3;
				}
				else if ( this.array[i].y < -gameEngine.CANVASHEIGHT )
				{
					this.array[i].y += gameEngine.CANVASHEIGHT * 3;
				}
			}
		}
	}
}

var easterEggs;

var player;
var playerHealthBar;
var enemies;
var powerStars;
var boss;
var bossHealthBar;
var bossText;
var spriteArray;
var stageBounds;
var cameraBounds;
var backDrops;
var life;
var bosslife;
var MAXLIFE = 100;

var jumpable;
var MAXJUMPHEIGHT = -100;
function playerMovement()
{
	var posToAdd = new vec2( 0, 0 );
	if ( gameEngine.ArrowUp || gameEngine.WPressed )
	{
		posToAdd = posToAdd.subtract( new vec2( 0, player.moveable.velocity * gameEngine.DT ) );
		//	player.position.y -= player.velocity * gameEngine.DT;
	}
	if ( gameEngine.ArrowDown || gameEngine.SPressed )
	{
		posToAdd = posToAdd.add( new vec2( 0, player.moveable.velocity * gameEngine.DT ) );
		//player.position.y += player.velocity * gameEngine.DT;
	}
	if ( gameEngine.ArrowLeft || gameEngine.APressed )
	{
		posToAdd = posToAdd.subtract( new vec2( player.moveable.velocity * gameEngine.DT, 0 ) );
		//player.position.x -= player.velocity * gameEngine.DT;
	}
	if ( gameEngine.ArrowRight || gameEngine.DPressed )
	{
		//player.position.x += player.velocity * gameEngine.DT;
		posToAdd = posToAdd.add( new vec2( player.moveable.velocity * gameEngine.DT, 0 ) );
	}

	if ( jumpable )
	{
		if ( gameEngine.SpacePressed && player.moveable.airDistance >= MAXJUMPHEIGHT )
		{
			player.moveable.airDistance -= 10;
		}
		else
		{
			jumpable = false;
		}
	}
	else
	{
		if ( player.moveable.airDistance < 0 )
		{
			player.moveable.airDistance += 10;
		}
		if ( player.moveable.airDistance >= 0 )
		{
			player.moveable.airDistance = 0;
			jumpable = true;
		}
	}

	if ( posToAdd.equals( new vec2( 0, 0 ) ) )
	{
		if ( player.moveable.sprite.currentAnimation != "Neutral" )
		{
			player.moveable.sprite.gotoAndPlay( "Neutral" );
		}
	}
	else
	{
		if ( posToAdd.x > 0 )
		{
			if ( player.moveable.sprite.scaleX < 0 )
			{
				player.moveable.sprite.scaleX *= -1;
			}
			if ( player.attacker.x < 0 || player.attacker.width < 0 )
			{
				player.attacker.x *= -1;
				player.attacker.width *= -1;
			}
		}
		else if ( posToAdd.x < 0 )
		{
			if ( player.moveable.sprite.scaleX > 0 )
			{
				player.moveable.sprite.scaleX *= -1;
			}
			if ( player.attacker.x > 0 || player.attacker.width > 0 )
			{
				player.attacker.x *= -1;
				player.attacker.width *= -1;
			}
		}
		if ( player.moveable.sprite.currentAnimation == "Neutral" )
		{
			player.moveable.sprite.gotoAndPlay( "Run" );
		}
		player.moveable.position = player.moveable.position.add( posToAdd );
	}
	stageBounds.contain( player.moveable );
	if ( gameEngine.ZPressed || gameEngine.IPressed || gameEngine.XPressed || gameEngine.OPressed )
	{
		player.attacker.updateDebugSprite( player.moveable.sprite );
		player.attacker.debugSprite.visible = true;
		for ( var i = 0; i < enemies.length; i++ )
		{
			if ( enemies[i].moveable.sprite.visible && enemies[i].moveable.sprite.currentAnimation != "Die" )
			{
				var collided = player.attacker.collideSprite( player.moveable.sprite, enemies[i].moveable.sprite );

				if ( collided )
				{
					score += 100;
					enemies[i].moveable.sprite.gotoAndPlay( "Die" );
				}
			}
		}

		if ( boss.moveable.sprite.visible && boss.moveable.sprite.currentAnimation != "Die" )
		{
			var collided = player.attacker.collideSprite( player.moveable.sprite, boss.moveable.sprite );

			if ( collided )
			{
				bosslife -= 0.5;
			}
		}
	}
	else player.attacker.debugSprite.visible = false;

	if ( gameEngine.JamiePressed || gameEngine.TomPressed )
	{
		invisibleTimeLeft = INVISIBLETIME;
	}

	for ( var i = 0; i < powerStars.length; i++ )
	{
		if ( powerStars[i].sprite.visible )
		{
			if ( ndgmr.checkRectCollision( player.moveable.sprite, powerStars[i].sprite ) )
			{
				powerStars[i].sprite.visible = false;
				invisibleTimeLeft = INVISIBLETIME;
			}
		}
	}

	for ( var i = 0; i < easterEggs.length; i++ )
	{
		if ( easterEggs[i].sprite.visible )
		{
			if ( ndgmr.checkRectCollision( player.moveable.sprite, easterEggs[i].sprite ) )
			{
				easterEggs[i].sprite.visible = false;
			}
		}
	}

}

function enemyMovement()
{
	for ( var i = 0; i < enemies.length; i++ )
	{
		if ( enemies[i].moveable.sprite.visible && enemies[i].moveable.sprite.currentAnimation != "Die" )
		{
			var distance = enemies[i].moveable.position.subtract( player.moveable.position ).length()
			if ( distance > 175 && distance < gameEngine.CANVASWIDTH * 1.25 )
			{
				enemies[i].attacker.debugSprite.visible = false;
				var posToAdd = player.moveable.position.subtract( enemies[i].moveable.position ).normalize().multiply( enemies[i].moveable.velocity );
				enemies[i].moveable.position = enemies[i].moveable.position.add( posToAdd );

				if ( posToAdd.equals( new vec2( 0, 0 ) ) )
				{
				}
				else
				{
					if ( posToAdd.x > 0 )
					{
						if ( enemies[i].moveable.sprite.scaleX < 0 )
						{
							enemies[i].moveable.sprite.scaleX *= -1;
						}
						if ( enemies[i].attacker.x < 0 || enemies[i].attacker.width < 0 )
						{
							enemies[i].attacker.x *= -1;
							enemies[i].attacker.width *= -1;
						}
					}
					else if ( posToAdd.x < 0 )
					{
						if ( enemies[i].moveable.sprite.scaleX > 0 )
						{
							enemies[i].moveable.sprite.scaleX *= -1;
						}
						if ( enemies[i].attacker.x > 0 || enemies[i].attacker.width > 0 )
						{
							enemies[i].attacker.x *= -1;
							enemies[i].attacker.width *= -1;
						}
					}
				}

				stageBounds.contain( enemies[i].moveable );
			}
			else
			{
				enemies[i].attacker.debugSprite.visible = true;
				enemies[i].attacker.updateDebugSprite( enemies[i].moveable.sprite );
				if ( invisibleTimeLeft <= 0 && enemies[i].attacker.collideSprite( enemies[i].moveable.sprite, player.moveable.sprite ) )
				{
					life -= 0.25;
				}
			}
		}
		else
		{
			enemies[i].attacker.debugSprite.visible = false;
		}
	}
}

function bossUpdate()
{
	if ( boss.moveable.sprite.visible && boss.moveable.sprite.currentAnimation != "Die" )
	{
		var distance = boss.moveable.position.subtract( player.moveable.position ).length()
		if ( distance > 175 && distance < gameEngine.CANVASWIDTH * 1.25 )
		{
			boss.attacker.debugSprite.visible = false;
			var posToAdd = player.moveable.position.subtract( boss.moveable.position ).normalize().multiply( boss.moveable.velocity );
			boss.moveable.position = boss.moveable.position.add( posToAdd );

			if ( posToAdd.equals( new vec2( 0, 0 ) ) )
			{
			}
			else
			{
				if ( posToAdd.x > 0 )
				{
					if ( boss.moveable.sprite.scaleX < 0 )
					{
						boss.moveable.sprite.scaleX *= -1;
					}
					if ( boss.attacker.x < 0 || boss.attacker.width < 0 )
					{
						boss.attacker.x *= -1;
						boss.attacker.width *= -1;
					}
				}
				else if ( posToAdd.x < 0 )
				{
					if ( boss.moveable.sprite.scaleX > 0 )
					{
						boss.moveable.sprite.scaleX *= -1;
					}
					if ( boss.attacker.x > 0 || boss.attacker.width > 0 )
					{
						boss.attacker.x *= -1;
						boss.attacker.width *= -1;
					}
				}
			}

			stageBounds.contain( boss.moveable );
		}
		else
		{
			boss.attacker.debugSprite.visible = true;
			boss.attacker.updateDebugSprite( boss.moveable.sprite );
			if ( invisibleTimeLeft <= 0 && boss.attacker.collideSprite( boss.moveable.sprite, player.moveable.sprite ) )
			{
				life -= 0.5;
			}
		}
	}
	else
	{
		boss.attacker.debugSprite.visible = false;
	}
}

function cameraFollowPlayer()
{
	var oldCamera = new vec2( camera.x, camera.y );
	if ( player.moveable.sprite.x < gameEngine.CANVASWIDTH * 0.25 )
	{
		camera.x += player.moveable.sprite.x - ( gameEngine.CANVASWIDTH * 0.25 )
	}
	if ( player.moveable.sprite.x > gameEngine.CANVASWIDTH * 0.75 )
	{
		camera.x += player.moveable.sprite.x - ( gameEngine.CANVASWIDTH * 0.75 )
	}
	if ( player.moveable.sprite.y < gameEngine.CANVASHEIGHT * 0.25 )
	{
		camera.y += player.moveable.sprite.y - ( gameEngine.CANVASHEIGHT * 0.25 )
	}
	if ( player.moveable.sprite.y > gameEngine.CANVASHEIGHT * 0.75 )
	{
		camera.y += player.moveable.sprite.y - ( gameEngine.CANVASHEIGHT * 0.75 )
	}
	cameraBounds.containCamera( camera );
	for ( var i = 0; i < backDrops.length; i++ )
	{
		backDrops[i].move( oldCamera.subtract( camera ) );
	}
}

function moveableObjectsUpdate( theSprites )
{
	for ( var i = 0; i < theSprites.length; i++ )
	{
		if ( theSprites[i].sprite.visible )
		{
			theSprites[i].sprite.x = theSprites[i].position.x - camera.x;
			theSprites[i].sprite.y = theSprites[i].position.y + theSprites[i].airDistance - camera.y;
		}
	}
}

var lastLife;
var lastBossLife;
var lifeMoveSpeed = 1;
function updateLife()
{
	lastLife += ( life - lastLife ) * lifeMoveSpeed;
	playerHealthBar.scaleX = lastLife / 50;
	if ( life < 25 && ( playerHealthBar.currentAnimation == "Good" || playerHealthBar.currentAnimation == "ToGood" ) )
	{
		playerHealthBar.gotoAndPlay( "ToBad" );
	}
	else if ( life >= 25 && ( playerHealthBar.currentAnimation == "Bad" || playerHealthBar.currentAnimation == "ToBad" ) )
	{
		playerHealthBar.gotoAndPlay( "ToGood" );
	}

	var distance = boss.moveable.position.subtract( player.moveable.position ).length()
	if ( distance < gameEngine.CANVASWIDTH * 1.25 )
	{
		bossText.visible = true;
		bossHealthBar.visible = true;
	}
	else
	{
		bossText.visible = false;
		bossHealthBar.visible = false;
	}


	lastBossLife += ( bosslife - lastBossLife ) * lifeMoveSpeed;
	bossHealthBar.scaleX = -( lastBossLife / 50 );
	if ( bosslife < 25 && ( bossHealthBar.currentAnimation == "Good" || bossHealthBar.currentAnimation == "ToGood" ) )
	{
		bossHealthBar.gotoAndPlay( "ToBad" );
	}
	else if ( bosslife >= 25 && ( bossHealthBar.currentAnimation == "Bad" || bossHealthBar.currentAnimation == "ToBad" ) )
	{
		bossHealthBar.gotoAndPlay( "ToGood" );
	}

	if ( bosslife <= 0 && boss.moveable.sprite.currentAnimation != "Die" )
	{
		score += 9001;
		boss.moveable.sprite.gotoAndPlay( "Die" );
	}
}

var invisibleTimeLeft;
var INVISIBLETIME = 3;

function invisibilityUpdate()
{
	if ( invisibleTimeLeft > 0 ) invisibleTimeLeft -= gameEngine.DT;
	if ( invisibleTimeLeft < 0 ) invisibleTimeLeft = 0;
	player.moveable.sprite.alpha = 1 - ( ( invisibleTimeLeft / INVISIBLETIME ) * 0.5 );
}


var score;
var scoreDisplay;
//#region level1
function level1Init()
{

}

function level1Delete()
{

}

function level1Update()
{

}
//#endregion

//#region level2
function level2Init()
{

}

function level2Delete()
{

}

function level2Update()
{

}
//#endregion

//#region level3
function level3Init()
{

}

function level3Delete()
{

}

function level3Update()
{

}
//#endregion

//#region level4
function level4Init()
{
	backDrops = new Array();
	backDrops.push( new moveableBackdrop( level4BackGround, 1, new vec2( 0, 0 ), new vec2( -1000, 0 ), new vec2( level4BackGround.getBounds().width, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level4Building, 0.5, new vec2( 0, 0 ), new vec2( -1000, 0 ), new vec2( level4Building.getBounds().width, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level4Train, 1, new vec2( 0, gameEngine.CANVASHEIGHT - level4Train.getBounds().height - 50 ), new vec2( 0, 0 ), new vec2( level4Train.getBounds().width, 0 ), false, true ) );
	for ( var i = 0; i < backDrops.length; i++ )
	{
		for ( var j = 0; j < backDrops[i].array.length; j++ )
		{
			gameEngine.stage.addChild( backDrops[i].array[j] );
		}
	}

	spriteArray = new Array();


	boss = new moveableAttacker( new moveableObject( level4Boss.clone(), new vec2( 9000, 0 ), 10 ), new shortRangeAttack( level4Boss.getTransformedBounds().width / 4, -level4Boss.getTransformedBounds().height / 4, 100, 100 ) );
	boss.attacker.debugSprite = pixel.clone();
	boss.moveable.sprite.on( "animationend", function ( evt ) { if ( evt.name == "Die" ) evt.target.visible = false; } );
	spriteArray.push( boss.moveable );
	gameEngine.stage.addChild( boss.moveable.sprite );
	gameEngine.stage.addChild( boss.attacker.debugSprite );
	enemies = new Array();
	for ( var i = 0; i < 100; i++ )
	{
		enemies.push( new moveableAttacker( new moveableObject( level4Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( ( 10000 - gameEngine.CANVASWIDTH ) * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ), new shortRangeAttack( level4Enemy.getTransformedBounds().width / 4, -level4Enemy.getTransformedBounds().height / 4, 100, 20 ) ) );
		enemies[i].attacker.debugSprite = pixel.clone();
		enemies[i].attacker.debugSprite.visible = true;
		enemies[i].moveable.sprite.on( "animationend",
		function ( evt ) { if ( evt.name == "Die" ) evt.target.visible = false; }
		);
		spriteArray.push( enemies[i].moveable );
		gameEngine.stage.addChild( enemies[i].moveable.sprite );
		gameEngine.stage.addChild( enemies[i].attacker.debugSprite );
	}

	stageBounds = new cage( gameEngine.CANVASHEIGHT - 75, gameEngine.CANVASHEIGHT - 50, 0, 10000 );
	cameraBounds = new cage( 0, gameEngine.CANVASHEIGHT - 100, 0, 10000 );
	camera = new vec2( 0, 0 );
	player = new moveableAttacker( new moveableObject( jamieChara.clone(), new vec2( gameEngine.CANVASWIDTH * 0.25, gameEngine.CANVASHEIGHT * 0.75 ), 300 ), new shortRangeAttack( jamieChara.getTransformedBounds().width / 4, -jamieChara.getTransformedBounds().height / 2, 45, 10 ) );
	player.attacker.debugSprite = pixel.clone();
	spriteArray.push( player.moveable );
	gameEngine.stage.addChild( player.moveable.sprite );
	gameEngine.stage.addChild( player.attacker.debugSprite );

	powerStars = new Array();
	for ( var i = 0; i < 4; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * 7500 ) + gameEngine.CANVASWIDTH, 0 ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		gameEngine.stage.addChild( powerStars[i].sprite );
	}

	easterEggs = new Array();
	for ( var i = 0; i < 2; i++ )
	{
		easterEggs.push( new moveableObject( easterEgg.clone(), new vec2(( Math.random() * 7500 ) + gameEngine.CANVASWIDTH, 0 ) ) );
		spriteArray.push( easterEggs[easterEggs.length - 1] );
		stageBounds.contain( easterEggs[easterEggs.length - 1] );
		gameEngine.stage.addChild( easterEggs[easterEggs.length - 1].sprite )
	}

	jumpable = true;
	life = 100;
	lastLife = life;
	bosslife = 50;
	lastBossLife = bosslife;
	invisibleTimeLeft = 0;
	playerHealthBar = healthBar.clone();
	gameEngine.stage.addChild( playerHealthBar );

	bossText = new createjs.Text( "Boss", "16px Comic Sans MS", "#FFF" );
	bossText.regX = bossText.getMeasuredWidth();
	bossText.regY = bossText.getMeasuredHeight();
	bossText.x = gameEngine.CANVASWIDTH;
	bossText.y = gameEngine.CANVASHEIGHT;
	gameEngine.stage.addChild( bossText );

	bossHealthBar = healthBar.clone();
	bossHealthBar.x = gameEngine.CANVASWIDTH;
	bossHealthBar.y = gameEngine.CANVASHEIGHT - bossHealthBar.getTransformedBounds().height - bossText.getTransformedBounds().height;
	gameEngine.stage.addChild( bossHealthBar );
	score = 0;

	var scoreText = new createjs.Text( "Score", "16px Comic Sans MS", "#000" );
	scoreText.regX = scoreText.getMeasuredWidth();
	scoreText.x = gameEngine.CANVASWIDTH;

	scoreDisplay = new createjs.Text( score, "16px Comic Sans MS", "#000" );
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	scoreDisplay.y = scoreText.getMeasuredHeight();
	gameEngine.stage.addChild( scoreText );
	gameEngine.stage.addChild( scoreDisplay );
}

function level4Delete()
{
	gameEngine.stage.removeAllChildren();
	backDrops = spriteArray = enemies = stageBounds = null;
}

function level4Update()
{

	playerMovement();
	enemyMovement();
	bossUpdate();
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
	updateLife();
	invisibilityUpdate();
	scoreDisplay.text = score;
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	if ( life <= 0 ) gameEngine.mode = "gameover";
	if ( !boss.moveable.sprite.visible )
	{
		var gotAllEggs = true;
		for ( var i = 0; i < easterEggs.length; i++ )
		{
			if ( easterEggs[i].sprite.visible )
			{
				gotAllEggs = false;
			}
		}
		if ( gotAllEggs )
		{
			gameEngine.mode = "trueWin";
		}
		else gameEngine.mode = "win";
	}
}
//#endregion

//#region level5
function level5Init()
{

}

function level5Delete()
{

}

function level5Update()
{

}
//#endregion

//#endregion
function andrewMain()
{
	titleQueue = new Array();
	titleQueue.push( new createjs.LoadQueue( true, "assets/" ) );
	titleQueue[0].on( "complete", titleLoaded, this );
	titleQueue[0].loadManifest( titleManifest );
	gameEngine.addModeLooper( "title", new gameEngine.updateModeLooper( titleInit, titleDelete, titleUpdate, titleQueue ) );

	instructionsQueue = new Array();
	instructionsQueue.push( new createjs.LoadQueue( true, "assets/" ) );
	instructionsQueue[0].on( "complete", instructionsLoaded, this );
	instructionsQueue[0].loadManifest( instructionsManifest );
	gameEngine.addModeLooper( "instructions", new gameEngine.updateModeLooper( instructionsInit, instructionsDelete, instructionsUpdate, instructionsQueue ) );

	creditsQueue = new Array();
	creditsQueue.push( new createjs.LoadQueue( true, "assets/" ) );
	creditsQueue[0].on( "complete", creditsLoaded, this );
	creditsQueue[0].loadManifest( creditsManifest );
	gameEngine.addModeLooper( "credits", new gameEngine.updateModeLooper( creditsInit, creditsDelete, creditsUpdate, creditsQueue ) );

	gameoverQueue = new Array();
	gameoverQueue.push( new createjs.LoadQueue( true, "assets/" ) );
	gameoverQueue[0].on( "complete", gameoverLoaded, this );
	gameoverQueue[0].loadManifest( gameoverManifest );
	gameEngine.addModeLooper( "gameover", new gameEngine.updateModeLooper( gameoverInit, gameoverDelete, gameoverUpdate, gameoverQueue ) );

	winQueue = new Array();
	winQueue.push( new createjs.LoadQueue( true, "assets/" ) );
	winQueue[0].on( "complete", winLoaded, this );
	winQueue[0].loadManifest( winManifest );
	gameEngine.addModeLooper( "win", new gameEngine.updateModeLooper( winInit, winDelete, winUpdate, winQueue ) );

	trueWinQueue = new Array();
	trueWinQueue.push( new createjs.LoadQueue( true, "assets/" ) );
	trueWinQueue[0].on( "complete", trueWinLoaded, this );
	trueWinQueue[0].loadManifest( trueWinManifest );
	gameEngine.addModeLooper( "trueWin", new gameEngine.updateModeLooper( trueWinInit, trueWinDelete, trueWinUpdate, trueWinQueue ) );

	characterSelectQueue = new Array();
	characterSelectQueue.push( new createjs.LoadQueue( true, "assets/" ) );
	characterSelectQueue[0].on( "complete", characterSelectLoaded, this );
	characterSelectQueue[0].loadManifest( characterSelectManifest );
	gameEngine.addModeLooper( "characterSelect", new gameEngine.updateModeLooper( characterSelectInit, characterSelectDelete, characterSelectUpdate, characterSelectQueue ) );

	mainGameQueue = new createjs.LoadQueue( true, "assets/" );
	mainGameQueue.on( "complete", mainGameLoaded, this );
	mainGameQueue.loadManifest( mainGameManifest );

	Level1Queue = new Array();
	Level1Queue.push( new createjs.LoadQueue( true, "assets/" ) );
	Level1Queue[0].on( "complete", level1Loaded );
	Level1Queue[0].loadManifest( Level1Manifest );
	Level1Queue.push( mainGameQueue );
	gameEngine.addModeLooper( "level1", new gameEngine.updateModeLooper( level1Init, level1Delete, level1Update, Level1Queue ) );

	Level2Queue = new Array();
	Level2Queue.push( new createjs.LoadQueue( true, "assets/" ) );
	Level2Queue[0].on( "complete", level2Loaded );
	Level2Queue[0].loadManifest( Level2Manifest );
	Level2Queue.push( mainGameQueue );
	gameEngine.addModeLooper( "level2", new gameEngine.updateModeLooper( level2Init, level2Delete, level2Update, Level2Queue ) );

	Level3Queue = new Array();
	Level3Queue.push( new createjs.LoadQueue( true, "assets/" ) );
	Level3Queue[0].on( "complete", level3Loaded );
	Level3Queue[0].loadManifest( Level3Manifest );
	Level3Queue.push( mainGameQueue );
	gameEngine.addModeLooper( "level3", new gameEngine.updateModeLooper( level3Init, level3Delete, level3Update, Level3Queue ) );

	Level4Queue = new Array();
	Level4Queue.push( new createjs.LoadQueue( true, "assets/" ) );
	Level4Queue[0].on( "complete", level4Loaded );
	Level4Queue[0].loadManifest( Level4Manifest );
	Level4Queue.push( mainGameQueue );
	gameEngine.addModeLooper( "level4", new gameEngine.updateModeLooper( level4Init, level4Delete, level4Update, Level4Queue ) );

	Level5Queue = new Array();
	Level5Queue.push( new createjs.LoadQueue( true, "assets/" ) );
	Level5Queue[0].on( "complete", level5Loaded );
	Level5Queue[0].loadManifest( Level5Manifest );
	Level5Queue.push( mainGameQueue );
	gameEngine.addModeLooper( "level5", new gameEngine.updateModeLooper( level5Init, level5Delete, level5Update, Level5Queue ) );
}