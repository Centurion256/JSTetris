document.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case DOWN:
      if (!paused)
        updateDown();
      break;
    case LEFT:
      if (!paused)
        updateSidewards(([y,x]) => [y, x-1]);
      break;
    case RIGHT:
      if (!paused)
        updateSidewards(([y,x]) => [y, x+1]);
      break;
    case ROTATER:
      if (!paused)
        updateRotate(true);
      break;
    case ROTATEL:
      if (!paused)
        updateRotate(false);  
      break;
    case PAUSE:
      if (paused) {
        startGame();
      }
      else pauseGame();
      paused = !paused;
      break;
    default:
      break;
  }
});