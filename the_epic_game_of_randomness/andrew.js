//#region title
var titleManifest =
[
	{ src: "images/title.jpg", id: "title" },
	{ src: "images/playButton.png", id: "playButton" },
];
var titleQueue;
var titleScreen, playButton;
function titleLoaded()
{
	titleScreen = new createjs.Bitmap( titleQueue[0].getResult( "title" ) );
	playButton = new createjs.Bitmap( titleQueue[0].getResult( "playButton" ) );
	playButton.on( "click", function ( evt ) { gameEngine.mode = "characterSelect"; } );
	playButton.regX = playButton.getBounds().width / 2;
	playButton.regY = playButton.getBounds().height / 2;
	playButton.x = gameEngine.CANVASWIDTH / 2;
	playButton.y = gameEngine.CANVASHEIGHT / 2;
}

function titleInit()
{
	gameEngine.stage.addChild( titleScreen );
	gameEngine.stage.addChild( playButton );
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


//#region mainGame
var mainGameManifest =
	[
		{ src: "images/jamieChara.png", id: "jamieChara" }
	];
var mainGameQueue, jamieChara;

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
		{ src: "images/enemy.png", id: "enemy" }
	];
var Level4Queue, level4Enemy;

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
					regY: 146 / 2,
					width: 92,
					height: 146
				},
			animations:
				{
					NeutralFront: [0, 0, "NeutralFront"],
					Run: [1, 4, "RunLoop"],
					RunLoop: [5, 24, "RunLoop"]
				}
		}
	);

	jamieChara = new createjs.Sprite( jamieCharaSheet, "NeutralFront" );
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
				[[0, 0, 173, 134, 0, 109, 83], [0, 0, 173, 134, 0, 109, 83], [178, 0, 183, 144, 0, 114, 87], [0, 149, 195, 155, 0, 120, 93], [200, 149, 205, 166, 0, 125, 98], [0, 320, 217, 178, 0, 131, 104], [222, 320, 228, 189, 0, 137, 109], [0, 514, 240, 199, 0, 143, 114], [245, 514, 250, 211, 0, 148, 120], [0, 730, 265, 224, 0, 155, 127]],
			animations:
				{
					Neutral: [0, 0],
					Die: [1, 9, false]
				}
		}
		);
	level4Enemy = new createjs.Sprite( enemySheet, "Neutral" );
	level4Enemy.on( "animationend", function ( evt ) { if ( evt.name == "Die" ) evt.target.visible = false; } );
}

function level5Loaded()
{

}

function vec2(x, y)
{
	this.x = x;
	this.y = y;
	this.normalize = function()
	{
		var magnitude = Math.sqrt(( this.x * this.x ) + ( this.y * this.y ) );
		if ( magnitude === 0 )
		{
			return new vec2( 0, 0 );
		}
		else return new vec2( this.x / magnitude, this.y / magnitude );
	}
	this.add = function(addWith)
	{
		return new vec2( addWith.x + this.x, addWith.y + this.y );
	}
	this.subtract = function(subtractWith)
	{
		return new vec2( this.x - subtractWith.x, this.y - subtractWith.y );
	}
	this.multiply = function(multiplyWith)
	{
		return new vec2( this.x * multiplyWith, this.y * multiplyWith );
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
var spriteArray;
function playerMovement()
{
	var posToAdd = new vec2( 0, 0 );
	if(gameEngine.ArrowUp || gameEngine.WPressed)
	{
		posToAdd = posToAdd.subtract( new vec2( 0, player.velocity * gameEngine.DT ) );
	//	player.position.y -= player.velocity * gameEngine.DT;
	}
	if(gameEngine.ArrowDown || gameEngine.SPressed)
	{
		posToAdd = posToAdd.add( new vec2( 0, player.velocity * gameEngine.DT )  );
		//player.position.y += player.velocity * gameEngine.DT;
	}
	if ( gameEngine.ArrowLeft || gameEngine.APressed )
	{
		posToAdd = posToAdd.subtract( new vec2( player.velocity * gameEngine.DT, 0 )  );
		//player.position.x -= player.velocity * gameEngine.DT;
	}
	if ( gameEngine.ArrowRight || gameEngine.DPressed )
	{
		//player.position.x += player.velocity * gameEngine.DT;
		posToAdd = posToAdd.add( new vec2( player.velocity * gameEngine.DT, 0 )  );
	}
	player.position =  player.position.add( posToAdd );
	player.sprite.x = player.position.x - camera.x;
	player.sprite.y = player.position.y - camera.y;
}

function enemyMovement()
{
	for(i = 0; i < enemies.length; i++)
	{
		enemies[i].position = enemies[i].position.add( player.position.subtract( enemies[i].position ).normalize().multiply( enemies[i].velocity ) );
	}
}

function cameraFollowPlayer()
{
	if(player.sprite.x < gameEngine.CANVASWIDTH * 0.1)
	{
		camera.x += player.sprite.x - (gameEngine.CANVASWIDTH * 0.1)
	}
	if ( player.sprite.x > gameEngine.CANVASWIDTH * 0.9 )
	{
		camera.x += player.sprite.x - ( gameEngine.CANVASWIDTH * 0.9 )
	}
	if ( player.sprite.y < gameEngine.CANVASHEIGHT * 0.1 )
	{
		camera.y += player.sprite.y - ( gameEngine.CANVASHEIGHT * 0.1 )
	}
	if ( player.sprite.y > gameEngine.CANVASHEIGHT * 0.9 )
	{
		camera.y += player.sprite.y - ( gameEngine.CANVASHEIGHT * 0.9 )
	}
}

function moveableObjectsUpdate(theSprites)
{
	for(i = 0; i < theSprites.length; i++)
	{
		if ( theSprites[i].sprite.visible )
		{
			theSprites[i].sprite.x = theSprites[i].position.x - camera.x;
			theSprites[i].sprite.y = theSprites[i].position.y - camera.y;
		}
	}
}

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
	spriteArray = new Array();
	player = new moveableObject( jamieChara.clone(), new vec2( 10, 100 ), 300 );
	spriteArray.push( player );
	gameEngine.stage.addChild( player.sprite );
	enemies = new Array();
	for(i = 0; i < 5; i++)
	{
		enemies.push( new moveableObject( level4Enemy.clone(), new vec2( gameEngine.CANVASWIDTH + ( 100 * Math.random() ), gameEngine.CANVASHEIGHT * Math.random() ), Math.random() * 10 ) );
		spriteArray.push( enemies[i] );
		gameEngine.stage.addChild( enemies[i].sprite );
	}
}

function level4Delete()
{
	gameEngine.stage.removeAllChildren();
}

function level4Update()
{
	playerMovement();
	enemyMovement();
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
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
	titleQueue.push(new createjs.LoadQueue( true, "assets/" ));
	titleQueue[0].on( "complete", titleLoaded, this );
	titleQueue[0].loadManifest( titleManifest );
	gameEngine.addModeLooper( "title", new gameEngine.updateModeLooper( titleInit, titleDelete, titleUpdate, titleQueue ) );

	instructionsQueue = new Array();
	instructionsQueue.push(new createjs.LoadQueue( true, "assets/" ));
	instructionsQueue[0].on( "complete", instructionsLoaded, this );
	instructionsQueue[0].loadManifest( instructionsManifest );
	gameEngine.addModeLooper( "instructions", new gameEngine.updateModeLooper( instructionsInit, instructionsDelete, instructionsUpdate, instructionsQueue ) );

	creditsQueue = new Array();
	creditsQueue.push(new createjs.LoadQueue( true, "assets/" ));
	creditsQueue[0].on( "complete", creditsLoaded, this );
	creditsQueue[0].loadManifest( creditsManifest );
	gameEngine.addModeLooper( "credits", new gameEngine.updateModeLooper( creditsInit, creditsDelete, creditsUpdate, creditsQueue ) );

	gameoverQueue = new Array();
	gameoverQueue.push(new createjs.LoadQueue( true, "assets/" ));
	gameoverQueue[0].on( "complete", gameoverLoaded, this );
	gameoverQueue[0].loadManifest( gameoverManifest );
	gameEngine.addModeLooper( "gameover", new gameEngine.updateModeLooper( gameoverInit, gameoverDelete, gameoverUpdate, gameoverQueue ) );

	characterSelectQueue = new Array();
	characterSelectQueue.push(new createjs.LoadQueue( true, "assets/" ));
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
	gameEngine.addModeLooper( "level1", new gameEngine.updateModeLooper( level5Init, level5Delete, level5Update, Level5Queue ) );
}