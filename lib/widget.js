var Steez = require("steez"),
    util = require("util");

var Widget = module.exports = function Widget(config) {
  Steez.call(this);

  if (!config) { config = {}; }

  this.width = config.width;
  this.height = config.height;
};
util.inherits(Widget, Steez);
