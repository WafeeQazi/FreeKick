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

const scenarios = [
    {
        x: canvas.width / 2,
        y: 590,
        wallDistance: 300
    },
    {
        x: canvas.width / 2 - 80,
        y: 570,
        wallDistance: 280
    },
    {
        x: canvas.width / 2 + 90,
        y: 610,
        wallDistance: 320
    }
];

let currentScenario = 0;

const freeKick = {
    x: scenarios[currentScenario].x,
    y: scenarios[currentScenario].y,
    wallDistance: scenarios[currentScenario].wallDistance
};

const wall = [];

const ball = {
    x: freeKick.x,
    y: freeKick.y,
    radius: 12
};

function createWall() {
    wall.length = 0;

    for (let i = 0; i < 5; i++) {
        wall.push({
            x: freeKick.x - 80 + i * 40,
            y: freeKick.y - freeKick.wallDistance,
            radius: 16
        });
    }
}

function resetFreeKick() {
    ball.x = freeKick.x;
    ball.y = freeKick.y;

    createWall();
}

resetFreeKick();

function loadScenario(index) {
    const scenario = scenarios[index];

    freeKick.x = scenario.x;
    freeKick.y = scenario.y;
    freeKick.wallDistance = scenario.wallDistance;

    resetFreeKick();
}

function drawField() {
    ctx.fillStyle = "#7ac943";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += 50) {
        if ((y / 50) % 2 === 0) {
            ctx.fillStyle = "#73bd3f";
            ctx.fillRect(0, y, canvas.width, 50);
        }
    }

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(0, 650);
    ctx.lineTo(canvas.width, 650);

    ctx.stroke();


    // penalty area lines

    ctx.beginPath();

    ctx.moveTo(250, 220);
    ctx.lineTo(650, 220);

    ctx.moveTo(250, 220);
    ctx.lineTo(150, 450);

    ctx.moveTo(650, 220);
    ctx.lineTo(750, 450);

    ctx.stroke();
}

function drawShadow(x, y, size) {
    ctx.fillStyle = "rgba(0,0,0,0.2)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y,
        size,
        size / 3,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function drawGoal() {
    drawShadow(
        goal.x + goal.width / 2,
        goal.y + goal.height + 10,
        100
    );

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
    drawShadow(
        player.x,
        player.y + player.radius + 25,
        12
    );

    ctx.fillStyle = "#f2c29b";

    ctx.beginPath();
    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = color;

    ctx.fillRect(
        player.x - 10,
        player.y + player.radius - 2,
        20,
        30
    );

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        player.x - 6,
        player.y + player.radius + 28
    );

    ctx.lineTo(
        player.x - 10,
        player.y + player.radius + 45
    );

    ctx.moveTo(
        player.x + 6,
        player.y + player.radius + 28
    );

    ctx.lineTo(
        player.x + 10,
        player.y + player.radius + 45
    );

    ctx.stroke();
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
    drawShadow(
        ball.x,
        ball.y + ball.radius + 5,
        10
    );

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

    ctx.beginPath();

    ctx.moveTo(
        ball.x - 5,
        ball.y
    );

    ctx.lineTo(
        ball.x + 5,
        ball.y
    );

    ctx.moveTo(
        ball.x,
        ball.y - 5
    );

    ctx.lineTo(
        ball.x,
        ball.y + 5
    );

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

window.addEventListener("keydown", (event) => {
    if (event.key === "r") {
        currentScenario++;

        if (currentScenario >= scenarios.length) {
            currentScenario = 0;
        }

        loadScenario(currentScenario);
    }
});

gameLoop();
