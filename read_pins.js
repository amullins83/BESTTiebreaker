var gpio = require("pi-gpio");

var PinReader = function(pinList) {
  this.pins = pinList;
};

