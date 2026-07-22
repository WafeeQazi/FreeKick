function calculateShot() {
    const pullX = game.shot.startX - game.shot.targetX;
    const pullY = game.shot.startY - game.shot.targetY;

    const pullDistance = Math.sqrt(
        pullX * pullX +
        pullY * pullY
    );

    if (pullDistance < 5) {
        return;
    }

    const power = Math.min(
        pullDistance / 14,
        game.shot.maxPower
    );

    game.shot.power = power;

    const directionX = pullX / pullDistance;
    const directionY = pullY / pullDistance;

    game.ball.velocityX = directionX * power;
    game.ball.velocityY = directionY * power;

    game.ball.velocityZ = power * 0.25;

    game.ball.spin =
        (game.shot.targetX - game.shot.startX) * 0.002;

    game.ball.moving = true;
}

function updateBall() {
    if (!game.ball.moving) {
        return;
    }

    applyPhysics();

    checkWallCollision();
    checkKeeperCollision();
    checkGoalPosts();
    checkCrossbar();
    checkGoal();
    checkOutOfBounds();
}

function applyPhysics() {
    game.ball.x += game.ball.velocityX;
    game.ball.y += game.ball.velocityY;
    game.ball.z += game.ball.velocityZ;

    game.ball.velocityZ -= game.physics.gravity;

    game.ball.velocityX *= game.physics.airResistance;
    game.ball.velocityY *= game.physics.airResistance;

    game.ball.velocityX += game.ball.spin;
    game.ball.spin *= 0.98;

    if (game.ball.z <= 0) {
        game.ball.z = 0;

        if (game.ball.velocityZ < 0) {
            game.ball.velocityZ *= -0.2;
        }

        game.ball.velocityX *= game.physics.groundFriction;
        game.ball.velocityY *= game.physics.groundFriction;

        if (
            Math.abs(game.ball.velocityX) < 0.05 &&
            Math.abs(game.ball.velocityY) < 0.05
        ) {
            game.ball.velocityX = 0;
            game.ball.velocityY = 0;
            game.ball.velocityZ = 0;
        }
    }

    game.ball.rotating +=
        Math.sqrt(
            game.ball.velocityX *
            game.ball.velocityX +
            game.ball.velocityY *
            game.ball.velocityY
        ) * 0.2;
}

function checkKeeperCollision() {
    const keeper = game.keeper;

    if (keeper.hasTouchedBall) {
        return;
    }

    const dx = game.ball.x - keeper.x;

    const dy =
        (game.ball.y - game.ball.z) -
        keeper.y;

    const distance = Math.sqrt(
        dx * dx +
        dy * dy
    );

    const hitDistance =
        game.ball.radius +
        keeper.radius;

    if (distance > hitDistance) {
        return;
    }

    keeper.hasTouchedBall = true;

    const speed = Math.sqrt(
        game.ball.velocityX *
        game.ball.velocityX +
        game.ball.velocityY *
        game.ball.velocityY
    );

    game.score.saves++;

    if (speed < 8) {
        game.ball.velocityX = 0;
        game.ball.velocityY = 0;
        game.ball.velocityZ = 0;
        game.ball.moving = false;
        return;
    }

    const normalX = dx / distance;
    const normalY = dy / distance;

    game.ball.velocityX =
        normalX * speed * 0.55;

    game.ball.velocityY =
        normalY * speed * 0.55;

    game.ball.velocityZ *= 0.5;
}

function checkWallCollision() {
    for (const player of game.wall) {
        const dx = game.ball.x - player.x;
        const dy = game.ball.y - player.y;

        const distance = Math.sqrt(
            dx * dx +
            dy * dy
        );

        const minDistance =
            game.ball.radius +
            player.radius;

        if (
            distance >= minDistance ||
            distance === 0
        ) {
            continue;
        }

        const normalX = dx / distance;
        const normalY = dy / distance;

        const dot =
            game.ball.velocityX * normalX +
            game.ball.velocityY * normalY;

        game.ball.velocityX -=
            2 * dot * normalX;

        game.ball.velocityY -=
            2 * dot * normalY;

        game.ball.velocityX *= 0.55;
        game.ball.velocityY *= 0.55;

        const overlap =
            minDistance - distance;

        game.ball.x += normalX * overlap;
        game.ball.y += normalY * overlap;
    }
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
    const dx = game.ball.x - post.x;
    const dy = game.ball.y - post.y;

    const distance = Math.sqrt(
        dx * dx +
        dy * dy
    );

    const postRadius = 7;

    if (
        distance === 0 ||
        distance > game.ball.radius + postRadius
    ) {
        return;
    }

    const normalX = dx / distance;
    const normalY = dy / distance;

    const dot =
        game.ball.velocityX * normalX +
        game.ball.velocityY * normalY;

    game.ball.velocityX -=
        2 * dot * normalX;

    game.ball.velocityY -=
        2 * dot * normalY;

    game.ball.velocityX *= 0.8;
    game.ball.velocityY *= 0.8;

    const overlap =
        game.ball.radius +
        postRadius -
        distance;

    game.ball.x += normalX * overlap;
    game.ball.y += normalY * overlap;
}

function checkCrossbar() {
    const crossbarHeight = game.goal.height;

    if (
        game.ball.x < game.goal.x ||
        game.ball.x > game.goal.x + game.goal.width
    ) {
        return;
    }

    if (
        Math.abs(game.ball.y - game.goal.y) >
        game.ball.radius
    ) {
        return;
    }

    if (
        game.ball.z >= crossbarHeight - 6 &&
        game.ball.z <= crossbarHeight + 6
    ) {
        game.ball.velocityZ *= -0.75;
    }
}

function checkGoal() {
    if (game.ball.z > game.goal.height) {
        return;
    }

    if (
        game.ball.x > game.goal.x &&
        game.ball.x < game.goal.x + game.goal.width &&
        game.ball.y > game.goal.y &&
        game.ball.y < game.goal.y + game.goal.height
    ) {
        game.score.goals++;
        game.score.shots++;

        stopShot();
    }
}

function checkOutOfBounds() {
    const speed = Math.sqrt(
        game.ball.velocityX *
        game.ball.velocityX +
        game.ball.velocityY *
        game.ball.velocityY +
        game.ball.velocityZ *
        game.ball.velocityZ
    );

    if (
        speed < 0.15 &&
        game.ball.z === 0
    ) {
        stopShot();
        return;
    }

    if (
        game.ball.x < -100 ||
        game.ball.x > canvas.width + 100 ||
        game.ball.y < -100 ||
        game.ball.y > canvas.height + 100
    ) {
        stopShot();
    }
}

function stopShot() {
    game.ball.moving = false;

    setTimeout(() => {
        resetAfterShot();
    }, 700);
}
