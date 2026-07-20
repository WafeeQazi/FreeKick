function gameLoop() {
    updateBall();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
