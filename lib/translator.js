var Steez = require("steez"),
    util = require("util");

var Translator = module.exports = function Translator(widget, position) {
  Steez.call(this);

  this.widget = widget;
  this.position = position;
};
util.inherits(Translator, Steez);
