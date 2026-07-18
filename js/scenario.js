function buildWall() {
    game.wall.length = 0;

    const scenario = game.scenarios[game.currentScenario];

    const spacing = 40;

    const startX =
        game.freeKick.x -
        ((scenario.wallPlayers - 1) * spacing) / 2;

    for (let i = 0; i < scenario.wallPlayers; i++) {
        game.wall.push({
            x: startX + i * spacing,
            y: game.freeKick.y - game.freeKick.wallDistance,
            radius: 16
        });
    }
}

function applyScenario() {
    const scenario = game.scenarios[game.currentScenario];

    game.freeKick.x = scenario.x;
    game.freeKick.y = scenario.y;
    game.freeKick.wallDistance = scenario.wallDistance;

    game.ball.x = game.freeKick.x;
    game.ball.y = game.freeKick.y;

    buildWall();
}

function nextScenario() {
    game.currentScenario++;

    if (game.currentScenario >= game.scenarios.length) {
        game.currentScenario = 0;
    }

    applyScenario();
}

function previousScenario() {
    game.currentScenario--;

    if (game.currentScenario < 0) {
        game.currentScenario = game.scenarios.length - 1;
    }

    applyScenario();
}

function resetFreeKick() {
    applyScenario();
}

resetFreeKick();
