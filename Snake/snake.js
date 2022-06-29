const x = document.querySelector("#playground");
const gameover = document.querySelector("#gameover");
const startagain = document.querySelector("#startagain");
const score = document.querySelector("#score");
score.innerHTML = 0;

const playground = x.getContext("2d");
let direction;

//background
playground.fillStyle = "rgb(250, 215, 143)";
playground.fillRect(0, 0, 510, 510);

//initial snake
const snake = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 20, y: 0 },
  { x: 30, y: 0 },
  { x: 40, y: 0 },
  { x: 50, y: 0 },
];
for (let i = 0; i < snake.length; i++) {
  playground.fillStyle = "darkgreen";
  playground.fillRect(snake[i].x, snake[i].y, 10, 10);
}

//initial apple
let appleX = 100;
let appleY = 100;
playground.fillStyle = "red";
playground.fillRect(appleX, appleY, 10, 10);

function clearOldSnake() {
  playground.fillStyle = "rgb(250, 215, 143)";
  playground.fillRect(snake[0].x, snake[0].y, 10, 10);
  setTimeout(function () {
    clearOldSnake();
  }, 60);
}

function changeDirection() {
  switch (direction) {
    case "Right":
      snake.shift();
      snake.push({
        x: snake[snake.length - 1].x + 10,
        y: snake[snake.length - 1].y,
      });
      break;

    case "Left":
      snake.shift();
      snake.push({
        x: snake[snake.length - 1].x - 10,
        y: snake[snake.length - 1].y,
      });
      break;

    case "Up":
      snake.shift();
      snake.push({
        x: snake[snake.length - 1].x,
        y: snake[snake.length - 1].y - 10,
      });
      break;

    case "Down":
      snake.shift();
      snake.push({
        x: snake[snake.length - 1].x,
        y: snake[snake.length - 1].y + 10,
      });
  }
  setTimeout(function () {
    changeDirection();
  }, 60);
}

function newSnake() {
  playground.fillStyle = "darkgreen";
  playground.fillRect(
    snake[snake.length - 1].x,
    snake[snake.length - 1].y,
    10,
    10
  );
  // console.log(snake);
  setTimeout(function () {
    newSnake();
  }, 60);

  appleEaten();
  gameOverOutOfPlayground();
  gameOverHitSelf();
}

//appleCoordinates.length = 51, with all the usable coordinates
const appleCoordinates = [
  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170,
  180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320,
  330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470,
  480, 490, 500,
];

function appleEaten() {
  if (
    snake[snake.length - 1].x === appleX &&
    snake[snake.length - 1].y === appleY
  ) {
    changeApplePosition();
    addSnake();
    addScore();
  }
}

function changeApplePosition() {
  appleX = appleCoordinates[Math.floor(Math.random() * 51)];
  appleY = appleCoordinates[Math.floor(Math.random() * 51)];

  //check if apple coordinates === any of snake coordinates
  //if true, run this function again to check again
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === appleX && snake[i].y === appleY) {
      changeApplePosition();
      console.log("ATTENTION!!!!!!");
    }
  }

  playground.fillStyle = "red";
  playground.fillRect(appleX, appleY, 10, 10);
}

function addSnake() {
  if (snake[0].x < snake[1].x && snake[0].y === snake[1].y) {
    snake.unshift(
      { x: snake[0].x - 10, y: snake[0].y },
      { x: snake[1].x - 10, y: snake[1].y }
    );
  } else if (snake[0].x > snake[1].x && snake[0].y === snake[1].y) {
    snake.unshift(
      { x: snake[0].x + 10, y: snake[0].y },
      { x: snake[1].x + 10, y: snake[1].y }
    );
  } else if (snake[0].x === snake[1].x && snake[0].y < snake[1].y) {
    snake.unshift(
      { x: snake[0].x, y: snake[0].y - 10 },
      { x: snake[1].x, y: snake[1].y - 10 }
    );
  } else if (snake[0].x === snake[1].x && snake[0].y > snake[1].y) {
    snake.unshift(
      { x: snake[0].x, y: snake[0].y + 10 },
      { x: snake[1].x, y: snake[1].y + 10 }
    );
  }
}

function addScore() {
  score.innerHTML++;
}

//snake goes out of playgorund
function gameOverOutOfPlayground() {
  if (
    snake[snake.length - 1].x < 0 ||
    snake[snake.length - 1].x > 500 ||
    snake[snake.length - 1].y < 0 ||
    snake[snake.length - 1].y > 500
  ) {
    gameover.style.display = "block";
  }
}

//snake hits itself
function gameOverHitSelf() {
  for (let i = 0; i < snake.length - 1; i++) {
    if (
      snake[i].x === snake[snake.length - 1].x &&
      snake[i].y === snake[snake.length - 1].y
    ) {
      gameover.style.display = "block";
    }
  }
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "Down") {
        direction = "Up";
        console.log(direction);
      }
      break;

    case "ArrowDown":
      if (direction !== "Up") {
        direction = "Down";
        console.log(direction);
      }
      break;

    case "ArrowRight":
      if (direction !== "Left") {
        direction = "Right";
        console.log(direction);
      }
      break;

    case "ArrowLeft":
      if (direction !== "Right") {
        direction = "Left";
        console.log(direction);
      }
      break;
    case "Enter":
      if (gameover.style.display === "block") {
        location.reload();
      }
  }
});

startagain.addEventListener("click", () => {
  location.reload();
});

clearOldSnake();
changeDirection();
newSnake();
