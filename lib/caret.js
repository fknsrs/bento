var _     = require("underscore");
var Coord = require("./coord");

var Caret = module.exports = function Caret(box, origin) {
  this.box      = box;
  this.origin   = new Coord(origin || [0,0]);
  this.position = new Coord(origin || [0,0]);
};

Object.defineProperty(Caret.prototype, 'y', {
  get: function() {
    return this.position.y;
  },
  set: function(y) {
    return this.position.y = y;
  }
});

Object.defineProperty(Caret.prototype, 'x', {
  get: function() {
    return this.position.x;
  },
  set: function(x) {
    return this.position.x = x;
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

// output text and advance cursor position
Caret.prototype.text = function text(str, styleFn) {
  this.x += str.length;
  return this.box.jetty.text(str, styleFn);
};

Caret.prototype.erase = function erase(n, styleFn) {
  this.x += n;
  return this.box.jetty.erase(n, styleFn);
};

Caret.prototype.reset = function reset() {
  this.moveTo(this.origin.y, this.origin.x);
};

Caret.prototype.moveTo = function moveTo(y, x) {
  if (typeof y === "number") this.y = y;
  else if (typeof y === "string") this.y += parseInt(y);
  if (typeof x === "number") this.x = x;
  else if (typeof x === "string") this.x += parseInt(x);
  return this.move();
};

Caret.prototype.move = function move() {
  return this.box.jetty.moveTo(Coord.add(this.box.position, this.position).toArray());
};

Caret.prototype.clear = function clear(n) {
  return this.box.jetty.clear(n);
};
