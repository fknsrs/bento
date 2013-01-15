
// requires
var fs = require('fs');
var Bento = require('./lib/bento');
var Prompt = require('./lib/prompt');

// setup bento
var bento = new Bento(process.stdout);

// setup prompt
var prompt = new Prompt(process.stdin);
prompt.on('end', function(){
  bento.jetty.clear().show();
  console.log('exiting program...');
  process.exit();
});

// custom keypress events
prompt.on('keypress', function(buffer) {
  switch (buffer[0]) {
    case 0x1b:

      if (buffer[1] == 0x5b) {
        // up-arrow
        if (buffer[2] == 0x41) {
          this.emit('scrollUp');
        }
        // down-arrow
        else if (buffer[2] == 0x42) {
          this.emit('scrollDown');
        }
      }
  }
});

// create a widget
var scrolly = bento.box({
  dimensions: [20, 40],
  initialize: function initialize() {
    this.buffer = fs.readFileSync('chats.txt').toString().split(/\n/);
    this.scrollPos = 0;  
  },
  scrollUp: function scrollUp() {
    this.scrollPos--;
    this.draw();
  },
  scrollDown: function scrollDown() {
    this.scrollPos++;
    if (this.scrollPos > 0){
      this.scrollPos = 0;
    }
    this.draw();
  },
  draw: function draw() {
    this.clear();
    
    this.caret.moveTo(this.bound.limit.y, 0);
    var _line, _i = this.buffer.length - 1 + this.scrollPos;
    while (this.bound.caretInBounds(this.caret)) {
      _line = this.buffer[_i];
      if (_line) {
        this.jetty.text(_line.slice(0, 40));
      }
      // out of range
      else {
        this.scrollPos++;
      }
      
      this.caret.y = this.caret.y - 1;
      this.caret.move();
      _i -= 1;
    }
  }
});

prompt.on('scrollUp', scrolly.scrollUp.bind(scrolly));
prompt.on('scrollDown', scrolly.scrollDown.bind(scrolly));
