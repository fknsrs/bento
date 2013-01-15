var Coord = module.exports = function Coord(y, x) {

  // set via coord
  if (y instanceof Coord) {
    this.y = y.y;
    this.x = y.x;
  }

  // set via [y,x]
  else if (y instanceof Array) {
    this.y = y[0];
    this.x = y[1];
  }

  // set via y,x
  else {
    this.y = y || 0;
    this.x = x || 0;
  }
};

Coord.add = function add(a, b) {
  return new Coord(
    a.y + b.y,
    a.x + b.x
  );
};

Coord.prototype.toArray = function toArray() {
  return [this.y, this.x];
};
