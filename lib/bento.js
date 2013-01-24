var _           = require("underscore");
var Jetty       = require("jetty");

var Bento = module.exports = function Bento(config, boxes) {

  // config
  _.defaults(this, config);

  // init boxes
  this.boxes = {};

  // auto init user-defined boxes
  if (_.isObject(boxes)) {
    _.each(boxes, function(options, name) {
      this.box(name, options);
    }.bind(this));
  }

  // initialize
  process.nextTick(this.initialize.bind(this, this.boxes));

  // hack: Bento.Caret should be the only thing that uses Jetty
  new Jetty(process.stdout).nuke();
};

Bento.Box         = require("./box");
Bento.Caret       = require("./caret");
Bento.Coord       = require("./coord");
Bento.Dimensions  = require("./dimensions");
Bento.Keypress    = require("./keypress");

Bento.prototype.initialize = function initialize(boxes) {
  _.each(this.boxes, function(box, name) {
    box.emit("initialize"); 
  });
};

Bento.prototype.box = function box(name, options) {
  
  // create a box
  var _box = new Bento.Box();

  // configure
  _.defaults(options, {
    bindings:   this.bindings[name],
    styles:     this.styles,
    name:       name,
    position:   [0,0],
    dimensions: [0,0],
    caret:      [0,0],
    autoDraw:   true
  });

  options.position    = new Bento.Coord(options.position);
  options.dimensions  = new Bento.Dimensions(options.dimensions);
  options.caret       = new Bento.Caret(_box, options.caret);

  // hack: this exists because _box must initialized constructing
  //       a new Caret
  _box.configure(options);

  // add to boxes
  this.boxes[name] = _box;

  return _box;
};
