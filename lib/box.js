var util      = require("util");
var Stream    = require("stream").Stream;
var Coord     = require("./coord");
var Caret     = require("./caret");
var Boundary  = require("./boundary");

var Box = module.exports = function Box(options) {
  Stream.call(this);
  this.readable = true;
  this.writable = true;
};
util.inherits(Box, Stream);

Box.prototype._initialize = function _initialize(options) {
  this.jetty  = options.jetty;
  this.pos    = new Coord(options.position);
  this.bound  = new Boundary(options.dimensions);
  this.caret  = new Caret(this.pos, this.jetty);

  // listeners
  this.on("draw", this._draw);

  // init
  this.emit("initialize");

  // autodraw?
  if (options.autoDraw) {
    this.emit("draw");
  }
};

Box.prototype.write = function write(data) {
  this.emit("data", data);
  return !this.paused && this.writable;
};

// auto clear and write a full-width row
Box.prototype.row = function row(str, styleFn) {
  this.jetty.erase(this.bound.width);
  this.caret.moveTo(null, 0);
  this.jetty.text(str, styleFn);
};

// default draw behavior
Box.prototype._draw = function _draw() {

};