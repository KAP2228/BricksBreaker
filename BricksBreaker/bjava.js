const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Paddle properties
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    width: 100,
    height: 10,
    speed: 10,
    dx: 0
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 8,
    speed: 3,
    dx: 3,
    dy: -3
};

// Brick properties
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 50;
const brickOffsetLeft = 35;
let bricks = [];

for (let r = 0; r < brickRowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[r][c] = { 
            x: c * (brickWidth + brickPadding) + brickOffsetLeft,
            y: r * (brickHeight + brickPadding) + brickOffsetTop,
            status: 1
        };
    }
}


// Draw paddle
function drawPaddle() {
    ctx.fillStyle = "blue";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}
  
//draw bricks
function drawBricks() {
    console.clear(); // Clears previous logs for better visibility

    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            let brick = bricks[r][c];

            if (brick.status === 1) {
                let brickX = brick.x;
                let brickY = brick.y;

                ctx.fillStyle = "red";  
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);

                ctx.strokeStyle = "black";
                ctx.strokeRect(brickX, brickY, brickWidth, brickHeight);

                // Log brick details to console
                console.log(`Brick [Row: ${r}, Col: ${c}] - Position (${brickX}, ${brickY})`);
            }
        }
    }
}



// Move paddle
function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (left/right)
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }

    // Wall collision (top)
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.dy *= -1;
    }

    // Brick collision
    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            let brick = bricks[r][c];
            if (brick.status === 1) {
                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + brickWidth &&
                    ball.y > brick.y &&
                    ball.y < brick.y + brickHeight
                ) {
                    ball.dy *= -1;
                    brick.status = 0;
                }
            }
        }
    }

    // Bottom wall (game over)
    if (ball.y + ball.radius > canvas.height) {
        alert("Game Over!");
        document.location.reload();
    }
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        paddle.dx = paddle.speed;
    } else if (e.key === "ArrowLeft") {
        paddle.dx = -paddle.speed;
    }
});

document.addEventListener("keyup", () => {
    paddle.dx = 0;
});

// Update game loop
function update() {
    movePaddle();
    moveBall();
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();