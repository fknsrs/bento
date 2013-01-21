var _     = require("underscore");
var Jetty = require("jetty");
var Box   = require("./box");

var Bento = module.exports = function Bento(config) {
  _.defaults(this, config, {
    jetty: new Jetty(process.stdout)
  });
  this.jetty.nuke();
};

Bento.Caret       = require("./caret");
Bento.Coord       = require("./coord");
Bento.Dimensions  = require("./dimensions");
Bento.Keypress    = require("./keypress");

Bento.prototype.box = function box(options) {
   
  // create a box
  var _box = new Box();

  // bind event listeners
  Object.keys(options).forEach(function(key) {
    if (typeof options[key] === "function") {
      _box.on(key, options[key]);
      delete options[key];
    }
  });

  // init
  _.defaults(options, {
    jetty: this.jetty,
    position:   [0,0],
    dimensions: [0,0],
    caret:      [0,0],
    autoDraw:   true
  });

  options.position    = new Bento.Coord(options.position);
  options.dimensions  = new Bento.Dimensions(options.dimensions);

  _box._initialize(options);

  return _box;
};
