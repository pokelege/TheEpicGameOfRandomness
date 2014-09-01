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
		{ src: "images/pixel.png", id: "pixel" }
	];
var mainGameQueue, jamieChara, pixel, healthBar, powerStar;

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
	level4Boss = new createjs.Sprite( enemySheet2, "Neutral" );
	level4Boss.scaleX = 1.5;
	level4Boss.scaleY = -1.5;
	level4Boss.on( "animationend", function ( evt ) { if ( evt.name == "Die" ) evt.target.visible = false; } );

	level4Building = new createjs.Bitmap( Level4Queue[0].getResult( "level4Building" ) );
	level4BackGround = new createjs.Bitmap( Level4Queue[0].getResult( "level4BackGround" ) );
	level4Train = new createjs.Bitmap( Level4Queue[0].getResult( "level4Train" ) );
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
	this.length = function()
	{
		return Math.sqrt(( this.x * this.x ) + ( this.y * this.y ) );
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
	this.equals = function(equalWith)
	{
		return (x === equalWith.x && y === equalWith.y);
	}
}

var camera;
function moveableObject(sprite, initialPosition, velocity)
{
	this.sprite = sprite;
	this.position = initialPosition;
	this.velocity = velocity;
	this.airDistance = 0;

	this.sprite.x = this.position.x;
	this.sprite.y = this.position.y;
}

function shortRangeAttack(x, y, width, height)
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

	this.collideSprite = function(theSpriteFrom, theSpriteTo)
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

function moveableAttacker(moveable, attacker)
{
	this.moveable = moveable;
	this.attacker = attacker;
}

function cage(top, bottom, left, right)
{
	this.top = top;
	this.bottom = bottom;
	this.left = left;
	this.right = right;

	this.contain = function(moveable)
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
	this.containCamera = function(camera)
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

function moveableBackdrop(sprite, depth, initialPosition, velocity, seperation, loopVertical, loopHorizonatal)
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


	if(seperation)
	{
		if(loopHorizonatal)
		{
			var currentX = initialPosition.x;
			var currentY = initialPosition.y;
			currentX -= seperation.x;
			currentY -= seperation.y;
			while(currentX >= -gameEngine.CANVASWIDTH)
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
		if (loopVertical)
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

	this.move = function(deltaPos)
	{
		for( var i = 0; i < this.array.length;i++)
		{
			this.array[i].x += (deltaPos.x * depth) + (depth * velocity.x * gameEngine.DT);
			this.array[i].y += (deltaPos.y * depth) + (depth * velocity.y * gameEngine.DT);
			if(this.loopHorizontal)
			{
				if(this.array[i].x > gameEngine.CANVASWIDTH * 2)
				{
					this.array[i].x -= gameEngine.CANVASWIDTH * 3;
				}
				else if(this.array[i].x < -gameEngine.CANVASWIDTH)
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

var player;
var playerHealthBar;
var enemies;
var powerStars;
var boss;
var bossHealthBar;
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
	if(gameEngine.ArrowUp || gameEngine.WPressed)
	{
		posToAdd = posToAdd.subtract( new vec2( 0, player.moveable.velocity * gameEngine.DT ) );
	//	player.position.y -= player.velocity * gameEngine.DT;
	}
	if(gameEngine.ArrowDown || gameEngine.SPressed)
	{
		posToAdd = posToAdd.add( new vec2( 0, player.moveable.velocity * gameEngine.DT )  );
		//player.position.y += player.velocity * gameEngine.DT;
	}
	if ( gameEngine.ArrowLeft || gameEngine.APressed )
	{
		posToAdd = posToAdd.subtract( new vec2( player.moveable.velocity * gameEngine.DT, 0 )  );
		//player.position.x -= player.velocity * gameEngine.DT;
	}
	if ( gameEngine.ArrowRight || gameEngine.DPressed )
	{
		//player.position.x += player.velocity * gameEngine.DT;
		posToAdd = posToAdd.add( new vec2( player.moveable.velocity * gameEngine.DT, 0 )  );
	}

	if ( jumpable )
	{
		if(gameEngine.SpacePressed && player.moveable.airDistance >= MAXJUMPHEIGHT)
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
		if(player.moveable.airDistance < 0)
		{
			player.moveable.airDistance += 10;
		}
		if(player.moveable.airDistance >= 0)
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
			if(player.moveable.sprite.scaleX < 0)
			{
				player.moveable.sprite.scaleX *= -1;
			}
			if(player.attacker.x < 0 || player.attacker.width < 0)
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
			player.moveable.sprite.gotoAndPlay("Run");
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
					enemies[i].moveable.sprite.gotoAndPlay( "Die" );
				}
			}
		}
	}
	else player.attacker.debugSprite.visible = false;

	for(var i = 0;i < powerStars.length;i++)
	{
		if(powerStars[i].sprite.visible)
		{
			if(ndgmr.checkRectCollision(player.moveable.sprite, powerStars[i].sprite))
			{
				powerStars[i].sprite.visible = false;
				invisibleTimeLeft = INVISIBLETIME;
			}
		}
	}

}

function enemyMovement()
{
	for(var i = 0; i < enemies.length; i++)
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

function cameraFollowPlayer()
{
	var oldCamera = new vec2( camera.x, camera.y );
	if(player.moveable.sprite.x < gameEngine.CANVASWIDTH * 0.25)
	{
		camera.x += player.moveable.sprite.x - (gameEngine.CANVASWIDTH * 0.25)
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

function moveableObjectsUpdate(theSprites)
{
	for( var i = 0; i < theSprites.length; i++)
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

	lastBossLife += ( bosslife - lastBossLife ) * lifeMoveSpeed;
	bossHealthBar.scaleX = lastBossLife / 50;
	if ( life < 25 && ( bossHealthBar.currentAnimation == "Good" || bossHealthBar.currentAnimation == "ToGood" ) )
	{
		bossHealthBar.gotoAndPlay( "ToBad" );
	}
	else if ( bosslife >= 25 && ( bossHealthBar.currentAnimation == "Bad" || bossHealthBar.currentAnimation == "ToBad" ) )
	{
		bossHealthBar.gotoAndPlay( "ToGood" );
	}
}

var invisibleTimeLeft;
var INVISIBLETIME = 5;

function invisibilityUpdate()
{
	if ( invisibleTimeLeft > 0 ) invisibleTimeLeft -= gameEngine.DT;
	if ( invisibleTimeLeft < 0 ) invisibleTimeLeft = 0;
	player.moveable.sprite.alpha = 1 - ( ( invisibleTimeLeft / INVISIBLETIME ) * 0.5 );
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
	backDrops = new Array();
	backDrops.push( new moveableBackdrop( level4BackGround, 1, new vec2( 0, 0 ), new vec2( -1000, 0 ), new vec2( level4BackGround.getBounds().width, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level4Building, 0.5, new vec2( 0, 0 ), new vec2( -1000, 0 ), new vec2( level4Building.getBounds().width, 0 ), false, true ) );
	backDrops.push( new moveableBackdrop( level4Train, 1, new vec2( 0, gameEngine.CANVASHEIGHT - level4Train.getBounds().height - 50 ), new vec2( 0, 0 ), new vec2( level4Train.getBounds().width, 0 ), false, true ) );
	for (var i = 0; i < backDrops.length; i++ )
	{
		for (var j = 0; j < backDrops[i].array.length; j++ )
		{
			gameEngine.stage.addChild( backDrops[i].array[j] );
		}
	}

	spriteArray = new Array();


	boss = new moveableAttacker( new moveableObject( level4Boss.clone(), new vec2( 9000, 0 ), new vec2( 0, 0 ) ), new shortRangeAttack( 0, 10, -100, 10 ) );
	spriteArray.push( boss.moveable );
	gameEngine.stage.addChild( boss.moveable.sprite );
	enemies = new Array();
	for( var i = 0; i < 100; i++)
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
	for ( var i = 0; i < 10; i++ )
	{
		powerStars.push( new moveableObject( powerStar.clone(), new vec2(( Math.random() * 7500 ) + gameEngine.CANVASWIDTH, 0 ) ) );
		spriteArray.push( powerStars[i] );
		stageBounds.contain( powerStars[i] );
		gameEngine.stage.addChild( powerStars[i].sprite );
	}

	jumpable = true;
	life = 100;
	lastLife = life;
	bosslife = 50;
	lastBossLife = bosslife;
	invisibleTimeLeft = 0;
	playerHealthBar = healthBar.clone();
	gameEngine.stage.addChild( playerHealthBar );
	bossHealthBar = healthBar.clone();
	gameEngine.stage.addChild( bossHealthBar );
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
	cameraFollowPlayer();
	moveableObjectsUpdate( spriteArray );
	updateLife();
	invisibilityUpdate();
	if ( life <= 0 ) gameEngine.mode = "gameover";
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
	gameEngine.addModeLooper( "level5", new gameEngine.updateModeLooper( level5Init, level5Delete, level5Update, Level5Queue ) );
}