var gameKeyHandler = (event) => {
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
};
var reset_button_node = document.querySelector("#info-panel > #game-over > button");
var game_over_node = document.getElementById("game-over");
var score_node = document.getElementById("score");

var restartGameHandler = () => {
  objects = [];
  score = 0;
  updateScore();
  createAndRender();
  game_over_node.style.visibility = "hidden";
  reset_button_node.removeEventListener("click", restartGameHandler);
  document.addEventListener("keydown", gameKeyHandler);
  startGame();
}



document.addEventListener("keydown", gameKeyHandler);