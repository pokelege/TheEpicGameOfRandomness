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
			for ( var i = 0; i < this.queues.length; i++ )
			{
				if ( !this.queues[i].loaded ) notLoaded = true;
			}
			if ( notLoaded )
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
		for ( var i = 0; i < gameEngine.updateModeLooperArray.length; i++ )
		{
			if ( gameEngine.updateModeLooperArray[i].data.initialized )
			{
				gameEngine.updateModeLooperArray[i].data.deleter();
				gameEngine.updateModeLooperArray[i].data.initialized = false;
			}
		}
		if ( gameEngine.loadingInitialized )
		{
			gameEngine.loadingDelete();
		}
	},

	pauseAllQueues: function ()
	{
		for ( var i = 0; i < gameEngine.updateModeLooperArray.length; i++ )
		{
			for ( var j = 0; j < gameEngine.updateModeLooperArray[i].data.queues.length; j++ )
			{
				if ( !gameEngine.updateModeLooperArray[i].data.queues[j].loaded ) gameEngine.updateModeLooperArray[i].data.queues[j].setPaused( true );
			}
		}
	},

	startAllQueues: function ()
	{
		for ( var i = 0; i < gameEngine.updateModeLooperArray.length; i++ )
		{
			for ( var j = 0; j < gameEngine.updateModeLooperArray[i].data.queues.length; j++ )
			{
				if ( !gameEngine.updateModeLooperArray[i].data.queues[j].loaded ) gameEngine.updateModeLooperArray[i].data.queues[j].setPaused( false );
			}
		}
	},

	//#region loading
	barBorder: null, progressBar: null, loadingText: null, backgroundColor: null,
	loadingTextWidth: null,
	loadingInitialized: false,
	loadingInit: function ()
	{
		//gameEngine.pauseAllQueues();
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
		//gameEngine.startAllQueues();
	},

	loadingUpdate: function ( queues )
	{
		//for ( var j = 0; j < queues.length; j++ )
		//{
		//	if(!queues[j].loaded) queues[j].setPaused( false );
		//}
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
	window.addEventListener("keydown", function(e)
	{
        	e.preventDefault();
	}, false);
		window.addEventListener("keyup", function(e)
	{
        	e.preventDefault();
	}, false);
}
else
{ //MSIE
	window.attachEvent( "onload", gameEngine.main );
	document.onkeydown = gameEngine.handleKeyDown;
	document.onkeyup = gameEngine.handleKeyUp;
	window.attachEvent("keydown", function(e)
	{
        	e.preventDefault();
	}, false);
	window.attachEvent("keyup", function(e)
	{
        	e.preventDefault();
	}, false);
}

var mute = false;

//#region title
var titleManifest =
[
	{ src: "images/title.jpg", id: "title" },
	{ src: "images/playButton.png", id: "playButton" },
	{ src: "images/instructionsButton.png", id: "instructionsButton" },
	{ src: "images/creditsButton.png", id: "creditsButton" },
	{ src: "images/audio.png", id: "audio" },
	{ src: "audio/title.mp3", id: "titleMusic" }
];
var titleQueue;
var titleScreen, playButton, instructionsButton, creditsButton, titleMusic, audio;
function titleLoaded()
{
	titleScreen = new createjs.Bitmap( titleQueue[0].getResult( "title" ) );
	playButton = new createjs.Bitmap( titleQueue[0].getResult( "playButton" ) );
	playButton.on( "click", function ( evt ) { gameEngine.mode = "characterSelect"; titleMusic.stop(); } );
	playButton.regX = playButton.getBounds().width / 2;
	playButton.regY = playButton.getBounds().height / 2;
	playButton.x = gameEngine.CANVASWIDTH * 0.5;
	playButton.y = gameEngine.CANVASHEIGHT *0.75;

	instructionsButton = new createjs.Bitmap( titleQueue[0].getResult( "instructionsButton" ) );
	instructionsButton.on( "click", function ( evt ) { gameEngine.mode = "instructions"; } );
	instructionsButton.regX = instructionsButton.getBounds().width / 2;
	instructionsButton.x = gameEngine.CANVASWIDTH * 0.25;
	instructionsButton.y = gameEngine.CANVASHEIGHT * 0.75;

	creditsButton = new createjs.Bitmap( titleQueue[0].getResult( "creditsButton" ) );
	creditsButton.on( "click", function ( evt ) { gameEngine.mode = "credits"; titleMusic.stop(); } );
	creditsButton.regX = creditsButton.getBounds().width / 2;
	creditsButton.x = gameEngine.CANVASWIDTH *0.75;
	creditsButton.y = gameEngine.CANVASHEIGHT * 0.75;


	var audioSpriteSheet = new createjs.SpriteSheet
		(
		{
			images: [titleQueue[0].getResult( "audio" )],
			frames:
				{
					regX: 0,
					regY: 40,
					width: 40,
					height: 40,
				},
			animations:
				{
					On: [0, 0],
					Off: [1, 1]
				}
		}
		);
	audio = new createjs.Sprite( audioSpriteSheet, "On" );
	audio.y = gameEngine.CANVASHEIGHT;
	audio.on( "click", function ( evt ) { mute = mute == false; if ( mute ) audio.gotoAndPlay( "Off" ); else audio.gotoAndPlay( "On" ); } )

	titleMusic = new createjs.Sound.createInstance( "titleMusic" );
}

function titleInit()
{
	gameEngine.stage.addChild( titleScreen );
	gameEngine.stage.addChild( playButton );
	gameEngine.stage.addChild( instructionsButton );
	gameEngine.stage.addChild( creditsButton );
	if ( titleMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) titleMusic.play( { loop: -1 } );
	gameEngine.stage.addChild( audio );
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
	gameEngine.stage.addChild( audio );
}

function instructionsDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
}
function instructionsUpdate()
{
	titleMusic.setMute( mute );
}
//#endregion

//#region credits
var creditsManifest =
	[
		{ src: "images/credits.jpg", id: "credits" },
		{ src: "audio/credits.mp3", id: "creditsMusic" }
	];
var creditsQueue;
var credits, creditsMusic;
function creditsLoaded()
{
	credits = new createjs.Bitmap( creditsQueue[0].getResult( "credits" ) );
	creditsMusic = new createjs.Sound.createInstance( "creditsMusic" );
}

function creditsInit()
{
	gameEngine.stage.addChild( credits );
	gameEngine.stage.on( "click", function ( evt ) { gameEngine.mode = "title"; } );
	creditsMusic.play( { loop: -1 } );
	creditsMusic.setMute( mute );
	gameEngine.stage.addChild( audio );
}

function creditsDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
	creditsMusic.stop();
}
function creditsUpdate()
{
	creditsMusic.setMute( mute );
}
//#endregion

//#region gameover
var gameoverManifest =
	[
		{ src: "images/gameover.jpg", id: "gameover" },
		{ src: "audio/gameOver.mp3", id: "gameOverMusic" }
	];
var gameoverQueue;
var gameover, gameOverMusic;
function gameoverLoaded()
{
	gameover = new createjs.Bitmap( gameoverQueue[0].getResult( "gameover" ) );
	gameOverMusic = new createjs.Sound.createInstance( "gameOverMusic" );
}

function gameoverInit()
{
	gameEngine.stage.addChild( gameover );
	gameEngine.stage.on( "click", function ( evt ) { gameEngine.mode = "title"; } );
	gameOverMusic.play();
	gameOverMusic.setMute( mute );
	gameEngine.stage.addChild( audio );
}

function gameoverDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
	gameOverMusic.stop();
}
function gameoverUpdate()
{
	gameOverMusic.setMute( mute );
}
//#endregion

//#region win
var winManifest =
	[
		{ src: "images/win.jpg", id: "win" },
		{ src: "audio/win.mp3", id: "winMusic" }
	];
var winQueue;
var win, winMusic;
function winLoaded()
{
	win = new createjs.Bitmap( winQueue[0].getResult( "win" ) );
	winMusic = new createjs.Sound.createInstance( "winMusic" );
}

function winInit()
{
	gameEngine.stage.addChild( win );
	gameEngine.stage.on( "click", function ( evt ) { gameEngine.mode = "credits"; } );
	gameEngine.stage.addChild( audio );
	winMusic.play( { loop: -1 } );
	winMusic.setMute( mute );
}

function winDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
	winMusic.stop();
}
function winUpdate()
{
	winMusic.setMute( mute );
}
//#endregion

//#region trueWin
var trueWinManifest =
	[
		{ src: "images/trueWin.jpg", id: "trueWin" },
		{ src: "audio/trueWin.mp3", id: "trueWinMusic" }
	];
var trueWinQueue;
var trueWin, trueWinMusic;
function trueWinLoaded()
{
	trueWin = new createjs.Bitmap( trueWinQueue[0].getResult( "trueWin" ) );
	trueWinMusic = new createjs.Sound.createInstance( "trueWinMusic" );
}

function trueWinInit()
{
	gameEngine.stage.addChild( trueWin );
	gameEngine.stage.on( "click", function ( evt ) { gameEngine.mode = "credits"; } );
	gameEngine.stage.addChild( audio );
	trueWinMusic.play( { loop: -1 } );
	trueWinMusic.setMute( mute );
}

function trueWinDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
	trueWinMusic.stop();
}
function trueWinUpdate()
{
	trueWinMusic.setMute( mute );
}
//#endregion

//#region characterSelect
var characterSelectManifest =
	[
		{ src: "images/characterSelect.png", id: "characterSelect" },
		{ src: "audio/characterSelect.mp3", id: "characterSelectMusic" }
	];
var characterSelectQueue;
var characterSelect, characterSelectMusic;
var characterMode = "jamie";
function characterSelectLoaded()
{
	characterSelect = new createjs.Bitmap( characterSelectQueue[0].getResult( "characterSelect" ) );
	characterSelectMusic = new createjs.Sound.createInstance( "characterSelectMusic" );
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
	gameEngine.mode = "level1";
	if ( titleMusic.playState == createjs.Sound.PLAY_SUCCEEDED )
		titleMusic.stop();
	score = null;
	easterEggs = null;
} );
	characterSelectMusic.play( { loop: -1 } );
	characterSelectMusic.setMute( mute );
	gameEngine.stage.addChild( audio );
}

function characterSelectDelete()
{
	gameEngine.stage.removeAllChildren();
	gameEngine.stage.removeAllEventListeners();
	characterSelectMusic.stop();
}
function characterSelectUpdate()
{
	characterSelectMusic.setMute( mute );
}
//#endregion


//#region mainGame
var mainGameManifest =
	[
		{ src: "images/jamieChara.png", id: "jamieChara" },
		{ src: "images/jamieCharaIcon.png", id: "jamieIcon" },
		{ src: "images/halladayChara.png", id: "halladayChara" },
		{ src: "images/halladayCharaIcon.png", id: "halladayIcon" },
		{ src: "images/fpsBar.png", id: "healthBar" },
		{ src: "images/powerStar.png", id: "powerStar" },
		{ src: "images/easterEgg.png", id: "easterEgg" },
		{ src: "images/pixel.png", id: "pixel" },
		{ src: "images/circleExplosion.png", id: "circleExplosion"},
		{ src: "audio/boss.mp3", id: "mainBossMusic" },
		{ src: "audio/playerHit.mp3", id: "mainPlayerHit" },
		{ src: "audio/enemyHit.mp3", id: "mainEnemyHit" },
		{ src: "audio/playerScream.mp3", id: "mainPlayerDie" },
		{ src: "audio/enemyScream.mp3", id: "mainEnemyDie" },
		{ src: "audio/egg.mp3", id: "eggGet" },
		{ src: "audio/star.mp3", id: "starGet" },
	];
var mainGameQueue, jamieChara, jamieIcon, halladayChara, halladayIcon, pixel, healthBar, powerStar, easterEgg, mainBossMusic, mainPlayerHit, mainEnemyHit, mainPlayerDie, mainEnemyDie, circleExplosion, eggGet, starGet;

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
		{ src: "audio/level1/level1Music.mp3", id: "level1Music" }
	];
var Level1Queue, level1Frame, level1Enemy, level1EnemyIcon, level1Boss, level1BossIcon, level1BackGround, level1Bench, level1Lamp, level1Trash, level1Music;

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
		{ src: "images/level2/bullet.png", id: "bullet" },
		{ src: "audio/level2/level2Music.mp3", id: "level2Music" }
	];
var Level2Queue, level2Enemy, level2EnemyIcon, level2Boss, level2BossIcon, level2Building, level2BackGround, level2Train, level2Frame, level2Music, bullet;

var Level3Manifest =
	[
		{ src: "images/level3/level3Frame.png", id: "level3Frame" },
		{ src: "images/level3/level3Enemy.png", id: "level3Enemy" },
		{ src: "images/level3/level3EnemyIcon.png", id: "level3EnemyIcon" },
		{ src: "images/level3/level3Boss.png", id: "level3Boss" },
		{ src: "images/level3/level3BossIcon.png", id: "level3BossIcon" },
		{ src: "images/level3/level3BackGround.png", id: "level3BackGround" },
		{ src: "images/level3/level3Shelf.png", id: "level3Shelf" },
		{ src: "audio/level3/level3Music.mp3", id: "level3Music" }
	];
var Level3Queue, level3Frame, level3Enemy, level3EnemyIcon, level3Boss, level3BossIcon, level3BackGround, level3Shelf, level3Music;

var Level4Manifest =
	[
		{ src: "images/level4/level4Frame.png", id: "level4Frame" },
		{ src: "images/level4/level4Enemy.png", id: "level4Enemy" },
		{ src: "images/level4/level4EnemyIcon.png", id: "level4EnemyIcon" },
		{ src: "images/level4/level4Boss.png", id: "level4Boss" },
		{ src: "images/level4/level4BossIcon.png", id: "level4BossIcon" },
		{ src: "images/level4/level4BackGround.png", id: "level4BackGround" },
		{ src: "images/level4/level4Chair.png", id: "level4Chair" },
		{ src: "images/level4/level4DoorRight.png", id: "level4DoorRight" },
		{ src: "images/level4/level4Lights.png", id: "level4Lights" },
		{ src: "images/level4/level4Table.png", id: "level4Table" },
		{ src: "images/level4/level4King.jpg", id: "level4King" },
		{ src: "audio/level4/level4Music.mp3", id: "level4Music" }
	];
var Level4Queue, level4Frame, level4Enemy, level4EnemyIcon, level4Boss, level4BossIcon, level4BackGround, level4Chair, level4DoorRight, level4Lights, level4Table, level4Music, level4King;

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
		{ src: "audio/level5/level5Music.mp3", id: "level5Music" },
		{ src: "audio/level5/level5BossIntro.mp3", id: "level5BossIntroMusic" },
		{ src: "audio/level5/level5Boss.mp3", id: "level5BossMusic" },
	];
var Level5Queue, level5Frame, level5Enemy, level5EnemyIcon, level5Boss, level5BossIcon, level5BackGround, level5WoodPile, level5Building, level5Music, level5BossIntroMusic, level5BossMusic;


function mainGameLoaded()
{
	var jamieCharaSheet = new createjs.SpriteSheet
	(
		{
			images: [mainGameQueue.getResult( "jamieChara" )],
			frames:
				{
					regX: 0,
					regY: 0,
					width: 357,
					height: 415,
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
					},
					Attack2:
					{
						frames: [3,5],
						next: "Neutral",
						speed: 0.25
					}
				}
		}
	);

	jamieChara = new createjs.Sprite( jamieCharaSheet, "Neutral" );
	jamieChara.regX = jamieChara.getBounds().width * 0.4;
	jamieChara.regY = jamieChara.getBounds().height;
	jamieChara.scaleX = 0.5;
	jamieChara.scaleY = 0.5;

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
			{
				regX: 0,
				regY: 0,
				width: 399,
				height: 426,
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
				},
				Attack2:
				{
					frames: [3],
					next: "Neutral",
					speed: 0.25
				}
			}
	}
);

	halladayChara = new createjs.Sprite( halladayCharaSheet, "Neutral" );
	halladayChara.regX = halladayChara.getBounds().width * 0.3;
	halladayChara.regY = halladayChara.getBounds().height;
	halladayChara.scaleX = 0.5;
	halladayChara.scaleY = 0.5;

	halladayIcon = new createjs.Bitmap( mainGameQueue.getResult( "halladayIcon" ) );
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

	var circleExplosionSheet = new createjs.SpriteSheet
(
	{
		images: [mainGameQueue.getResult( "circleExplosion" )],
		frames: [[0, 0, 21, 21, 0, 26.950000000000003, 6.950000000000003], [21, 0, 31, 31, 0, 31.950000000000003, 11.950000000000003], [52, 0, 41, 41, 0, 36.95, 16.950000000000003], [93, 0, 53, 53, 0, 42.95, 22.950000000000003], [146, 0, 63, 63, 0, 47.95, 27.950000000000003], [209, 0, 73, 73, 0, 52.95, 32.95], [282, 0, 85, 85, 0, 58.95, 38.95], [367, 0, 95, 95, 0, 63.95, 43.95], [0, 95, 107, 106, 0, 69.95, 49.95], [107, 95, 117, 117, 0, 74.95, 54.95], [224, 95, 127, 127, 0, 79.95, 59.95], [351, 95, 139, 139, 0, 85.95, 65.95], [0, 234, 149, 149, 0, 90.95, 70.95], [149, 234, 161, 160, 0, 96.95, 76.95], [310, 234, 171, 171, 0, 101.95, 81.95]],
		animations:
			{
				Normal: [0, 14, false]
			}
	}
);

	circleExplosion = new createjs.Sprite( circleExplosionSheet, "Normal" );
	

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

	mainBossMusic = new createjs.Sound.createInstance( "mainBossMusic" );
	mainBossMusic.addEventListener( "complete", function ( evt ) { bossMusic.play( { loop: -1 } ); } );
	mainPlayerHit = new createjs.Sound.createInstance( "mainPlayerHit" );
	mainEnemyHit = new createjs.Sound.createInstance( "mainEnemyHit" );
	mainPlayerDie = new createjs.Sound.createInstance( "mainPlayerDie" );
	mainEnemyDie = new createjs.Sound.createInstance( "mainEnemyDie" );
	starGet = new createjs.Sound.createInstance( "starGet" );
	eggGet = new createjs.Sound.createInstance( "eggGet" );
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
				width: 525,
				height: 459
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
	level1Boss = new createjs.Sprite( level1BossSheet, "Neutral" );
	level1Boss.regX = level1Boss.getBounds().width * 0.35;
	level1Boss.regY = level1Boss.getBounds().height * 0.9;
	level1Boss.scaleX = 0.45;
	level1Boss.scaleY = 0.45;

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

	level1BossIcon.regX = level1BossIcon.getBounds().width;
	level1BossIcon.regY = level1BossIcon.getBounds().height;

	level1Frame = new createjs.Bitmap( Level1Queue[0].getResult( "level1Frame" ) );

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
	level1Music = new createjs.Sound.createInstance( "level1Music" );
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
				width: 400,
				height: 704
			},
		animations:
			{
				Neutral: [0, 39]
			}
	}
	);
	level2Boss = new createjs.Sprite( level2BossSheet, "Neutral" );
	level2Boss.regX = level2Boss.getBounds().width / 2;
	level2Boss.regY = level2Boss.getBounds().height;
	level2Boss.scaleX = 0.4;
	level2Boss.scaleY = 0.4;

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
	level2BossIcon.regX = level2BossIcon.getBounds().width;
	level2BossIcon.regY = level2BossIcon.getBounds().height;

	var bulletSheet = new createjs.SpriteSheet
		(
		{
			images: [Level2Queue[0].getResult( "bullet" )],
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

	level2Frame = new createjs.Bitmap( Level2Queue[0].getResult( "level2Frame" ) );

	level2Building = new createjs.Bitmap( Level2Queue[0].getResult( "level2Building" ) );
	level2BackGround = new createjs.Bitmap( Level2Queue[0].getResult( "level2BackGround" ) );
	level2Train = new createjs.Bitmap( Level2Queue[0].getResult( "level2Train" ) );
	level2Music = new createjs.Sound.createInstance( "level2Music" );
}

function level3Loaded()
{
	var level3EnemySheet = new createjs.SpriteSheet
	(
	{
		images: [Level3Queue[0].getResult( "level3Enemy" )],
		frames:
			{
				regX: 0,
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
				width: 694,
				height: 1076
			},
		animations:
			{
				Neutral: [0, 0],
				Run:
				{
					frames: [0, 1],
					next: "Neutral",
					speed: 0.25
				},
				Attack1:[2, 23, "Neutral", 1.5]
			}
	}
	);
	level3Boss = new createjs.Sprite( level3BossSheet, "Neutral" );
	level3Boss.regX = level3Boss.getBounds().width * 0.5;
	level3Boss.regY = level3Boss.getBounds().height*0.95;
	level3Boss.scaleX = 0.45;
	level3Boss.scaleY = 0.45;

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
	level3BossIcon.regX = level3BossIcon.getBounds().width;
	level3BossIcon.regY = level3BossIcon.getBounds().height;

	level3Frame = new createjs.Bitmap( Level3Queue[0].getResult( "level3Frame" ) );

	level3BackGround = new createjs.Bitmap( Level3Queue[0].getResult( "level3BackGround" ) );
	level3Shelf = new createjs.Bitmap( Level3Queue[0].getResult( "level3Shelf" ) );
	level3Shelf.regY = level3Shelf.getBounds().height;
	level3Music = new createjs.Sound.createInstance( "level3Music" );
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
				width: 424,
				height: 552
			},
		animations:
			{
				Neutral: [0, 0],
				Run:
				{
					frames: [0, 0],
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
	level4Boss = new createjs.Sprite( level4BossSheet, "Neutral" );
	level4Boss.regX = level4Boss.getBounds().width * 0.30;
	level4Boss.regY = level4Boss.getBounds().height;
	level4Boss.scaleX = 0.40;
	level4Boss.scaleY = 0.40;

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
	level4BossIcon.regX = level4BossIcon.getBounds().width;
	level4BossIcon.regY = level4BossIcon.getBounds().height;

	level4Frame = new createjs.Bitmap( Level4Queue[0].getResult( "level4Frame" ) );

	level4BackGround = new createjs.Bitmap( Level4Queue[0].getResult( "level4BackGround" ) );

	level4Chair = new createjs.Bitmap( Level4Queue[0].getResult( "level4Chair" ) );
	level4Chair.regY = level4Chair.getBounds().height;
	level4Chair.scaleX = 0.75;
	level4Chair.scaleY = 0.75;

	level4DoorRight = new createjs.Bitmap( Level4Queue[0].getResult( "level4DoorRight" ) );
	level4DoorRight.regY = level4DoorRight.getBounds().height;
	level4DoorRight.scaleX = 0.25;
	level4DoorRight.scaleY = 0.25;
	level4Lights = new createjs.Bitmap( Level4Queue[0].getResult( "level4Lights" ) );
	level4Lights.regY = level4Lights.getBounds().height;


	level4King = new createjs.Bitmap( Level4Queue[0].getResult( "level4King" ) );
	level4King.regY = level4King.getBounds().height;
	level4King.scaleX = 0.1;
	level4King.scaleY = 0.1;

	level4Table = new createjs.Bitmap( Level4Queue[0].getResult( "level4Table" ) );
	level4Table.regY = level4Table.getBounds().height;
	level4Music = new createjs.Sound.createInstance( "level4Music" );
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
				width: 339,
				height: 481
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
	level5Boss = new createjs.Sprite( level5BossSheet, "Neutral" );
	level5Boss.regX = level5Boss.getBounds().width / 2;
	level5Boss.regY = level5Boss.getBounds().height;
	level5Boss.scaleX = 0.5;
	level5Boss.scaleY = 0.5;

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
	level5BossIcon.regX = level5BossIcon.getBounds().width;
	level5BossIcon.regY = level5BossIcon.getBounds().height;

	level5Frame = new createjs.Bitmap( Level5Queue[0].getResult( "level5Frame" ) );

	level5BackGround = new createjs.Bitmap( Level5Queue[0].getResult( "level5BackGround" ) );

	level5WoodPile = new createjs.Bitmap( Level5Queue[0].getResult( "level5WoodPile" ) );
	level5WoodPile.regY = level5WoodPile.getBounds().height;

	level5Building = new createjs.Bitmap( Level5Queue[0].getResult( "level5Building" ) );
	level5Building.regY = level5Building.getBounds().height;
	level5Music = new createjs.Sound.createInstance( "level5Music" );
	level5BossIntroMusic = new createjs.Sound.createInstance( "level5BossIntroMusic" );
	level5BossIntroMusic.addEventListener( "complete", function ( evt )
	{
		level5BossIntroMusic.stop();
		bossMusic = level5BossMusic;
		bossMusic.play( { loop: -1 } );
		bossMusic.setMute( mute );
	} );
	level5BossMusic = new createjs.Sound.createInstance( "level5BossMusic" );
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
	this.damage = 1;
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
			return ndgmr.checkPixelCollision( pixelTest, theSpriteTo, 0.25 );
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
	this.damage = 1;
	for ( var i = 0; i < limit; i++ )
	{
		this.array.push( new moveableObject( projectileSprite.clone(), new vec2( 0, 0 ), new vec2(velocity.x, velocity.y) ) );
		this.array[i].sprite.visible = false;
	}
	this.update = function ()
	{
		for ( var i = 0; i < this.array.length; i++ )
		{
			if ( this.array[i].sprite.visible )
			{
				this.array[i].position = this.array[i].position.add( this.array[i].velocity );
				if ( this.array[i].position.x - camera.x > gameEngine.CANVASWIDTH * 1.25 || this.array[i].position.x - camera.x < gameEngine.CANVASWIDTH * -0.25 )
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
			if ( this.array[i].sprite.visible === false )
			{
				if ( flipX )
				{
					if ( this.array[i].sprite.scaleX > 0 ) this.array[i].sprite.scaleX *= -1;
					if ( this.array[i].velocity.x > 0 ) this.array[i].velocity.x *= -1;
					this.array[i].position.x = this.character.position.x - this.x;
				}
				else
				{
					if ( this.array[i].sprite.scaleX < 0 ) this.array[i].sprite.scaleX *= -1;
					if ( this.array[i].velocity.x < 0 ) this.array[i].velocity.x *= -1;
					this.array[i].position.x = this.character.position.x + this.x;
				}

				if ( flipY )
				{
					if ( this.array[i].sprite.scaleY > 0 ) this.array[i].sprite.scaleY *= -1;
					if ( this.array[i].velocity.y > 0 ) this.array[i].velocity.y *= -1;
					this.array[i].position.y = this.character.position.y - this.y;
				}
				else
				{
					if ( this.array[i].sprite.scaleY < 0 ) this.array[i].sprite.scaleY *= -1;
					if ( this.array[i].velocity.y < 0 ) this.array[i].velocity.y *= -1;
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
				if ( ndgmr.checkPixelCollision( this.array[i].sprite, theSpriteTo, 0.25 ) ) return this.array[i];
			}
		}
		return false;
	}
}

function moveableAttacker( moveable, attacker, life )
{
	this.moveable = moveable;
	this.attacker = attacker;
	this.attacker2 = null;
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
var MAXJUMPHEIGHT = -200;
var primaryBuffer = false;
var specialNotUsed = true;
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

	if ( !primaryBuffer && ( gameEngine.ZPressed || gameEngine.IPressed  ) && player.moveable.sprite.currentAnimation != "Attack1" && player.moveable.sprite.currentAnimation != "Attack2" ) //&& player.moveable.airDistance === 0 )
	{
		player.moveable.sprite.gotoAndPlay( "Attack1" );
		primaryBuffer = true;
	}
	else if ( specialNotUsed && !primaryBuffer && ( gameEngine.XPressed || gameEngine.OPressed ) && player.moveable.sprite.currentAnimation != "Attack1" && player.moveable.sprite.currentAnimation != "Attack2" ) //&& player.moveable.airDistance === 0 )
	{
		player.moveable.sprite.gotoAndPlay( "Attack2" );
		primaryBuffer = true;
		specialNotUsed = false;
	}
	else if ( !( gameEngine.ZPressed || gameEngine.IPressed || gameEngine.XPressed || gameEngine.OPressed ) ) primaryBuffer = false;

	if ( posToAdd.equals( new vec2( 0, 0 ) ) )
	{
		if ( player.moveable.sprite.currentAnimation != "Neutral" && player.moveable.sprite.currentAnimation != "Attack1" && player.moveable.sprite.currentAnimation != "Attack2" )
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
			if ( player.attacker2.x < 0 || player.attacker2.width < 0 )
				{
				player.attacker2.x *= -1;
				player.attacker2.width *= - 1;
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
			if ( player.attacker2.x > 0 || player.attacker2.width > 0 )
		{
				player.attacker2.x *= -1;
				player.attacker2.width *= -1;
		}
		}
		if ( player.moveable.sprite.currentAnimation == "Neutral" && player.moveable.sprite.currentAnimation != "Attack1" && player.moveable.sprite.currentAnimation != "Attack2" )
		{
			player.moveable.sprite.gotoAndPlay( "Run" );
		}
		player.moveable.position = player.moveable.position.add( posToAdd );
	}
	stageBounds.contain( player.moveable );

	if ( !tomBuffer && gameEngine.TomPressed )
	{
		tomMode = tomMode == false;
		tomBuffer = true;
	}
	else if ( !gameEngine.TomPressed ) tomBuffer = false;

	if ( gameEngine.JamiePressed ) punishJamie();
	for ( var i = 0; i < powerStars.length; i++ )
	{
		if ( powerStars[i].sprite.visible )
		{
			if ( ndgmr.checkPixelCollision( player.moveable.sprite, powerStars[i].sprite, 0.25 ) )
			{
				starGet.play();
				powerStars[i].sprite.visible = false;
				invisibleTimeLeft = INVISIBLETIME;
			}
		}
	}

	for ( var i = 0; i < easterEggs.length; i++ )
	{
		if ( easterEggs[i].sprite.visible )
		{
			if ( ndgmr.checkPixelCollision( player.moveable.sprite, easterEggs[i].sprite, 0.25 ) )
			{
				eggGet.play();
				easterEggs[i].sprite.visible = false;
			}
		}
	}

	player.attacker.update();
	player.attacker2.update();
}

var tomBuffer = false;
var tomMode = false;


function punishJamie()
{
	for ( var i = 0; i < enemies.length; i++ )
	{
		if ( !enemies[i].moveable.sprite.visible )
		{
			enemies[i].moveable.sprite.visible = true;
			enemies[i].life = 100;
		}
	}
}
function playerAttack()
{
	player.attacker.update();
	//player.attacker.debugSprite.visible = true;
	for ( var i = 0; i < enemies.length; i++ )
	{
		if ( enemies[i].moveable.sprite.visible )
		{
			var collided = player.attacker.collideSprite( enemies[i].moveable.sprite );

			if ( collided )
			{
				enemies[i].life -= player.attacker.damage;
				if ( playerHit ) playerHit.play();
				if ( enemies[i].life <= 0 )
				{
					score += 100;
					addExplosion( new vec2( enemies[i].moveable.position.x, enemies[i].moveable.position.y - ( enemies[i].moveable.sprite.getTransformedBounds().height * 0.5 ) ) );
					if ( enemyDie ) enemyDie.play();
					enemies[i].moveable.sprite.visible = false;
					updateTarget( null );
				}
				else updateTarget( enemies[i] );
			}
		}
	}

	if ( boss.moveable.sprite.visible)
	{
		var collided = player.attacker.collideSprite( boss.moveable.sprite );

		if ( collided )
		{
			if ( playerHit ) playerHit.play();
			boss.life -= player.attacker.damage;
			if ( boss.life <= 0 )
			{
				score += 9001
				addExplosion( new vec2( boss.moveable.position.x, boss.moveable.position.y - ( boss.moveable.sprite.getTransformedBounds().height * 0.5 ) ) );
				boss.moveable.sprite.visible = false;
				if ( bossDie ) bossDie.play();
				updateTarget( null );
			}
			else
			{
				updateTarget( boss );
			}
		}
	}
}

function playerAttack2()
{
	player.attacker2.update();
	//player.attacker.debugSprite.visible = true;
	for ( var i = 0; i < enemies.length; i++ )
	{
		if ( enemies[i].moveable.sprite.visible )
		{
			var collided = player.attacker2.collideSprite( enemies[i].moveable.sprite );

			if ( collided )
			{
				enemies[i].life -= player.attacker2.damage;
				if ( playerHit ) playerHit.play();
				if ( enemies[i].life <= 0 )
				{
					score += 100;
					addExplosion( new vec2( enemies[i].moveable.position.x, enemies[i].moveable.position.y - ( enemies[i].moveable.sprite.getTransformedBounds().height * 0.5 ) ) );
					if ( enemyDie ) enemyDie.play();
					enemies[i].moveable.sprite.visible = false;
					updateTarget( null );
				}
				else updateTarget( enemies[i] );
			}
		}
	}

	if ( boss.moveable.sprite.visible )
	{
		var collided = player.attacker2.collideSprite( boss.moveable.sprite );

		if ( collided )
		{
			if ( playerHit ) playerHit.play();
			boss.life -= player.attacker2.damage;
			if ( boss.life <= 0 )
			{
				score += 9001
				addExplosion( new vec2( boss.moveable.position.x, boss.moveable.position.y - ( boss.moveable.sprite.getTransformedBounds().height * 0.5 ) ) );
				boss.moveable.sprite.visible = false;
				if ( bossDie ) bossDie.play();
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
				if ( Math.abs( enemies[i].moveable.position.x - player.moveable.position.x ) < ( player.moveable.sprite.getTransformedBounds().width * 0.25 ) ) moveAwayPlayer( enemies[i].moveable, false, true );
				else moveToPlayer( enemies[i].moveable );
				stageBounds.contain( enemies[i].moveable );
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

			else if ( distance < gameEngine.CANVASWIDTH * 1.25 && Math.random() <= 0.25 && enemies[i].moveable.sprite.currentAnimation != "Attack1" )
			{
				enemies[i].moveable.sprite.gotoAndPlay( "Attack1" );
			}
		}
	}
}

function enemyAttack( enemySprite )
{
	for ( var i = 0; i < enemies.length; i++ )
	{
		if ( enemies[i].moveable.sprite == enemySprite )
		{
			if ( invisibleTimeLeft <= 0 && enemies[i].attacker.collideSprite( player.moveable.sprite ) )
			{
				if ( enemyHit ) enemyHit.play();
				player.life -= enemies[i].attacker.damage;
			}
		}
	}
}

function bossUpdate()
{
	if ( boss.moveable.sprite.visible )
	{
		boss.attacker.update();
		var distance = boss.moveable.position.subtract( player.moveable.position ).length()
		if ( distance < gameEngine.CANVASWIDTH * 1.25 && !boss.attacker.collideSprite( player.moveable.sprite ) && boss.moveable.sprite.currentAnimation != "Attack1" )
		{
			if ( bossMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) bossMusic.play();
			if ( levelMusic.playState == createjs.Sound.PLAY_SUCCEEDED ) levelMusic.stop( { loop: -1 } );
			if ( Math.abs( boss.moveable.position.x - player.moveable.position.x ) < ( player.moveable.sprite.getTransformedBounds().width * 0.25 ) ) moveAwayPlayer( boss.moveable, false, true );
			else moveToPlayer( boss.moveable );
			stageBounds.contain( boss.moveable );
			if ( boss.moveable.sprite.currentAnimation != "Run" ) boss.moveable.sprite.gotoAndPlay( "Run" );
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
		else if ( distance < gameEngine.CANVASWIDTH * 1.25 && Math.random() <= 0.25 && boss.moveable.sprite.currentAnimation != "Attack1" )
		{
			boss.moveable.sprite.gotoAndPlay( "Attack1" );
		}
	}
}

function TRAXBossUpdate()
{
	boss.attacker.update();
	if ( boss.moveable.sprite.visible )
	{
		var distance = boss.moveable.position.subtract( player.moveable.position ).length()
		if ( distance < gameEngine.CANVASWIDTH * 1.25 )
		{
			if ( bossMusic.playState != createjs.Sound.PLAY_SUCCEEDED ) bossMusic.play();
			if ( levelMusic.playState == createjs.Sound.PLAY_SUCCEEDED ) levelMusic.stop( { loop: -1 } );
			if ( Math.abs( boss.moveable.position.x - player.moveable.position.x ) < ( player.moveable.sprite.getTransformedBounds().width ) ) moveAwayPlayer( boss.moveable, false, true );
			else if ( Math.abs( boss.moveable.position.x - player.moveable.position.x ) > ( ( player.moveable.sprite.getTransformedBounds().width ) + ( boss.moveable.sprite.getTransformedBounds().width ))  ) moveToPlayer( boss.moveable );
			else
			{
				var posToTest = player.moveable.position.subtract( boss.moveable.position ).normalize().multiply( boss.moveable.velocity );
				if ( posToTest.x > 0 )
				{
					boss.moveable.facing = "right";
				}
				else if ( posToTest.x < 0 )
				{
					boss.moveable.facing = "left";
				}
			}
			if ( boss.moveable.facing == "right" )
			{
				if ( boss.moveable.sprite.scaleX < 0 )
				{
					boss.moveable.sprite.scaleX *= -1;
				}
			}
			else if ( boss.moveable.facing == "left" )
			{
				if ( boss.moveable.sprite.scaleX > 0 )
				{
					boss.moveable.sprite.scaleX *= -1;
				}
			}
		}
		if(Math.random() < 0.2)
		{
			if ( boss.moveable.facing == "left" ) boss.attacker.fire( true, false );
			else boss.attacker.fire(false, false);
		}
	}
}

function bossAttack()
{
	if ( invisibleTimeLeft <= 0 && boss.attacker.collideSprite( player.moveable.sprite ) )
	{
		if ( bossHit ) bossHit.play();
		player.life -= boss.attacker.damage;
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
		enemyTarget = null;
		if ( enemyLifeIcon )
		{
			enemyLifeIcon.visible = false;
			gameEngine.stage.removeChild( enemyLifeIcon );
		}
	}
}

var invisibleTimeLeft;
var INVISIBLETIME = 1;

function invisibilityUpdate()
{
	if ( tomMode )
	{
		invisibleTimeLeft = INVISIBLETIME;
	}
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
	player = new moveableAttacker( new moveableObject( jamieChara.clone(), new vec2( gameEngine.CANVASWIDTH * 0.25, gameEngine.CANVASHEIGHT * 0.75 ), 300 ), new shortRangeAttack( jamieChara.getTransformedBounds().width * 0.25, -jamieChara.getTransformedBounds().height * 0.75, 40, 80 ), 100 );
	player.attacker2 = new shortRangeAttack( 0, -jamieChara.getTransformedBounds().height, jamieChara.getTransformedBounds().width * 0.5, jamieChara.getTransformedBounds().height );
	player.attacker2.damage = 10;
	player.moveable.sprite.on( "animationend", function ( evt )
	{
		if ( evt.name == "Attack1" ) playerAttack();
		if ( evt.name == "Attack2" ) playerAttack2();
	} );
	player.attacker.characterSprite = player.moveable.sprite;
	player.attacker2.characterSprite = player.moveable.sprite;
	//player.attacker.debugSprite = pixel.clone();
	//player.attacker2.debugSprite = pixel.clone();
	spriteArray.push( player.moveable );
	spriteContainer.addChild( player.moveable.sprite );
	//spriteContainer.addChild( player.attacker.debugSprite );
	//spriteContainer.addChild( player.attacker2.debugSprite );
	playerIcon = jamieIcon;
	specialNotUsed = true;
}

function loadHalladay()
{
	//player = new moveableAttacker( new moveableObject( halladayChara.clone(), new vec2( gameEngine.CANVASWIDTH * 0.25, gameEngine.CANVASHEIGHT * 0.75 ), 300 ), new longRangeAttack( halladayChara.getTransformedBounds().width, -halladayChara.getTransformedBounds().height / 2, null, powerStar.clone(), new vec2( 10, 0 ), 3 ), 100 );
	player = new moveableAttacker( new moveableObject( halladayChara.clone(), new vec2( gameEngine.CANVASWIDTH * 0.25, gameEngine.CANVASHEIGHT * 0.75 ), 300 ), new shortRangeAttack( halladayChara.getTransformedBounds().width * 0.2, -halladayChara.getTransformedBounds().height * 0.75, 40, 80 ), 100 );
	player.attacker2 = new shortRangeAttack( halladayChara.getTransformedBounds().width * 0.275, -halladayChara.getTransformedBounds().height * 0.775, 80, 80 );
	player.attacker2.damage = 10;
	player.moveable.sprite.on( "animationend", function ( evt )
	{
		if ( evt.name == "Attack1" ) playerAttack();
		if ( evt.name == "Attack2" ) playerAttack2();
	} );
	player.attacker.characterSprite = player.moveable.sprite;
	player.attacker2.characterSprite = player.moveable.sprite;
	//player.attacker.debugSprite = pixel.clone();
	//player.attacker2.debugSprite = pixel.clone();
	spriteArray.push( player.moveable );
	spriteContainer.addChild( player.moveable.sprite );
	//spriteContainer.addChild( player.attacker.debugSprite );
	//spriteContainer.addChild( player.attacker2.debugSprite );
	playerIcon = halladayIcon;
	specialNotUsed = true;
}

var score;
var scoreDisplay;

var spriteContainer;
var spriteContainerBackdrops;
var playerAttackers;
var enemyAttackers;
function collideBullets()
{

}

function TRAXBossSpecialCollide()
{
	if ( invisibleTimeLeft <= 0 )
	{
		var collided = boss.attacker.collideSprite( player.moveable.sprite );
		if ( collided )
		{
			collided.sprite.visible = false;
			if ( bossHit ) bossHit.play();
			player.life -= 1;
		}
	}
}

var levelFrameContainer;
var animated = false;
var levelFrameAnimator;

function levelFrameAniFinished( tween )
{
	levelFrameContainer.alpha = 1;
	levelFrameContainer.visible = false;
	levelFrameAnimator = null;
	animated = true;
}

function showLevelFrame()
{
	levelFrameContainer.visible = true;
	levelFrameAnimator = new createjs.Tween.get( levelFrameContainer, { loop: false } )
	.wait( 2000 )
	.to( { alpha: 0 }, 1000, createjs.Ease.sineIn )
	.call( levelFrameAniFinished );
	animated = false;
}

var circleExplosionParticleArray;
function addExplosion( pos )
{
	for ( var i = 0; i < circleExplosionParticleArray.length; i++ )
	{
		if ( !circleExplosionParticleArray[i].sprite.visible )
		{
			circleExplosionParticleArray[i].position = pos;
			circleExplosionParticleArray[i].sprite.gotoAndPlay( "Normal" );
			circleExplosionParticleArray[i].sprite.visible = true;
			circleExplosionParticleArray[i].sprite.x = circleExplosionParticleArray[i].position.x - camera.x;
			circleExplosionParticleArray[i].sprite.y = circleExplosionParticleArray[i].position.y + circleExplosionParticleArray[i].airDistance - camera.y;
			break;
		}
	}
}
var levelMusic, bossMusic;
var playerDie, enemyDie, bossDie, playerHit, enemyHit, bossHit;
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

	boss = new moveableAttacker( new moveableObject( level1Boss.clone(), new vec2( MAXDISTANCE, 0 ), 10 ), new shortRangeAttack( level1Boss.getTransformedBounds().width *0.25, -level1Boss.getTransformedBounds().height * 0.5, 50, 50 ), 30 );
	boss.icon = level1BossIcon.clone();

	boss.icon.x = gameEngine.CANVASWIDTH;
	boss.icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;
	boss.attacker.characterSprite = boss.moveable.sprite;
	//boss.attacker.debugSprite = pixel.clone();
	boss.moveable.sprite.on( "animationend", function ( evt ) { if ( evt.name == "Attack1" ) bossAttack(); } );
	spriteArray.push( boss.moveable );
	stageBounds.contain( boss.moveable );
	spriteContainer.addChild( boss.moveable.sprite );
	//spriteContainer.addChild( boss.attacker.debugSprite );
	enemies = new Array();
	for ( var i = 0; i < 10; i++ )
	{
		enemies.push( new moveableAttacker( new moveableObject( level1Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( ( MAXDISTANCE - ( gameEngine.CANVASWIDTH * 2 ) ) * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ), new shortRangeAttack( level1Enemy.getTransformedBounds().width / 8, -level1Enemy.getTransformedBounds().height * 0.9, 50, level1Enemy.getTransformedBounds().height / 2 ), 1 ) );
		enemies[i].attacker.characterSprite = enemies[i].moveable.sprite;
		stageBounds.contain( enemies[i].moveable );
		//enemies[i].attacker.debugSprite = pixel.clone();
		//enemies[i].attacker.debugSprite.visible = true;
		enemies[i].moveable.sprite.on( "animationend",
		function ( evt ) { if ( evt.name == "Attack1" ) enemyAttack( evt.target ); }
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
	stageBounds.contain( player.moveable );
	powerStars = new Array();
	for ( var i = 0; i < 4; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * ( MAXDISTANCE - ( gameEngine.CANVASWIDTH * 2 ) ) ) + gameEngine.CANVASWIDTH, gameEngine.CANVASHEIGHT * Math.random() ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		spriteContainer.addChild( powerStars[i].sprite );
	}

	gameEngine.stage.addChild( spriteContainer );
	circleExplosionParticleArray = new Array();
	for ( var i = 0; i < 100; i++ )
	{
		circleExplosionParticleArray.push( new moveableObject( circleExplosion.clone(), new vec2( 0, 0 ), 0 ) );
		circleExplosionParticleArray[i].sprite.on( "animationend", function ( evt ) { evt.target.visible = false; } );
		circleExplosionParticleArray[i].sprite.visible = false;
		spriteArray.push( circleExplosionParticleArray[i] );
		gameEngine.stage.addChild( circleExplosionParticleArray[i].sprite );
	}
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

	levelMusic = level1Music;
	levelMusic.play( { loop: -1 } );
	levelMusic.setMute( mute );
	bossMusic = mainBossMusic;
	bossMusic.setMute( mute );

	playerHit = mainPlayerHit;
	playerDie = mainPlayerDie;
	enemyHit = mainEnemyHit;
	enemyDie = mainEnemyDie;
	bossHit = mainEnemyHit;
	bossDie = mainEnemyDie;

	enemyTarget = null;
	gameEngine.stage.addChild( audio );
	levelFrameContainer = level1Frame;
	gameEngine.stage.addChild( levelFrameContainer );
	showLevelFrame();
}

function level1Delete()
{
	gameEngine.stage.removeAllChildren();
	backDrops = spriteArray = enemies = stageBounds = null;
	levelMusic.stop();
	bossMusic.stop();

	playerHit.stop();
	playerDie.stop();
	enemyHit.stop();
	enemyDie.stop();
	bossHit.stop();
	bossDie.stop();
}

function level1Update()
{
	if ( animated )
	{
		playerMovement();
		enemyMovement();
		bossUpdate();
		collideBullets();
		invisibilityUpdate();

		if ( player.life <= 0 )
		{
			playerDie.play();
			addExplosion( new vec2( player.moveable.position.x, player.moveable.position.y - ( player.moveable.sprite.getTransformedBounds().height * 0.5 ) ) );
			player.moveable.sprite.visible = false;
			gameEngine.mode = "gameover";
		}
		if ( !boss.moveable.sprite.visible )
		{
			gameEngine.mode = "level2";
		}
	}
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
	updateLife();
	scoreDisplay.text = score;
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	levelMusic.setMute( mute );
	bossMusic.setMute( mute );
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

	if ( !easterEggs ) easterEggs = new Array();
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

	boss = new moveableAttacker( new moveableObject( level2Boss.clone(), new vec2( MAXDISTANCE, 0 ), 5 ), new longRangeAttack( level2Boss.getTransformedBounds().width * 0.5, -level2Boss.getTransformedBounds().height * 0.5, null, bullet, new vec2( 15, 0 ), 10 ), 30 );
	boss.icon = level2BossIcon.clone();
	boss.icon.x = gameEngine.CANVASWIDTH;
	boss.icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;
	stageBounds.contain( boss.moveable );
	boss.attacker.character = boss.moveable;
	//boss.attacker.debugSprite = pixel.clone();
	//boss.moveable.sprite.on( "animationend", function ( evt ) { if ( evt.name == "Attack1" ) bossAttack(); } );
	spriteArray.push( boss.moveable );
	spriteContainer.addChild( boss.moveable.sprite );
	//spriteContainer.addChild( boss.attacker.debugSprite );

	for ( var i = 0; i < boss.attacker.array.length; i++ )
	{
		spriteArray.push( boss.attacker.array[i] );
		spriteContainer.addChild( boss.attacker.array[i].sprite);
	}
	enemies = new Array();
	for ( var i = 0; i < 30; i++ ) //30
	{
		enemies.push( new moveableAttacker( new moveableObject( level2Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( ( MAXDISTANCE - gameEngine.CANVASWIDTH ) * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ), new shortRangeAttack( level2Enemy.getTransformedBounds().width / 8, -level2Enemy.getTransformedBounds().height * 0.9, 50, level2Enemy.getTransformedBounds().height / 2 ), 2 ) );
		enemies[i].attacker.characterSprite = enemies[i].moveable.sprite;
		stageBounds.contain( enemies[i].moveable );
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
	stageBounds.contain( player.moveable );
	powerStars = new Array();
	for ( var i = 0; i < 8; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * ( MAXDISTANCE - ( gameEngine.CANVASWIDTH * 2 ) ) ) + gameEngine.CANVASWIDTH, gameEngine.CANVASHEIGHT * Math.random() ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		spriteContainer.addChild( powerStars[i].sprite );
	}
	gameEngine.stage.addChild( spriteContainer );

	circleExplosionParticleArray = new Array(); 
	for ( var i = 0; i < 100; i++ )
	{
		circleExplosionParticleArray.push( new moveableObject( circleExplosion.clone(), new vec2( 0, 0 ), 0 ) );
		circleExplosionParticleArray[i].sprite.on( "animationend", function ( evt ) { evt.target.visible = false; } );
		circleExplosionParticleArray[i].sprite.visible = false;
		spriteArray.push( circleExplosionParticleArray[i] );
		gameEngine.stage.addChild( circleExplosionParticleArray[i].sprite );
	}
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

	levelMusic = level2Music;
	levelMusic.play( { loop: -1 } );
	levelMusic.setMute( mute );
	bossMusic = mainBossMusic;
	bossMusic.setMute( mute );

	playerHit = mainPlayerHit;
	playerDie = mainPlayerDie;
	enemyHit = mainEnemyHit;
	enemyDie = mainEnemyDie;
	bossHit = mainEnemyHit;
	bossDie = mainEnemyDie;
	enemyTarget = null;
	gameEngine.stage.addChild( audio );

	levelFrameContainer = level2Frame;
	gameEngine.stage.addChild( levelFrameContainer );
	showLevelFrame();
}

function level2Delete()
{
	gameEngine.stage.removeAllChildren();
	backDrops = spriteArray = enemies = stageBounds = null;
	levelMusic.stop();
	bossMusic.stop();

	playerHit.stop();
	playerDie.stop();
	enemyHit.stop();
	enemyDie.stop();
	bossHit.stop();
	bossDie.stop();
}

function level2Update()
{
	if ( animated )
	{
		playerMovement();
		enemyMovement();
		TRAXBossUpdate();

		TRAXBossSpecialCollide();
		invisibilityUpdate();

		if ( player.life <= 0 )
		{
			addExplosion( new vec2( player.moveable.position.x, player.moveable.position.y - ( player.moveable.sprite.getTransformedBounds().height * 0.5 ) ) );
			playerDie.play();
			player.moveable.sprite.visible = false;
			gameEngine.mode = "gameover";

		}
		if ( !boss.moveable.sprite.visible )
		{
			gameEngine.mode = "level3";
		}
	}
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
	updateLife();
	scoreDisplay.text = score;
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();
	levelMusic.setMute( mute );
	bossMusic.setMute( mute );
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

	if ( !easterEggs ) easterEggs = new Array();
	for ( var i = 0; i < 2; i++ )
	{
		easterEggs.push( new moveableObject( easterEgg.clone(), new vec2(( ( level3Shelf.getTransformedBounds().width + 500 ) * Math.floor( Math.random() * 10 ) ) + 10, 100 ), 0 ) );
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

	boss = new moveableAttacker( new moveableObject( level3Boss.clone(), new vec2( MAXDISTANCE, 0 ), 10 ), new shortRangeAttack( 0, -level3Boss.getTransformedBounds().height * 0.2, level3Boss.getTransformedBounds().width * 0.5, 100 ), 30 );
	boss.icon = level3BossIcon.clone();
	boss.icon.x = gameEngine.CANVASWIDTH;
	boss.icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;
	boss.moveable.sprite.on( "animationend", function ( evt ) { if ( evt.name == "Attack1" ) bossAttack(); } );
	stageBounds.contain( boss.moveable );
	boss.attacker.characterSprite = boss.moveable.sprite;
	spriteArray.push( boss.moveable );
	spriteContainer.addChild( boss.moveable.sprite );
	enemies = new Array();
	for ( var i = 0; i < 40; i++ )
	{
		enemies.push( new moveableAttacker( new moveableObject( level3Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( ( MAXDISTANCE - gameEngine.CANVASWIDTH ) * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ), new shortRangeAttack( level3Enemy.getTransformedBounds().width / 3, -level3Enemy.getTransformedBounds().height * 0.9, 50, level3Enemy.getTransformedBounds().height / 2 ), 3 ) );
		enemies[i].attacker.characterSprite = enemies[i].moveable.sprite;
		stageBounds.contain( enemies[i].moveable );
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
	stageBounds.contain( player.moveable );
	powerStars = new Array();
	for ( var i = 0; i < 16; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * MAXDISTANCE ) + gameEngine.CANVASWIDTH, Math.random() * gameEngine.CANVASHEIGHT ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		spriteContainer.addChild( powerStars[i].sprite );
	}

	gameEngine.stage.addChild( spriteContainer );
	circleExplosionParticleArray = new Array();
	for ( var i = 0; i < 100; i++ )
	{
		circleExplosionParticleArray.push( new moveableObject( circleExplosion.clone(), new vec2( 0, 0 ), 0 ) );
		circleExplosionParticleArray[i].sprite.on( "animationend", function ( evt ) { evt.target.visible = false; } );
		circleExplosionParticleArray[i].sprite.visible = false;
		spriteArray.push( circleExplosionParticleArray[i] );
		gameEngine.stage.addChild( circleExplosionParticleArray[i].sprite );
	}
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

	levelMusic = level3Music;
	levelMusic.play( { loop: -1 } );
	levelMusic.setMute( mute );
	bossMusic = mainBossMusic;
	bossMusic.setMute( mute );

	playerHit = mainPlayerHit;
	playerDie = mainPlayerDie;
	enemyHit = mainEnemyHit;
	enemyDie = mainEnemyDie;
	bossHit = mainEnemyHit;
	bossDie = mainEnemyDie;

	enemyTarget = null;
	gameEngine.stage.addChild( audio );
	levelFrameContainer = level3Frame;
	gameEngine.stage.addChild( levelFrameContainer );
	showLevelFrame();
}

function level3Delete()
{
	gameEngine.stage.removeAllChildren();
	backDrops = spriteArray = enemies = stageBounds = null;
	levelMusic.stop();
	bossMusic.stop();

	playerHit.stop();
	playerDie.stop();
	enemyHit.stop();
	enemyDie.stop();
	bossHit.stop();
	bossDie.stop();
}

function level3Update()
{
	if ( animated )
	{
		playerMovement();
		enemyMovement();
		bossUpdate();

		collideBullets();
		invisibilityUpdate();
		if ( player.life <= 0 )
		{
			addExplosion( new vec2( player.moveable.position.x, player.moveable.position.y - ( player.moveable.sprite.getTransformedBounds().height * 0.5 ) ) );
			playerDie.play();
			player.moveable.sprite.visible = false;
			gameEngine.mode = "gameover";
		}
		if ( !boss.moveable.sprite.visible )
		{
			gameEngine.mode = "level4";
		}
	}
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
	updateLife();
	scoreDisplay.text = score;
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();

	levelMusic.setMute( mute );
	bossMusic.setMute( mute );
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
	backDrops.push( new moveableBackdrop( level4DoorRight, 0.5, new vec2( Math.random() * 20, 320 ), new vec2( 0, 0 ), new vec2( level4DoorRight.getTransformedBounds().width + 100, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level4King, 0.5, new vec2( Math.random() * 20, 200 ), new vec2( 0, 0 ), new vec2( level4King.getTransformedBounds().width + 200, 0 ), false, true ) );
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

	boss = new moveableAttacker( new moveableObject( level4Boss.clone(), new vec2( MAXDISTANCE, 0 ), 10 ), new shortRangeAttack( 0, -level4Boss.getTransformedBounds().height * 0.65, 110, 30 ), 30 );

	stageBounds.contain( boss.moveable );

	boss.icon = level4BossIcon.clone();
	boss.icon.x = gameEngine.CANVASWIDTH;
	boss.icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;

	boss.attacker.characterSprite = boss.moveable.sprite;
	//boss.attacker.debugSprite = pixel.clone();
	boss.moveable.sprite.on( "animationend", function ( evt ) { if ( evt.name == "Attack1" ) bossAttack(); } );
	spriteArray.push( boss.moveable );
	spriteContainer.addChild( boss.moveable.sprite );
	//spriteContainer.addChild( boss.attacker.debugSprite );
	enemies = new Array();
	for ( var i = 0; i < 50; i++ )
	{
		enemies.push( new moveableAttacker( new moveableObject( level4Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( ( MAXDISTANCE - gameEngine.CANVASWIDTH ) * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ), new shortRangeAttack( level4Enemy.getTransformedBounds().width / 5, -level4Enemy.getTransformedBounds().height * 0.8, 40, level4Enemy.getTransformedBounds().height / 2 ), 4 ) );
		enemies[i].attacker.characterSprite = enemies[i].moveable.sprite;
		stageBounds.contain( enemies[i].moveable );
		//enemies[i].attacker.debugSprite = pixel.clone();
		//enemies[i].attacker.debugSprite.visible = true;
		enemies[i].moveable.sprite.on( "animationend",
		function ( evt ) { if ( evt.name == "Attack1" ) enemyAttack( evt.target ); }
		);

		enemies[i].icon = level4EnemyIcon.clone();

		enemies[i].icon.x = gameEngine.CANVASWIDTH;
		enemies[i].icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;

		spriteArray.push( enemies[i].moveable );
		spriteContainer.addChild( enemies[i].moveable.sprite );
		//spriteContainer.addChild( enemies[i].attacker.debugSprite );
	}


	camera = new vec2( 0, 0 );

	if ( characterMode == "halladay" ) loadHalladay();
	else loadJamie();
	stageBounds.contain( player.moveable );
	powerStars = new Array();
	for ( var i = 0; i < 32; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * MAXDISTANCE ) + gameEngine.CANVASWIDTH, Math.random() * gameEngine.CANVASHEIGHT ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		spriteContainer.addChild( powerStars[i].sprite );
	}

	gameEngine.stage.addChild( spriteContainer );
	circleExplosionParticleArray = new Array();
	for ( var i = 0; i < 100; i++ )
	{
		circleExplosionParticleArray.push( new moveableObject( circleExplosion.clone(), new vec2( 0, 0 ), 0 ) );
		circleExplosionParticleArray[i].sprite.on( "animationend", function ( evt ) { evt.target.visible = false; } );
		circleExplosionParticleArray[i].sprite.visible = false;
		spriteArray.push( circleExplosionParticleArray[i] );
		gameEngine.stage.addChild( circleExplosionParticleArray[i].sprite );
	}
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

	levelMusic = level4Music;
	levelMusic.play( { loop: -1 } );
	levelMusic.setMute( mute );
	bossMusic = mainBossMusic;
	bossMusic.setMute( mute );

	playerHit = mainPlayerHit;
	playerDie = mainPlayerDie;
	enemyHit = mainEnemyHit;
	enemyDie = mainEnemyDie;
	bossHit = mainEnemyHit;
	bossDie = mainEnemyDie;

	enemyTarget = null;
	gameEngine.stage.addChild( audio );
	levelFrameContainer = level4Frame;
	gameEngine.stage.addChild( levelFrameContainer );
	showLevelFrame();
}

function level4Delete()
{
	gameEngine.stage.removeAllChildren();
	backDrops = spriteArray = enemies = stageBounds = null;
	levelMusic.stop();
	bossMusic.stop();

	playerHit.stop();
	playerDie.stop();
	enemyHit.stop();
	enemyDie.stop();
	bossHit.stop();
	bossDie.stop();
}

function level4Update()
{
	if ( animated )
	{
		playerMovement();
		enemyMovement();
		bossUpdate();

		collideBullets();
		invisibilityUpdate();

		if ( player.life <= 0 )
		{
			addExplosion( new vec2( player.moveable.position.x, player.moveable.position.y - ( player.moveable.sprite.getTransformedBounds().height * 0.5 ) ) );
			playerDie.play();
			player.moveable.sprite.visible = false;
			gameEngine.mode = "gameover";
		}
		if ( !boss.moveable.sprite.visible )
		{
			gameEngine.mode = "level5";
		}
	}
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
	updateLife();
	scoreDisplay.text = score;
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();

	levelMusic.setMute( mute );
	bossMusic.setMute( mute );
}
//#endregion

//#region level5
function level5Init()
{
	var MAXDISTANCE = 10000;
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


	boss = new moveableAttacker( new moveableObject( level5Boss.clone(), new vec2( MAXDISTANCE, 0 ), 10 ), new shortRangeAttack( level5Boss.getTransformedBounds().width * 0.15, -level5Boss.getTransformedBounds().height * 0.725, level5Boss.getTransformedBounds().width * 0.35, level5Boss.getTransformedBounds().height * 0.35 ), 50 );
	stageBounds.contain( boss.moveable );
	boss.icon = level5BossIcon.clone();
	boss.icon.x = gameEngine.CANVASWIDTH;
	boss.icon.y = gameEngine.CANVASHEIGHT - healthBar.getTransformedBounds().height - 5;

	boss.attacker.characterSprite = boss.moveable.sprite;
	//boss.attacker.debugSprite = pixel.clone();
	boss.moveable.sprite.on( "animationend", function ( evt ) {if ( evt.name == "Attack1" ) bossAttack(); } );
	spriteArray.push( boss.moveable );
	spriteContainer.addChild( boss.moveable.sprite );
	//spriteContainer.addChild( boss.attacker.debugSprite );
	enemies = new Array();
	for ( var i = 0; i < 50; i++ )
	{
		enemies.push( new moveableAttacker( new moveableObject( level5Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( ( MAXDISTANCE - gameEngine.CANVASWIDTH ) * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ), new shortRangeAttack( level5Enemy.getTransformedBounds().width * 0.15, -level5Enemy.getTransformedBounds().height, level5Enemy.getTransformedBounds().width * 0.55, level5Enemy.getTransformedBounds().height * 0.6 ), 5 ) );
		enemies[i].attacker.characterSprite = enemies[i].moveable.sprite;
		//enemies[i].attacker.debugSprite = pixel.clone();
		//enemies[i].attacker.debugSprite.visible = true;
		enemies[i].moveable.sprite.on( "animationend",
		function ( evt )
		{
			if ( evt.name == "Attack1" ) enemyAttack( evt.target );
		}
		);
		stageBounds.contain( enemies[i].moveable );
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
	stageBounds.contain(player.moveable);
	powerStars = new Array();
	for ( var i = 0; i < 128; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * MAXDISTANCE ) + gameEngine.CANVASWIDTH, 0 ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		spriteContainer.addChild( powerStars[i].sprite );
	}

	gameEngine.stage.addChild( spriteContainer );
	circleExplosionParticleArray = new Array();
	for ( var i = 0; i < 100; i++ )
	{
		circleExplosionParticleArray.push( new moveableObject( circleExplosion.clone(), new vec2( 0, 0 ), 0 ) );
		circleExplosionParticleArray[i].sprite.on( "animationend", function ( evt ) { evt.target.visible = false; } );
		circleExplosionParticleArray[i].sprite.visible = false;
		spriteArray.push( circleExplosionParticleArray[i] );
		gameEngine.stage.addChild( circleExplosionParticleArray[i].sprite );
	}
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

	levelMusic = level5Music;
	levelMusic.play( { loop: -1 } );
	levelMusic.setMute( mute );
	bossMusic = level5BossIntroMusic;
	bossMusic.setMute( mute );

	playerHit = mainPlayerHit;
	playerDie = mainPlayerDie;
	enemyHit = mainEnemyHit;
	enemyDie = mainEnemyDie;
	bossHit = mainEnemyHit;
	bossDie = mainEnemyDie;

	enemyTarget = null;
	gameEngine.stage.addChild( audio );
	levelFrameContainer = level5Frame;
	gameEngine.stage.addChild( levelFrameContainer );
	showLevelFrame();
}

function level5Delete()
{
	gameEngine.stage.removeAllChildren();
	backDrops = spriteArray = enemies = stageBounds = null;
	levelMusic.stop();
	bossMusic.stop();

	playerHit.stop();
	playerDie.stop();
	enemyHit.stop();
	enemyDie.stop();
	bossHit.stop();
	bossDie.stop();
}

function level5Update()
{
	if ( animated )
	{
		playerMovement();
		enemyMovement();
		bossUpdate();

		collideBullets();
		
		invisibilityUpdate();

		if ( player.life <= 0 )
		{
			addExplosion( new vec2( player.moveable.position.x, player.moveable.position.y - ( player.moveable.sprite.getTransformedBounds().height * 0.5 ) ) );
			playerDie.play();
			player.moveable.sprite.visible = false;
			gameEngine.mode = "gameover";
		}
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
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
	updateLife();
	scoreDisplay.text = score;
	scoreDisplay.x = gameEngine.CANVASWIDTH - scoreDisplay.getMeasuredWidth();

	levelMusic.setMute( mute );
	bossMusic.setMute( mute );
}
//#endregion

//#endregion
function andrewMain()
{
	titleQueue = new Array();
	titleQueue.push( new createjs.LoadQueue( true, "" ) );
	createjs.Sound.alternateExtensions = ["mp3"];
	titleQueue[0].installPlugin( createjs.Sound );
	titleQueue[0].on( "complete", function(){titleLoaded(); instructionsQueue[0].load();}, this );
	titleQueue[0].loadManifest( titleManifest, false );
	gameEngine.addModeLooper( "title", new gameEngine.updateModeLooper( titleInit, titleDelete, titleUpdate, titleQueue ) );

	instructionsQueue = new Array();
	instructionsQueue.push( new createjs.LoadQueue( true, "" ) );
	instructionsQueue[0].on( "complete", function () { instructionsLoaded(); creditsQueue[0].load(); }, this );
	instructionsQueue[0].loadManifest( instructionsManifest, false );
	gameEngine.addModeLooper( "instructions", new gameEngine.updateModeLooper( instructionsInit, instructionsDelete, instructionsUpdate, instructionsQueue ) );

	creditsQueue = new Array();
	creditsQueue.push( new createjs.LoadQueue( true, "" ) );
	creditsQueue[0].installPlugin( createjs.Sound );
	creditsQueue[0].on( "complete", function () { creditsLoaded(); characterSelectQueue[0].load(); }, this );
	creditsQueue[0].loadManifest( creditsManifest, false );
	gameEngine.addModeLooper( "credits", new gameEngine.updateModeLooper( creditsInit, creditsDelete, creditsUpdate, creditsQueue ) );

	characterSelectQueue = new Array();
	characterSelectQueue.push( new createjs.LoadQueue( true, "" ) );
	characterSelectQueue[0].installPlugin( createjs.Sound );
	characterSelectQueue[0].on( "complete", function () { characterSelectLoaded(); gameoverQueue[0].load();}, this );
	characterSelectQueue[0].loadManifest( characterSelectManifest, false );
	gameEngine.addModeLooper( "characterSelect", new gameEngine.updateModeLooper( characterSelectInit, characterSelectDelete, characterSelectUpdate, characterSelectQueue ) );

	gameoverQueue = new Array();
	gameoverQueue.push( new createjs.LoadQueue( true, "" ) );
	gameoverQueue[0].installPlugin( createjs.Sound );
	gameoverQueue[0].on( "complete", function () { gameoverLoaded(); mainGameQueue.load(); }, this );
	gameoverQueue[0].loadManifest( gameoverManifest, false );
	gameEngine.addModeLooper( "gameover", new gameEngine.updateModeLooper( gameoverInit, gameoverDelete, gameoverUpdate, gameoverQueue ) );

	mainGameQueue = new createjs.LoadQueue( true, "" );
	mainGameQueue.installPlugin( createjs.Sound );
	mainGameQueue.on( "complete", function () { mainGameLoaded(); Level1Queue[0].load(); }, this );
	mainGameQueue.loadManifest( mainGameManifest, false );

	Level1Queue = new Array();
	Level1Queue.push( new createjs.LoadQueue( true, "" ) );
	Level1Queue[0].installPlugin( createjs.Sound );
	Level1Queue[0].on( "complete", function () { level1Loaded(); Level2Queue[0].load(); } );
	Level1Queue[0].loadManifest( Level1Manifest, false );
	Level1Queue.push( mainGameQueue );
	gameEngine.addModeLooper( "level1", new gameEngine.updateModeLooper( level1Init, level1Delete, level1Update, Level1Queue ) );

	Level2Queue = new Array();
	Level2Queue.push( new createjs.LoadQueue( true, "" ) );
	Level2Queue[0].installPlugin( createjs.Sound );
	Level2Queue[0].on( "complete", function () { level2Loaded(); Level3Queue[0].load(); } );
	Level2Queue[0].loadManifest( Level2Manifest, false );
	Level2Queue.push( mainGameQueue );
	gameEngine.addModeLooper( "level2", new gameEngine.updateModeLooper( level2Init, level2Delete, level2Update, Level2Queue ) );

	Level3Queue = new Array();
	Level3Queue.push( new createjs.LoadQueue( true, "" ) );
	Level3Queue[0].installPlugin( createjs.Sound );
	Level3Queue[0].on( "complete", function () { level3Loaded(); Level4Queue[0].load(); } );
	Level3Queue[0].loadManifest( Level3Manifest, false );
	Level3Queue.push( mainGameQueue );
	gameEngine.addModeLooper( "level3", new gameEngine.updateModeLooper( level3Init, level3Delete, level3Update, Level3Queue ) );

	Level4Queue = new Array();
	Level4Queue.push( new createjs.LoadQueue( true, "" ) );
	Level4Queue[0].installPlugin( createjs.Sound );
	Level4Queue[0].on( "complete", function () { level4Loaded(); Level5Queue[0].load(); } );
	Level4Queue[0].loadManifest( Level4Manifest, false );
	Level4Queue.push( mainGameQueue );
	gameEngine.addModeLooper( "level4", new gameEngine.updateModeLooper( level4Init, level4Delete, level4Update, Level4Queue ) );

	Level5Queue = new Array();
	Level5Queue.push( new createjs.LoadQueue( true, "" ) );
	Level5Queue[0].installPlugin( createjs.Sound );
	Level5Queue[0].on( "complete", function () { level5Loaded(); winQueue[0].load(); } );
	Level5Queue[0].loadManifest( Level5Manifest, false );
	Level5Queue.push( mainGameQueue );
	gameEngine.addModeLooper( "level5", new gameEngine.updateModeLooper( level5Init, level5Delete, level5Update, Level5Queue ) );

	winQueue = new Array();
	winQueue.push( new createjs.LoadQueue( true, "" ) );
	winQueue[0].installPlugin( createjs.Sound );
	winQueue[0].on( "complete", function () { winLoaded(); trueWinQueue[0].load(); }, this );
	winQueue[0].loadManifest( winManifest, false );
	gameEngine.addModeLooper( "win", new gameEngine.updateModeLooper( winInit, winDelete, winUpdate, winQueue ) );

	trueWinQueue = new Array();
	trueWinQueue.push( new createjs.LoadQueue( true, "" ) );
	trueWinQueue[0].installPlugin( createjs.Sound );
	trueWinQueue[0].on( "complete", function () { trueWinLoaded();}, this );
	trueWinQueue[0].loadManifest( trueWinManifest, false );
	gameEngine.addModeLooper( "trueWin", new gameEngine.updateModeLooper( trueWinInit, trueWinDelete, trueWinUpdate, trueWinQueue ) );
	titleQueue[0].load();
}
