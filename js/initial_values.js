var objects = [{
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
  }
]

var paused = false;
var gameInterval;
var tetromino = {
  type: 'L',
  state: 'falling',
  rotation_index: 0,
  position: [[HEIGHT-1, 1], [HEIGHT-2, 1], [HEIGHT-2, 2], [HEIGHT-2, 3]]
};