var Jetty = require('jetty');
var Box   = require('./box');

var Bento = module.exports = function Bento(outputStream) {
  this.jetty = new Jetty(outputStream);
  this.jetty.hide().clear().moveTo([0,0]);
};

Bento.prototype.box = function box(options) {
  
  var _box = new Box();

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

  _box.setup(_options);
  _box.emit('initialize');

  // autodraw?
  if (true) {
    _box.emit('draw');
  }

  return _box;
};
