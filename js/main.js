const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const goal = {
    x: 250,
    y: 60,
    width: 400,
    height: 90
};

const keeper = {
    x: canvas.width / 2,
    y: 175,
    radius: 18
};

const wall = [];

for (let i = 0; i < 5; i++) {
    wall.push({
        x: 370 + i * 40,
        y: 290,
        radius: 16
    });
}

const ball = {
    x: canvas.width / 2,
    y: 590,
    radius: 12
};

function drawField() {
    ctx.fillStyle = "#3e9b45";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(0, 650);
    ctx.lineTo(canvas.width, 650);
    ctx.stroke();
}

function drawGoal() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 6;

    ctx.strokeRect(
        goal.x,
        goal.y,
        goal.width,
        goal.height
    );

    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 2;

    for (let x = goal.x + 20; x < goal.x + goal.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, goal.y);
        ctx.lineTo(x, goal.y + goal.height);
        ctx.stroke();
    }

    for (let y = goal.y + 20; y < goal.y + goal.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(goal.x, y);
        ctx.lineTo(goal.x + goal.width, y);
        ctx.stroke();
    }
}

function drawPlayer(player, color) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillRect(
        player.x - 8,
        player.y + player.radius - 2,
        16,
        30
    );
}

function drawWall() {
    for (const player of wall) {
        drawPlayer(player, "#1f4db8");
    }
}

function drawKeeper() {
    drawPlayer(keeper, "#ffcc00");
}

function drawBall() {
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function draw() {
    drawField();
    drawGoal();
    drawKeeper();
    drawWall();
    drawBall();
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
