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

var mute = false;

//#region title
var titleManifest =
[
	{ src: "images/title.jpg", id: "title" },
	{ src: "images/playButton.png", id: "playButton" },
	{ src: "images/instructionsButton.png", id: "instructionsButton" },
	{ src: "images/creditsButton.png", id: "creditsButton" },
	{ src: "audio/InGame.mp3", id: "titleMusic" }
];
var titleQueue;
var titleScreen, playButton, instructionsButton, creditsButton, titleMusic;
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

	titleMusic = new createjs.Sound.createInstance( "titleMusic" );
	titleMusic.setVolume( 0.50 );
}

function titleInit()
{
	gameEngine.stage.addChild( titleScreen );
	gameEngine.stage.addChild( playButton );
	gameEngine.stage.addChild( instructionsButton );
	gameEngine.stage.addChild( creditsButton );
	if ( titleMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) titleMusic.play( { loop: -1 } );
}
function titleDelete()
{
	gameEngine.stage.removeAllChildren();
}
function titleUpdate()
{
	titleMusic.setMute( mute );
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
	if ( titleMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) titleMusic.play( { loop: -1 } );
}

function instructionsDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllChildren();
}
function instructionsUpdate()
{
	titleMusic.setMute( mute );
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
	if ( titleMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) titleMusic.play( { loop: -1 } );
}

function creditsDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
}
function creditsUpdate()
{
	titleMusic.setMute( mute );
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
	gameEngine.stage.on( "click",
function ( evt )
{
	if ( evt.stageX < gameEngine.CANVASWIDTH / 2 )
		characterMode = "jamie";
	else characterMode = "halladay";
	gameEngine.mode = "level5";
	if ( titleMusic.playState == createjs.Sound.PLAY_SUCCEEDED )
		titleMusic.stop();
	score = null;
	easterEggs = null;
} );
	if ( titleMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) titleMusic.play( { loop: -1 } );
}

function characterSelectDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
}
function characterSelectUpdate()
{
	titleMusic.setMute( mute );
}
//#endregion


//#region mainGame
var mainGameManifest =
	[
		{ src: "images/jamieChara.png", id: "jamieChara" },
		{ src: "images/powerStar.png", id: "jamieIcon" },
		{ src: "images/jamieChara.png", id: "halladayChara" },
		{ src: "images/powerStar.png", id: "halladayIcon" },
		{ src: "images/fpsBar.png", id: "healthBar" },
		{ src: "images/powerStar.png", id: "powerStar" },
		{ src: "images/easterEgg.png", id: "easterEgg" },
		{ src: "images/pixel.png", id: "pixel" },
		{src: "audio/InGame.mp3", id: "gameMusic"}
	];
var mainGameQueue, jamieChara, jamieIcon, halladayChara, halladayIcon, pixel, healthBar, powerStar, easterEgg, gameMusic;

var Level1Manifest =
	[
		{ src: "images/level1/level1Frame.png", id: "level1Frame" },
		{ src: "images/level1/level1Enemy.png", id: "level1Enemy" },
		{ src: "images/level1/level1EnemyIcon.png", id: "level1EnemyIcon" },
		{ src: "images/level1/level1Boss.png", id: "level1Boss" },
		{ src: "images/level1/level1BossIcon.png", id: "level1BossIcon" },
		{ src: "images/level1/level1BackGround.png", id: "level1BackGround" },
		{ src: "images/level1/level1Bench.png", id: "level1Bench" },
		{ src: "images/level1/level1Lamp.png", id: "level1Lamp" },
		{ src: "images/level1/level1Trash.png", id: "level1Trash" },
	];
var Level1Queue, level1Frame, level1Enemy, level1EnemyIcon, level1Boss, level1BossIcon, level1BackGround, level1Bench, level1Lamp, level1Trash;

var Level2Manifest =
	[
		{ src: "images/level2/level2Frame.png", id: "level2Frame" },
		{ src: "images/level2/level2Enemy.png", id: "level2Enemy" },
		{ src: "images/level2/level2EnemyIcon.png", id: "level2EnemyIcon" },
		{ src: "images/level2/level2Boss.png", id: "level2Boss" },
		{ src: "images/level2/level2BossIcon.png", id: "level2BossIcon" },
		{ src: "images/level2/level2Building.png", id: "level2Building" },
		{ src: "images/level2/level2BackGround.png", id: "level2BackGround" },
		{ src: "images/level2/level2Train.png", id: "level2Train" },
	];
var Level2Queue, level2Enemy, level2EnemyIcon, level2Boss, level2BossIcon, level2Building, level2BackGround, level2Train, level2Frame;

var Level3Manifest =
	[
		{ src: "images/level3/level3Frame.png", id: "level3Frame" },
		{ src: "images/level3/level3Enemy.png", id: "level3Enemy" },
		{ src: "images/level3/level3EnemyIcon.png", id: "level3EnemyIcon" },
		{ src: "images/level3/level3Boss.png", id: "level3Boss" },
		{ src: "images/level3/level3BossIcon.png", id: "level3BossIcon" },
		{ src: "images/level3/level3BackGround.png", id: "level3BackGround" },
		{ src: "images/level3/level3Shelf.png", id: "level3Shelf" },
	];
var Level3Queue, level3Frame, level3Enemy, level3EnemyIcon, level3Boss, level3BossIcon, level3BackGround, level3Shelf;

var Level4Manifest =
	[
		{ src: "images/level4/level4Frame.png", id: "level4Frame" },
		{ src: "images/level4/level4Enemy.png", id: "level4Enemy" },
		{ src: "images/level4/level4EnemyIcon.png", id: "level4EnemyIcon"},
		{ src: "images/level4/level4Boss.png", id: "level4Boss" },
		{ src: "images/level4/level4BossIcon.png", id: "level4BossIcon" },
		{ src: "images/level4/level4BackGround.png", id: "level4BackGround" },
		{ src: "images/level4/level4Chair.png", id: "level4Chair" },
		{ src: "images/level4/level4DoorRight.png", id: "level4DoorRight" },
		{ src: "images/level4/level4Lights.png", id: "level4Lights" },
		{ src: "images/level4/level4Table.png", id: "level4Table" },
	];
var Level4Queue, level4Frame, level4Enemy, level4EnemyIcon, level4Boss, level4BossIcon, level4BackGround, level4Chair, level4DoorRight, level4Lights, level4Table;

var Level5Manifest =
	[
		{ src: "images/level5/level5Frame.png", id: "level5Frame" },
		{ src: "images/level5/level5Enemy.png", id: "level5Enemy" },
		{ src: "images/level5/level5EnemyIcon.png", id: "level5EnemyIcon" },
		{ src: "images/level5/level5Boss.png", id: "level5Boss" },
		{ src: "images/level5/level5BossIcon.png", id: "level5BossIcon" },
		{ src: "images/level5/level5BackGround.png", id: "level5BackGround" },
		{ src: "images/level5/level5WoodPile.png", id: "level5WoodPile" },
		{ src: "images/level5/level5Building.png", id: "level5Building" },
	];
var Level5Queue, level5Frame, level5Enemy, level5EnemyIcon, level5Boss, level5BossIcon, level5BackGround, level5WoodPile, level5Building;


function mainGameLoaded()
{
	var jamieCharaSheet = new createjs.SpriteSheet
	(
		{
			images: [mainGameQueue.getResult( "jamieChara" )],
			frames:
				[[5, 5, 54, 222, 0, 15.450000000000003, 130.55], [64, 5, 81, 221, 0, 35.45, 128.55], [150, 5, 99, 221, 0, 40.45, 129.55], [254, 5, 109, 202, 0, 47.45, 115.55000000000001], [368, 5, 133, 197, 0, 53.45, 109.55000000000001], [506, 5, 141, 192, 0, 56.45, 104.55000000000001], [652, 5, 129, 192, 0, 50.45, 109.55000000000001], [786, 5, 115, 201, 0, 45.45, 111.55000000000001], [906, 5, 103, 202, 0, 34.45, 111.55000000000001], [5, 232, 93, 202, 0, 22.450000000000003, 111.55000000000001], [103, 232, 90, 206, 0, 18.450000000000003, 114.55000000000001], [198, 232, 106, 204, 0, 35.45, 111.55000000000001], [309, 232, 109, 203, 0, 40.45, 111.55000000000001], [423, 232, 115, 198, 0, 47.45, 111.55000000000001], [543, 232, 132, 197, 0, 53.45, 109.55000000000001], [680, 232, 141, 192, 0, 56.45, 104.55000000000001], [826, 232, 129, 192, 0, 50.45, 109.55000000000001], [5, 443, 115, 201, 0, 45.45, 111.55000000000001], [125, 443, 103, 202, 0, 34.45, 111.55000000000001], [233, 443, 93, 202, 0, 22.450000000000003, 111.55000000000001], [331, 443, 90, 206, 0, 18.450000000000003, 114.55000000000001], [426, 443, 106, 204, 0, 35.45, 111.55000000000001], [537, 443, 109, 203, 0, 40.45, 111.55000000000001], [651, 443, 117, 198, 0, 47.45, 111.55000000000001], [773, 443, 132, 197, 0, 53.45, 109.55000000000001], [5, 5, 54, 222, 0, 15.450000000000003, 130.55], [64, 5, 81, 221, 0, 35.45, 128.55], [910, 443, 97, 217, 0, 38.45, 129.55], [5, 665, 119, 217, 0, 41.45, 129.55], [129, 665, 146, 212, 0, 52.45, 129.55]],
			animations:
				{
					Neutral: [0, 0, "Neutral"],
					Run: [1, 4, "RunLoop"],
					RunLoop: [5, 24, "RunLoop"],
					Attack1: [25, 29, "Neutral", 0.5]
				}
		}
	);

	jamieChara = new createjs.Sprite( jamieCharaSheet, "Neutral" );
	jamieChara.scaleX = 0.75;
	jamieChara.scaleY = 0.75;
	jamieChara.regY = jamieChara.getTransformedBounds().height / 2;

	jamieIcon = new createjs.Bitmap( mainGameQueue.getResult( "jamieIcon" ) );
	if ( jamieIcon.getTransformedBounds().width > jamieIcon.getTransformedBounds().height )
	{
		jamieIcon.scaleX = 64 / jamieIcon.getBounds().width;
		jamieIcon.scaleY = 64 / jamieIcon.getBounds().width;
	}
	else
	{
		jamieIcon.scaleX = 64 / jamieIcon.getBounds().height;
		jamieIcon.scaleY = 64 / jamieIcon.getBounds().height;
	}

	var halladayCharaSheet = new createjs.SpriteSheet
(
	{
		images: [mainGameQueue.getResult( "halladayChara" )],
		frames:
			[[5, 5, 54, 222, 0, 15.450000000000003, 130.55], [64, 5, 81, 221, 0, 35.45, 128.55], [150, 5, 99, 221, 0, 40.45, 129.55], [254, 5, 109, 202, 0, 47.45, 115.55000000000001], [368, 5, 133, 197, 0, 53.45, 109.55000000000001], [506, 5, 141, 192, 0, 56.45, 104.55000000000001], [652, 5, 129, 192, 0, 50.45, 109.55000000000001], [786, 5, 115, 201, 0, 45.45, 111.55000000000001], [906, 5, 103, 202, 0, 34.45, 111.55000000000001], [5, 232, 93, 202, 0, 22.450000000000003, 111.55000000000001], [103, 232, 90, 206, 0, 18.450000000000003, 114.55000000000001], [198, 232, 106, 204, 0, 35.45, 111.55000000000001], [309, 232, 109, 203, 0, 40.45, 111.55000000000001], [423, 232, 115, 198, 0, 47.45, 111.55000000000001], [543, 232, 132, 197, 0, 53.45, 109.55000000000001], [680, 232, 141, 192, 0, 56.45, 104.55000000000001], [826, 232, 129, 192, 0, 50.45, 109.55000000000001], [5, 443, 115, 201, 0, 45.45, 111.55000000000001], [125, 443, 103, 202, 0, 34.45, 111.55000000000001], [233, 443, 93, 202, 0, 22.450000000000003, 111.55000000000001], [331, 443, 90, 206, 0, 18.450000000000003, 114.55000000000001], [426, 443, 106, 204, 0, 35.45, 111.55000000000001], [537, 443, 109, 203, 0, 40.45, 111.55000000000001], [651, 443, 117, 198, 0, 47.45, 111.55000000000001], [773, 443, 132, 197, 0, 53.45, 109.55000000000001], [5, 5, 54, 222, 0, 15.450000000000003, 130.55], [64, 5, 81, 221, 0, 35.45, 128.55], [910, 443, 97, 217, 0, 38.45, 129.55], [5, 665, 119, 217, 0, 41.45, 129.55], [129, 665, 146, 212, 0, 52.45, 129.55]],
		animations:
			{
				Neutral: [0, 0, "Neutral"],
				Run: [1, 4, "RunLoop"],
				RunLoop: [5, 24, "RunLoop"],
				Attack1: [25, 28, "Neutral", 0.5]
			}
	}
);

	halladayChara = new createjs.Sprite( halladayCharaSheet, "Neutral" );
	halladayChara.scaleX = 0.75;
	halladayChara.scaleY = 0.75;
	halladayChara.regY = halladayChara.getTransformedBounds().height / 2;

	halladayIcon = new createjs.Bitmap( mainGameQueue.getResult( "jamieIcon" ) );
	if ( halladayIcon.getTransformedBounds().width > halladayIcon.getTransformedBounds().height )
	{
		halladayIcon.scaleX = 64 / halladayIcon.getBounds().width;
		halladayIcon.scaleY = 64 / halladayIcon.getBounds().width;
	}
	else
	{
		halladayIcon.scaleX = 64 / halladayIcon.getBounds().height;
		halladayIcon.scaleY = 64 / halladayIcon.getBounds().height;
	}

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
	easterEgg.regX = easterEgg.getTransformedBounds().width / 2;
	easterEgg.regY = easterEgg.getTransformedBounds().height;
	pixel = new createjs.Bitmap( mainGameQueue.getResult( "pixel" ) );

	gameMusic = new createjs.Sound.createInstance( "gameMusic" );
	gameMusic.setVolume( 0.50 );
}

function level1Loaded()
{
	var level1EnemySheet = new createjs.SpriteSheet
(
{
	images: [Level1Queue[0].getResult( "level1Enemy" )],
	frames:
		{
			regX: 0,
			regY: 0,
			width: 284,
			height: 409,
		},
	animations:
		{
			Neutral: [0, 0],
			Run:
			{
				frames: [0,2],
				next: "Neutral",
				speed:0.25
			},
			Attack1:
			{
				frames: [1],
				next: "Neutral",
				speed: 0.25
			}
		}
}
);
	level1Enemy = new createjs.Sprite( level1EnemySheet, "Neutral" );
	level1Enemy.regX = level1Enemy.getBounds().width / 2;
	level1Enemy.regY = level1Enemy.getBounds().height;
	level1Enemy.scaleX = 0.5;
	level1Enemy.scaleY = 0.5;

	level1EnemyIcon = new createjs.Bitmap( Level1Queue[0].getResult( "level1EnemyIcon" ) );
	if ( level1EnemyIcon.getTransformedBounds().width > level1EnemyIcon.getTransformedBounds().height )
	{
		level1EnemyIcon.scaleX = 64 / level1EnemyIcon.getBounds().width;
		level1EnemyIcon.scaleY = 64 / level1EnemyIcon.getBounds().width;
	}
	else
	{
		level1EnemyIcon.scaleX = 64 / level1EnemyIcon.getBounds().height;
		level1EnemyIcon.scaleY = 64 / level1EnemyIcon.getBounds().height;
	}

	level1EnemyIcon.regX = level1EnemyIcon.getBounds().width;
	level1EnemyIcon.regY = level1EnemyIcon.getBounds().height;


	var level1BossSheet = new createjs.SpriteSheet
	(
	{
		images: [Level1Queue[0].getResult( "level1Boss" )],
		frames:
			{
				regX: 0,
				regY: 0,
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
	level1Boss = new createjs.Sprite( level1BossSheet, "Neutral" );
	level1Boss.scaleX = 1.5;
	level1Boss.scaleY = 1.5;
	level1Boss.regX = 367 / 2;
	level1Boss.regY = 311 * 0.80;

	level1BossIcon = new createjs.Bitmap( Level1Queue[0].getResult( "level1BossIcon" ) );
	if ( level1BossIcon.getTransformedBounds().width > level1BossIcon.getTransformedBounds().height )
	{
		level1BossIcon.scaleX = 64 / level1BossIcon.getBounds().width;
		level1BossIcon.scaleY = 64 / level1BossIcon.getBounds().width;
	}
	else
	{
		level1BossIcon.scaleX = 64 / level1BossIcon.getBounds().height;
		level1BossIcon.scaleY = 64 / level1BossIcon.getBounds().height;
	}

	level1BossIcon.regX = level1BossIcon.getTransformedBounds().width;
	level1BossIcon.regY = level1BossIcon.getTransformedBounds().height;

	level1BackGround = new createjs.Bitmap( Level1Queue[0].getResult( "level1BackGround" ) );
	level1Bench = new createjs.Bitmap( Level1Queue[0].getResult( "level1Bench" ) );
	level1Bench.regY = level1Bench.getBounds().height;
	level1Bench.scaleX = 0.5;
	level1Bench.scaleY = 0.5;
	level1Lamp = new createjs.Bitmap( Level1Queue[0].getResult( "level1Lamp" ) );
	level1Lamp.regY = level1Lamp.getBounds().height;
	level1Lamp.scaleX = 0.5;
	level1Lamp.scaleY = 0.5;
	level1Trash = new createjs.Bitmap( Level1Queue[0].getResult( "level1Trash" ) );
	level1Trash.regY = level1Trash.getBounds().height;
	level1Trash.scaleX = 0.50;
	level1Trash.scaleY = 0.50;
}

function level2Loaded()
{
	var level2EnemySheet = new createjs.SpriteSheet
	(
	{
		images: [Level2Queue[0].getResult( "level2Enemy" )],
		frames:
			{
				regX: 0,
				regY: 0,
				width: 286,
				height: 412
			},
		animations:
			{
				Neutral: [0, 0],
				Run:
				{
					frames: [0, 2],
					next: "Neutral",
					speed: 0.25
				},
				Attack1:
				{
					frames: [1],
					next: "Neutral",
					speed: 0.25
				}
			}
	}
	);
	level2Enemy = new createjs.Sprite( level2EnemySheet, "Neutral" );
	level2Enemy.regX = level2Enemy.getBounds().width / 2;
	level2Enemy.regY = level2Enemy.getBounds().height;
	level2Enemy.scaleX = 0.5;
	level2Enemy.scaleY = 0.5;

	level2EnemyIcon = new createjs.Bitmap( Level2Queue[0].getResult( "level2EnemyIcon" ) );
	if ( level2EnemyIcon.getTransformedBounds().width > level2EnemyIcon.getTransformedBounds().height )
	{
		level2EnemyIcon.scaleX = 64 / level2EnemyIcon.getBounds().width;
		level2EnemyIcon.scaleY = 64 / level2EnemyIcon.getBounds().width;
	}
	else
	{
		level2EnemyIcon.scaleX = 64 / level2EnemyIcon.getBounds().height;
		level2EnemyIcon.scaleY = 64 / level2EnemyIcon.getBounds().height;
	}

	level2EnemyIcon.regX = level2EnemyIcon.getBounds().width;
	level2EnemyIcon.regY = level2EnemyIcon.getBounds().height;

	var level2BossSheet = new createjs.SpriteSheet
	(
	{
		images: [Level2Queue[0].getResult( "level2Boss" )],
		frames:
			{
				regX: 0,
				regY: 0,
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
	level2Boss = new createjs.Sprite( level2BossSheet, "Neutral" );
	level2Boss.scaleX = 1.5;
	level2Boss.scaleY = 1.5;
	level2Boss.regX = 367 / 2;
	level2Boss.regY = 311 * 0.80;

	level2BossIcon = new createjs.Bitmap( Level2Queue[0].getResult( "level2BossIcon" ) );
	if ( level2BossIcon.getTransformedBounds().width > level2BossIcon.getTransformedBounds().height )
	{
		level2BossIcon.scaleX = 64 / level2BossIcon.getBounds().width;
		level2BossIcon.scaleY = 64 / level2BossIcon.getBounds().width;
	}
	else
	{
		level2BossIcon.scaleX = 64 / level2BossIcon.getBounds().height;
		level2BossIcon.scaleY = 64 / level2BossIcon.getBounds().height;
	}
	level2BossIcon.regX = level2BossIcon.getTransformedBounds().width;
	level2BossIcon.regY = level2BossIcon.getTransformedBounds().height;

	level2Building = new createjs.Bitmap( Level2Queue[0].getResult( "level2Building" ) );
	level2BackGround = new createjs.Bitmap( Level2Queue[0].getResult( "level2BackGround" ) );
	level2Train = new createjs.Bitmap( Level2Queue[0].getResult( "level2Train" ) );
}

function level3Loaded()
{
	var level3EnemySheet = new createjs.SpriteSheet
	(
	{
		images: [Level3Queue[0].getResult( "level3Enemy" )],
		frames:
			{
				regX:0,
				regY: 0,
				width: 348,
				height: 411
			},
		animations:
			{
				Neutral: [0, 0],
				Run:
				{
					frames: [0, 2],
					next: "Neutral",
					speed: 0.25
				},
				Attack1:
				{
					frames: [1],
					next: "Neutral",
					speed: 0.25
				}
			}
	}
	);
	level3Enemy = new createjs.Sprite( level3EnemySheet, "Neutral" );
	level3Enemy.regX = level3Enemy.getBounds().width / 4;
	level3Enemy.regY = level3Enemy.getBounds().height;
	level3Enemy.scaleX = 0.5;
	level3Enemy.scaleY = 0.5;

	level3EnemyIcon = new createjs.Bitmap( Level3Queue[0].getResult( "level3EnemyIcon" ) );
	if ( level3EnemyIcon.getTransformedBounds().width > level3EnemyIcon.getTransformedBounds().height )
	{
		level3EnemyIcon.scaleX = 64 / level3EnemyIcon.getBounds().width;
		level3EnemyIcon.scaleY = 64 / level3EnemyIcon.getBounds().width;
	}
	else
	{
		level3EnemyIcon.scaleX = 64 / level3EnemyIcon.getBounds().height;
		level3EnemyIcon.scaleY = 64 / level3EnemyIcon.getBounds().height;
	}

	level3EnemyIcon.regX = level3EnemyIcon.getBounds().width;
	level3EnemyIcon.regY = level3EnemyIcon.getBounds().height;

	var level3BossSheet = new createjs.SpriteSheet
	(
	{
		images: [Level3Queue[0].getResult( "level3Boss" )],
		frames:
			{
				regX: 0,
				regY: 0,
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
	level3Boss = new createjs.Sprite( level3BossSheet, "Neutral" );
	level3Boss.scaleX = 1.5;
	level3Boss.scaleY = 1.5;
	level3Boss.regX = 367 / 2;
	level3Boss.regY = 311 * 0.80;

	level3BossIcon = new createjs.Bitmap( Level3Queue[0].getResult( "level3BossIcon" ) );
	if ( level3BossIcon.getTransformedBounds().width > level3BossIcon.getTransformedBounds().height )
	{
		level3BossIcon.scaleX = 64 / level3BossIcon.getBounds().width;
		level3BossIcon.scaleY = 64 / level3BossIcon.getBounds().width;
	}
	else
	{
		level3BossIcon.scaleX = 64 / level3BossIcon.getBounds().height;
		level3BossIcon.scaleY = 64 / level3BossIcon.getBounds().height;
	}
	level3BossIcon.regX = level3BossIcon.getTransformedBounds().width;
	level3BossIcon.regY = level3BossIcon.getTransformedBounds().height;

	level3BackGround = new createjs.Bitmap( Level3Queue[0].getResult( "level3BackGround" ) );
	level3Shelf = new createjs.Bitmap( Level3Queue[0].getResult( "level3Shelf" ) );
	level3Shelf.regY = level3Shelf.getBounds().height;
}

function level4Loaded()
{
	var level4EnemySheet = new createjs.SpriteSheet
(
{
	images: [Level4Queue[0].getResult( "level4Enemy" )],
	frames:
		{
			regX: 0,
			regY: 0,
			width: 274,
			height: 415
		},
	animations:
		{
			Neutral: [0, 0],
			Run:
			{
				frames: [0, 2],
				next: "Neutral",
				speed: 0.25
			},
			Attack1:
			{
				frames: [1],
				next: "Neutral",
				speed: 0.25
			}
		}
}
);
	level4Enemy = new createjs.Sprite( level4EnemySheet, "Neutral" );
	level4Enemy.regX = level4Enemy.getBounds().width / 2;
	level4Enemy.regY = level4Enemy.getBounds().height;
	level4Enemy.scaleX = 0.5;
	level4Enemy.scaleY = 0.5;

	level4EnemyIcon = new createjs.Bitmap( Level4Queue[0].getResult( "level4EnemyIcon" ) );
	if ( level4EnemyIcon.getTransformedBounds().width > level4EnemyIcon.getTransformedBounds().height )
	{
		level4EnemyIcon.scaleX = 64 / level4EnemyIcon.getBounds().width;
		level4EnemyIcon.scaleY = 64 / level4EnemyIcon.getBounds().width;
	}
	else
	{
		level4EnemyIcon.scaleX = 64 / level4EnemyIcon.getBounds().height;
		level4EnemyIcon.scaleY = 64 / level4EnemyIcon.getBounds().height;
	}

	level4EnemyIcon.regX = level4EnemyIcon.getBounds().width;
	level4EnemyIcon.regY = level4EnemyIcon.getBounds().height;

	var level4BossSheet = new createjs.SpriteSheet
	(
	{
		images: [Level4Queue[0].getResult( "level4Boss" )],
		frames:
			{
				regX: 0,
				regY: 0,
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
	level4Boss = new createjs.Sprite( level4BossSheet, "Neutral" );
	level4Boss.scaleX = 1.5;
	level4Boss.scaleY = 1.5;
	level4Boss.regX = 367 / 2;
	level4Boss.regY = 311 * 0.80;

	level4BossIcon = new createjs.Bitmap( Level4Queue[0].getResult( "level4BossIcon" ) );
	if ( level4BossIcon.getTransformedBounds().width > level4BossIcon.getTransformedBounds().height )
	{
		level4BossIcon.scaleX = 64 / level4BossIcon.getBounds().width;
		level4BossIcon.scaleY = 64 / level4BossIcon.getBounds().width;
	}
	else
	{
		level4BossIcon.scaleX = 64 / level4BossIcon.getBounds().height;
		level4BossIcon.scaleY = 64 / level4BossIcon.getBounds().height;
	}
	level4BossIcon.regX = level4BossIcon.getTransformedBounds().width;
	level4BossIcon.regY = level4BossIcon.getTransformedBounds().height;

	level4BackGround = new createjs.Bitmap( Level4Queue[0].getResult( "level4BackGround" ) );

	level4Chair = new createjs.Bitmap( Level4Queue[0].getResult( "level4Chair" ) );
	level4Chair.regY = level4Chair.getBounds().height;
	level4Chair.scaleX = 0.75;
	level4Chair.scaleY = 0.75;

	level4DoorRight = new createjs.Bitmap( Level4Queue[0].getResult( "level4DoorRight" ) );
	level4DoorRight.regY = level4DoorRight.getBounds().height;

	level4Lights = new createjs.Bitmap( Level4Queue[0].getResult( "level4Lights" ) );
	level4Lights.regY = level4Lights.getBounds().height;

	level4Table = new createjs.Bitmap( Level4Queue[0].getResult( "level4Table" ) );
	level4Table.regY = level4Table.getBounds().height;
}

function level5Loaded()
{
	var level5EnemySheet = new createjs.SpriteSheet
(
{
	images: [Level5Queue[0].getResult( "level5Enemy" )],
	frames:
		{
			regX: 0,
			regY: 0,
			width: 520,
			height: 419
		},
	animations:
		{
			Neutral: [0, 0],
			Run:
			{
				frames: [0, 2],
				next: "Neutral",
				speed: 0.25
			},
			Attack1:
			{
				frames: [1],
				next: "Neutral",
				speed: 0.25
			}
		}
}
);
	level5Enemy = new createjs.Sprite( level5EnemySheet, "Neutral" );
	level5Enemy.regX = level5Enemy.getBounds().width / 4;
	level5Enemy.regY = level5Enemy.getBounds().height;
	level5Enemy.scaleX = 0.5;
	level5Enemy.scaleY = 0.5;

	level5EnemyIcon = new createjs.Bitmap( Level5Queue[0].getResult( "level5EnemyIcon" ) );
	if ( level5EnemyIcon.getTransformedBounds().width > level5EnemyIcon.getTransformedBounds().height )
	{
		level5EnemyIcon.scaleX = 64 / level5EnemyIcon.getBounds().width;
		level5EnemyIcon.scaleY = 64 / level5EnemyIcon.getBounds().width;
	}
	else
	{
		level5EnemyIcon.scaleX = 64 / level5EnemyIcon.getBounds().height;
		level5EnemyIcon.scaleY = 64 / level5EnemyIcon.getBounds().height;
	}

	level5EnemyIcon.regX = level5EnemyIcon.getBounds().width;
	level5EnemyIcon.regY = level5EnemyIcon.getBounds().height;

	var level5BossSheet = new createjs.SpriteSheet
	(
	{
		images: [Level5Queue[0].getResult( "level5Boss" )],
		frames:
			{
				regX: 0,
				regY: 0,
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
	level5Boss = new createjs.Sprite( level5BossSheet, "Neutral" );
	level5Boss.scaleX = 1.5;
	level5Boss.scaleY = 1.5;
	level5Boss.regX = 367 / 2;
	level5Boss.regY = 311 * 0.80;

	level5BossIcon = new createjs.Bitmap( Level5Queue[0].getResult( "level5BossIcon" ) );
	if ( level5BossIcon.getTransformedBounds().width > level5BossIcon.getTransformedBounds().height )
	{
		level5BossIcon.scaleX = 64 / level5BossIcon.getBounds().width;
		level5BossIcon.scaleY = 64 / level5BossIcon.getBounds().width;
	}
	else
	{
		level5BossIcon.scaleX = 64 / level5BossIcon.getBounds().height;
		level5BossIcon.scaleY = 64 / level5BossIcon.getBounds().height;
	}
	level5BossIcon.regX = level5BossIcon.getTransformedBounds().width;
	level5BossIcon.regY = level5BossIcon.getTransformedBounds().height;

	level5BackGround = new createjs.Bitmap( Level5Queue[0].getResult( "level5BackGround" ) );

	level5WoodPile = new createjs.Bitmap( Level5Queue[0].getResult( "level5WoodPile" ) );
	level5WoodPile.regY = level5WoodPile.getBounds().height;

	level5Building = new createjs.Bitmap( Level5Queue[0].getResult( "level5Building" ) );
	level5Building.regY = level5Building.getBounds().height;
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
	this.facing = "right";

	this.sprite.x = this.position.x;
	this.sprite.y = this.position.y;
}

function shortRangeAttack( x, y, width, height, characterSprite )
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.characterSprite = characterSprite;
	this.debugSprite = null;
	this.update = function ()
	{
		if ( this.debugSprite )
		{
			var pixelTest = this.debugSprite;
			pixelTest.x = this.x + this.characterSprite.x;
			pixelTest.y = this.y + this.characterSprite.y;
			pixelTest.scaleX = this.width;
			pixelTest.scaleY = this.height;
		}
	}

	this.collideSprite = function ( theSpriteTo )
	{
		if ( this.debugSprite )
		{
			return ndgmr.checkPixelCollision( this.debugSprite, theSpriteTo, 0 );
		}
		else
		{
			var pixelTest = pixel.clone();
			pixelTest.x = this.x + this.characterSprite.x;
			pixelTest.y = this.y + this.characterSprite.y;
			pixelTest.scaleX = this.width;
			pixelTest.scaleY = this.height;
			return ndgmr.checkPixelCollision( pixelTest, theSpriteTo, 0 );
		}
	}
}

function longRangeAttack( x, y, character, projectileSprite, velocity, limit )
{
	this.x = x;
	this.y = y;
	this.character = character;
	this.projectileSprite = projectileSprite;
	this.array = new Array();
	for ( var i = 0; i < limit; i++ )
	{
		this.array.push( new moveableObject( projectileSprite.clone(), new vec2( 0, 0 ), velocity ) );
		this.array[i].sprite.visible = false;
	}
	this.update = function ()
	{
		for ( var i = 0; i < this.array.length; i++ )
		{
			if ( this.array[i].sprite.visible )
			{
				this.array[i].position = this.array[i].position.add( this.array[i].velocity );
				if(this.array[i].position.x - camera.x > gameEngine.CANVASWIDTH * 1.25 || this.array[i].position.x - camera.x < gameEngine.CANVASWIDTH * -0.25)
				{
					this.array[i].sprite.visible = false;
				}
			}
		}
	}

	this.fire = function ( flipX, flipY )
	{
		for ( var i = 0; i < this.array.length; i++ )
		{
			if ( !this.array[i].sprite.visible )
			{
				if ( flipX )
				{
					if ( this.array[i].sprite.scaleX > 0 ) this.array[i].sprite.scaleX *= -1;
					this.array[i].position.x = this.character.position.x - this.x;
				}
				else
				{
					if ( this.array[i].sprite.scaleX < 0 ) this.array[i].sprite.scaleX *= -1;
					this.array[i].position.x = this.character.position.x + this.x;
				}

				if ( flipY )
				{
					if ( this.array[i].sprite.scaleY > 0 ) this.array[i].sprite.scaleY *= -1;
					this.array[i].position.y = this.character.position.y - this.y;
				}
				else
				{
					if ( this.array[i].sprite.scaleY < 0 ) this.array[i].sprite.scaleY *= -1;
					this.array[i].position.y = this.character.position.y + this.y;
				}
				this.array[i].sprite.x = this.array[i].position.x - camera.x;
				this.array[i].sprite.y = this.array[i].position.y + this.array[i].airDistance - camera.y;
				this.array[i].sprite.visible = true;
				break;
			}
		}
	}

	this.collideSprite = function ( theSpriteTo )
	{
		for ( var i = 0; i < this.array.length; i++ )
		{
			if ( this.array[i].sprite.visible )
			{
				if ( ndgmr.checkPixelCollision( this.array[i].sprite, theSpriteTo, 0 ) ) return this.array[i];
			}
		}
		return false;
	}
}

function moveableAttacker( moveable, attacker, life )
{
	this.moveable = moveable;
	this.attacker = attacker;
	this.life = life;
	this.icon = null;
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

var enemies;
var powerStars;
var boss;

var spriteArray;
var stageBounds;
var cameraBounds;
var backDrops;
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

	if ( ( gameEngine.ZPressed || gameEngine.IPressed || gameEngine.XPressed || gameEngine.OPressed ) && player.moveable.sprite.currentAnimation != "Attack1") //&& player.moveable.airDistance === 0 )
	{
		player.moveable.sprite.gotoAndPlay( "Attack1" );
	}

	if ( posToAdd.equals( new vec2( 0, 0 ) ) )
	{
		if ( player.moveable.sprite.currentAnimation != "Neutral" && player.moveable.sprite.currentAnimation != "Attack1" )
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
		if ( player.moveable.sprite.currentAnimation == "Neutral" && player.moveable.sprite.currentAnimation != "Attack1" )
		{
			player.moveable.sprite.gotoAndPlay( "Run" );
		}
		player.moveable.position = player.moveable.position.add( posToAdd );
	}
	stageBounds.contain( player.moveable );

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

	player.attacker.update();
}

function playerAttack()
{
	player.attacker.update();
	//player.attacker.debugSprite.visible = true;
	for ( var i = 0; i < enemies.length; i++ )
	{
		if ( enemies[i].moveable.sprite.visible)
		{
			var collided = player.attacker.collideSprite( enemies[i].moveable.sprite );

			if ( collided )
			{
				enemies[i].life -= 1;
				if ( enemies[i].life <= 0)
				{
					score += 100;
					enemies[i].moveable.sprite.visible = false;
					updateTarget( null );
				}
				else updateTarget( enemies[i] );
			}
		}
	}

	if ( boss.moveable.sprite.visible && boss.moveable.sprite.currentAnimation != "Die" )
	{
		var collided = player.attacker.collideSprite( boss.moveable.sprite );

		if ( collided )
		{

			boss.life -= 1;
			if ( boss.life <= 0 && boss.moveable.sprite.currentAnimation != "Die" )
			{
				score += 9001
				boss.moveable.sprite.gotoAndPlay( "Die" );
				updateTarget( null );
			}
			else
			{

				updateTarget( boss );
			}
		}
	}
}

function enemyMovement()
{
	for ( var i = 0; i < enemies.length; i++ )
	{
		if ( enemies[i].moveable.sprite.visible )
		{
			enemies[i].attacker.update();

			var distance = enemies[i].moveable.position.subtract( player.moveable.position ).length()
			if ( distance < gameEngine.CANVASWIDTH * 1.25 && !enemies[i].attacker.collideSprite( player.moveable.sprite ) && enemies[i].moveable.sprite.currentAnimation != "Attack1" )
			{
				if ( enemies[i].moveable.sprite.currentAnimation != "Run" ) enemies[i].moveable.sprite.gotoAndPlay( "Run" );
				if ( Math.abs( enemies[i].moveable.position.x - player.moveable.position.x ) < ( player.moveable.sprite.getTransformedBounds().width / 2 ) + ( enemies[i].moveable.sprite.getTransformedBounds().width / 2 ) ) moveAwayPlayer( enemies[i].moveable, false, true );
				else moveToPlayer( enemies[i].moveable );

				if ( enemies[i].moveable.facing == "right" )
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
				else if ( enemies[i].moveable.facing == "left" )
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

			else if (distance < gameEngine.CANVASWIDTH * 1.25 && Math.random() <= 0.25 && enemies[i].moveable.sprite.currentAnimation != "Attack1" )
			{
				enemies[i].moveable.sprite.gotoAndPlay( "Attack1" );
			}
		}
	}
}

function enemyAttack(enemySprite)
{
	for(var i = 0; i < enemies.length;i++)
	{
		if(enemies[i].moveable.sprite == enemySprite)
		{
			//enemies[i].attacker.debugSprite.visible = true;
			if ( invisibleTimeLeft <= 0 && enemies[i].attacker.collideSprite( player.moveable.sprite ) )
			{
				player.life -= 0.25;
			}
		}
	}
}

function bossUpdate()
{
	if ( boss.moveable.sprite.visible && boss.moveable.sprite.currentAnimation != "Die" )
	{
		boss.attacker.update();
		var distance = boss.moveable.position.subtract( player.moveable.position ).length()
		if ( distance < gameEngine.CANVASWIDTH * 1.25 && !boss.attacker.collideSprite( player.moveable.sprite ) )
		{
			boss.attacker.debugSprite.visible = false;
			moveToPlayer( boss.moveable );

			if ( boss.moveable.facing == "right" )
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
			else if ( boss.moveable.facing == "left" )
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
		else if ( distance < gameEngine.CANVASWIDTH * 1.25 && Math.random() <= 0.25 )
		{
			boss.attacker.debugSprite.visible = true;
			if ( invisibleTimeLeft <= 0 && boss.attacker.collideSprite( player.moveable.sprite ) )
			{
				player.life -= 0.5;
			}
		}
		else
		{
			boss.attacker.debugSprite.visible = false;
		}
	}
	else
	{
		boss.attacker.debugSprite.visible = false;
	}
}

function moveToPlayer( enemyMovable )
{
	var posToAdd = player.moveable.position.subtract( enemyMovable.position ).normalize().multiply( enemyMovable.velocity );
	enemyMovable.position = enemyMovable.position.add( posToAdd );

	if ( posToAdd.distance == 0 )
	{
	}
	else
	{
		if ( posToAdd.x > 0 )
		{
			enemyMovable.facing = "right";
		}
		else if ( posToAdd.x < 0 )
		{
			enemyMovable.facing = "left";
		}
	}
	stageBounds.contain( enemyMovable );
}

function moveAwayPlayer( enemyMovable, ignoreX, ignoreY )
{
	var posToAdd = player.moveable.position.subtract( enemyMovable.position );
	if ( ignoreX ) posToAdd.x = 0;
	if ( ignoreY ) posToAdd.y = 0;
	posToAdd = posToAdd.normalize().multiply( -enemyMovable.velocity );
	enemyMovable.position = enemyMovable.position.add( posToAdd );
	if ( posToAdd.distance == 0 )
	{
	}
	else
	{
		if ( posToAdd.x > 0 )
		{
			enemyMovable.facing = "right";
		}
		else if ( posToAdd.x < 0 )
		{
			enemyMovable.facing = "left";
		}
	}
	stageBounds.contain( enemyMovable );
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
	for ( var i = 0; i < spriteContainerBackdrops.length; i++ )
	{
		spriteContainerBackdrops[i].move( oldCamera.subtract( camera ) );
	}
}

function moveableObjectsUpdate( theSprites )
{
	for ( var i = 0; i < theSprites.length; i++ )
	{
		if ( theSprites[i].sprite.visible )
		{
			theSprites[i].sprite.x = theSprites[i].position.x - camera.x;
			theSprites[i].sprite.y = theSprites[i].position.y - camera.y;
		}
	}

	var sortFunction = function ( obj1, obj2, options )
	{
		if ( obj1.y > obj2.y )
		{
			return 1;
		}
		if ( obj1.y < obj2.y )
		{
			return -1;
		}
		return 0;
	}
	spriteContainer.sortChildren( sortFunction );

	for ( var i = 0; i < theSprites.length; i++ )
	{
		if ( theSprites[i].sprite.visible )
		{
			theSprites[i].sprite.x = theSprites[i].position.x - camera.x;
			theSprites[i].sprite.y = theSprites[i].position.y + theSprites[i].airDistance - camera.y;
		}
	}
}

var playerHealthBar;
var playerIcon;
var lastLife;
var lastEnemyLife;
var enemyTarget;
var enemyHealthBar;
var enemyLifeIcon;
var lifeMoveSpeed = 1;
function updateLife()
{
	lastLife += ( player.life - lastLife ) * lifeMoveSpeed;
	playerHealthBar.scaleX = lastLife / 50;
	if ( player.life < 25 && ( playerHealthBar.currentAnimation == "Good" || playerHealthBar.currentAnimation == "ToGood" ) )
	{
		playerHealthBar.gotoAndPlay( "ToBad" );
	}
	else if ( player.life >= 25 && ( playerHealthBar.currentAnimation == "Bad" || playerHealthBar.currentAnimation == "ToBad" ) )
	{
		playerHealthBar.gotoAndPlay( "ToGood" );
	}

	if ( enemyTarget )
	{
		enemyHealthBar.visible = true;

		lastEnemyLife += ( enemyTarget.life - lastEnemyLife ) * lifeMoveSpeed;
		enemyHealthBar.scaleX = -( lastEnemyLife / 50 );
		if ( enemyTarget.life < 25 && ( enemyHealthBar.currentAnimation == "Good" || enemyHealthBar.currentAnimation == "ToGood" ) )
		{
			enemyHealthBar.gotoAndPlay( "ToBad" );
		}
		else if ( enemyTarget.life >= 25 && ( enemyHealthBar.currentAnimation == "Bad" || enemyHealthBar.currentAnimation == "ToBad" ) )
		{
			enemyHealthBar.gotoAndPlay( "ToGood" );
		}
	}
	else
	{
		enemyHealthBar.visible = false;
	}
}

function updateTarget( newTarget )
{
	if ( newTarget )
	{
		enemyTarget = newTarget;
		lastEnemyLife = enemyTarget.life;
		if ( enemyLifeIcon )
		{
			enemyLifeIcon.visible = false;
			gameEngine.stage.removeChild( enemyLifeIcon );
		}
		if ( enemyTarget.icon )
		{
			enemyLifeIcon = enemyTarget.icon;
			gameEngine.stage.addChild( enemyLifeIcon );
			enemyLifeIcon.visible = true;
		}
	}
	else
	{
		if ( enemyLifeIcon )
		{
			enemyLifeIcon.visible = false;
			gameEngine.stage.removeChild( enemyLifeIcon );
		}
	}
}

var invisibleTimeLeft;
var INVISIBLETIME = 3;

function invisibilityUpdate()
{
	if ( invisibleTimeLeft > 0 )
	{
		invisibleTimeLeft -= gameEngine.DT;
		if ( player.life < MAXLIFE ) player.life += gameEngine.DT;
		if ( player.life > MAXLIFE ) player.life = MAXLIFE;
	}
	if ( invisibleTimeLeft < 0 ) invisibleTimeLeft = 0;
	player.moveable.sprite.alpha = 1 - ( ( invisibleTimeLeft / INVISIBLETIME ) * 0.5 );
}

function loadJamie()
{
	player = new moveableAttacker( new moveableObject( jamieChara.clone(), new vec2( gameEngine.CANVASWIDTH * 0.25, gameEngine.CANVASHEIGHT * 0.75 ), 300 ), new shortRangeAttack( jamieChara.getTransformedBounds().width, -jamieChara.getTransformedBounds().height / 2, 25, 20 ), 100 );
	player.moveable.sprite.on( "animationend", function ( evt )
	{
		if ( evt.name == "Attack1" ) playerAttack();
	} );
	player.attacker.characterSprite = player.moveable.sprite;
	player.attacker.debugSprite = pixel.clone();
	spriteArray.push( player.moveable );
	spriteContainer.addChild( player.moveable.sprite );
	spriteContainer.addChild( player.attacker.debugSprite );
	playerIcon = jamieIcon;
}

function loadHalladay()
{
	//player = new moveableAttacker( new moveableObject( halladayChara.clone(), new vec2( gameEngine.CANVASWIDTH * 0.25, gameEngine.CANVASHEIGHT * 0.75 ), 300 ), new longRangeAttack( halladayChara.getTransformedBounds().width, -halladayChara.getTransformedBounds().height / 2, null, powerStar.clone(), new vec2( 10, 0 ), 3 ), 100 );
	player = new moveableAttacker( new moveableObject( halladayChara.clone(), new vec2( gameEngine.CANVASWIDTH * 0.25, gameEngine.CANVASHEIGHT * 0.75 ), 300 ), new shortRangeAttack( halladayChara.getTransformedBounds().width, -halladayChara.getTransformedBounds().height / 2, 25, 20 ), 100 );
	player.moveable.sprite.on( "animationend", function ( evt )
	{
		if ( evt.name == "Attack1" ) playerAttack();
	} );
	player.attacker.characterSprite = player.moveable.sprite;
	player.attacker.debugSprite = pixel.clone();
	spriteArray.push( player.moveable );
	spriteContainer.addChild( player.moveable.sprite );
	spriteContainer.addChild( player.attacker.debugSprite );
	playerIcon = halladayIcon;
}

var score;
var scoreDisplay;

var spriteContainer;
var spriteContainerBackdrops;
var playerAttackers;
var enemyAttackers;
function collideBullets()
{
	//for ( var i = 0; i < enemies.length; i++ )
	//{
	//	if ( enemies[i].moveable.sprite.visible && enemies[i].moveable.sprite.currentAnimation != "Die" )
	//	{
	//		var collided = player.attacker.collideSprite( enemies[i].moveable.sprite );

	//		if ( collided )
	//		{
	//			if(  typeof(longRangeAttack)) collided.sprite.visible = false;
	//			enemies[i].life -= 1;
	//			if ( enemies[i].life <= 0 && enemies[i].moveable.sprite.currentAnimation != "Die" )
	//			{
	//				score += 100;
	//				enemies[i].moveable.sprite.gotoAndPlay( "Die" );
	//				updateTarget( null );
	//			}
	//			else updateTarget( enemies[i] );
	//		}
	//	}
	//}

	//if ( boss.moveable.sprite.visible && boss.moveable.sprite.currentAnimation != "Die" )
	//{
	//	var collided = player.attacker.collideSprite( boss.moveable.sprite );

	//	if ( collided )
	//	{
	//		collided.sprite.visible = false;
	//		boss.life -= 1;
	//		if ( boss.life <= 0 && boss.moveable.sprite.currentAnimation != "Die" )
	//		{
	//			score += 9001
	//			boss.moveable.sprite.gotoAndPlay( "Die" );
	//			updateTarget( null );
	//		}
	//		else
	//		{

	//			updateTarget( boss );
	//		}
	//	}
	//}
}

//#region level1
function level1Init()
{
	var MAXDISTANCE = 2500;
	spriteArray = new Array();
	spriteContainer = new createjs.Container();
	stageBounds = new cage( 322, gameEngine.CANVASHEIGHT, 0, MAXDISTANCE );
	cameraBounds = new cage( 0, gameEngine.CANVASHEIGHT, 0, MAXDISTANCE );

	if ( !easterEggs ) easterEggs = new Array();
	easterEggs.push( new moveableObject( easterEgg.clone(), new vec2(( ( level1Trash.getTransformedBounds().width + 500 ) * Math.floor( Math.random() * 5 ) ) + 10, 349 ) ) );
	spriteArray.push( easterEggs[easterEggs.length - 1] );
	spriteContainer.addChild( easterEggs[easterEggs.length - 1].sprite );


	backDrops = new Array();
	backDrops.push( new moveableBackdrop( level1BackGround, 1, new vec2( 0, 0 ), new vec2( 0, 0 ), new vec2( level1BackGround.getBounds().width, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level1Lamp, 0.25, new vec2( Math.random() * 20, 320 ), new vec2( 0, 0 ), new vec2( level1Lamp.getTransformedBounds().width + 20, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level1Bench, 0.5, new vec2( Math.random() * 500, 321 ), new vec2( 0, 0 ), new vec2( level1Bench.getTransformedBounds().width + 200, 0 ), false, true ) );

	for ( var i = 0; i < backDrops.length; i++ )
	{
		for ( var j = 0; j < backDrops[i].array.length; j++ )
		{
			gameEngine.stage.addChild( backDrops[i].array[j] );
		}
	}

	spriteContainerBackdrops = new Array();
	spriteContainerBackdrops.push( new moveableBackdrop( level1Trash, 1, new vec2( 0, 350 ), new vec2( 0, 0 ), new vec2( level1Trash.getTransformedBounds().width + 500, 0 ), false, true ) );
	for ( var i = 0; i < spriteContainerBackdrops.length; i++ )
	{
		for ( var j = 0; j < spriteContainerBackdrops[i].array.length; j++ )
		{
			spriteContainer.addChild( spriteContainerBackdrops[i].array[j] );
		}
	}

	boss = new moveableAttacker( new moveableObject( level1Boss.clone(), new vec2( MAXDISTANCE, 0 ), 10 ), new shortRangeAttack( 0, -level1Boss.getTransformedBounds().height / 8, level1Boss.getTransformedBounds().width, 10 ), 10 );
	boss.icon = level1BossIcon.clone();

	boss.icon.x = gameEngine.CANVASWIDTH;
	boss.icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;
	boss.attacker.characterSprite = boss.moveable.sprite;
	boss.attacker.debugSprite = pixel.clone();
	boss.moveable.sprite.on( "animationend", function ( evt ) { if ( evt.name == "Die" ) evt.target.visible = false; } );
	spriteArray.push( boss.moveable );
	spriteContainer.addChild( boss.moveable.sprite );
	spriteContainer.addChild( boss.attacker.debugSprite );
	enemies = new Array();
	for ( var i = 0; i < 10; i++ )
	{
		enemies.push( new moveableAttacker( new moveableObject( level1Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( ( MAXDISTANCE - ( gameEngine.CANVASWIDTH * 2 ) ) * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ), new shortRangeAttack( level1Enemy.getTransformedBounds().width / 8, -level1Enemy.getTransformedBounds().height * 0.9, 50, level1Enemy.getTransformedBounds().height / 2 ), 3 ) );
		enemies[i].attacker.characterSprite = enemies[i].moveable.sprite;
		//enemies[i].attacker.debugSprite = pixel.clone();
		//enemies[i].attacker.debugSprite.visible = true;
		enemies[i].moveable.sprite.on( "animationend",
		function ( evt ) { if ( evt.name == "Attack1" ) enemyAttack(evt.target); }
		);
		enemies[i].icon = level1EnemyIcon.clone();

		enemies[i].icon.x = gameEngine.CANVASWIDTH;
		enemies[i].icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;
		spriteArray.push( enemies[i].moveable );
		spriteContainer.addChild( enemies[i].moveable.sprite );
		//spriteContainer.addChild( enemies[i].attacker.debugSprite );
	}

	camera = new vec2( 0, 0 );

	if ( characterMode == "halladay" ) loadHalladay();
	else loadJamie();
	powerStars = new Array();
	for ( var i = 0; i < 4; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * ( MAXDISTANCE - ( gameEngine.CANVASWIDTH * 2 ) ) ) + gameEngine.CANVASWIDTH, gameEngine.CANVASHEIGHT * Math.random() ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		spriteContainer.addChild( powerStars[i].sprite );
	}

	gameEngine.stage.addChild( spriteContainer );
	jumpable = true;
	lastLife = player.life;

	invisibleTimeLeft = 0;
	var playerHealthBox = new createjs.Shape();
	playerHealthBar = healthBar.clone();
	playerHealthBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, 250, playerHealthBar.getTransformedBounds().height + 74 );
	playerHealthBox.alpha = 0.5;
	gameEngine.stage.addChild( playerHealthBox );

	gameEngine.stage.addChild( playerHealthBar );
	gameEngine.stage.addChild( playerIcon );
	playerHealthBar.y = playerIcon.getTransformedBounds().height + 5;

	enemyHealthBar = healthBar.clone();
	
	enemyHealthBar.x = gameEngine.CANVASWIDTH;
	enemyHealthBar.y = gameEngine.CANVASHEIGHT - enemyHealthBar.getTransformedBounds().height;
	var enemyHealthBox = new createjs.Shape();
	enemyHealthBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, -250, -enemyHealthBar.getTransformedBounds().height - 74 );
	enemyHealthBox.alpha = 0.5;
	enemyHealthBox.x = gameEngine.CANVASWIDTH;
	enemyHealthBox.y = gameEngine.CANVASHEIGHT;
	gameEngine.stage.addChild( enemyHealthBox );
	gameEngine.stage.addChild( enemyHealthBar );
	if(!score) score = 0;

	var scoreText = new createjs.Text( "Score", "24px Comic Sans MS", "#FFF" );
	scoreText.regX = scoreText.getMeasuredWidth();
	scoreText.x = gameEngine.CANVASWIDTH;

	scoreDisplay = new createjs.Text( score, "24px Comic Sans MS", "#FFF" );
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	scoreDisplay.y = scoreText.getMeasuredHeight();
	var scoreBox = new createjs.Shape();
	scoreBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, -250, playerHealthBar.getTransformedBounds().height + 74 );
	scoreBox.alpha = 0.5;
	scoreBox.x = gameEngine.CANVASWIDTH;
	gameEngine.stage.addChild( scoreBox );
	gameEngine.stage.addChild( scoreText );
	gameEngine.stage.addChild( scoreDisplay );

	if ( gameMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) gameMusic.play( { loop: -1 } );
	enemyTarget = null;
}

function level1Delete()
{
	gameEngine.stage.removeAllChildren();
	backDrops = spriteArray = enemies = stageBounds = null;
}

function level1Update()
{
	playerMovement();
	enemyMovement();
	bossUpdate();
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
	collideBullets();
	updateLife();
	invisibilityUpdate();
	scoreDisplay.text = score;
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	if ( player.life <= 0 )
	{
		gameEngine.mode = "gameover";
		if ( gameMusic.playState == createjs.Sound.PLAY_SUCCEEDED ) gameMusic.stop();
	}
	if ( !boss.moveable.sprite.visible )
	{
		gameEngine.mode = "level2";
	}
	gameMusic.setMute( mute );
}
//#endregion

//#region level2
function level2Init()
{
	var MAXDISTANCE = 5000;
	spriteArray = new Array();
	spriteContainer = new createjs.Container();
	stageBounds = new cage( gameEngine.CANVASHEIGHT - 75, gameEngine.CANVASHEIGHT - 50, 0, MAXDISTANCE );
	cameraBounds = new cage( 0, gameEngine.CANVASHEIGHT - 100, 0, MAXDISTANCE );

	if ( !easterEggs ) easterEggs = new Array() ;
	for ( var i = 0; i < 2; i++ )
	{
		easterEggs.push( new moveableObject( easterEgg.clone(), new vec2(( Math.random() * MAXDISTANCE ), 0 ) ) );
		spriteArray.push( easterEggs[easterEggs.length - 1] );
		stageBounds.contain( easterEggs[easterEggs.length - 1] );
		spriteContainer.addChild( easterEggs[easterEggs.length - 1].sprite )
	}

	backDrops = new Array();
	backDrops.push( new moveableBackdrop( level2BackGround, 1, new vec2( 0, 0 ), new vec2( -1000, 0 ), new vec2( level2BackGround.getBounds().width, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level2Building, 0.5, new vec2( 0, 0 ), new vec2( -1000, 0 ), new vec2( level2Building.getBounds().width, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level2Train, 1, new vec2( 0, gameEngine.CANVASHEIGHT - level2Train.getBounds().height - 50 ), new vec2( 0, 0 ), new vec2( level2Train.getBounds().width, 0 ), false, true ) );
	for ( var i = 0; i < backDrops.length; i++ )
	{
		for ( var j = 0; j < backDrops[i].array.length; j++ )
		{
			gameEngine.stage.addChild( backDrops[i].array[j] );
		}
	}

	spriteContainerBackdrops = new Array();

	boss = new moveableAttacker( new moveableObject( level2Boss.clone(), new vec2( MAXDISTANCE, 0 ), 10 ), new shortRangeAttack( 0, -level2Boss.getTransformedBounds().height / 8, level2Boss.getTransformedBounds().width, 10 ), 20 );
	boss.icon = level2BossIcon.clone();
	boss.icon.x = gameEngine.CANVASWIDTH;
	boss.icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;

	boss.attacker.characterSprite = boss.moveable.sprite;
	boss.attacker.debugSprite = pixel.clone();
	boss.moveable.sprite.on( "animationend", function ( evt ) { if ( evt.name == "Die" ) evt.target.visible = false; } );
	spriteArray.push( boss.moveable );
	spriteContainer.addChild( boss.moveable.sprite );
	spriteContainer.addChild( boss.attacker.debugSprite );
	enemies = new Array();
	for ( var i = 0; i < 30; i++ ) //30
	{
		enemies.push( new moveableAttacker( new moveableObject( level2Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( ( MAXDISTANCE - gameEngine.CANVASWIDTH ) * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ), new shortRangeAttack( level2Enemy.getTransformedBounds().width / 8, -level2Enemy.getTransformedBounds().height * 0.9, 50, level2Enemy.getTransformedBounds().height / 2 ), 3 ) );
		enemies[i].attacker.characterSprite = enemies[i].moveable.sprite;
		//enemies[i].attacker.debugSprite = pixel.clone();
		//enemies[i].attacker.debugSprite.visible = true;
		enemies[i].moveable.sprite.on( "animationend",
		function ( evt ) { if ( evt.name == "Attack1" ) enemyAttack( evt.target ); }
		);
		enemies[i].icon = level2EnemyIcon.clone();

		enemies[i].icon.x = gameEngine.CANVASWIDTH;
		enemies[i].icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;
		spriteArray.push( enemies[i].moveable );
		spriteContainer.addChild( enemies[i].moveable.sprite );
		//spriteContainer.addChild( enemies[i].attacker.debugSprite );
	}

	camera = new vec2( 0, 0 );

	if ( characterMode == "halladay" ) loadHalladay();
	else loadJamie();

	powerStars = new Array();
	for ( var i = 0; i < 8; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * ( MAXDISTANCE -( gameEngine.CANVASWIDTH * 2 ) ) ) +gameEngine.CANVASWIDTH, gameEngine.CANVASHEIGHT * Math.random() ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		spriteContainer.addChild( powerStars[i].sprite );
	}
	gameEngine.stage.addChild( spriteContainer );

	jumpable = true;
	lastLife = player.life;

	invisibleTimeLeft = 0;
	var playerHealthBox = new createjs.Shape();
	playerHealthBar = healthBar.clone();
	playerHealthBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, 250, playerHealthBar.getTransformedBounds().height + 74 );
	playerHealthBox.alpha = 0.5;
	gameEngine.stage.addChild( playerHealthBox );

	gameEngine.stage.addChild( playerHealthBar );
	gameEngine.stage.addChild( playerIcon );
	playerHealthBar.y = playerIcon.getTransformedBounds().height + 5;

	enemyHealthBar = healthBar.clone();

	enemyHealthBar.x = gameEngine.CANVASWIDTH;
	enemyHealthBar.y = gameEngine.CANVASHEIGHT -enemyHealthBar.getTransformedBounds().height;
	var enemyHealthBox = new createjs.Shape();
	enemyHealthBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, -250, -enemyHealthBar.getTransformedBounds().height -74 );
	enemyHealthBox.alpha = 0.5;
	enemyHealthBox.x = gameEngine.CANVASWIDTH;
	enemyHealthBox.y = gameEngine.CANVASHEIGHT;
	gameEngine.stage.addChild( enemyHealthBox );
	gameEngine.stage.addChild( enemyHealthBar );

	if ( !score ) score = 0;

	var scoreText = new createjs.Text( "Score", "24px Comic Sans MS", "#FFF" );
	scoreText.regX = scoreText.getMeasuredWidth();
	scoreText.x = gameEngine.CANVASWIDTH;

	scoreDisplay = new createjs.Text( score, "24px Comic Sans MS", "#FFF" );
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	scoreDisplay.y = scoreText.getMeasuredHeight();
	var scoreBox = new createjs.Shape();
	scoreBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, -250, playerHealthBar.getTransformedBounds().height + 74 );
	scoreBox.alpha = 0.5;
	scoreBox.x = gameEngine.CANVASWIDTH;
	gameEngine.stage.addChild( scoreBox );
	gameEngine.stage.addChild( scoreText );
	gameEngine.stage.addChild( scoreDisplay );

	if ( gameMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) gameMusic.play( { loop: -1 } );
	enemyTarget = null;
}

function level2Delete()
{
	gameEngine.stage.removeAllChildren();
	backDrops = spriteArray = enemies = stageBounds = null;
}

function level2Update()
{
	playerMovement();
	enemyMovement();
	bossUpdate();
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
	collideBullets();
	updateLife();
	invisibilityUpdate();
	scoreDisplay.text = score;
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	if ( player.life <= 0 )
	{
		gameEngine.mode = "gameover";
		if ( gameMusic.playState == createjs.Sound.PLAY_SUCCEEDED ) gameMusic.stop();
	}
	if ( !boss.moveable.sprite.visible )
	{
		gameEngine.mode = "level3";
	}
	gameMusic.setMute( mute );
}
//#endregion

//#region level3
function level3Init()
{
	var MAXDISTANCE = 7500;
	spriteArray = new Array();
	spriteContainer = new createjs.Container();
	stageBounds = new cage( 333, gameEngine.CANVASHEIGHT, 0, MAXDISTANCE );
	cameraBounds = new cage( 0, gameEngine.CANVASHEIGHT, 0, MAXDISTANCE );

	if ( !easterEggs ) easterEggs = new Array() ;
	for ( var i = 0; i < 2; i++ )
	{
		easterEggs.push( new moveableObject( easterEgg.clone(), new vec2(( ( level3Shelf.getTransformedBounds().width + 500 ) * Math.floor( Math.random() * 10 ) ) + 10, 100), 0 ) ) ;
		spriteArray.push( easterEggs[easterEggs.length - 1] );
		spriteContainer.addChild( easterEggs[easterEggs.length - 1].sprite )
	}

	backDrops = new Array();
	backDrops.push( new moveableBackdrop( level3BackGround, 1, new vec2( 0, 0 ), new vec2( 0, 0 ), new vec2( level3BackGround.getBounds().width, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level3Shelf, 1, new vec2( 0, 320 ), new vec2( 0, 0 ), new vec2( level3Shelf.getTransformedBounds().width + 500, 0 ), false, true ) );
	for ( var i = 0; i < backDrops.length; i++ )
	{
		for ( var j = 0; j < backDrops[i].array.length; j++ )
		{
			gameEngine.stage.addChild( backDrops[i].array[j] );
		}
	}

	spriteContainerBackdrops = new Array();

	boss = new moveableAttacker( new moveableObject( level3Boss.clone(), new vec2( MAXDISTANCE, 0 ), 10 ), new shortRangeAttack( 0, -level3Boss.getTransformedBounds().height / 8, level3Boss.getTransformedBounds().width, 10 ), 30 );

	boss.icon = level3BossIcon.clone();
	boss.icon.x = gameEngine.CANVASWIDTH;
	boss.icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;

	boss.attacker.characterSprite = boss.moveable.sprite;
	boss.attacker.debugSprite = pixel.clone();
	boss.moveable.sprite.on( "animationend", function ( evt ) { if ( evt.name == "Die" ) evt.target.visible = false; } );
	spriteArray.push( boss.moveable );
	spriteContainer.addChild( boss.moveable.sprite );
	spriteContainer.addChild( boss.attacker.debugSprite );
	enemies = new Array();
	for ( var i = 0; i < 50; i++ )
	{
		enemies.push( new moveableAttacker( new moveableObject( level3Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( ( MAXDISTANCE - gameEngine.CANVASWIDTH ) * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ), new shortRangeAttack( level3Enemy.getTransformedBounds().width / 3, -level3Enemy.getTransformedBounds().height * 0.9, 50, level3Enemy.getTransformedBounds().height / 2 ), 3 ) );
		enemies[i].attacker.characterSprite = enemies[i].moveable.sprite;
		//enemies[i].attacker.debugSprite = pixel.clone();
		//enemies[i].attacker.debugSprite.visible = true;
		enemies[i].moveable.sprite.on( "animationend",
		function ( evt ) { if ( evt.name == "Attack1" ) enemyAttack( evt.target ); }
		);
		enemies[i].icon = level3EnemyIcon.clone();

		enemies[i].icon.x = gameEngine.CANVASWIDTH;
		enemies[i].icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;

		spriteArray.push( enemies[i].moveable );
		spriteContainer.addChild( enemies[i].moveable.sprite );
		//spriteContainer.addChild( enemies[i].attacker.debugSprite );
	}

	camera = new vec2( 0, 0 );

	if ( characterMode == "halladay" ) loadHalladay();
	else loadJamie();

	powerStars = new Array();
	for ( var i = 0; i < 16; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * MAXDISTANCE ) + gameEngine.CANVASWIDTH, 0 ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		spriteContainer.addChild( powerStars[i].sprite );
	}
	gameEngine.stage.addChild( spriteContainer );

	jumpable = true;
	lastLife = player.life;

	invisibleTimeLeft = 0;
	var playerHealthBox = new createjs.Shape();
	playerHealthBar = healthBar.clone();
	playerHealthBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, 250, playerHealthBar.getTransformedBounds().height + 74 );
	playerHealthBox.alpha = 0.5;
	gameEngine.stage.addChild( playerHealthBox );

	gameEngine.stage.addChild( playerHealthBar );
	gameEngine.stage.addChild( playerIcon );
	playerHealthBar.y = playerIcon.getTransformedBounds().height + 5;

	enemyHealthBar = healthBar.clone();

	enemyHealthBar.x = gameEngine.CANVASWIDTH;
	enemyHealthBar.y = gameEngine.CANVASHEIGHT - enemyHealthBar.getTransformedBounds().height;
	var enemyHealthBox = new createjs.Shape();
	enemyHealthBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, -250, -enemyHealthBar.getTransformedBounds().height - 74 );
	enemyHealthBox.alpha = 0.5;
	enemyHealthBox.x = gameEngine.CANVASWIDTH;
	enemyHealthBox.y = gameEngine.CANVASHEIGHT;
	gameEngine.stage.addChild( enemyHealthBox );
	gameEngine.stage.addChild( enemyHealthBar );

	if ( !score ) score = 0;

	var scoreText = new createjs.Text( "Score", "24px Comic Sans MS", "#FFF" );
	scoreText.regX = scoreText.getMeasuredWidth();
	scoreText.x = gameEngine.CANVASWIDTH;

	scoreDisplay = new createjs.Text( score, "24px Comic Sans MS", "#FFF" );
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	scoreDisplay.y = scoreText.getMeasuredHeight();
	var scoreBox = new createjs.Shape();
	scoreBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, -250, playerHealthBar.getTransformedBounds().height + 74 );
	scoreBox.alpha = 0.5;
	scoreBox.x = gameEngine.CANVASWIDTH;
	gameEngine.stage.addChild( scoreBox );
	gameEngine.stage.addChild( scoreText );
	gameEngine.stage.addChild( scoreDisplay );

	if ( gameMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) gameMusic.play( { loop: -1 } );
}

function level3Delete()
{
	gameEngine.stage.removeAllChildren();
	backDrops = spriteArray = enemies = stageBounds = null;
}

function level3Update()
{
	playerMovement();
	enemyMovement();
	bossUpdate();
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
	collideBullets();
	updateLife();
	invisibilityUpdate();
	scoreDisplay.text = score;
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	if ( player.life <= 0 )
	{
		gameEngine.mode = "gameover";
		if ( gameMusic.playState == createjs.Sound.PLAY_SUCCEEDED ) gameMusic.stop();
	}
	if ( !boss.moveable.sprite.visible )
	{
		gameEngine.mode = "level4";
	}
}
//#endregion

//#region level4
function level4Init()
{
	var MAXDISTANCE = 10000;
	spriteArray = new Array();
	spriteContainer = new createjs.Container();
	stageBounds = new cage( 400, gameEngine.CANVASHEIGHT, 0, MAXDISTANCE );
	cameraBounds = new cage( 0, gameEngine.CANVASHEIGHT, 0, MAXDISTANCE );

	if ( !easterEggs ) easterEggs = new Array();
	for ( var i = 0; i < 5; i++ )
	{
		easterEggs.push( new moveableObject( easterEgg.clone(), new vec2(( ( level4Table.getTransformedBounds().width + 100 ) * Math.floor( Math.random() * 10 ) ) + 10, 320 ), 0 ) );
		spriteArray.push( easterEggs[easterEggs.length - 1] );
		spriteContainer.addChild( easterEggs[easterEggs.length - 1].sprite )
	}

	backDrops = new Array();
	backDrops.push( new moveableBackdrop( level4BackGround, 1, new vec2( 0, 0 ), new vec2( 0, 0 ), new vec2( level4BackGround.getBounds().width, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level4DoorRight, 0.9, new vec2( Math.random() * 20, 320 ), new vec2( 0, 0 ), new vec2( level4DoorRight.getTransformedBounds().width + 500, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level4Chair, 1, new vec2(( level4Table.getTransformedBounds().width / 2 ) - ( level4Chair.getTransformedBounds().width / 2 ), 400 ), new vec2( 0, 0 ), new vec2( level4Chair.getTransformedBounds().width + 100, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level4Table, 1, new vec2( 0, 400 ), new vec2( 0, 0 ), new vec2( level4Table.getTransformedBounds().width + 100, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level4Lights, 1, new vec2( 0, 50 ), new vec2( 0, 0 ), new vec2( level4Lights.getTransformedBounds().width + 50, 0 ), false, true ) );
	for ( var i = 0; i < backDrops.length; i++ )
	{
		for ( var j = 0; j < backDrops[i].array.length; j++ )
		{
			gameEngine.stage.addChild( backDrops[i].array[j] );
		}
	}

	spriteContainerBackdrops = new Array();

	boss = new moveableAttacker( new moveableObject( level4Boss.clone(), new vec2( MAXDISTANCE, 0 ), 10 ), new shortRangeAttack( 0, -level4Boss.getTransformedBounds().height / 8, level4Boss.getTransformedBounds().width, 10 ), 40 );

	boss.icon = level4BossIcon.clone();
	boss.icon.x = gameEngine.CANVASWIDTH;
	boss.icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;

	boss.attacker.characterSprite = boss.moveable.sprite;
	boss.attacker.debugSprite = pixel.clone();
	boss.moveable.sprite.on( "animationend", function ( evt ) { if ( evt.name == "Die" ) evt.target.visible = false; } );
	spriteArray.push( boss.moveable );
	spriteContainer.addChild( boss.moveable.sprite );
	spriteContainer.addChild( boss.attacker.debugSprite );
	enemies = new Array();
	for ( var i = 0; i < 75; i++ )
	{
		enemies.push( new moveableAttacker( new moveableObject( level4Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( ( MAXDISTANCE - gameEngine.CANVASWIDTH ) * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ), new shortRangeAttack( level4Enemy.getTransformedBounds().width / 5, -level4Enemy.getTransformedBounds().height * 0.8, 40, level4Enemy.getTransformedBounds().height / 2 ), 3 ) );
		enemies[i].attacker.characterSprite = enemies[i].moveable.sprite;
		enemies[i].attacker.debugSprite = pixel.clone();
		enemies[i].attacker.debugSprite.visible = true;
		enemies[i].moveable.sprite.on( "animationend",
		function ( evt ) { if ( evt.name == "Attack1" ) enemyAttack( evt.target ); }
		);

		enemies[i].icon = level4EnemyIcon.clone();

		enemies[i].icon.x = gameEngine.CANVASWIDTH;
		enemies[i].icon.y = gameEngine.CANVASHEIGHT -healthBar.getTransformedBounds().height - 5;

		spriteArray.push( enemies[i].moveable );
		spriteContainer.addChild( enemies[i].moveable.sprite );
		spriteContainer.addChild( enemies[i].attacker.debugSprite );
	}

	
	camera = new vec2( 0, 0 );

	if ( characterMode == "halladay" ) loadHalladay();
	else loadJamie();

	powerStars = new Array();
	for ( var i = 0; i < 32; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * MAXDISTANCE ) + gameEngine.CANVASWIDTH, 0 ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		spriteContainer.addChild( powerStars[i].sprite );
	}
	gameEngine.stage.addChild( spriteContainer );

	jumpable = true;
	lastLife = player.life;

	invisibleTimeLeft = 0;
	var playerHealthBox = new createjs.Shape();
	playerHealthBar = healthBar.clone();
	playerHealthBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, 250, playerHealthBar.getTransformedBounds().height +74 );
	playerHealthBox.alpha = 0.5;
	gameEngine.stage.addChild( playerHealthBox );

	gameEngine.stage.addChild( playerHealthBar );
	gameEngine.stage.addChild( playerIcon );
	playerHealthBar.y = playerIcon.getTransformedBounds().height +5;

	enemyHealthBar = healthBar.clone();

	enemyHealthBar.x = gameEngine.CANVASWIDTH;
	enemyHealthBar.y = gameEngine.CANVASHEIGHT - enemyHealthBar.getTransformedBounds().height;
	var enemyHealthBox = new createjs.Shape();
	enemyHealthBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, -250, -enemyHealthBar.getTransformedBounds().height -74 );
	enemyHealthBox.alpha = 0.5;
	enemyHealthBox.x = gameEngine.CANVASWIDTH;
	enemyHealthBox.y = gameEngine.CANVASHEIGHT;
	gameEngine.stage.addChild( enemyHealthBox );
	gameEngine.stage.addChild( enemyHealthBar );

	if ( !score ) score = 0;

	var scoreText = new createjs.Text( "Score", "24px Comic Sans MS", "#FFF" );
	scoreText.regX = scoreText.getMeasuredWidth();
	scoreText.x = gameEngine.CANVASWIDTH;

	scoreDisplay = new createjs.Text( score, "24px Comic Sans MS", "#FFF" );
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	scoreDisplay.y = scoreText.getMeasuredHeight();
	var scoreBox = new createjs.Shape();
	scoreBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, -250, playerHealthBar.getTransformedBounds().height +74 );
	scoreBox.alpha = 0.5;
	scoreBox.x = gameEngine.CANVASWIDTH;
	gameEngine.stage.addChild( scoreBox );
	gameEngine.stage.addChild( scoreText );
	gameEngine.stage.addChild( scoreDisplay );

	if ( gameMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) gameMusic.play( {
		loop: -1 } );
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
	collideBullets();
	updateLife();
	invisibilityUpdate();
	scoreDisplay.text = score;
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	if ( player.life <= 0 )
	{
		gameEngine.mode = "gameover";
		if ( gameMusic.playState == createjs.Sound.PLAY_SUCCEEDED ) gameMusic.stop();
	}
	if ( !boss.moveable.sprite.visible )
	{
		gameEngine.mode = "level5";
	}
}
//#endregion

//#region level5
function level5Init()
{
	var MAXDISTANCE = 15000;
	spriteArray = new Array();
	spriteContainer = new createjs.Container();
	stageBounds = new cage( 400, gameEngine.CANVASHEIGHT, 0, MAXDISTANCE );
	cameraBounds = new cage( 0, gameEngine.CANVASHEIGHT, 0, MAXDISTANCE );

	if ( !easterEggs ) easterEggs = new Array();
	for ( var i = 0; i < 10; i++ )
	{
		easterEggs.push( new moveableObject( easterEgg.clone(), new vec2(( ( level5WoodPile.getTransformedBounds().width + 200 ) * Math.floor( Math.random() * 10 ) ) + level5WoodPile.getTransformedBounds().width + 10, 415 ), 0 ) );
		spriteArray.push( easterEggs[easterEggs.length - 1] );
		spriteContainer.addChild( easterEggs[easterEggs.length - 1].sprite )
	}

	backDrops = new Array();
	backDrops.push( new moveableBackdrop( level5BackGround, 1, new vec2( 0, 0 ), new vec2( 0, 0 ), new vec2( level5BackGround.getBounds().width, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level5Building, 0.8, new vec2( Math.random() * 20, 300 ), new vec2( 0, 0 ), new vec2( level5Building.getTransformedBounds().width + 500, 0 ), false, true ) );
	level5WoodPile.scaleX = 0.25;
	level5WoodPile.scaleY = 0.25;
	backDrops.push( new moveableBackdrop( level5WoodPile, 0.8, new vec2( Math.random() * 20, 320 ), new vec2( 0, 0 ), new vec2( level5WoodPile.getTransformedBounds().width + 500, 0 ), false, true ) );
	level5WoodPile.scaleX = 0.75;
	level5WoodPile.scaleY = 0.75;
	backDrops.push( new moveableBackdrop( level5WoodPile, 0.9, new vec2( Math.random() * 20, 333 ), new vec2( 0, 0 ), new vec2( level5WoodPile.getTransformedBounds().width + 500, 0 ), false, true ) );
	level5WoodPile.scaleX = 1;
	level5WoodPile.scaleY = 1;
	backDrops.push( new moveableBackdrop( level5WoodPile, 1, new vec2( Math.random() * 20, 410 ), new vec2( 0, 0 ), new vec2( level5WoodPile.getTransformedBounds().width + 500, 0 ), false, true ) );
	for ( var i = 0; i < backDrops.length; i++ )
	{
		for ( var j = 0; j < backDrops[i].array.length; j++ )
		{
			gameEngine.stage.addChild( backDrops[i].array[j] );
		}
	}

	spriteContainerBackdrops = new Array();
	level5WoodPile.scaleX = 1.2;
	level5WoodPile.scaleY = 1.2;
	spriteContainerBackdrops.push( new moveableBackdrop( level5WoodPile, 1, new vec2( Math.random() * 20, 420 ), new vec2( 0, 0 ), new vec2( level5WoodPile.getTransformedBounds().width + 200, 0 ), false, true ) );
	for ( var i = 0; i < spriteContainerBackdrops.length; i++ )
	{
		for ( var j = 0; j < spriteContainerBackdrops[i].array.length; j++ )
		{
			spriteContainer.addChild( spriteContainerBackdrops[i].array[j] );
		}
	}


	boss = new moveableAttacker( new moveableObject( level5Boss.clone(), new vec2( MAXDISTANCE, 0 ), 10 ), new shortRangeAttack( 0, -level5Boss.getTransformedBounds().height / 8, level5Boss.getTransformedBounds().width, 10 ), 50 );

	boss.icon = level5BossIcon.clone();
	boss.icon.x = gameEngine.CANVASWIDTH;
	boss.icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;

	boss.attacker.characterSprite = boss.moveable.sprite;
	boss.attacker.debugSprite = pixel.clone();
	boss.moveable.sprite.on( "animationend", function ( evt ) { if ( evt.name == "Die" ) evt.target.visible = false; } );
	spriteArray.push( boss.moveable );
	spriteContainer.addChild( boss.moveable.sprite );
	spriteContainer.addChild( boss.attacker.debugSprite );
	enemies = new Array();
	for ( var i = 0; i < 100; i++ )
	{
		enemies.push( new moveableAttacker( new moveableObject( level5Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( ( MAXDISTANCE - gameEngine.CANVASWIDTH ) * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ), new shortRangeAttack( level5Enemy.getTransformedBounds().width * 0.15, -level5Enemy.getTransformedBounds().height, level5Enemy.getTransformedBounds().width * 0.55, level5Enemy.getTransformedBounds().height * 0.6 ), 3 ) );
		enemies[i].attacker.characterSprite = enemies[i].moveable.sprite;
		//enemies[i].attacker.debugSprite = pixel.clone();
		//enemies[i].attacker.debugSprite.visible = true;
		enemies[i].moveable.sprite.on( "animationend",
		function ( evt ) { if ( evt.name == "Attack1" ) enemyAttack( evt.target ); }
		);

		enemies[i].icon = level5EnemyIcon.clone();

		enemies[i].icon.x = gameEngine.CANVASWIDTH;
		enemies[i].icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;

		spriteArray.push( enemies[i].moveable );
		spriteContainer.addChild( enemies[i].moveable.sprite );
		//spriteContainer.addChild( enemies[i].attacker.debugSprite );
	}

	camera = new vec2( 0, 0 );

	if ( characterMode == "halladay" ) loadHalladay();
	else loadJamie();

	powerStars = new Array();
	for ( var i = 0; i < 64; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * MAXDISTANCE ) + gameEngine.CANVASWIDTH, 0 ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		spriteContainer.addChild( powerStars[i].sprite );
	}

	gameEngine.stage.addChild( spriteContainer );

	jumpable = true;
	lastLife = player.life;

	invisibleTimeLeft = 0;
	var playerHealthBox = new createjs.Shape();
	playerHealthBar = healthBar.clone();
	playerHealthBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, 250, playerHealthBar.getTransformedBounds().height + 74 );
	playerHealthBox.alpha = 0.5;
	gameEngine.stage.addChild( playerHealthBox );

	gameEngine.stage.addChild( playerHealthBar );
	gameEngine.stage.addChild( playerIcon );
	playerHealthBar.y = playerIcon.getTransformedBounds().height + 5;

	enemyHealthBar = healthBar.clone();

	enemyHealthBar.x = gameEngine.CANVASWIDTH;
	enemyHealthBar.y = gameEngine.CANVASHEIGHT - enemyHealthBar.getTransformedBounds().height;
	var enemyHealthBox = new createjs.Shape();
	enemyHealthBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, -250, -enemyHealthBar.getTransformedBounds().height - 74 );
	enemyHealthBox.alpha = 0.5;
	enemyHealthBox.x = gameEngine.CANVASWIDTH;
	enemyHealthBox.y = gameEngine.CANVASHEIGHT;
	gameEngine.stage.addChild( enemyHealthBox );
	gameEngine.stage.addChild( enemyHealthBar );

	if ( !score ) score = 0;

	var scoreText = new createjs.Text( "Score", "24px Comic Sans MS", "#FFF" );
	scoreText.regX = scoreText.getMeasuredWidth();
	scoreText.x = gameEngine.CANVASWIDTH;

	scoreDisplay = new createjs.Text( score, "24px Comic Sans MS", "#FFF" );
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	scoreDisplay.y = scoreText.getMeasuredHeight();
	var scoreBox = new createjs.Shape();
	scoreBox.graphics.beginFill( "FFF" ).drawRect( 0, 0, -250, playerHealthBar.getTransformedBounds().height + 74 );
	scoreBox.alpha = 0.5;
	scoreBox.x = gameEngine.CANVASWIDTH;
	gameEngine.stage.addChild( scoreBox );
	gameEngine.stage.addChild( scoreText );
	gameEngine.stage.addChild( scoreDisplay );

	if ( gameMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) gameMusic.play( {
		loop: -1
	} );
}

function level5Delete()
{
	gameEngine.stage.removeAllChildren();
	backDrops = spriteArray = enemies = stageBounds = null;
}

function level5Update()
{
	playerMovement();
	enemyMovement();
	bossUpdate();
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
	collideBullets();
	updateLife();
	invisibilityUpdate();
	scoreDisplay.text = score;
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	if ( player.life <= 0 )
	{
		gameEngine.mode = "gameover";
		if ( gameMusic.playState == createjs.Sound.PLAY_SUCCEEDED ) gameMusic.stop();
	}
	if ( !boss.moveable.sprite.visible )
	{
		if ( gameMusic.playState == createjs.Sound.PLAY_SUCCEEDED ) gameMusic.stop();
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

//#endregion
function andrewMain()
{
	titleQueue = new Array();
	titleQueue.push( new createjs.LoadQueue( true, "assets/" ) );
	createjs.Sound.alternateExtensions = ["mp3"];
	titleQueue[0].installPlugin( createjs.Sound );
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
	mainGameQueue.installPlugin( createjs.Sound );
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