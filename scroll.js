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
  position:   [5,5],
  dimensions: [20, 40],
  initialize: function initialize() {
    this.buffer = fs.readFileSync('chats.txt').toString().split(/\n/);
    this.scrollPos = 0;
    this.autoScroll = true;
  },
  scrollUp: function scrollUp() {
    this.scrollPos++;
    if (this.scrollPos >= this.buffer.length - this.bound.height) {
      this.scrollPos--;
    }
    else if (this.scrollPos > 0) {
      this.autoScroll = false;  
    }
    this.emit('draw');
  },
  scrollDown: function scrollDown() {
    this.scrollPos--;
    if (this.scrollPos <= 0){
      this.scrollPos = 0;
      this.autoScroll = true;
    }
    this.emit('draw');
  },
  data: function data(data) {
    this.buffer.unshift(data.toString());
    if (this.autoScroll) {
      this.emit('draw');
    }
  },
  draw: function draw() {
    this.caret.moveTo(this.bound.limit.y, 0);
    var _line = null, _i = 0;
    while (this.bound.caretInBounds(this.caret) && _line !== undefined) {
      if (_line=this.buffer[_i++ + this.scrollPos]) {
        this.row(_line.slice(0, 40));
        this.caret.moveTo('-1', 0);
      }
    }
  }
});

prompt.on('scrollUp',   function() { scrolly.emit('scrollUp'); });
prompt.on('scrollDown', function() { scrolly.emit('scrollDown'); });

// fake scrolly traffic
var c = 'a'.charCodeAt(0);
setInterval(function() {
  scrolly.write(String.fromCharCode(c,c,c,c,c,c,c,c,c))
  if (++c > 'z'.charCodeAt(0)) c = 'a'.charCodeAt(0);
}, 1000);
