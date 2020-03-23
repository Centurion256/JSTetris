// render DOM nodes according to the playground definition
function renderPlayground() {
  renderPositions();
  let playgroundNode = document.getElementById('playground')
  playgroundNode.innerHTML = '';

  for (let rowIndex = playground.length - 1; rowIndex >= 0; rowIndex-- ) {
    let rowNode = createRow(rowIndex)
    for (let cellIndex = 0; cellIndex < playground[rowIndex].length; cellIndex++) {
      rowNode.appendChild(createCell(cellIndex, playground[rowIndex][cellIndex]))
    }
    playgroundNode.appendChild(rowNode);
  }
}

function renderNext(tetromino) {
  let next_display = createNextDisplay();
  let relative_positions = tetromino.position.map(tile => vectorOp(tile, [15, 0], (x,y) => x - y));
  for (let tile of relative_positions)
  {
    next_display[tile[0]][tile[1]] = TYPE_COLORS[tetromino.type];
  }
  let next_display_node = document.getElementById('next-tetromino');
  next_display_node.innerHTML = '';

  for (let row_index = next_display.length - 1; row_index >= 0; row_index --) {
    let row_node = createRow(row_index);
    for (let cell_index = 0; cell_index < next_display[row_index].length; cell_index++) {
      row_node.appendChild(createCell(cell_index, next_display[row_index][cell_index]));
    }
    next_display_node.appendChild(row_node); 
  }
}

function updateScore() {
  score_node.innerHTML = `Score: ${score}`;

}

// Creates <div class="row" id="row-9">
function createRow(rowIndex) {
  let rowNode = document.createElement('div');
  rowNode.setAttribute('id', `row-${rowIndex}`);
  rowNode.setAttribute('class', 'row');
  return rowNode;
}

// Creates <div class="cell cell-1">1</div>
function createCell(cellIndex, color) {
  let cellNode = document.createElement('div');
  cellNode.setAttribute('class', `cell cell-${cellIndex} ${color}`);
  return cellNode;
}