//The engine nameSpace
var gameEngine =
{
	mode:"title",
	MAINFPS:30,
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
	updateModeLooper: function ( initializer, deleter, updater, queue )
	{
		this.initialized = false;
		this.queue = queue;
		this.initializer = initializer;
		this.deleter = deleter;
		this.updater = updater;
		this.update = function ()
		{
			queue = this.queue;
			if ( queue == null || !queue.loaded )
			{
				gameEngine.loadingUpdate( this.queue );
			}
			else
			{
				if ( this.initialized )
				{
					gameEngine.removeAll();
					this.initializer();
					this.initialized = true;
				}
				else
				{
					this.updater();
				}
			}
		};
	},

	//add your updateModeLoopers to this map
	updateModeLooperArray: new Map(),

	//call this to delete all stages based on your deleter
	removeAll: function()
	{
		for(var m in gameEngine.updateModeLooperArray)
		{
			if(gameEngine.updateModeLooperArray[m].initialized)
			{
				gameEngine.updateModeLooperArray[m].deleter();
				gameEngine.updateModeLooperArray[m].initialized = false;
			}
		}
		if ( gameEngine.loadingInitialized )
		{
			gameEngine.loadingDelete();
		}
	},

	//#region loading
	barBorder : null, progressBar: null, loadingText: null, backgroundColor: null,
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
		stage.addChild( barBorder );

		gameEngine.progressBar = new createjs.Shape();
		gameEngine.progressBar.graphics.beginFill( "#FFF" ).drawRect( 0, 0, 0, 10 );
		gameEngine.progressBar.x = ( gameEngine.stage.canvas.width / 2 ) - ( gameEngine.loadingTextWidth / 2 );
		gameEngine.progressBar.y = ( gameEngine.stage.canvas.height / 2 ) + ( loadingTextHeight / 2 );
		stage.addChild( gameEngine.progressBar );
		gameEngine.loadingInitialized = true;
	},

	loadingDelete: function ()
	{
		gameEngine.stage.removeAllChildren();
		gameEngine.backgroundColor = gameEngine.loadingText = gameEngine.barBorder = gameEngine.progressBar = null;
		gameEngine.loadingInitialized = false;
	},

	loadingUpdate: function (queue)
	{
		if(gameEngine.loadingInitialized)
		{
			if ( queue == null ) gameEngine.progressBar.graphics.beginFill( "#FFF" ).drawRect( 0, 0, 0, 10 );
			else gameEngine.progressBar.graphics.beginFill( "#FFF" ).drawRect( 0, 0, gameEngine.loadingTextWidth * queue.progress, 10 );
		}
		else
		{
			gameEngine.removeAll();
			gameEngine.loadingInit();
		}
	},
	//#endregion

	//the loop, don't touch
	loop: function()
	{
		if ( gameEngine.updateModeLooperArray[gameEngine.mode] != null ) gameEngine.updateModeLooperArray[gameEngine.mode].update();
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

	main: function()
	{
		gameEngine.setUpCanvas();
		createjs.Ticker.addEventListener( "tick", gameEngine.loop );
		createjs.Ticker.setFPS( gameEngine.MAINFPS );
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