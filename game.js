const canvas = document.getElementById("flappyGame");
const ctx = canvas.getContext("2d");

// Game variables
let frames = 0;
const gravity = 0.25;
const jump = 4.6;

// Bird
const bird = {
  x: 50,
  y: 150,
  w: 30,
  h: 30,
  radius: 15,
  velocity: 0,
  draw() {
    ctx.fillStyle = "#58a6ff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  },
  update() {
    this.velocity += gravity;
    this.y += this.velocity;

    if (this.y + this.radius >= canvas.height) {
      resetGame();
    }
  },
  flap() {
    this.velocity = -jump;
  }
};

// Pipes
let pipes = [];
function createPipe() {
  const gap = 100;
  const top = Math.random() * (canvas.height / 2);
  pipes.push({
    x: canvas.width,
    y: top,
    width: 50,
    height: top,
    gap: gap
  });
}
function updatePipes() {
  if (frames % 100 === 0) {
    createPipe();
  }
  pipes.forEach((pipe, i) => {
    pipe.x -= 2;

    // Collision detection
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipe.width &&
      (bird.y - bird.radius < pipe.height ||
       bird.y + bird.radius > pipe.height + pipe.gap)
    ) {
      resetGame();
    }

    if (pipe.x + pipe.width < 0) {
      pipes.splice(i, 1);
    }
  });
}
function drawPipes() {
  ctx.fillStyle = "#1f6feb";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.height);
    ctx.fillRect(pipe.x, pipe.height + pipe.gap, pipe.width, canvas.height);
  });
}

// Reset
function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  frames = 0;
}

// Draw & update loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.update();
  bird.draw();

  updatePipes();
  drawPipes();

  frames++;
  requestAnimationFrame(loop);
}
loop();

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    bird.flap();
  }
});
canvas.addEventListener("click", () => bird.flap());
canvas.addEventListener("touchstart", () => bird.flap());
