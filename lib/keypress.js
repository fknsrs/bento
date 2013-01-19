var Keypress = module.exports = function Keypress(buffer) {
  
  // allow array-type access to the object
  // keypress = new Keypress(new Buffer([0x1b, 0x5b, 0x41]));
  // keypress[0]; //=> 0x1b
  // keypress[1]; //=> 0x5b
  for (var _i=0; _i<buffer.length; _i++) {
    this[_i] = buffer[_i];
  }

  // full hex sequence
  this.sequence = buffer.toString('hex');
  this.string   = buffer.toString();
};

// check if keypress matches a sequence of bytes
// keypress.is(0x1b, 0x5b, 0x41); //=> Boolean
Keypress.prototype.is = function is() {
  return this.sequence == arguments.map(function(byte) {
    return byte.toString(16);
  }).join('');
};
