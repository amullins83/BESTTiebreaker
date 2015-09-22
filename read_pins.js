var wpi = require("wiring-pi");
var EventEmitter = require("events").EventEmitter;

const UNOPENED = -2;
const UNREAD = -1;
const OFF = 0;
const ON = 1;

wpi.setup("wpi");

var PinReader = function(pinList, listener) {
  this.pins = pinList;
  this._emitter = new EventEmitter();
  this.pinStates = {};
  this.pins.forEach(function(pin) {
    this.pinStates[pin] = UNOPENED;
  }.bind(this));

  if (typeof(listener) == "function") {
    this.addPinChangeListener(listener);
    this.openPins();
  }
};

PinReader.prototype.addPinChangeListener = function(listener) {
  this._emitter.addListener("pinChanged", listener);
};

PinReader.prototype._watchPin = function(pin) {
  var _self = this;
  if (_self.pinStates[pin] != UNOPENED) {
    var value = wpi.digitalRead(pin);
    if (value != _self.pinStates[pin]) {
       _self.pinStates[pin] = value;
       _self._emitter.emit("pinChanged", {pin: pin, value: value});
    }

    setTimeout(function() {
      _self._watchPin(pin);
    }, 20);
  }
};

PinReader.prototype.openPins = function() {
  this.pins.map(function(pin) {
    wpi.pinMode(pin, wpi.INPUT);
    wpi.pullUpDnControl(pin, wpi.PUD_UP);
    this.pinStates[pin] = UNREAD;
    setTimeout(function() {
      this._watchPin(pin);
    }.bind(this), Math.floor(Math.random() * 10));
  }.bind(this));
};

module.exports = PinReader;

