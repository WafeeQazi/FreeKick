function calculateShot() {

    const pullX =
        game.shot.startX -
        game.shot.targetX;

    const pullY =
        game.shot.startY -
        game.shot.targetY;

    const pullDistance =
        Math.sqrt(
            pullX * pullX +
            pullY * pullY
        );

    if (pullDistance < 5) {
        return;
    }

    const power =
        Math.min(
            pullDistance / 14,
            game.shot.maxPower
        );

    game.shot.power = power;

    const directionX =
        pullX / pullDistance;

    const directionY =
        pullY / pullDistance;

    game.ball.velocityX =
        directionX * power;

    game.ball.velocityY =
        directionY * power;

    game.ball.velocityZ =
        power * 0.25;

    game.ball.spin =
        (
            game.shot.targetX -
            game.shot.startX
        ) *
        0.002;

    game.ball.moving = true;
}

function updateBall() {

    if (!game.ball.moving) {
        return;
    }

    applyPhysics();

    if (checkKeeperCollision()) {
        return;
    }

    if (checkWallCollision()) {
        return;
    }

    checkGoalPosts();

    checkCrossbar();

    checkGoal();

    checkOutOfBounds();
}

function applyPhysics() {

    const ball = game.ball;

    ball.x += ball.velocityX;

    ball.y += ball.velocityY;

    ball.z += ball.velocityZ;

    ball.velocityZ -=
        game.physics.gravity;

    ball.velocityX *=
        game.physics.airResistance;

    ball.velocityY *=
        game.physics.airResistance;

    ball.velocityX +=
        ball.spin;

    ball.spin *=
        game.physics.spinDecay;

    if (ball.z <= 0) {

        ball.z = 0;

        if (ball.velocityZ < 0) {

            ball.velocityZ *= -0.2;

        }

        ball.velocityX *=
            game.physics.groundFriction;

        ball.velocityY *=
            game.physics.groundFriction;

        if (
            Math.abs(ball.velocityX)
            <
            game.physics.minRollingSpeed
            &&
            Math.abs(ball.velocityY)
            <
            game.physics.minRollingSpeed
        ) {

            ball.velocityX = 0;

            ball.velocityY = 0;

            ball.velocityZ = 0;

        }

    }

    ball.rotating +=
        Math.sqrt(
            ball.velocityX *
            ball.velocityX +
            ball.velocityY *
            ball.velocityY
        ) *
        0.2;
}

function checkKeeperCollision() {

    const keeper = game.keeper;

    if (keeper.hasTouchedBall) {
        return false;
    }

    for (const hitbox of keeper.bodyHitboxes) {

        let hitboxX =
            keeper.x +
            hitbox.xOffset;

        if (keeper.diving) {

            hitboxX +=
                keeper.diveDirection * 25;

        }

        const hitboxY =
            keeper.y +
            hitbox.yOffset;

        const ballY =
            game.ball.y -
            game.ball.z;

        const dx =
            game.ball.x -
            hitboxX;

        const dy =
            ballY -
            hitboxY;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        const collisionDistance =
            game.ball.radius +
            hitbox.radius;

        if (
            distance >= collisionDistance ||
            distance === 0
        ) {
            continue;
        }

        keeper.hasTouchedBall = true;

        game.score.saves++;

        stopShot("save");

        return true;
    }

    return false;
}

function checkWallCollision() {

    for (const player of game.wall) {

        for (const hitbox of player.hitboxes) {

            const hitboxX =
                player.x +
                hitbox.xOffset;

            const hitboxY =
                player.y +
                hitbox.yOffset;

            const dx =
                game.ball.x -
                hitboxX;

            const dy =
                game.ball.y -
                hitboxY;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            const collisionDistance =
                game.ball.radius +
                hitbox.radius;



            if (
                distance >= collisionDistance ||
                distance === 0
            ) {
                continue;
            }

            const normalX =
                dx / distance;

            const normalY =
                dy / distance;

            const dot =
                game.ball.velocityX *
                normalX +
                game.ball.velocityY *
                normalY;

            if (dot < 0) {

                game.ball.velocityX -=
                    2 *
                    dot *
                    normalX;

                game.ball.velocityY -=
                    2 *
                    dot *
                    normalY;

                game.ball.velocityX *=
                    game.physics.wallBounce;

                game.ball.velocityY *=
                    game.physics.wallBounce;

            }

            const overlap =
                collisionDistance -
                distance +
                game.physics.collisionPush;

            game.ball.x +=
                normalX *
                overlap;

            game.ball.y +=
                normalY *
                overlap;

            return true;

        }

    }

    return false;
}

function checkGoalPosts() {

    const leftPost = {
        x: game.goal.x,
        y: game.goal.y
    };

    const rightPost = {
        x: game.goal.x + game.goal.width,
        y: game.goal.y
    };

    checkPostCollision(leftPost);

    checkPostCollision(rightPost);
}

function checkPostCollision(post) {

    const dx =
        game.ball.x -
        post.x;

    const dy =
        (game.ball.y - game.ball.z) -
        post.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const postRadius = 7;

    if (
        distance === 0 ||
        distance >
        game.ball.radius + postRadius
    ) {
        return;
    }

    const normalX =
        dx / distance;

    const normalY =
        dy / distance;

    const dot =
        game.ball.velocityX *
        normalX +
        game.ball.velocityY *
        normalY;

    if (dot < 0) {

        game.ball.velocityX -=
            2 *
            dot *
            normalX;

        game.ball.velocityY -=
            2 *
            dot *
            normalY;

        game.ball.velocityX *=
            game.physics.postBounce;

        game.ball.velocityY *=
            game.physics.postBounce;

    }

    const overlap =
        game.ball.radius +
        postRadius -
        distance;

    game.ball.x +=
        normalX *
        overlap;

    game.ball.y +=
        normalY *
        overlap;
}

function checkCrossbar() {

    if (
        game.ball.x <
        game.goal.x ||
        game.ball.x >
        game.goal.x +
        game.goal.width
    ) {
        return;
    }

    if (
        Math.abs(
            game.ball.y -
            game.goal.y
        )
        >
        game.ball.radius
    ) {
        return;
    }

    const height =
        game.goal.height;

    if (
        game.ball.z >= height - 6 &&
        game.ball.z <= height + 6
    ) {

        game.ball.velocityZ *=
            -game.physics.crossbarBounce;

    }
}

function checkGoal() {

    if (
        game.ball.z >
        game.goal.height
    ) {
        return;
    }

    if (

        game.ball.x >
        game.goal.x &&

        game.ball.x <
        game.goal.x +
        game.goal.width &&

        game.ball.y >
        game.goal.y &&

        game.ball.y <
        game.goal.y +
        game.goal.height

    ) {

        game.score.shots++;

        stopShot("goal");

    }

}

function checkOutOfBounds() {

    const speed =
        Math.sqrt(

            game.ball.velocityX *
            game.ball.velocityX +

            game.ball.velocityY *
            game.ball.velocityY +

            game.ball.velocityZ *
            game.ball.velocityZ

        );

    if (

        speed <
        0.15 &&

        game.ball.z === 0

    ) {

        stopShot();

        return;

    }

    if (

        game.ball.x <
        -100 ||

        game.ball.x >
        canvas.width + 100 ||

        game.ball.y <
        -100 ||

        game.ball.y >
        canvas.height + 100

    ) {

        stopShot();

    }

}

function stopShot(result = "miss") {

    if (!game.ball.moving) {
        return;
    }

    game.ball.moving = false;
    game.ball.velocityX = 0;
    game.ball.velocityY = 0;
    game.ball.velocityZ = 0;
    game.ball.spin = 0;
    game.ball.canShoot = false;

    setTimeout(() => {

        finishAttempt(result);

    }, 700);
}
