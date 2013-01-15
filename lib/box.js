var util      = require('util');
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

Box.prototype.setup = function setup(options) {
  this.jetty  = options.jetty;
  this.pos    = new Coord(options.position);
  this.bound  = new Boundary(options.dimensions);
  this.caret  = new Caret(this.pos, this.jetty);
};

Box.prototype.write = function write(data) {
  this.emit('data', data);
  return !this.paused && this.writable;
};

Box.prototype.clear = function clear() {
  for (var _i=0; _i<this.bound.height; _i++) {
    this.caret.moveTo(_i, this.bound.width);
    this.jetty.clearLine();
  }
};
