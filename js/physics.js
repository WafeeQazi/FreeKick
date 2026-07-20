function calculateShot() {
    const dx = game.shot.targetX - game.shot.startX;
    const dy = game.shot.targetY - game.shot.startY;

    const distance = Math.sqrt(
        dx * dx + dy * dy
    );

    const maxPower = 18;

    game.shot.power = Math.min(
        distance / 20,
        maxPower
    );

    const directionX = dx / distance;
    const directionY = dy / distance;

    game.ball.velocityX =
        directionX * game.shot.power;

    game.ball.velocityY =
        directionY * game.shot.power;

    const curveDirection =
        (game.shot.targetX - canvas.width / 2) / canvas.width;

    game.ball.curve =
        curveDirection * 0.08;

    game.ball.moving = true;
}

function updateBall() {

    if (!game.ball.moving) {
        return;
    }

    game.ball.x += game.ball.velocityX;

    game.ball.y += game.ball.velocityY;

    game.ball.velocityX += game.ball.curve;

    checkWallCollision();

    checkGoal();

    if (
        game.ball.x < -50 ||
        game.ball.x > canvas.width + 50 ||
        game.ball.y < -50 ||
        game.ball.y > canvas.height + 50
    ) {
        resetAfterShot();
    }
}

function checkWallCollision() {

    for (const player of game.wall) {

        const dx = game.ball.x - player.x;
        const dy = game.ball.y - player.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (
            distance <
            game.ball.radius + player.radius
        ) {

            game.ball.velocityX *= -0.5;
            game.ball.velocityY *= -0.5;

            game.ball.curve *= -1;
        }
    }
}

function checkGoal() {

    if (
        game.ball.x > game.goal.x &&
        game.ball.x < game.goal.x + game.goal.width &&
        game.ball.y > game.goal.y &&
        game.ball.y < game.goal.y + game.goal.height
    ) {

        resetAfterShot();
    }
}

function resetAfterShot() {

    game.ball.moving = false;

    loadRandomFreeKick();
}
