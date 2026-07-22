function resetKeeper() {
    const keeper = game.keeper;

    keeper.x = canvas.width / 2;
    keeper.y = 175;

    keeper.velocityX = 0;
    keeper.targetX = canvas.width / 2;

    keeper.state = "idle";

    keeper.reacted = false;
    keeper.reactionTimer = 0;

    keeper.predictedX = canvas.width / 2;

    keeper.diving = false;
    keeper.diveDirection = 0;
    keeper.diveTimer = 0;

    keeper.hasTouchedBall = false;
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
}

function updateIdle() {
    const keeper = game.keeper;

    keeper.velocityX = 0;

    if (!game.ball.moving) {
        return;
    }

    keeper.state = "reaction";
    keeper.reactionTimer = 0;
}

function updateReaction() {
    const keeper = game.keeper;

    keeper.reactionTimer++;

    const reactionFrames =
        Math.round(
            keeper.reactionTime / 16.67
        );

    if (
        keeper.reactionTimer <
        reactionFrames
    ) {
        return;
    }

    keeper.reacted = true;

    predictShot();

    keeper.state = "tracking";
}

function predictShot() {

    const keeper = game.keeper;
    const ball = game.ball;

    if (ball.velocityY >= -0.1) {

        keeper.predictedX =
            canvas.width / 2;

        keeper.targetX =
            keeper.predictedX;

        return;
    }

    const timeToGoal =
        (game.goal.y - ball.y) /
        ball.velocityY;

    let predictedX =
        ball.x +
        ball.velocityX * timeToGoal;

    predictedX +=
        ball.spin *
        timeToGoal *
        10;

    const minX =
        game.goal.x +
        keeper.radius;

    const maxX =
        game.goal.x +
        game.goal.width -
        keeper.radius;

    predictedX = Math.max(
        minX,
        Math.min(maxX, predictedX)
    );

    keeper.predictedX =
        predictedX;

    keeper.targetX =
        predictedX;
}

function updateTracking() {
    predictShot();

    const keeper = game.keeper;
    const ball = game.ball;

    if (!ball.moving) {
        keeper.state = "recovering";
        return;
    }

    const distance =
        Math.abs(
            keeper.targetX -
            keeper.x
        );

    const timeNeeded =
        distance /
        Math.max(
            keeper.maxSpeed,
            0.01
        );

    const timeRemaining =
        Math.abs(
            (game.goal.y - ball.y) /
            Math.min(
                ball.velocityY,
                -0.01
            )
        );

    if (
        distance > keeper.reach &&
        timeNeeded >
        timeRemaining * 0.8
    ) {
        keeper.state = "diving";

        keeper.diving = true;

        keeper.diveDirection =
            Math.sign(
                keeper.targetX -
                keeper.x
            );

        if (
            keeper.diveDirection === 0
        ) {
            keeper.diveDirection = 1;
        }

        return;
    }

    moveKeeper();
}

function moveKeeper() {

    const keeper = game.keeper;

    const difference =
        keeper.targetX -
        keeper.x;

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

        keeper.x +=
            keeper.velocityX;

        clampKeeper();

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

    keeper.x +=
        keeper.velocityX;

    clampKeeper();
}

function updateDiving() {

    const keeper = game.keeper;

    keeper.x +=
        keeper.diveDirection *
        keeper.diveSpeed;

    keeper.diveTimer++;

    clampKeeper();

    if (
        keeper.diveTimer >=
        keeper.diveDuration
    ) {

        keeper.diving = false;

        keeper.diveTimer = 0;

        keeper.state =
            "recovering";
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

function clampKeeper() {

    const keeper = game.keeper;

    const leftLimit =
        game.goal.x +
        keeper.radius;

    const rightLimit =
        game.goal.x +
        game.goal.width -
        keeper.radius;

    if (keeper.x < leftLimit) {
        keeper.x = leftLimit;
    }

    if (keeper.x > rightLimit) {
        keeper.x = rightLimit;
    }
}

function keeperResetAfterPlay() {

    const keeper = game.keeper;

    keeper.state = "idle";

    keeper.reacted = false;

    keeper.reactionTimer = 0;

    keeper.predictedX =
        canvas.width / 2;

    keeper.targetX =
        canvas.width / 2;

    keeper.velocityX = 0;

    keeper.diving = false;
    keeper.diveDirection = 0;
    keeper.diveTimer = 0;

    keeper.hasTouchedBall = false;
}
