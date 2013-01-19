var Jetty = require('jetty');
var Box   = require('./box');

var Bento = module.exports = function Bento(outputStream) {
  this.jetty = new Jetty(outputStream);
  this.jetty.hide().clear().moveTo([0,0]);
};

Bento.Keypress = require('./keypress');
Bento.prototype.box = function box(options) {
   
  // create a box
  var _box = new Box();

  // merge options
  var _options = {
    jetty:      this.jetty,
    position:   [0,0],
    dimensions: [0,0],
    autoDraw:   true
  };

  Object.keys(options).forEach(function(key) {
    // event
    if (typeof options[key] === 'function') {
      _box.on(key, options[key]);
    }
    // non-event
    else {
      _options[key] = options[key];
    }
  });

  // init
  _box._initialize(_options);
  return _box;
};
