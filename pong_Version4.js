const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PADDLE_SPEED = 7;

// Ball settings
const BALL_SIZE = 14;
const BALL_SPEED = 5;

// Game state
let leftScore = 0;
let rightScore = 0;

// Paddles
let leftPaddle = { x: 16, y: HEIGHT / 2 - PADDLE_HEIGHT / 2, dy: 0 };
let rightPaddle = { x: WIDTH - 16 - PADDLE_WIDTH, y: HEIGHT / 2 - PADDLE_HEIGHT / 2, dy: 0 };

// Ball
let ball = {
  x: WIDTH / 2 - BALL_SIZE / 2,
  y: HEIGHT / 2 - BALL_SIZE / 2,
  dx: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
  dy: BALL_SPEED * (Math.random() * 2 - 1)
};

// Keyboard control
let upPressed = false;
let downPressed = false;

// Gamepad state
let gamepadIndex = null;

// Mouse control
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddle.y = Math.max(0, Math.min(mouseY - PADDLE_HEIGHT / 2, HEIGHT - PADDLE_HEIGHT));
});

// Keyboard events
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') upPressed = true;
  if (e.key === 'ArrowDown') downPressed = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') upPressed = false;
  if (e.key === 'ArrowDown') downPressed = false;
});

// Gamepad events
window.addEventListener("gamepadconnected", (e) => {
  gamepadIndex = e.gamepad.index;
});

window.addEventListener("gamepaddisconnected", (e) => {
  if (gamepadIndex === e.gamepad.index) {
    gamepadIndex = null;
  }
});

// Helper: vibrate the controller if supported
function vibrateController(duration = 120, strong = 1.0, weak = 0.8) {
  if (gamepadIndex !== null) {
    const gp = navigator.getGamepads()[gamepadIndex];
    if (gp && gp.vibrationActuator && gp.vibrationActuator.type === "dual-rumble") {
      gp.vibrationActuator.playEffect("dual-rumble", {
        duration: duration,
        strongMagnitude: strong,
        weakMagnitude: weak,
      });
    }
  }
}

// Draw functions
function drawRect(x, y, w, h, color = '#fff') {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall() {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ball.x + BALL_SIZE / 2, ball.y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
}

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update positions and state
function update() {
  // Gamepad controls
  let paddleDy = 0;
  if (gamepadIndex !== null) {
    const gp = navigator.getGamepads()[gamepadIndex];
    if (gp) {
      // Left stick Y axis (axis 1): value between -1 (up) and 1 (down)
      let axisY = gp.axes[1] || 0;
      // Deadzone to prevent drift
      if (Math.abs(axisY) > 0.15) {
        paddleDy = axisY * PADDLE_SPEED;
      }

      // D-pad (buttons 12 up, 13 down)
      if (gp.buttons[12]?.pressed) {
        paddleDy = -PADDLE_SPEED;
      }
      if (gp.buttons[13]?.pressed) {
        paddleDy = PADDLE_SPEED;
      }
    }
  }

  // Left paddle (player) control
  if (upPressed) {
    leftPaddle.y -= PADDLE_SPEED;
  }
  if (downPressed) {
    leftPaddle.y += PADDLE_SPEED;
  }
  if (paddleDy !== 0) {
    leftPaddle.y += paddleDy;
  }
  leftPaddle.y = Math.max(0, Math.min(leftPaddle.y, HEIGHT - PADDLE_HEIGHT));

  // Right paddle (AI)
  let target = ball.y - (PADDLE_HEIGHT - BALL_SIZE) / 2;
  let diff = target - rightPaddle.y;
  if (Math.abs(diff) > 4) {
    rightPaddle.y += Math.sign(diff) * Math.min(PADDLE_SPEED * 0.85, Math.abs(diff));
    rightPaddle.y = Math.max(0, Math.min(rightPaddle.y, HEIGHT - PADDLE_HEIGHT));
  }

  // Move the ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Top/bottom wall collision
  if (ball.y < 0) {
    ball.y = 0;
    ball.dy *= -1;
    vibrateController(80, 0.5, 0.7); // light vibration on wall hit
  }
  if (ball.y + BALL_SIZE > HEIGHT) {
    ball.y = HEIGHT - BALL_SIZE;
    ball.dy *= -1;
    vibrateController(80, 0.5, 0.7);
  }

  // Left paddle collision
  if (
    ball.x < leftPaddle.x + PADDLE_WIDTH &&
    ball.x > leftPaddle.x &&
    ball.y + BALL_SIZE > leftPaddle.y &&
    ball.y < leftPaddle.y + PADDLE_HEIGHT
  ) {
    ball.x = leftPaddle.x + PADDLE_WIDTH;
    ball.dx *= -1.1; // bounce & speed up
    // Add a bit of randomness based on where it hits the paddle
    ball.dy += ((ball.y + BALL_SIZE / 2) - (leftPaddle.y + PADDLE_HEIGHT / 2)) * 0.15;
    vibrateController(180, 1.0, 0.9); // strong vibration on paddle hit
  }

  // Right paddle collision
  if (
    ball.x + BALL_SIZE > rightPaddle.x &&
    ball.x + BALL_SIZE < rightPaddle.x + PADDLE_WIDTH &&
    ball.y + BALL_SIZE > rightPaddle.y &&
    ball.y < rightPaddle.y + PADDLE_HEIGHT
  ) {
    ball.x = rightPaddle.x - BALL_SIZE;
    ball.dx *= -1.1;
    ball.dy += ((ball.y + BALL_SIZE / 2) - (rightPaddle.y + PADDLE_HEIGHT / 2)) * 0.15;
    vibrateController(150, 0.8, 0.8); // medium vibration for right paddle (player for fun)
  }

  // Left or right wall (score)
  if (ball.x < -BALL_SIZE) {
    rightScore++;
    resetBall();
    vibrateController(400, 0.7, 1.0); // longer vibration on score
  }
  if (ball.x > WIDTH + BALL_SIZE) {
    leftScore++;
    resetBall();
    vibrateController(400, 1.0, 1.0); // longer vibration on score
  }

  // Update scoreboard
  document.getElementById('left-score').textContent = leftScore;
  document.getElementById('right-score').textContent = rightScore;
}

function resetBall() {
  ball.x = WIDTH / 2 - BALL_SIZE / 2;
  ball.y = HEIGHT / 2 - BALL_SIZE / 2;
  ball.dx = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
  ball.dy = BALL_SPEED * (Math.random() * 2 - 1);
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // Middle dashed line
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([12, 18]);
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Paddles
  drawRect(leftPaddle.x, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
  drawRect(rightPaddle.x, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Ball
  drawBall();
}

// Start game
gameLoop();