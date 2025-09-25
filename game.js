const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");

canvas.width = 480;
canvas.height = 320;

let playerScore = 0;
let cpuScore = 0;
let gameOver = false;

const paddleHeight = 80;
const paddleWidth = 15;

let playerY = (canvas.height - paddleHeight) / 2;
let cpuY = (canvas.height - paddleHeight) / 2;
const playerX = 20;
const cpuX = canvas.width - paddleWidth - 20;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 4;
let ballSpeedY = 4;

const hitSound = new Audio("assets/hit.wav");
const scoreSound = new Audio("assets/score.wav");
const winSound = new Audio("assets/win.wav");

function drawTable() {
  ctx.fillStyle = "#006400";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
}

function drawPaddle(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = (Math.random() > 0.5 ? 4 : -4);
  ballSpeedY = (Math.random() > 0.5 ? 4 : -4);
}

function update() {
  if (gameOver) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Player collision
  if (
    ballX - ballRadius < playerX + paddleWidth &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    let hitPos = ballY - (playerY + paddleHeight / 2);
    ballSpeedY = hitPos * 0.25;
    hitSound.play();
  }

  // CPU collision
  if (
    ballX + ballRadius > cpuX &&
    ballY > cpuY &&
    ballY < cpuY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    let hitPos = ballY - (cpuY + paddleHeight / 2);
    ballSpeedY = hitPos * 0.25;
    hitSound.play();
  }

  // Score check
  if (ballX - ballRadius < 0) {
    cpuScore++;
    scoreSound.play();
    resetBall();
  } else if (ballX + ballRadius > canvas.width) {
    playerScore++;
    scoreSound.play();
    resetBall();
  }

  // CPU AI
  const cpuCenter = cpuY + paddleHeight / 2;
  if (cpuCenter < ballY - 10) {
    cpuY += 5;
  } else if (cpuCenter > ballY + 10) {
    cpuY -= 5;
  }

  // Touch control
  canvas.ontouchmove = function (e) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const y = touch.clientY - rect.top;
    playerY = y - paddleHeight / 2;
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height) playerY = canvas.height - paddleHeight;
  };

  // Win check
  if (playerScore >= 11 || cpuScore >= 11) {
    gameOver = true;
    winSound.play();
  }
}

function draw() {
  drawTable();
  drawPaddle(playerX, playerY, "#00f");
  drawPaddle(cpuX, cpuY, "#f00");
  drawBall(ballX, ballY);
  scoreDisplay.innerText = `You: ${playerScore} | CPU: ${cpuScore}`;

  if (gameOver) {
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.fillText(
      playerScore >= 11 ? "You Win! 🎉" : "CPU Wins! 🤖",
      canvas.width / 2 - 80,
      canvas.height / 2
    );
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

resetBtn.onclick = () => {
  playerScore = 0;
  cpuScore = 0;
  gameOver = false;
  resetBall();
};

gameLoop();
