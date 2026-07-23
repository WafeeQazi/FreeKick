function gameLoop() {
    updateKeeper();
    updateBall();
    if (game.message.timer > 0) {
        game.message.timer--;
    }
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
