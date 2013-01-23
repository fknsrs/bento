var _           = require("underscore");
var Jetty       = require("jetty");

var Bento = module.exports = function Bento(config) {
  _.defaults(this, config, {
    jetty: new Jetty(process.stdout)
  });
  this.jetty.nuke();
};

Bento.Box         = require("./box");
Bento.Caret       = require("./caret");
Bento.Coord       = require("./coord");
Bento.Dimensions  = require("./dimensions");
Bento.Keypress    = require("./keypress");

Bento.prototype.box = function box(options) {
  
  // create a box
  var _box = new Bento.Box();

  // configure
  _.defaults(options, {
    jetty:      this.jetty,
    styles:     this.styles,
    position:   [0,0],
    dimensions: [0,0],
    caret:      [0,0],
    autoDraw:   true
  });

  options.position    = new Bento.Coord(options.position);
  options.dimensions  = new Bento.Dimensions(options.dimensions);
  options.caret       = new Bento.Caret(_box, options.caret);

  _box.emit("configure", options);

  return _box;
};
