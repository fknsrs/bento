var Jetty = require('jetty');
var Box   = require('./box');

var Bento = module.exports = function Bento(outputStream) {
  this.jetty = new Jetty(outputStream);
  this.jetty.hide().clear().moveTo([0,0]);
};

Bento.mergeObjects = function mergeObjects(defaults, options) {
  
  return defaults;
};

Bento.prototype.box = function box(options) {
  
  var _box = new Box();

  var _options = {
    jetty:      this.jetty,
    position:   [0,0],
    dimensions: [0,0], 
    autoDraw:   true,
    initialize: function initialize() {},
    draw:       function draw() {},
  };

  Object.keys(options).forEach(function(key) {
    _options[key] = typeof options[key] === 'function'
      ? _box[key] = options[key].bind(_box)
      : options[key]
    ;
  });

  _box.setup(_options);

  // init
  _box.initialize();

  // autodraw?
  if (true) {
    _box.draw();
  }

  return _box;
};
