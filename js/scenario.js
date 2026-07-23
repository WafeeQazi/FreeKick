function refillPositionBag() {
    game.positionBag = [];

    for (let i = 0; i < game.freeKickPositions.length; i++) {
        game.positionBag.push(i);
    }

    shufflePositionBag();
}

function shufflePositionBag() {
    for (let i = game.positionBag.length - 1; i > 0; i--) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );

        const temp = game.positionBag[i];
        game.positionBag[i] = game.positionBag[j];
        game.positionBag[j] = temp;
    }
}

function getNextFreeKickPosition() {
    if (game.positionBag.length === 0) {
        refillPositionBag();
    }

    const index = game.positionBag.pop();

    game.currentPosition =
        game.freeKickPositions[index];

    return game.currentPosition;
}

function createWall() {
    game.wall.length = 0;

    const position = game.currentPosition;

    const spacing = 40;

    const startX =
        game.freeKick.x -
        ((position.wallPlayers - 1) * spacing) / 2;

    for (let i = 0; i < position.wallPlayers; i++) {

        const player = {
            x: startX + i * spacing,
            y: game.freeKick.y - game.freeKick.wallDistance,
            radius: 16,

            hitboxes: []
        };

        for (const hitbox of game.wallHitboxes) {
            player.hitboxes.push({
                name: hitbox.name,
                xOffset: hitbox.xOffset,
                yOffset: hitbox.yOffset,
                radius: hitbox.radius
            });
        }

        game.wall.push(player);
    }
}

function resetBall() {
    const ball = game.ball;

    ball.x = game.freeKick.x;
    ball.y = game.freeKick.y;
    ball.z = 0;

    ball.velocityX = 0;
    ball.velocityY = 0;
    ball.velocityZ = 0;

    ball.spin = 0;
    ball.rotating = 0;

    ball.moving = false;
    ball.canShoot = true;

    game.shot.aiming = false;
    game.shot.power = 0;

    game.shot.startX = ball.x;
    game.shot.startY = ball.y;
    game.shot.targetX = ball.x;
    game.shot.targetY = ball.y;
}

function resetKeeper() {
    const keeper = game.keeper;

    keeper.x = canvas.width / 2;
    keeper.y = 175;

    keeper.velocityX = 0;
    keeper.targetX = canvas.width / 2;

    keeper.state = "idle";

    keeper.reacted = false;
    keeper.reactionTimer = 0;

    keeper.diving = false;
    keeper.diveDirection = 0;
    keeper.diveTimer = 0;

    keeper.hasTouchedBall = false;

    keeper.predictedX = canvas.width / 2;
}

function loadRandomFreeKick() {
    const position = getNextFreeKickPosition();

    game.freeKick.x = position.x;
    game.freeKick.y = position.y;
    game.freeKick.wallDistance =
        position.wallDistance;

    createWall();
    resetBall();
    resetKeeper();
}

function showMessage(text, color) {

    game.message.text = text;
    game.message.color = color;
    game.message.timer =
        game.message.duration;
}

function finishAttempt(result) {

    if (game.round.finished) {
        return;
    }

    switch (result) {

        case "goal":

            showMessage(
                "GOAL!",
                "#4cff4c"
            );

            game.round.goals++;
            game.score.goals++;

            break;

        case "save":

            showMessage(
                "SAVED!",
                "#4da6ff"
            );

            game.round.saves++;
            game.score.saves++;

            break;

        case "miss":

            showMessage(
                "MISS!",
                "#ff5555"
            );

            game.round.misses++;

            break;
    }

    game.round.currentShot++;

    if (
        game.round.currentShot >
        game.round.maxShots
    ) {

        game.round.finished = true;

        game.ball.canShoot = false;

        return;
    }

    loadRandomFreeKick();
}

function resetAfterShot() {

    if (game.round.finished) {
        return;
    }

    loadRandomFreeKick();
}

refillPositionBag();
loadRandomFreeKick();
