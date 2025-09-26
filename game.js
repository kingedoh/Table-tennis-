const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.6;

let playerScore = 0;
let aiScore = 0;
const winningScore = 11;

let difficulty = "medium";

const paddleWidth = 100;
const paddleHeight = 15;

let playerPaddle = { x: canvas.width/2 - paddleWidth/2, y: canvas.height - 30, w: paddleWidth, h: paddleHeight, color: "red"};
let aiPaddle = { x: canvas.width/2 - paddleWidth/2, y: 15, w: paddleWidth, h: paddleHeight, color: "blue"};

let ball = { x: canvas.width/2, y: canvas.height/2, r: 10, speedX: 4, speedY: 4 };

document.getElementById("difficulty").addEventListener("change", (e)=>{
  difficulty = e.target.value;
});

canvas.addEventListener("mousemove", (e)=>{
  let rect = canvas.getBoundingClientRect();
  playerPaddle.x = e.clientX - rect.left - playerPaddle.w/2;
});

function resetBall(){
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  ball.speedX = 4 * (Math.random() > 0.5 ? 1 : -1);
  ball.speedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function drawPaddle(p){
  ctx.fillStyle = p.color;
  ctx.fillRect(p.x, p.y, p.w, p.h);
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function updateAI(){
  let targetX = ball.x - aiPaddle.w/2;
  let aiSpeed;
  if(difficulty === "easy") aiSpeed = 3;
  else if(difficulty === "medium") aiSpeed = 5;
  else if(difficulty === "hard") aiSpeed = 7;
  else aiSpeed = 10;

  if(aiPaddle.x < targetX) aiPaddle.x += aiSpeed;
  else aiPaddle.x -= aiSpeed;

  // clamp AI
  aiPaddle.x = Math.max(0, Math.min(canvas.width - aiPaddle.w, aiPaddle.x));
}

function updateBall(){
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // bounce off side walls
  if(ball.x - ball.r < 0 || ball.x + ball.r > canvas.width){
    ball.speedX *= -1;
  }

  // ball goes out top or bottom
  if(ball.y - ball.r < 0){
    playerScore++;
    updateScore();
    resetBall();
  } else if(ball.y + ball.r > canvas.height){
    aiScore++;
    updateScore();
    resetBall();
  }

  // collision with paddles
  if(ball.y + ball.r > playerPaddle.y && ball.x > playerPaddle.x && ball.x < playerPaddle.x + playerPaddle.w){
    ball.speedY *= -1;
    ball.y = playerPaddle.y - ball.r;
  }

  if(ball.y - ball.r < aiPaddle.y + aiPaddle.h && ball.x > aiPaddle.x && ball.x < aiPaddle.x + aiPaddle.w){
    ball.speedY *= -1;
    ball.y = aiPaddle.y + aiPaddle.h + ball.r;
  }
}

function updateScore(){
  document.getElementById("playerScore").textContent = playerScore;
  document.getElementById("aiScore").textContent = aiScore;
  if(playerScore >= winningScore || aiScore >= winningScore){
    alert(playerScore >= winningScore ? "You Win!" : "AI Wins!");
    playerScore = 0;
    aiScore = 0;
    resetBall();
  }
}

function gameLoop(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawPaddle(playerPaddle);
  drawPaddle(aiPaddle);
  drawBall();
  updateAI();
  updateBall();
  requestAnimationFrame(gameLoop);
}

function startGame(){
  playerScore = 0; aiScore = 0;
  resetBall();
}

startGame();
gameLoop();;
             
