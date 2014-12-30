/***************************************************************************************************
 A super-basic breakout-style game in javascript / HTML5
 The first program I wrote (typed) was a breakout game from a manual
 for a Timex Sinclair 1000, this kinda brings me back. This program
 is much shorter as the one for the Sinclair was in BASIC.
 Nothing fancy, just an excercise. I started from 
 a demo of a bouncing ball [http://cssdeck.com/labs/lets-make-a-bouncing-ball-in-html5-canvas]
 and decided to make a basic breakout.
 Just a fun project I like to work on when I'm burned out from work.
 TODO:
     Pad needs to be an object.
     Blocks needs to be an object.
     Speed needs to increment on level or bounce (haven't decided)
     When you get rid of all the blocks nothing happens, need
         to add levels
     Ball doesn't contact block until the center of the block touches
         the block. Need to make the radius affect block collisions
     Add levels of different sized/colors blocks
     Maybe add a score or something
*****************************************************************************************************/
 
document.onkeydown = function(e)
{
    switch (e.keyCode)
    {
        case 37:
            padX -= 8;
            if (padX < 0)
            {
                padX = 0;
            }
            break;
        case 39:
            padX += 8;
            if (padX > (W - currPadWidth))
            {
                padX = (W - currPadWidth);
            }
            break;
    }
}


var blockArray = [];
var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
var W = 720, H = 480;
var blockRows = 6;
var blockCols = 6;
var blockWidth = 120;
var blockHeight = 16;
canvas.height = H;
canvas.width = W;
currPadWidth = 96;
padX = 480;
var speedLimit = 2.5;
var bounceFactor = 1;
var ball = {};
var lives = 4;

/*
The Ball Object
*/

ball = {
    x: 0,
    y: 0,
    radius: 6,
    color: "green",
    vx: 1,
    vy: 1,
    draw: function ()
          {
              grad = ctx.createLinearGradient(0,0,0,8);
              grad.addColorStop(0,"green");
              grad.addColorStop(1,"darkgreen");
              ctx.beginPath();
              ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
              ctx.fillStyle = this.color;
              ctx.fill();
              ctx.closePath();
          },
   move: function ()
         {
             this.y += this.vy;
             this.x += this.vx;
         },
  changeXDirection: function ()
                    {
                        this.vx *= -1;
                    },
  changeYDirection: function ()
                    {
                        this.vy *= -1;
                    },     
  randomizeStart: function ()
                    {
                        this.x = Math.floor((Math.random() * W) + ball.radius);
                        this.y = Math.floor((Math.random() * H) + ball.radius);
                    }
};



/* Utility functions for managing the blocks */

function buildBlockArray()
{
   for (n = 0; n < blockCols; n++)
   {
       blockArray[n] = [];
       for (i = 0; i < blockRows; i++)
       {
           blockArray[n][i] = 1;
       }
   }
}

function drawBlocks()
{
   for (n = 0; n < blockCols; n++)
   {
       for (i = 0; i < blockRows; i++)
       {
           ctx.beginPath();
           ctx.rect((i * blockWidth),(n * blockHeight),blockWidth,blockHeight);
           ctx.lineWidth = 2;
           barGrad = ctx.createLinearGradient((i * blockWidth),(n * blockHeight),
                                              (i * blockWidth) + blockWidth,(i * blockHeight) + blockHeight);
           ctx.strokeStyle = 'black';
           barGrad.addColorStop(0,'#990000');
           barGrad.addColorStop(0.5,'#EF0000');
           barGrad.addColorStop(1,'#990000');
           if (blockArray[n][i] == 1)
           {
               ctx.fillStyle = barGrad;
               ctx.fill();
               ctx.stroke();
           }
       }
   }
   return;
}

/* Player pad utility function */
function drawPlayerPad()
{
    ctx.beginPath();
    ctx.rect(padX,420,currPadWidth,8);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'green';
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
}

function clearCanvas()
{
    ctx.clearRect(0,0,W,H);
}


function isSpeedInRange(speedValue)
{
   var rValue = 1;
   if (speedValue <= (maxBounceFactor * -1))
   {
      rValue = 0;
   }
   if (speedValue >= maxBounceFactor)
   {
       rValue = 0;
   }
   return(rValue);
}
 
/*
This needs to be a member of the ball class (object) whatever..
*/

function incrementBounceFactor()
{
    bounceFactor *= 1.00125;
}

function resetBlock()
{
    arrXCoord = Math.floor(ball.x / 120);
    arrYCoord = Math.floor(ball.y / 16);
    if ((arrXCoord < blockRows) && (arrYCoord < blockCols))
    {
        blockArray[arrYCoord][arrXCoord] = 0;
    }
}

function isBallAtBlock()
{
    var retValue = 0;
    arrXCoord = Math.floor((ball.x) / 120);
    arrYCoord = Math.floor((ball.y) / 16);
    if ((arrXCoord < blockRows) && (arrYCoord < blockCols))
    {
        retValue = blockArray[arrYCoord][arrXCoord];
        resetBlock();
    }
    return retValue;
}

function isBallAtPad()
{
    retValue = 0;
    if (Math.floor(ball.y + ball.radius) == 420)
    {
        if ((Math.floor(ball.x + ball.radius) >= padX) && (Math.floor(ball.x + ball.radius) <= (padX + currPadWidth)))
        {
            retValue = 1;
        }
    }
    return retValue;
}


/**
Update function, this is the main game loop
**/
function update()
{
   clearCanvas();
   ball.draw();
   drawBlocks();
   drawPlayerPad();
   //move the ball
   ball.move();
   //bottomCollision
   if ((ball.y + ball.radius >= H) || isBallAtBlock() || isBallAtPad())
   {
       ball.changeYDirection();
       incrementBounceFactor();
       if (ball.y + ball.radius >= H)
       {
           lives--;
           ball.randomizeStart();
       }
   } else
   //Right Collision
   if ((ball.x + ball.radius >= W) || isBallAtBlock())
   {
       ball.changeXDirection();
       incrementBounceFactor();
   } else
   //Left Collision
   if ((ball.x - ball.radius <= 0) || isBallAtBlock())
   {
       ball.changeXDirection();
       incrementBounceFactor();
   } else
   //Top Collision
   if ((ball.y - ball.radius <= 0) || isBallAtBlock())
   {
       ball.changeYDirection();
       incrementBounceFactor();
   }
   //document.getElementById('debugLivesLeft').innerHTML = lives;
   /* If you're out of lives, end the loop and display a message */
   if (lives == 0)
   {
       clearInterval(loopIntervalHndl);
       clearCanvas();
       ctx.fillStyle = "blue";
       ctx.font = "bold 24px Arial";
       ctx.fillText("G A M E     O V E R",256,256);
   }
}

buildBlockArray();
ball.randomizeStart();
var loopIntervalHndl = setInterval(update,1000/60);
