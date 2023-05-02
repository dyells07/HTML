console.log("Linked");
var canvas = document.getElementById("canvas");
console.log(canvas);
canvas.style.position = "fixed";

//canvas to window size
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var hasCollided = false;
var pipeVelocity = 1.8;
var velocity = 0;
var gravity = 0.1;

const drawer = canvas.getContext("2d"); //getting drawing context

var box = {
  top: canvas.height / 2,
  left: 150,
  width: 70,
  height: 70,
};

var score = 0;

const pipeVerticalGap = 300;
const pipeHorizontalGap = 350;
const pipeWidth = 45;

var pipes = [];

//adding four pipes to array
for (var i = 0; i < 7; i++) {
  pipes.push(giveMePipe());
}

// var pipe = {
//     topPipe: {
//         top: 0,
//         left: 250,
//         width: pipeWidth,
//         height: 100
//     },
//     bottomPipe: {
//         top: 100 +pipeVerticalGap,
//         left: 300,
//         width: pipeWidth,
//         height: canvas.height - 100 - pipeVerticalGap,
//     }
// };

// var x=0;
// var y=0;
setInterval(function () {
  if (hasCollided) {
    drawer.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    setTimeout(function () {
      window.location.reload();
    }, 3000);
    return;
  }

  drawer.clearRect(0, 0, canvas.width, canvas.height); //erasing all canvas
  velocity = velocity + gravity;
  box.top = box.top + velocity;

  //Box wont go up
  if (box.top < 0) {
    box.top = 0;
    velocity = 0;
  }

  //Box wont go down
  if (box.top > canvas.height - box.height) {
    box.top = canvas.height - box.height;
    velocity = 0;
  }

  for (var i = 0; i < pipes.length; i++) {
    var pipe = pipes[i];

    //moving pipes left
    pipe.bottomPipe.left = pipe.topPipe.left -= pipeVelocity;
    // pipe.bottomPipe.left -= pipeVelocity

    //drawing pipe
    drawBox(pipe.topPipe, "green");
    drawBox(pipe.bottomPipe, "green");
    if (pipe.topPipe.left < 0) {
      //remove first pipe from array
      pipes.shift();

      //add new pipe to the last of array
      pipes.push(giveMePipe());
      if (!hasCollided) {
        score++;
      }
    }
    checkCollision(pipe.topPipe, box);
    checkCollision(pipe.bottomPipe, box);
    //console.log(pipes)
  }

  //drawing box
  drawBox(box, hasCollided ? "red" : "purple");

  //drawing score
  drawer.fillStyle = "blue";
  drawer.font = "30px Arial";
  drawer.fillText("Score is: " + score, 50, 100);

  // if(x < canvas.width - 100){
  //     x = x + 1 ;
  // }
  // if(y < canvas.height - 100){
  //     y = y + 1 ;
  // }

  // // drawer.fillStyle = "purple" //giving fill color
  // drawer.fillRect(x, 0, 100, 100)
  //drawer.fillStyle = "purple" //giving fill color
  // //drawer.fillRect(box.left, box.top, box.width, box.height)
}, 10);

window.addEventListener("keydown", function (e) {
  if (e.key == "ArrowUp") {
    velocity = velocity - 7;
  }
  if (e.key == " ") {
    velocity = velocity - 7;
  }
});

function drawBox(box, color) {
  drawer.fillStyle = color;
  drawer.fillRect(box.left, box.top, box.width, box.height);
}

function giveMePipe() {
  var topPipeHeight = giveMeRandomHeight(20, canvas.height - pipeVerticalGap);
  var leftOffset = 1010;
  //if pipes array are empty
  if (pipes.length == 0) {
    //leftOffset = canvas.width - pipeHorizontalGap;
  } else {
    var lastPipe = pipes[pipes.length - 1];
    leftOffset = lastPipe.topPipe.left + pipeHorizontalGap;
  }

  return {
    topPipe: {
      top: 0,
      left: leftOffset,
      width: pipeWidth,
      height: topPipeHeight,
    },
    bottomPipe: {
      top: topPipeHeight + pipeVerticalGap,
      left: leftOffset,
      width: pipeWidth,
      height: canvas.height - topPipeHeight - pipeVerticalGap,
    },
  };
}

function giveMeRandomHeight(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkCollision(box1, box2) {
  if (
    box1.left < box2.left + box2.width &&
    box1.left + box1.width > box2.left &&
    box1.top < box2.top + box2.height &&
    box1.height + box1.top > box2.top
  ) {
    hasCollided = true;
    // window.location.reload();
  }
}
