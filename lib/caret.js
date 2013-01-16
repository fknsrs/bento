var Coord = require("./coord");

var Caret = module.exports = function Caret(offset, jetty) {
  this.offset = new Coord(offset);
  this.pos    = new Coord(offset);
  this.jetty  = jetty;
};

Object.defineProperty(Caret.prototype, 'y', {
  get: function() {
    return this.pos.y;
  },
  set: function(y) {
    return this.pos.y = y;
  }
});

Object.defineProperty(Caret.prototype, 'x', {
  get: function() {
    return this.pos.x;
  },
  set: function(x) {
    return this.pos.x = x;
  }
});

// Caret.prototype.addY = function addY(y) {
//   this.pos = new Coord(this.y+y, this.x);
//   this.move();
// };

// Caret.prototype.addX = function addX(n) {
//   this.pos = new Coord(this.y, this.x+x);
//   this.move();
// };

Caret.prototype.moveTo = function moveTo(y, x) {
  if (typeof y === "number") this.y = y;
  else if (typeof y === "string") this.y += parseInt(y);
  if (typeof x === "number") this.x = x;
  else if (typeof x === "string") this.x += parseInt(x);
  this.move();
};

Caret.prototype.move = function move() {
  this.jetty.moveTo(Coord.add(this.offset, this.pos).toArray());
};
