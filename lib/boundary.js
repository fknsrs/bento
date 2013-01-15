var Coord = require("./coord");

var Boundary = module.exports = function Boundary(dimensions) {
  this.height = dimensions[0];
  this.width  = dimensions[1];
};

Object.defineProperty(Boundary.prototype, 'origin', {
  get: function() {
    return this.pos;
  },
  set: function(coord) {
    this.pos = coord instanceof Coord
      ? coord
      : new Coord(0,0)
    ;
  }
});

Object.defineProperty(Boundary.prototype, 'limit', {
  get: function() {
    return new Coord(
      this.height -1,
      this.width  -1
    );
  }
});

Boundary.prototype.caretInBounds = function caretInBounds(caret) {
  return (
    caret.y >= 0              &&
    caret.x >= 0              &&
    caret.y <= this.limit.y   &&
    caret.x <= this.limit.x
  );
};
