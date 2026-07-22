const goal = game.goal;
const keeper = game.keeper;
const ball = game.ball;
const wall = game.wall;

function drawField() {
    ctx.fillStyle = "#75c943";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += 50) {
        if ((y / 50) % 2 === 0) {
            ctx.fillStyle = "#70bd3d";
            ctx.fillRect(0, y, canvas.width, 50);
        }
    }

    ctx.strokeStyle = "rgba(255,255,255,0.9)";
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

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(450, 220, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawShadow(x, y, width, alpha = 0.2) {
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;

    ctx.beginPath();
    ctx.ellipse(
        x,
        y,
        width,
        width * 0.35,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function drawGoal() {
    drawShadow(
        goal.x + goal.width / 2,
        goal.y + goal.height + 15,
        110,
        0.25
    );

    ctx.strokeStyle = "rgba(220,220,220,0.8)";
    ctx.lineWidth = 1;

    for (let x = goal.x; x <= goal.x + goal.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, goal.y);
        ctx.lineTo(x, goal.y + goal.height);
        ctx.stroke();
    }

    for (let y = goal.y; y <= goal.y + goal.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(goal.x, y);
        ctx.lineTo(goal.x + goal.width, y);
        ctx.stroke();
    }

    ctx.strokeStyle = "white";
    ctx.lineWidth = 7;

    ctx.strokeRect(
        goal.x,
        goal.y,
        goal.width,
        goal.height
    );

    ctx.strokeStyle = "#eeeeee";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(goal.x, goal.y);
    ctx.lineTo(goal.x + goal.width, goal.y);
    ctx.stroke();
}

function drawPlayer(player, color) {
    const x = player.x;
    const y = player.y;

    drawShadow(
        x,
        y + 70,
        18,
        0.25
    );

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 6;

    ctx.beginPath();

    ctx.moveTo(
        x - 7,
        y + 50
    );

    ctx.lineTo(
        x - 12,
        y + 72
    );

    ctx.moveTo(
        x + 7,
        y + 50
    );

    ctx.lineTo(
        x + 12,
        y + 72
    );

    ctx.stroke();

    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.roundRect(
        x - 15,
        y + 8,
        30,
        45,
        8
    );

    ctx.fill();

    ctx.strokeStyle = "#f2c29b";
    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(
        x - 13,
        y + 20
    );

    ctx.lineTo(
        x - 25,
        y + 42
    );

    ctx.moveTo(
        x + 13,
        y + 20
    );

    ctx.lineTo(
        x + 25,
        y + 42
    );

    ctx.stroke();

    ctx.fillStyle = "#f2c29b";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#222";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 5,
        14,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();
}

function drawWall() {
    for (const player of wall) {
        drawPlayer(
            player,
            "#2457c5"
        );
    }
}

function drawKeeper() {
    const x = keeper.x;
    const y = keeper.y;

    const diveOffset =
        keeper.diving
            ? keeper.diveDirection * 25
            : 0;

    drawShadow(
        x + diveOffset,
        y + 70,
        22,
        0.3
    );

    ctx.save();

    ctx.translate(
        x + diveOffset,
        y
    );

    if (keeper.diving) {
        ctx.rotate(
            keeper.diveDirection * -0.35
        );
    }

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(-8, 50);
    ctx.lineTo(-15, 75);

    ctx.moveTo(8, 50);
    ctx.lineTo(15, 75);

    ctx.stroke();

    ctx.fillStyle = "#e00000";

    ctx.beginPath();

    ctx.roundRect(
        -18,
        5,
        36,
        50,
        8
    );

    ctx.fill();

    ctx.strokeStyle = "#f2c29b";
    ctx.lineWidth = 9;

    ctx.beginPath();

    ctx.moveTo(-14, 18);
    ctx.lineTo(-40, 35);

    ctx.moveTo(14, 18);
    ctx.lineTo(40, 35);

    ctx.stroke();

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        -42,
        36,
        9,
        0,
        Math.PI * 2
    );

    ctx.arc(
        42,
        36,
        9,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#f2c29b";

    ctx.beginPath();

    ctx.arc(
        0,
        -10,
        16,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#222";

    ctx.beginPath();

    ctx.arc(
        0,
        -15,
        16,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

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

    ctx.moveTo(
        ball.x,
        ball.y
    );

    ctx.lineTo(
        game.shot.mouseX,
        game.shot.mouseY
    );

    ctx.stroke();

    ctx.setLineDash([]);

    const dx =
        ball.x -
        game.shot.mouseX;

    const dy =
        ball.y -
        game.shot.mouseY;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const power =
        Math.min(
            distance / 12,
            game.shot.maxPower
        );

    const percentage =
        power /
        game.shot.maxPower;

    ctx.fillStyle = "#222";
    ctx.fillRect(
        20,
        20,
        220,
        20
    );

    ctx.fillStyle = "#00ff55";

    ctx.fillRect(
        20,
        20,
        220 * percentage,
        20
    );

    ctx.strokeStyle = "white";

    ctx.strokeRect(
        20,
        20,
        220,
        20
    );

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";

    ctx.fillText(
        "Power",
        20,
        60
    );
}

function drawBall() {
    const screenY =
        ball.y -
        ball.z;

    const shadowSize =
        Math.max(
            4,
            12 - ball.z / 20
        );

    drawShadow(
        ball.x,
        ball.y + 12,
        shadowSize,
        0.25
    );

    ctx.save();

    ctx.translate(
        ball.x,
        screenY
    );

    ctx.rotate(
        ball.rotating * 0.03
    );

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#111";

    const patches = [
        [0, 0, 5],
        [-8, -6, 3],
        [8, -6, 3],
        [-8, 7, 3],
        [8, 7, 3]
    ];

    for (const patch of patches) {
        ctx.beginPath();

        ctx.arc(
            patch[0],
            patch[1],
            patch[2],
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        9,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        -10,
        0
    );

    ctx.lineTo(
        10,
        0
    );

    ctx.moveTo(
        0,
        -10
    );

    ctx.lineTo(
        0,
        10
    );

    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        ball.radius,
        0,
        Math.PI * 2
    );

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
