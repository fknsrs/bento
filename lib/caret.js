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

Caret.prototype.moveTo = function moveTo(y, x) {
  this.pos = new Coord(y, x);
  this.move();
};

Caret.prototype.move = function move() {
  this.jetty.moveTo(Coord.add(this.offset, this.pos).toArray());
};
