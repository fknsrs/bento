var _         = require("underscore");
var util      = require("util");
var Stream    = require("stream").Stream;
var Bento     = require("./bento");
var Coord     = require("./coord");
var Caret     = require("./caret");

var Box = module.exports = function Box() {
  Stream.call(this);
  this.readable = true;
  this.writable = true;
  this.on("configure", this.configure);
};
util.inherits(Box, Stream);

Box.prototype.configure = function configure(options) {

  // bind event listeners
  this.on("draw", this._draw);

  Object.keys(options).forEach(function(key) {
    if (typeof options[key] === "function") {
      this.on(key, options[key]);
      delete options[key];
    }
  }.bind(this));

  // extend
  _.extend(this, options);
  
  // init
  this.emit("initialize");
  if (options.autoDraw) {
    this.emit("draw");
  }
};

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