var wpi = require("wiring-pi");
var EventEmitter = require("events").EventEmitter;

const UNOPENED = -2;
const UNREAD = -1;
const OFF = 0;
const ON = 1;

wpi.setup("wpi");

var PinReader = function(pinList) {
  this.pins = pinList;
  this._emitter = new EventEmitter();
  this.pinStates = {};
  this.pins.forEach(function(pin) {
    this.pinStates[pin] = UNOPENED;
  }.bind(this));
};

PinReader.prototype.addPinChangeListener = function(listener) {
  this._emitter.addListener("pinChanged", listener);
};

var eachPin = function(pins, callback) {
  var current = Promise.resolve();
  return Promise.map(pins, function(pin) {
    current = current.then(function() {
      return callback(pin);
    });
    return current;
  });
};

PinReader.prototype._watchPin = function(pin) {
  var _self = this;
  if (_self.pinStates[pin] != UNOPENED) {
   var value = wpi.readDigital(pin);
   if (value != _self.pinStates[pin]) {
       _self.pinStates[pin] = value;
       _self._emitter.emit("pinChanged", {pin: pin, value: value});
   }

   setTimeout(function() {
     _self._watchPin(pin);
   }, 20);
};

PinReader.prototype.openPins = function() {
  this.pins.map(function(pin) {
    wpi.pinMode(pin, wpi.modes.INPUT);
    this.pinStates[pin] = UNREAD;
    setImmediate(function() {
      this._watchPin(pin);
    }.bind(this));
  }.bind(this));
};

module.exports = PinReader;

