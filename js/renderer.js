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

function drawHUD() {

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(15, 15, 220, 120);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 220, 120);

    ctx.fillStyle = "white";
    ctx.font = "bold 22px Arial";

    ctx.fillText(
        `Shot ${Math.min(game.round.currentShot, game.round.maxShots)}/${game.round.maxShots}`,
        28,
        45
    );

    ctx.font = "18px Arial";

    ctx.fillStyle = "#4cff4c";
    ctx.fillText(
        `Goals: ${game.round.goals}`,
        28,
        75
    );

    ctx.fillStyle = "#66b3ff";
    ctx.fillText(
        `Saves: ${game.round.saves}`,
        28,
        100
    );

    ctx.fillStyle = "#ff6666";
    ctx.fillText(
        `Misses: ${game.round.misses}`,
        28,
        125
    );
}

function drawMessage() {

    if (game.message.timer <= 0) {
        return;
    }

    const alpha =
        Math.min(
            1,
            game.message.timer / 25
        );

    ctx.save();

    ctx.globalAlpha = alpha;

    ctx.font = "bold 64px Arial";

    ctx.textAlign = "center";

    ctx.fillStyle =
        game.message.color;

    ctx.fillText(
        game.message.text,
        canvas.width / 2,
        120
    );

    ctx.restore();

    ctx.textAlign = "left";
}

function drawRoundComplete() {

    if (!game.round.finished) {
        return;
    }

    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const accuracy =
        Math.round(
            (game.round.goals / game.round.maxShots) * 100
        );

    let rating = "";

    if (accuracy === 100) {
        rating = "LEGENDARY";
    }
    else if (accuracy >= 90) {
        rating = "WORLD CLASS";
    }
    else if (accuracy >= 80) {
        rating = "EXCELLENT";
    }
    else if (accuracy >= 70) {
        rating = "VERY GOOD";
    }
    else if (accuracy >= 60) {
        rating = "GOOD";
    }
    else if (accuracy >= 40) {
        rating = "DECENT";
    }
    else {
        rating = "KEEP PRACTICING";
    }

    ctx.textAlign = "center";

    ctx.fillStyle = "white";

    ctx.font = "bold 52px Arial";
    ctx.fillText(
        "ROUND COMPLETE",
        canvas.width / 2,
        180
    );

    ctx.font = "34px Arial";

    ctx.fillStyle = "#4cff4c";
    ctx.fillText(
        `${game.round.goals} Goals`,
        canvas.width / 2,
        270
    );

    ctx.fillStyle = "white";
    ctx.fillText(
        `${accuracy}% Accuracy`,
        canvas.width / 2,
        330
    );

    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 38px Arial";
    ctx.fillText(
        rating,
        canvas.width / 2,
        410
    );

    ctx.fillStyle = "#cccccc";
    ctx.font = "24px Arial";
    ctx.fillText(
        "Press SPACE to play again",
        canvas.width / 2,
        520
    );

    ctx.textAlign = "left";
}

function render() {
    drawField();
    drawGoal();
    drawKeeper();
    drawWall();
    drawAimGuide();
    drawBall();
    drawHUD();
    drawMessage();
    drawRoundComplete();
}
