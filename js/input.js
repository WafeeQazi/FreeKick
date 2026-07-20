function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();

    game.shot.mouseX = event.clientX - rect.left;
    game.shot.mouseY = event.clientY - rect.top;
}

function isMouseOverBall() {
    const dx = game.shot.mouseX - game.ball.x;
    const dy = game.shot.mouseY - game.ball.y;

    const distance = Math.sqrt(
        dx * dx + dy * dy
    );

    return distance <= game.ball.radius + 8;
}

canvas.addEventListener("mousemove", (event) => {
    getMousePosition(event);

    if (game.shot.aiming) {
        game.shot.targetX = game.shot.mouseX;
        game.shot.targetY = game.shot.mouseY;
    }
});

canvas.addEventListener("mousedown", (event) => {
    getMousePosition(event);

    if (game.ball.moving) {
        return;
    }

    if (!isMouseOverBall()) {
        return;
    }

    game.shot.aiming = true;

    game.shot.startX = game.ball.x;
    game.shot.startY = game.ball.y;

    game.shot.targetX = game.shot.mouseX;
    game.shot.targetY = game.shot.mouseY;
});

canvas.addEventListener("mouseup", () => {

    if (!game.shot.aiming) {
        return;
    }

    game.shot.aiming = false;

    calculateShot();
});
