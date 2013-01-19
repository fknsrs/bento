var Coord = require("./coord");

var Boundary = module.exports = function Boundary(dimensions) {
  this.height = dimensions[0];
  this.width  = dimensions[1];
};

Object.defineProperty(Boundary.prototype, "limit", {
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
