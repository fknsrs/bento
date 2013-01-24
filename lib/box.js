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
  
  // bind event first responders
  this.once("initialize", this._initialize);
  this.on("draw", this._draw);

  // bind custom listeners; remove from options
  _.each(_.functions(options), function(event) {
    this.on(event, options[event]);
    delete options[event];
  }.bind(this));

  // dependent objects
  options.position    = new Bento.Coord(options.position);
  options.dimensions  = new Bento.Dimensions(options.dimensions);
  options.caret       = new Bento.Caret(this, options.caret);

  // extend
  _.extend(this, options);

  // auto bind keypress listeners
  if (_.isObject(this.bindings)) {
    this.on("keypress", this._keypress);
  }
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

// default initializer
Box.prototype._initialize = function _initialize() {
  if (this.autoDraw) {
    process.nextTick(this.emit.bind(this, "draw"));
  }
};

// default keypress
Box.prototype._keypress = function keypress(keypress) {
  _.each(this.bindings, function(sequence, event) {
    if (sequence === keypress.sequence) {
      this.emit(event);
    }
  }.bind(this));
};

// default draw behavior
Box.prototype._draw = function _draw() {
  this.caret.reset();
};
