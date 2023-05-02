console.log("Linked");
var canvas = document.getElementById("canvas");
console.log(canvas);
canvas.style.position = "fixed";

//canvas to window size
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var velocity = 0;
var gravity = 0.1;
const drawer = canvas.getContext("2d"); //getting drawing context

var box = {
  top: 0,
  left: 25,
  width: 25,
  height: 25,
};

const pipeVerticalGap = 200;
const pipeWidth = 45;

var pipes = [];
var score = 0; // Added score variable to keep track of pipes crossed

setInterval(function () {
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

  //drawing pipes
  for (var i = 0; i < pipes.length; i++) {
    drawBox(pipes[i].topPipe, "red");
    drawBox(pipes[i].bottomPipe, "red");
    pipes[i].topPipe.left -= 2; // Decreased pipe speed to 2 pixels per frame
    pipes[i].bottomPipe.left -= 2; // Decreased pipe speed to 2 pixels per frame

    // Remove pipes that have gone off screen
    if (pipes[i].topPipe.left < -pipeWidth) {
      pipes.splice(i, 1);
      i--;
    }

    // Check for collision with the box
    if (
      box.left + box.width > pipes[i].topPipe.left &&
      box.left < pipes[i].topPipe.left + pipeWidth &&
      (box.top < pipes[i].topPipe.height ||
        box.top + box.height > pipes[i].bottomPipe.top)
    ) {
      endGame();
      location.reload(); // Reload the game
    }

    // Check if box has passed a pipe
    if (box.left > pipes[i].topPipe.left + pipeWidth && !pipes[i].crossed) {
      pipes[i].crossed = true;
      score++;
      console.log(score);
    }
  }

  //drawing box
  drawBox(box, "purple");

  // Display score
  drawer.font = "30px Arial";
  drawer.fillStyle = "white"; // Changed score color to black
  drawer.fillText(`Score: ${score}`, 50, 50);
}, 10);

window.addEventListener("keydown", function (e) {
  if (e.key == "ArrowUp") {
    velocity = velocity - 7;
  } else if (e.key == "ArrowLeft") {
    if (box.left > 0) {
      box.left = box.left - 50;
    }
  } else if (e.key == "ArrowRight") {
    if (box.left < canvas.width - box.width) {
      box.left = box.left + 50;
    }
  } else if (e.key == "ArrowDown") {
    if (box.left < canvas.width - box.width) {
      box.left = box.left + 50;
    }
  }
});

function drawBox(box, color) {
  drawer.fillStyle = color;
  drawer.fillRect(box.left, box.top, box.width, box.height);
}

function generatePipes() {
  var gapPosition = Math.floor(
    Math.random() * (canvas.height - pipeVerticalGap)
  );
  var topPipe = {
    top: 0,
    left: canvas.width,
    width: pipeWidth,
    height: gapPosition,
  };
  var bottomPipe = {
    top: gapPosition + pipeVerticalGap,
    left: canvas.width,
    width: pipeWidth,
    height: canvas.height - gapPosition - pipeVerticalGap,
  };
  pipes.push({ topPipe: topPipe, bottomPipe: bottomPipe, crossed: false });
}

setInterval(generatePipes, 3000);

function endGame() {
  console.log("Game Over!");
}
