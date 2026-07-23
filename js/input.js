function updateMousePosition(event) {
    const rect = canvas.getBoundingClientRect();

    game.shot.mouseX =
        event.clientX - rect.left;

    game.shot.mouseY =
        event.clientY - rect.top;
}

function isMouseOverBall() {
    const dx =
        game.shot.mouseX -
        game.ball.x;

    const dy =
        game.shot.mouseY -
        game.ball.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    return (
        distance <=
        game.ball.radius + 12
    );
}

function canPlayerShoot() {
    if (!game.ball.canShoot) {
        return false;
    }

    if (game.ball.moving) {
        return false;
    }

    return true;
}

canvas.addEventListener(
    "mousemove",
    (event) => {

        updateMousePosition(event);

        if (!game.shot.aiming) {
            return;
        }

        game.shot.targetX =
            game.shot.mouseX;

        game.shot.targetY =
            game.shot.mouseY;
    }
);

canvas.addEventListener(
    "mousedown",
    (event) => {

        updateMousePosition(event);

        if (!canPlayerShoot()) {
            return;
        }

        if (!isMouseOverBall()) {
            return;
        }

        game.shot.aiming = true;

        game.shot.startX =
            game.ball.x;

        game.shot.startY =
            game.ball.y;

        game.shot.targetX =
            game.ball.x;

        game.shot.targetY =
            game.ball.y;
    }
);

canvas.addEventListener(
    "mouseup",
    () => {

        if (!game.shot.aiming) {
            return;
        }

        game.shot.aiming = false;

        if (!canPlayerShoot()) {
            return;
        }

        const dx =
            game.shot.startX -
            game.shot.targetX;

        const dy =
            game.shot.startY -
            game.shot.targetY;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (distance < 5) {
            return;
        }

        calculateShot();
    }
);

window.addEventListener("keydown", (event) => {

    if (event.code !== "Space") {
        return;
    }

    if (!game.round.finished) {
        return;
    }

    game.round.currentShot = 1;
    game.round.goals = 0;
    game.round.saves = 0;
    game.round.misses = 0;
    game.round.finished = false;

    game.ball.canShoot = true;

    loadRandomFreeKick();
});
