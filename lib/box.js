var _         = require("underscore");
var util      = require("util");
var Stream    = require("stream").Stream;
var Bento     = require("./bento");
var Coord     = require("./coord");
var Caret     = require("./caret");

var Box = module.exports = function Box(options) {
  Stream.call(this);
  this.readable = true;
  this.writable = true;

  _.extend(this, options);
  this.caret = new Caret(this, options.caret);

  // listeners
  this.on("draw", this._draw);

  // init
  process.nextTick(function() {
    this.emit("initialize");
    if (options.autoDraw) {
      this.emit("draw");
    }
  }.bind(this));
  
};
util.inherits(Box, Stream);

Object.defineProperty(Box.prototype, "limit", {
  get: function() {
    return new Coord(this.height -1, this.width  -1);
  }
});

Object.defineProperty(Box.prototype, "height", {
  get: function() {
    return this.dimensions.height;
  }
});

Object.defineProperty(Box.prototype, "width", {
  get: function() {
    return this.dimensions.width;
  }
});

Box.prototype.caretInBounds = function caretInBounds() {
  return (
    this.caret.y >= 0              &&
    this.caret.x >= 0              &&
    this.caret.y <= this.limit.y   &&
    this.caret.x <= this.limit.x
  );
};

Box.prototype.write = function write(data) {
  this.emit("data", data);
  return !this.paused && this.writable;
};

// auto clear and write a full-width row
// this function is not multi-byte safe
Box.prototype.row = function row(str, styleFn) {
  this.caret.text(str, styleFn);
  if (this.caret.x < this.width) {
    this.caret.erase(this.width - this.caret.x);
  }
  return this.caret;
};

// default draw behavior
Box.prototype._draw = function _draw() {
  this.caret.reset();
};