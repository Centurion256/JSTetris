var getCurrentObject =  () => objects.find(object => object.state === 'falling');
var createPlayground = () => (new Array(10).fill().map( el => (new Array(5).fill())));
var overlaps = (obj, tile) => obj.position.some(position => position.every((coordinate, index) => coordinate === tile[index]));
var getPiece = (coordinate) => objects.find(obj => overlaps(obj, coordinate));
var removeTileFromPiece = (piece, coordinate) => piece.position.filter(element => !element.every((x, index) => x === coordinate[index]));