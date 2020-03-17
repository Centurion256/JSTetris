var objects = [{
    type: 'L',
    state: 'falling',
    position: [[9, 1], [8, 1], [8, 2], [8, 3]]
  }, {
    type: 'T',
    state: 'static',
    position: [[3, 2], [3, 3], [3, 4], [2, 3]]
  }, {
    type: 'L',
    state: 'static',
    position: [[2, 0], [1, 0], [0, 0], [0, 1]]
  }, {
    type: 'I',
    state: 'static',
    position: [[2, 2], [1, 2], [0, 2]]
  }
]

var paused = false;
var gameInterval;