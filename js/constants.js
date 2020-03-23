const HEIGHT = 20;
const WIDTH = 10;
const NEXT_WIDTH = 5;
const ROTATION_COUNT = 4;
const TEST_COUNT = 5;

const TYPE_COLORS = {
  "L": 'red',
  "T": 'purple',
  "I": 'green',
  "o": 'magneta',
  "J": 'orange',
  "O": 'yellow',
  "S": 'green',
  "Z": 'red'
}
const INITIAL_OBJECTS = [{
  type: 'T',
  state: 'static',
  rotation_index: 0,
  position: [[3, 2], [3, 3], [3, 4], [2, 3]]
}, {
  type: 'L',
  state: 'static',
  position: [[2, 0], [1, 0], [0, 0], [0, 1]]
}, {
  type: 'I',
  state: 'static',
  rotation_index: 0,
  position: [[2, 2], [1, 2], [0, 2]]
}];

const INITIAL_POSITIONS = {
  "L": [[9, 1], [8, 1], [8, 2], [8, 3]],
  "T": [[9, 2], [9, 3], [9, 4], [8, 3]],
  "I": [[9, 2], [8, 2], [7, 2]]
}
//the first tile is the rotational tile.
const TETROMINOES = {
  "I": [[HEIGHT-2, 1], [HEIGHT-2, 0], [HEIGHT-2, 2], [HEIGHT-2, 3]],
  "J": [[HEIGHT-2, 1], [HEIGHT-1, 0], [HEIGHT-2, 0], [HEIGHT-2, 2]],
  "L": [[HEIGHT-2, 1], [HEIGHT-1, 2], [HEIGHT-2, 2], [HEIGHT-2, 0]],
  "O": [[HEIGHT-2, 1], [HEIGHT-1, 1], [HEIGHT-2, 2], [HEIGHT-1, 2]],
  "S": [[HEIGHT-2, 1], [HEIGHT-2, 0], [HEIGHT-1, 1], [HEIGHT-1, 2]],
  "T": [[HEIGHT-2, 1], [HEIGHT-1, 1], [HEIGHT-2, 2], [HEIGHT-2, 0]],
  "Z": [[HEIGHT-2, 1], [HEIGHT-1, 1], [HEIGHT-1, 0], [HEIGHT-2, 2]]
}

//There are five tests and four possible rotations. 
//for more info, please refer to http://harddrop.com/wiki/SRS.
const JLSTZ_OFFSETS = [
  [[0, 0], [0, 0], [0, 0], [0, 0]],
  [[0, 0], [1, 0], [0, 0], [-1, 0]],
  [[0, 0], [1, -1], [0, 0], [-1, -1]],
  [[0, 0], [0, 2], [0, 0], [0, 2]],
  [[0, 0], [1, 2], [0, 0], [1, 2]]
];
const I_OFFSETS = [
  [[0, 0], [-1, 0], [-1, 1], [0, 1]],
  [[-1, 0], [0, 0], [1, 1], [0, 1]],
  [[2, 0], [0, 0], [2, 1], [0, 1]],
  [[-1, 0], [0, 1], [1, 0], [0, -1]],
  [2, 0], [0, -2], [-2, 0], [0, 2]
];
const O_OFFSETS = [
  [[0, 0], [0, -1], [-1, -1], [-1, 0]]
];


// Event keys
const DOWN  = 40;
const LEFT  = 37;
const RIGHT = 39;
const PAUSE = 32;
const ROTATER = 82;
const ROTATEL = 81;