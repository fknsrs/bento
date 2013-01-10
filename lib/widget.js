var events = require("events"),
    util = require("util");

var Widget = module.exports = function Widget(config) {
  events.EventEmitter.call(this);

  if (!config) { config = {}; }

  this.width = config.width;
  this.height = config.height;
};
util.inherits(Widget, events.EventEmitter);
