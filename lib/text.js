var util = require("util");

var Widget = require("./widget");

var Text = module.exports = function Text(config) {
  if (!config) { config = {}; }

  Widget.call(this, config);

  this.content = config.content || "";
};
util.inherits(Text, Widget);
