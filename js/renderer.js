const goal = game.goal;
const keeper = game.keeper;
const ball = game.ball;
const wall = game.wall;

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

    ctx.beginPath();
    ctx.moveTo(250, 220);
    ctx.lineTo(650, 220);
    ctx.moveTo(250, 220);
    ctx.lineTo(150, 450);
    ctx.moveTo(650, 220);
    ctx.lineTo(750, 450);
    ctx.stroke();
}

function drawShadow(x, y, size, alpha = 0.2) {
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;

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
    ctx.strokeRect(goal.x, goal.y, goal.width, goal.height);

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
    drawShadow(player.x, player.y + player.radius + 25, 12);

    ctx.fillStyle = "#f2c29b";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.fillRect(player.x - 10, player.y + player.radius - 2, 20, 30);

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(player.x - 6, player.y + player.radius + 28);
    ctx.lineTo(player.x - 10, player.y + player.radius + 45);
    ctx.moveTo(player.x + 6, player.y + player.radius + 28);
    ctx.lineTo(player.x + 10, player.y + player.radius + 45);
    ctx.stroke();
}

function drawWall() {
    for (const player of wall) {
        drawPlayer(player, "#1f4db8");
    }
}

function drawKeeper() {
    const x = keeper.x;
    const y = keeper.y;

    const diving = keeper.diving;

    drawShadow(
        x,
        y + 55,
        diving ? 22 : 18,
        0.25
    );

    ctx.save();

    ctx.translate(x, y);

    if (diving) {
        ctx.rotate(
            keeper.diveDirection * -0.35
        );
    }

    ctx.fillStyle = "#f2c29b";

    ctx.beginPath();
    ctx.arc(
        0,
        -5,
        16,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#e60000";

    ctx.fillRect(
        -15,
        12,
        30,
        38
    );

    ctx.strokeStyle = "#f2c29b";
    ctx.lineWidth = 8;

    ctx.beginPath();

    ctx.moveTo(-12, 20);
    ctx.lineTo(-32, 35);

    ctx.moveTo(12, 20);
    ctx.lineTo(32, 35);

    ctx.stroke();

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        -34,
        37,
        7,
        0,
        Math.PI * 2
    );

    ctx.arc(
        34,
        37,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(-8, 50);
    ctx.lineTo(-14, 72);

    ctx.moveTo(8, 50);
    ctx.lineTo(14, 72);

    ctx.stroke();

    ctx.restore();
}

function drawAimGuide() {
    if (!game.shot.aiming) {
        return;
    }

    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);

    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(game.shot.mouseX, game.shot.mouseY);
    ctx.stroke();

    ctx.setLineDash([]);

    const dx = ball.x - game.shot.mouseX;
    const dy = ball.y - game.shot.mouseY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const power = Math.min(distance / 12, game.shot.maxPower);
    const percent = power / game.shot.maxPower;

    ctx.fillStyle = "#222";
    ctx.fillRect(20, 20, 220, 20);

    ctx.fillStyle = "#00ff55";
    ctx.fillRect(20, 20, 220 * percent, 20);

    ctx.strokeStyle = "white";
    ctx.strokeRect(20, 20, 220, 20);

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Power", 20, 58);
}

function drawBall() {
    const screenY = ball.y - ball.z;

    const shadowScale = Math.max(
        0.35,
        1 - ball.z / 180
    );

    drawShadow(
        ball.x,
        ball.y + ball.radius + 5,
        10 * shadowScale,
        0.25 * shadowScale
    );

    ctx.save();

    ctx.translate(ball.x, screenY);
    ctx.rotate(ball.rotating * 0.02);

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 5);
    ctx.stroke();

    ctx.restore();
}

function render() {
    drawField();
    drawGoal();
    drawKeeper();
    drawWall();
    drawAimGuide();
    drawBall();
}
