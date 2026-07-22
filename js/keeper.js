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

function updateKeeper() {
    const keeper = game.keeper;

    switch (keeper.state) {
        case "idle":
            updateIdle();
            break;

        case "reaction":
            updateReaction();
            break;

        case "tracking":
            updateTracking();
            break;

        case "diving":
            updateDiving();
            break;

        case "recovering":
            updateRecovery();
            break;
    }

    if (game.ball.moving) {
        checkKeeperSave();
    }
}

function updateIdle() {
    const keeper = game.keeper;

    keeper.velocityX = 0;

    if (game.ball.moving) {
        keeper.state = "reaction";
        keeper.reactionTimer = 0;
    }
}

function updateReaction() {
    const keeper = game.keeper;

    keeper.reactionTimer++;

    const reactionFrames =
        Math.round(
            keeper.reactionTime / 16.67
        );

    if (keeper.reactionTimer < reactionFrames) {
        return;
    }

    keeper.reacted = true;

    predictShot();

    keeper.state = "tracking";
}

function predictShot() {
    const keeper = game.keeper;
    const ball = game.ball;

    if (ball.velocityY >= 0) {
        keeper.predictedX = canvas.width / 2;
        return;
    }

    const timeToGoal =
        (game.goal.y - ball.y) /
        ball.velocityY;

    let predictedX =
        ball.x +
        ball.velocityX * timeToGoal;

    const minX =
        game.goal.x + keeper.radius;

    const maxX =
        game.goal.x +
        game.goal.width -
        keeper.radius;

    predictedX = Math.max(
        minX,
        Math.min(maxX, predictedX)
    );

    keeper.predictedX = predictedX;
    keeper.targetX = predictedX;
}

function updateTracking() {
    predictShot();

    const keeper = game.keeper;

    const distance =
        Math.abs(
            keeper.targetX - keeper.x
        );

    const timeNeeded =
        distance / keeper.maxSpeed;

    const ball = game.ball;

    const timeRemaining =
        (game.goal.y - ball.y) /
        Math.abs(ball.velocityY);

    if (
        distance > keeper.reach &&
        timeNeeded > timeRemaining * 0.8
    ) {
        keeper.state = "diving";
        keeper.diving = true;

        keeper.diveDirection =
            Math.sign(
                keeper.targetX - keeper.x
            );

        return;
    }

    moveKeeper();
}

function moveKeeper() {
    const keeper = game.keeper;

    const difference =
        keeper.targetX - keeper.x;

    if (
        Math.abs(difference) < 1
    ) {
        keeper.velocityX *= 0.75;

        if (
            Math.abs(
                keeper.velocityX
            ) < 0.05
        ) {
            keeper.velocityX = 0;
        }

        keeper.x += keeper.velocityX;
        return;
    }

    keeper.velocityX +=
        Math.sign(difference) *
        keeper.acceleration;

    keeper.velocityX = Math.max(
        -keeper.maxSpeed,
        Math.min(
            keeper.maxSpeed,
            keeper.velocityX
        )
    );

    keeper.x += keeper.velocityX;

    const leftLimit =
        game.goal.x +
        keeper.radius;

    const rightLimit =
        game.goal.x +
        game.goal.width -
        keeper.radius;

    keeper.x = Math.max(
        leftLimit,
        Math.min(
            rightLimit,
            keeper.x
        )
    );
}

function updateDiving() {
    const keeper = game.keeper;

    keeper.x +=
        keeper.diveDirection *
        keeper.diveSpeed;

    keeper.diveTimer++;

    const leftLimit =
        game.goal.x +
        keeper.radius;

    const rightLimit =
        game.goal.x +
        game.goal.width -
        keeper.radius;

    keeper.x = Math.max(
        leftLimit,
        Math.min(
            rightLimit,
            keeper.x
        )
    );

    if (
        keeper.diveTimer >=
        keeper.diveDuration
    ) {
        keeper.diving = false;
        keeper.diveTimer = 0;
        keeper.state = "recovering";
    }
}

function updateRecovery() {
    const keeper = game.keeper;

    keeper.targetX =
        canvas.width / 2;

    moveKeeper();

    if (
        Math.abs(
            keeper.x -
            keeper.targetX
        ) < 2
    ) {
        keeperResetAfterPlay();
    }
}

function checkKeeperSave() {
    const keeper = game.keeper;

    if (!game.ball.moving) {
        return;
    }

    if (keeper.hasTouchedBall) {
        return;
    }

    const dx =
        game.ball.x - keeper.x;

    const visualBallY =
        game.ball.y - game.ball.z;

    const dy =
        visualBallY -
        keeper.y;

    const distance = Math.sqrt(
        dx * dx +
        dy * dy
    );

    if (
        distance >
        keeper.reach
    ) {
        return;
    }
    
    keeper.hasTouchedBall = true;

    game.score.saves++;

    if (canCatchShot()) {
        catchBall();
    } else {
        deflectBall();
    }
}

function deflectBall() {
    const keeper = game.keeper;

    const dx =
        game.ball.x - keeper.x;

    const dy =
        (game.ball.y - game.ball.z) -
        keeper.y;

    const distance =
        Math.max(
            0.001,
            Math.sqrt(
                dx * dx +
                dy * dy
            )
        );

    const normalX =
        dx / distance;

    const normalY =
        dy / distance;

    const incomingSpeed =
        Math.sqrt(
            game.ball.velocityX *
            game.ball.velocityX +
            game.ball.velocityY *
            game.ball.velocityY
        );

    if (incomingSpeed < 8) {
        game.ball.velocityX = 0;
        game.ball.velocityY = 0;
        game.ball.velocityZ = 0;
        game.ball.moving = false;
        return;
    }

    game.ball.velocityX =
        normalX *
        incomingSpeed *
        0.65;

    game.ball.velocityY =
        Math.abs(normalY) *
        incomingSpeed *
        0.8;

    game.ball.velocityZ *= 0.55;
}

function catchBall() {
    game.ball.moving = false;

    game.ball.velocityX = 0;
    game.ball.velocityY = 0;
    game.ball.velocityZ = 0;

    game.keeper.state = "recovering";

    setTimeout(() => {
        resetAfterShot();
    }, 800);
}

function canCatchShot() {
    const speed = Math.sqrt(
        game.ball.velocityX * game.ball.velocityX +
        game.ball.velocityY * game.ball.velocityY
    );

    return speed < 8;
}

function clampKeeper() {
    const keeper = game.keeper;

    const minX =
        game.goal.x +
        keeper.radius;

    const maxX =
        game.goal.x +
        game.goal.width -
        keeper.radius;

    if (keeper.x < minX) {
        keeper.x = minX;
    }

    if (keeper.x > maxX) {
        keeper.x = maxX;
    }
}

function keeperResetAfterPlay() {
    const keeper = game.keeper;

    keeper.state = "idle";

    keeper.reacted = false;

    keeper.reactionTimer = 0;

    keeper.diving = false;

    keeper.diveDirection = 0;

    keeper.diveTimer = 0;

    keeper.hasTouchedBall = false;

    keeper.targetX =
        canvas.width / 2;

    keeper.predictedX =
        canvas.width / 2;
}
