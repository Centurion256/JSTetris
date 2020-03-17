document.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case DOWN:
      updateDown();
      break;
    case LEFT:
      updateSidewards(([y,x]) => [y, x-1]);
      break;
    case RIGHT:
      updateSidewards(([y,x]) => [y, x+1]);
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