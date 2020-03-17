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
    console.log(`Before applying change_function: ${new_tile}`);
    new_tile = [new_tile[0]-1, new_tile[1]];
    console.log(`After applying change_function: ${new_tile}`);
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
    let to = currentObject.position.reduce((min, curr) => curr[0] < min ? curr[0] : min, currentObject.position[0][0]);
    let from = currentObject.position.reduce((min, curr) => curr[0] > min ? curr[0] : min, currentObject.position[0][0]);
    console.log("---calling remove rows---");
    removeFilledRows(from, to);
    createAndRender();
  }

}

function moveDown(obj) {

  obj.position.forEach(position => {console.log(`old position: ${position}`)});
  obj.position.forEach(position => position[0]--);
  obj.position.forEach(position => {console.log(`new position: ${position}`)});
}

// function moveDown() {
//   console.log('moving down')
//   // 1. get current object - done
//   let currentObject = getCurrentObject();

//   // 2. re-define objects - done
//   console.log(objects)
//   currentObject.position.forEach(position => (position[0] > 0 && (position[0] -= 1)))
//   console.log(objects)
  
//   // 3. re-define clear playground


//   // 4. re-renderPositions
//   // 5. re-renderPlayground

// }

function updateSidewards(change_function) {

  let currentObject = getCurrentObject();
  let overlaps_self = false;
  let move = true;
  for (let new_tile of currentObject.position)
  {

    console.log(`Before applying change_function: ${new_tile}`);
    new_tile = change_function(new_tile);
    console.log(`After applying change_function: ${new_tile}`);
    //if at least one tile is on the edge, do nothing
    //&& (new_tile[0] < HEIGHT) - redundant here
    if (!((new_tile[1] < WIDTH) && (new_tile[1] >= 0)))
    {
      move = false;
      break;
    } 
    overlaps_self = overlaps(currentObject, new_tile);
    console.log(`overlaps_self: ${overlaps_self}`)
    let overlaps_other = false;
    //make sure that directional checks for tiles of the same block are ignored 
    if (!overlaps_self)
    {
      //perform a directional check
      console.log(`playground at the new position: ${playground[new_tile[0]][new_tile[1]]}`)
      overlaps_other = playground[new_tile[0]][new_tile[1]] != undefined;
      console.log(`overlaps_other: ${overlaps_other}`)
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
  // console.log('moving sidewards');
  // obj.position.forEach(position => {console.log(`old position: ${position}`)});
  // obj.position.forEach(position => {position = change_function(position)});
  // obj.position.forEach(position => {console.log(`new position: ${position}`)});

  // obj.position.map(change_function);
  
  obj.position.forEach(position => {console.log(`old position: ${position}`)});
  for (let i = 0; i < obj.position.length; i++)
  {
    obj.position[i] = change_function(obj.position[i]);
  }
  obj.position.forEach(position => {console.log(`new position: ${position}`)});

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
    current_piece.position = removeTileFromPiece(current_piece, coord);
  }
}

function removeFilledRows(from, to) {

  let shift_index = from; //starting from which row should the blocks be sifted
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

            if (tile[0] > shift_index)
            {
              //correct, but unnecessary, redundant.
              // let offset = decrement;
              // while (offset > 0)
              // {
              //   if (!(tile[0] - offset < 0 || playground[tile[0]-offset][tile[1]] != undefined))
              //   {
              //     break;
              //   }
              //   offset--;
  
              // }
              tile[0] -= decrement;
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
  
  (getCurrentObject() == undefined) ? simpleSpawn() : updateDown();
  createAndRender();

}
//Temporary function
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