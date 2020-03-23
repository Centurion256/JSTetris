var playground = createPlayground();

console.log(playground);

function createAndRender() {
  playground = createPlayground();
  renderPlayground();
}

// will add object positions to the emply playground array
function renderPositions() {
  objects.forEach( object => {
    object.position.forEach( ([rowIndex, cellIndex]) => {
      playground[rowIndex][cellIndex] = TYPE_COLORS[object.type]
    })
  });
}

function updateDown() {

  let currentObject = getCurrentObject();
  let overlaps_self = false;
  let move = true;
  let make_static = false;
  for (let new_tile of currentObject.position)
  {
    //console.log(`Before applying change_function: ${new_tile}`);
    new_tile = [new_tile[0]-1, new_tile[1]];
    //console.log(`After applying change_function: ${new_tile}`);
    if (new_tile[0] < 0)
    {
      move = false;
      make_static = true;
      break;
    }
    let overlaps_other = false;
    overlaps_self = overlaps(currentObject, new_tile);
    if (!overlaps_self)
    {
      overlaps_other = playground[new_tile[0]][new_tile[1]] != undefined;
      if (overlaps_other)
      {
        move = false;
        make_static = true;
        break;
      }
    }
  }
  if (move)
  {
    moveDown(currentObject);
    createAndRender();
  }
  else if (make_static)
  {
    currentObject.state = "static";
    let from = currentObject.position.reduce((min, curr) => curr[0] < min ? curr[0] : min, currentObject.position[0][0]);
    let to = currentObject.position.reduce((min, curr) => curr[0] > min ? curr[0] : min, currentObject.position[0][0]);
    console.log("---calling remove rows---");
    removeFilledRowsDynamic(from, to);
    createAndRender();
  }

}

function moveDown(obj) {

  //obj.position.forEach(position => {console.log(`old position: ${position}`)});
  obj.position.forEach(position => position[0]--);
  //obj.position.forEach(position => {console.log(`new position: ${position}`)});
}

function updateSidewards(change_function) {

  let currentObject = getCurrentObject();
  let overlaps_self = false;
  let move = true;
  for (let new_tile of currentObject.position)
  {

    //console.log(`Before applying change_function: ${new_tile}`);
    new_tile = change_function(new_tile);
    //console.log(`After applying change_function: ${new_tile}`);
    //if at least one tile is on the edge, do nothing
    //&& (new_tile[0] < HEIGHT) - redundant here
    if (!((new_tile[1] < WIDTH) && (new_tile[1] >= 0)))
    {
      move = false;
      break;
    } 
    overlaps_self = overlaps(currentObject, new_tile);
    //console.log(`overlaps_self: ${overlaps_self}`)
    let overlaps_other = false;
    //make sure that directional checks for tiles of the same block are ignored 
    if (!overlaps_self)
    {
      //perform a directional check
      //console.log(`playground at the new position: ${playground[new_tile[0]][new_tile[1]]}`)
      overlaps_other = playground[new_tile[0]][new_tile[1]] != undefined;
      //console.log(`overlaps_other: ${overlaps_other}`)
      //If there are no conflicts, promise to move the block
      if (overlaps_other)
      {
        move = false;
        break;
      }
    }
  }
  if (move)
  {
    moveSidewards(currentObject, change_function);
    createAndRender();
  }
}

function moveSidewards(obj, change_function) {
  
  //obj.position.forEach(position => {console.log(`old position: ${position}`)});
  for (let i = 0; i < obj.position.length; i++)
  {
    obj.position[i] = change_function(obj.position[i]);
  }
  //obj.position.forEach(position => {console.log(`new position: ${position}`)});

}

function pauseGame() {
  console.log('pausing the game');
  clearInterval(gameInterval);
} 
function startGame() {
  console.log('starting the game');
  gameInterval = setInterval(() => {
    updateState();
  }, 1000); 
}

function clearRow(row_index) {
  for (let i = 0; i < WIDTH; i++)
  {
    let coord = [row_index, i];
    let current_piece = getPiece(coord)
    console.log(`the current piece is: ${JSON.stringify(current_piece.position)}`);
    current_piece.position = removeTileFromPiece(current_piece, coord);
    playground[row_index][i] = undefined;
  }
}

function shiftDown(shift_index) {
  for (let piece of objects)
  {
    piece.position.forEach(tile => (tile[0] > shift_index) && tile[0]--);
  }
}

function removeFilledRowsDynamic(from, to) {
  
  let multiplier = 1;
  for (let row = from; row <= to; row++)
  {
    let filled = playground[row].every(tile => tile != undefined);
    if (filled)
    {
      //The scoring system is simple: each cleared row = 100 * 2^(number of rows cleared before).
      //The total can be calculated as $\sum_{n=0}^{cleared_rows} (2^n * 100)$.
      score += 100 * multiplier;
      multiplier *= 2;
      clearRow(row);
      shiftDown(row);
      row--; //check the shifted row again
      //an unefficient solution, can be replaced by a smarter shiftRow() function.
      createAndRender();
    }
  }
  updateScore();
  //TODO: Garbage collection

}

//DEPRECATED
function removeFilledRows(from, to) {

  let shift_index = from; //starting from which row should the blocks be shifted
  let decrement = 0;
  //determine how many rows to remove and clear removed rows
  for (let row = from; row >= to; row--)
  {
    let filled = true;
    for (let col = 0; col < WIDTH; col++)
    {
      if (playground[row][col] == undefined)
      {
        filled = false;
        break;
      }
    }
    console.log(`the row ${row} is filled - ${filled}`); 
    if (filled)
    {
      decrement++;
      shift_index = row;
      clearRow(row);
    }
  }
  //shift all rows above downwards
  if (decrement)
  {
    console.log("---shifting---"); 
    for (let row = shift_index; row < HEIGHT; row++)
    {
      for (let col = 0; col < WIDTH; col++)
      {
        let current_piece = getPiece([row, col]);
        if (current_piece != undefined) 
        {
          console.log("performing a tile shift..."); 
          current_piece.position.forEach(coordiate => console.log(`old coordinates: ${coordiate}`));
          for (let tile of current_piece.position)
          {

            if (tile[0] > row)
            {
              //correct, but unnecessary, redundant.
              let offset = decrement;
              while (offset > 0)
              {
                if (!((tile[0] - offset) < 0 || playground[tile[0]-offset][tile[1]] != undefined))
                {
                  break;
                }
                offset--;
  
              }
              tile[0] -= offset;
              let color = playground[row][col]
              playground[row][col] = undefined;
              playground[row-offset][col] = color;
            }
          }
          // current_piece.position.forEach(coordiate => coordiate[0]-=decrement);
          current_piece.position.forEach(coordiate => console.log(`new coordinates: ${coordiate}`));
          console.log("done.");
        }
      }
    }
  }

}

function updateState() {
  
  (getCurrentObject() == undefined) ? smartSpawn() : updateDown();
  createAndRender();

}

//for debug purposes only
function simpleSpawn() {
  console.log("spawning new piece");
  // let tile = {
  //   type: 'L',
  //   state: 'falling',
  //   position: [[9, 1], [8, 1], [7, 1], [7, 2]]
  // }
  let tile = {
        type: 'o',
        state: 'falling',
        position: [[9,0]]
  };
  objects.push(tile);
}

function smartSpawn() {
  console.log("smart-spawning new piece");
  createAndRender();
  //try to spawn a tetromino
  //end the game if the tile can't be spawned
  if (tetromino.position.some((tile) => playground[tile[0]][tile[1]] != undefined))
  {
    tetromino.position.forEach(tile => console.log(`tetromino game over position: ${tile}`))
    gameOver();
    return;
  }
  objects.push(JSON.parse(JSON.stringify(tetromino)));
  createAndRender();
  
  
  //Determine the next tetromino to spawn
  let keys = Object.keys(TETROMINOES);
  let tetromino_type = keys[Math.floor(Math.random() * keys.length)];
  let next_tetromino = {
    type: tetromino_type,
    state: 'falling',
    rotation_index: 0,
    position: JSON.parse(JSON.stringify(TETROMINOES[tetromino_type]))
  };
  let rotations = Math.floor(Math.random() * ROTATION_COUNT)
  for (let i = 0; i < rotations; i++) {
    console.log(`rotating ${i} time(s)`);
    rotatePiece(next_tetromino, Math.random() >= 0.5, true);
    createAndRender();
  }
  console.log(`next_tetromino before renderNext: ${JSON.stringify(next_tetromino.position)}`);
  renderNext(next_tetromino);
  tetromino = next_tetromino;
  tetromino.position.forEach(tile => console.log(`next tetromino postion: ${tile}`));
}

function gameOver() {
  document.removeEventListener("keydown", gameKeyHandler);
  reset_button_node.addEventListener("click", restartGameHandler);
  pauseGame();
  game_over_node.style.visibility = "visible";
}

function rotatePiece(obj, clockwise, to_offset) {
  
  let old_rotation_index = obj.rotation_index;
  obj.rotation_index = ((obj.rotation_index + (clockwise ? 1 : -1) % ROTATION_COUNT) + ROTATION_COUNT) % ROTATION_COUNT;
  console.log(`object's tiles: ${JSON.stringify(obj.position)}`)
  for (let i = 0; i < obj.position.length; i++) {

    playground[obj.position[i][0]][obj.position[i][1]] = undefined;
    obj.position[i] = rotateTile(obj.position[i], obj.position[0], clockwise); //remember, 0th tile is always the center tile
    

  }
  console.log(`object's NEW tiles: ${JSON.stringify(obj.position)}`)
  
  if (!to_offset)
  {
    obj.position.forEach((tile) => playground[tile[0]][tile[1]] = TYPE_COLORS[obj.type]);
    return;
  }

  let last_test;
  let test_passed = false;
  let test;
  switch(obj.type) {
    case 'I':
      test = applyTests(obj, old_rotation_index, I_OFFSETS);
      last_test = test[0];
      test_passed = test[1];
      break;
    case 'O':
      test = applyTests(obj, old_rotation_index, O_OFFSETS);
      last_test = test[0];
      test_passed = test[1];
      break;
    default:
      //JLSTZ case
      test = applyTests(obj, old_rotation_index, JLSTZ_OFFSETS);
      last_test = test[0];
      test_passed = test[1];
      break;
  }
  if (test_passed)
  {
    obj.position = obj.position.map((tile) => vectorOp(tile, last_test, (x,y) => x + y));
    obj.position.forEach((tile) => playground[tile[0]][tile[1]] = TYPE_COLORS[obj.type]);
    console.log(`after applying tests, the positions are: ${JSON.stringify(obj.position)}`);
  }
  else
  {
    console.log("All tests failed! resetting...");
    rotatePiece(obj, !clockwise, false);
  }

}

function rotateTile(tile, about, clockwise) {
  

  let relative = tile.map((elem, index) => elem - about[index]);
  // rot = [cos(x) -sin(x)]
  //       [sin(x)  cos(x)]
  // where x is the angle.
  //Since tiles are rotated by 90 (or -90) degrees, plug in x to get the following matrix:
  let rotation_matrix = clockwise ? [[0, -1], [1, 0]] : [[0, 1], [-1, 0]];
  //rotate the tile
  let rotated = matrixVectorMultiply(rotation_matrix, relative);
  return rotated.map((elem, index) => elem + about[index]);

}

function applyTests(obj, old_rotation_index, tester) {

  let can_offset = false;
  let last_test;
  let new_positions;
  let test_passed = false;
  for (let test_num = 0; test_num < tester.length; test_num++) {

    //move each tile by an offset and remove all tiles that overlap the rotated piece (this is needed for checking purposes)
    if (obj.type == "O" || obj.type == "I") {
    console.log(`now attempting test_num ${test_num} on object of type: ${obj.type} with rotation_index ${obj.rotation_index} and old_rotation_index=${old_rotation_index}`);
    }
    last_test = vectorOp(tester[test_num][old_rotation_index], tester[test_num][obj.rotation_index], (x,y) => x - y).reverse(); 
    new_positions = obj.position.map((tile) => vectorOp(tile, last_test, (x, y) => x + y));
    //TODO: proper overlap checks -- done.
    //Now check if the tile has valid coordinates and if it overlaps with some other piece (but not itself, all tiles that do were removed previously)
    can_offset = new_positions.every((tile) => isValid(tile) && playground[tile[0]][tile[1]] == undefined);
    if (can_offset) 
    {
      console.log(`test ${test_num+1} was successful`)
      test_passed = true;
      break;
    }
  }
  return [last_test, test_passed];
}

function updateRotate(clockwise) {
  let current_object = getCurrentObject();
  if (current_object == undefined)
  {
    //false positive
    return;
  }
  rotatePiece(current_object, clockwise, true);
  createAndRender();
}
// function createObj() {}

// Events
// 1. move to bottom
// 2. move right
// 3. move left
// 4. pause
// 5. game over
// 6. (re)render playground

renderPlayground()

// interval 4 second
startGame();