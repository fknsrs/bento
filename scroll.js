var fs = require('fs');

// Jetty
var Jetty = require('jetty');
var jetty = new Jetty(process.stdout);
jetty.clear().hide().moveTo([0,0]);


// capture stream
var Stream = require('stream').Stream;
var util = require('util');
var Prompt = function(inputStream) {
  Stream.call(this);
  this.writable = true;
  this.readable = true;
  this._str = '';
  this._outputLine = 0;

  // input stream
  inputStream.resume();
  inputStream.setRawMode(true);
  inputStream.pipe(this);
};
util.inherits(Prompt, Stream);

// todo: we should limit this to only accept one byte
// todo: handle multibyte
Prompt.prototype.write = function(buffer) {
  
  // break?
  switch(buffer[0]) {
    
    // Ctrl-C
    case 0x03:
      this.emit('end');
      return;

    // arrows
    case 0x1b:

      if (buffer[1] == 0x5b) {
        // up
        if (buffer[2] == 0x41) {
          this.emit('scrollUp');
        }
        // down
        else if (buffer[2] == 0x42) {
          this.emit('scrollDown');
        }
      }
      
  }

  return this.writable;
};


var prompt = new Prompt(process.stdin);

prompt.on('end', function(){
  console.log('exiting program...');
  process.exit();
});

var ScrollableBox = function() {
  // this._dim = [20, 40];
  this._buffer = fs.readFileSync('chats.txt').toString().split(/\n/);
  this._scrollPos = -1;
};

ScrollableBox.prototype.scrollUp = function() {
  this._scrollPos--;
  this.draw();
};

ScrollableBox.prototype.scrollDown = function() {
  this._scrollPos++;
  if (this._scrollPos > 0){
    this._scrollPos = 0;
  }
  this.draw();
};

ScrollableBox.prototype.clear = function() {
  for (var _y=0; _y<20; _y++) {
    jetty.moveTo([_y,40]).clearLine();  
  }
};

ScrollableBox.prototype.draw = function() {
  this.clear();
  jetty.moveTo([0,0]);
  var _line = 0;
  this._buffer.slice(-20+this._scrollPos, this._scrollPos).forEach(function(line){
    jetty.text(line.slice(0, 40)).moveTo([_line++,0]);
  }.bind(this));
};

var box = new ScrollableBox();
box.draw();

prompt.on('scrollUp', box.scrollUp.bind(box));
prompt.on('scrollDown', box.scrollDown.bind(box));