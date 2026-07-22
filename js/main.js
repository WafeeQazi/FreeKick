function gameLoop() {
    updateKeeper();
    updateBall();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
