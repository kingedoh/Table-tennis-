const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 320;

let playerScore = 0;
let cpuScore = 0;

const paddleHeight = 60;
const paddleWidth = 10;

let playerY = (canvas.height - paddleHeight) / 2;
let cpuY = (canvas.height - paddleHeight) / 2;
const playerX = 10;
const cpuX = canvas.width - paddleWidth - 10;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 8;
let ballSpeedX = 4;
let ballSpeedY = 4;

function drawPaddle(x, y) {
  ctx.fillStyle = "#0f0";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#f00";
  ctx.fill();
  ctx.closePath();
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball bounce top/bottom
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
    ballSpeedX *= 1.1; // Increase difficulty
    ballSpeedY *= 1.1;
  }

  // CPU collision
  if (
    ballX + ballRadius > cpuX &&
    ballY > cpuY &&
    ballY < cpuY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballSpeedX *= 1.1;
    ballSpeedY *= 1.1;
  }

  // Score check
  if (ballX - ballRadius < 0) {
    cpuScore++;
    resetBall();
  } else if (ballX + ballRadius > canvas.width) {
    playerScore++;
    resetBall();
  }

  // CPU AI (hard mode, tracks almost perfectly)
  const cpuCenter = cpuY + paddleHeight / 2;
  if (cpuCenter < ballY - 10) {
    cpuY += 6; // CPU moves fast
  } else if (cpuCenter > ballY + 10) {
    cpuY -= 6;
  }

  // Touch control for player
  canvas.ontouchmove = function (e) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const y = touch.clientY - rect.top;
    playerY = y - paddleHeight / 2;
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height) playerY = canvas.height - paddleHeight;
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles and ball
  drawPaddle(playerX, playerY);
  drawPaddle(cpuX, cpuY);
  drawBall(ballX, ballY);

  // Update score display
  document.getElementById("score").innerText = `You: ${playerScore} | CPU: ${cpuScore}`;
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
