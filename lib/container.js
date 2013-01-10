var util = require("util");

var Widget = require("./widget");

var CONTAINER_SPLIT = {
  horizontal: 1,
  vertical: 2,
};

var Container = module.exports = function Container(config) {
  if (!config) { config = {}; }

  Widget.call(this, config);

  this.split = config.split;

  this.children = [];
};
util.inherits(Container, Widget);

Container.SPLIT = CONTAINER_SPLIT;

Container.prototype.addWidget = function addWidget(widget, config) {
  this.children.push([widget, config || {}, {x: null, y: null}]);

  return this;
};

Container.prototype.reflow = function reflow() {
  var left = this.split === Container.SPLIT.horizontal ? this.width : this.height;

  this.children.forEach(function(e) {
    var child = e[0],
        config = e[1],
        position = e[2];

    child.width = null;
    child.height = null;

    position.x = null;
    position.y = null;

    if (this.split === Container.SPLIT.horizontal) {
      child.height = this.height;

      if (config.width) {
        child.width = config.width;
        left -= config.width;
      }
    } else {
      child.width = this.width;

      if (config.height) {
        child.height = config.height;
        left -= config.height;
      }
    }
  }.bind(this));

  var dynamic = this.children.filter(function(child) {
    return child[0].height === null || child[0].width === null;
  });

  dynamic.forEach(function(e) {
    var child = e[0];

    if (this.split === Container.SPLIT.horizontal) {
      child.width = Math.round(left / dynamic.length);
    } else {
      child.height = Math.round(left / dynamic.length);
    }
  }.bind(this));

  var last = 0;
  this.children.forEach(function(e) {
    var child = e[0],
        position = e[2];

    if (this.split === Container.SPLIT.horizontal) {
      position.x = last;
      position.y = 0;
      last += child.width;
    } else {
      position.x = 0;
      position.y = last;
      last += child.height;
    }

    if (typeof child.reflow === "function") {
      child.reflow();
    }
  });

  process.nextTick(this.emit.bind(this, "reflow"));

  return this;
};
