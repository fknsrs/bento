var Stream  = require('stream').Stream;
var util    = require('util');

var Prompt = module.exports = function Prompt(inputStream) {
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

// todo: we should limit this to only accept one byte (i think)
// todo: handle multibyte
Prompt.prototype.write = function(buffer) {
  
  switch(buffer[0]) {
    
    // Ctrl-C
    case 0x03:
      this.emit('end');
      return;

    default:
      this.emit('keypress', buffer);
  }

  return this.writable;
};
