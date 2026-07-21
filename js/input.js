function updateMousePosition(event) {
    const rect = canvas.getBoundingClientRect();

    game.shot.mouseX = event.clientX - rect.left;
    game.shot.mouseY = event.clientY - rect.top;
}

function isMouseOverBall() {
    const dx = game.shot.mouseX - game.ball.x;
    const dy = game.shot.mouseY - game.ball.y;

    return Math.sqrt(dx * dx + dy * dy) <= game.ball.radius + 10;
}

canvas.addEventListener("mousemove", (event) => {
    updateMousePosition(event);

    if (!game.shot.aiming) {
        return;
    }

    game.shot.targetX = game.shot.mouseX;
    game.shot.targetY = game.shot.mouseY;
});

canvas.addEventListener("mousedown", (event) => {
    updateMousePosition(event);

    if (game.ball.moving) {
        return;
    }

    if (!isMouseOverBall()) {
        return;
    }

    game.shot.aiming = true;

    game.shot.startX = game.ball.x;
    game.shot.startY = game.ball.y;

    game.shot.targetX = game.ball.x;
    game.shot.targetY = game.ball.y;
});

canvas.addEventListener("mouseup", () => {
    if (!game.shot.aiming) {
        return;
    }

    game.shot.aiming = false;

    calculateShot();
});
