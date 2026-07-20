function refillPositionBag() {
    game.positionBag = [];

    for (let i = 0; i < game.freeKickPositions.length; i++) {
        game.positionBag.push(i);
    }

    shufflePositionBag();
}

function shufflePositionBag() {
    for (let i = game.positionBag.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        const temp = game.positionBag[i];
        game.positionBag[i] = game.positionBag[randomIndex];
        game.positionBag[randomIndex] = temp;
    }
}

function getNextFreeKickPosition() {
    if (game.positionBag.length === 0) {
        refillPositionBag();
    }

    const index = game.positionBag.pop();

    game.currentPosition = game.freeKickPositions[index];

    return game.currentPosition;
}

function createWall() {
    game.wall.length = 0;

    const position = game.currentPosition;

    const players = position.wallPlayers;
    const spacing = 40;

    const startX =
        game.freeKick.x -
        ((players - 1) * spacing) / 2;

    for (let i = 0; i < players; i++) {
        game.wall.push({
            x: startX + i * spacing,
            y: game.freeKick.y - game.freeKick.wallDistance,
            radius: 16
        });
    }
}

function loadRandomFreeKick() {
    const position = getNextFreeKickPosition();

    game.freeKick.x = position.x;
    game.freeKick.y = position.y;
    game.freeKick.wallDistance = position.wallDistance;

    game.ball.x = game.freeKick.x;
    game.ball.y = game.freeKick.y;

    game.ball.moving = false;
    game.ball.velocityX = 0;
    game.ball.velocityY = 0;

    game.ball.curve = 0;
    game.ball.progress = 0;

    createWall();
}

refillPositionBag();
loadRandomFreeKick();
