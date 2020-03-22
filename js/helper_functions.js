var getCurrentObject =  () => objects.find(object => object.state === 'falling');
var createPlayground = () => (new Array(HEIGHT).fill().map( el => (new Array(WIDTH).fill())));
var createNextDisplay = () => (new Array(5).fill().map(el => (new Array(5).fill())));
var overlaps = (obj, tile) => obj.position.some(position => position.every((coordinate, index) => coordinate === tile[index]));
var isValid = (coordinate) => (coordinate[0] >= 0 && coordinate[0] < HEIGHT) && (coordinate[1] >= 0 && coordinate[1] < WIDTH);
var getPiece = (coordinate) => objects.find(obj => overlaps(obj, coordinate));
var removeTileFromPiece = (piece, coordinate) => piece.position.filter(element => !element.every((x, index) => x === coordinate[index]));
var matrixVectorMultiply = (matrix, vector) => matrix.map((curr_row) => curr_row.reduce((sum, val, val_index) => sum + (val*vector[val_index]), 0));
var vectorOp = (x, y, func) => x.map((val, index) => func(val, y[index]));

console.log(matrixVectorMultiply([[1,0], [0,1]], [2, -3]))