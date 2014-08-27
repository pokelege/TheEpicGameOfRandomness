//#region title
var titleManifest =
[
	{ src: "images/title.jpg", id: "title" }
];
var titleQueue;
var titleScreen;
function titleLoaded()
{
	titleScreen = new createjs.Bitmap( titleQueue[0].getResult( "title" ) );
}

function titleInit()
{
	gameEngine.stage.addChild( titleScreen );
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
		{src: "images/instructions.jpg", id: "instructions"}
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
}

function instructionsDelete()
{
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
}

function creditsDelete()
{
	gameEngine.stage.removeAllChildren();
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
}

function gameoverDelete()
{
	gameEngine.stage.removeAllChildren();
}
function gameoverUpdate()
{

}
//#endregion

//#region characterSelect
var characterSelectManifest =
	[
		{ src: "images/characterSelect.jpg", id: "characterSelect" }
	];
var characterSelectQueue;
var characterSelect;
function characterSelectLoaded()
{
	characterSelect = new createjs.Bitmap( characterSelectQueue[0].getResult( "characterSelect" ) );
}

function characterSelectInit()
{
	gameEngine.stage.addChild( characterSelect );
}

function characterSelectDelete()
{
	gameEngine.stage.removeAllChildren();
}
function characterSelectUpdate()
{

}
//#endregion


//#region mainGame
var mainGameManifest =
	[

	];
var mainGameQueue;

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

	];
var Level4Queue;

var Level5Manifest =
	[

	];
var Level5Queue;


function mainGameLoaded()
{

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

}

function level5Loaded()
{

}

function vec2(x, y)
{
	this.x = x;
	this.y = y;
	normalize = function()
	{
		var magnitude = Math.sqrt(( x * x ) + ( y * y ) );
		return new vec2( x / magnitude, y / magnitude );
	}
	add = function(addWith)
	{
		return new vec2( addWith.x + x, addWith.y + y );
	}
	subtract = function(subtractWith)
	{
		return new vec2( x - subtractWith.x, y - subtractWith.y );
	}
	multiply = function(multiplyWith)
	{
		return new vec2(x * multiplyWith, y * multiplyWith);
	}
}

var camera = new vec2( 0, 0 );
function moveableObject(sprite, initialPosition, velocity)
{
	this.sprite = sprite;
	this.position = initialPosition;
	this.velocity = velocity;
}
var player;
var enemies;
var boss;
var background, backgroundDepth;
var foreground, foregroundDepth;
var mainground, maingroundDepth;

function playerMovement()
{
	if(gameEngine.ArrowUp || gameEngine.WPressed)
	{
		player.position.y -= player.velocity * gameEngine.DT;
	}
	if(gameEngine.ArrowDown || gameEngine.SPressed)
	{
		player.position.y += player.velocity * gameEngine.DT;
	}
	if ( gameEngine.ArrowLeft || gameEngine.APressed )
	{
		player.position.x -= player.velocity * gameEngine.DT;
	}
	if ( gameEngine.ArrowRight || gameEngine.DPressed )
	{
		player.position.x += player.velocity * gameEngine.DT;
	}

	player.sprite.x = player.position.x - camera.x;
	player.sprite.y = player.position.y - camera.y;
}

function enemyMovement()
{
	for(i= 0; i < enemies.length; i++)
	{
		enemies[i].position.add( enemies[i].position.subtract( player.position ).normalize().multiply( enemies[i].velocity ) );
		enemies[i].sprite.x = enemies[i].position.x - camera.x;
		enemies[i].sprite.y = enemies[i].position.y - camera.y;
	}
}

function level1Init()
{

}

function level1Delete()
{

}

function level1Update()
{

}

function level2Init()
{

}

function level2Delete()
{

}

function level2Update()
{

}

function level3Init()
{

}

function level3Delete()
{

}

function level3Update()
{

}

function level4Init()
{

}

function level4Delete()
{

}

function level4Update()
{

}

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
function andrewMain()
{
	titleQueue = new Array();
	titleQueue.push(new createjs.LoadQueue( true, "assets/" ));
	titleQueue[0].on( "complete", titleLoaded, this );
	titleQueue[0].loadManifest( titleManifest );
	gameEngine.updateModeLooperArray.set( "title", new gameEngine.updateModeLooper( titleInit, titleDelete, titleUpdate, titleQueue ) );

	instructionsQueue = new Array();
	instructionsQueue.push(new createjs.LoadQueue( true, "assets/" ));
	instructionsQueue[0].on( "complete", instructionsLoaded, this );
	instructionsQueue[0].loadManifest( instructionsManifest );
	gameEngine.updateModeLooperArray.set( "instructions", new gameEngine.updateModeLooper( instructionsInit, instructionsDelete, instructionsUpdate, instructionsQueue ) );

	creditsQueue = new Array();
	creditsQueue.push(new createjs.LoadQueue( true, "assets/" ));
	creditsQueue[0].on( "complete", creditsLoaded, this );
	creditsQueue[0].loadManifest( creditsManifest );
	gameEngine.updateModeLooperArray.set( "credits", new gameEngine.updateModeLooper( creditsInit, creditsDelete, creditsUpdate, creditsQueue ) );

	gameoverQueue = new Array();
	gameoverQueue.push(new createjs.LoadQueue( true, "assets/" ));
	gameoverQueue[0].on( "complete", gameoverLoaded, this );
	gameoverQueue[0].loadManifest( gameoverManifest );
	gameEngine.updateModeLooperArray.set( "gameover", new gameEngine.updateModeLooper( gameoverInit, gameoverDelete, gameoverUpdate, gameoverQueue ) );

	characterSelectQueue = new Array();
	characterSelectQueue.push(new createjs.LoadQueue( true, "assets/" ));
	characterSelectQueue[0].on( "complete", characterSelectLoaded, this );
	characterSelectQueue[0].loadManifest( characterSelectManifest );
	gameEngine.updateModeLooperArray.set( "characterSelect", new gameEngine.updateModeLooper( characterSelectInit, characterSelectDelete, characterSelectUpdate, characterSelectQueue ) );

	mainGameQueue = new createjs.LoadQueue( true, "assets/" );
	mainGameQueue.on( "complete", characterSelectLoaded, this );
	mainGameQueue.loadManifest( mainGameManifest );

	Level1Queue = new Array();
	Level1Queue.push( new createjs.LoadQueue( true, "assets/" ) );
	Level1Queue[0].on( "complete", level1Loaded );
	Level1Queue[0].loadManifest( Level1Manifest );
	Level1Queue.push( mainGameQueue );
	gameEngine.updateModeLooperArray.set( "level1", new gameEngine.updateModeLooper( level1Init, level1Delete, level1Update, Level1Queue ) );

	Level2Queue = new Array();
	Level2Queue.push( new createjs.LoadQueue( true, "assets/" ) );
	Level2Queue[0].on( "complete", level2Loaded );
	Level2Queue[0].loadManifest( Level2Manifest );
	Level2Queue.push( mainGameQueue );
	gameEngine.updateModeLooperArray.set( "level2", new gameEngine.updateModeLooper( level2Init, level2Delete, level2Update, Level2Queue ) );

	Level3Queue = new Array();
	Level3Queue.push( new createjs.LoadQueue( true, "assets/" ) );
	Level3Queue[0].on( "complete", level3Loaded );
	Level3Queue[0].loadManifest( Level3Manifest );
	Level3Queue.push( mainGameQueue );
	gameEngine.updateModeLooperArray.set( "level3", new gameEngine.updateModeLooper( level3Init, level3Delete, level3Update, Level3Queue ) );

	Level4Queue = new Array();
	Level4Queue.push( new createjs.LoadQueue( true, "assets/" ) );
	Level4Queue[0].on( "complete", level4Loaded );
	Level4Queue[0].loadManifest( Level4Manifest );
	Level4Queue.push( mainGameQueue );
	gameEngine.updateModeLooperArray.set( "level4", new gameEngine.updateModeLooper( level4Init, level4Delete, level4Update, Level4Queue ) );

	Level5Queue = new Array();
	Level5Queue.push( new createjs.LoadQueue( true, "assets/" ) );
	Level5Queue[0].on( "complete", level5Loaded );
	Level5Queue[0].loadManifest( Level5Manifest );
	Level5Queue.push( mainGameQueue );
	gameEngine.updateModeLooperArray.set( "level1", new gameEngine.updateModeLooper( level5Init, level5Delete, level5Update, Level5Queue ) );
}