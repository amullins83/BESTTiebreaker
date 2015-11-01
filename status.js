var PinReader = require("./read_pins");

var quadrantNames = ["red", "blue", "yellow", "green"];

var Quadrant = function(pin) {
	this.name = quadrantNames[pin];
	this.rank = null;
	this.isSwitchOn = false;
	this.pin = pin;
};

var TiebreakerStatus = function() {
	this.isConfigured = false;
	this.quadrants = [0,1,2,3].map(function(pin) {
		return new Quadrant(pin);
	});
	this._reader = new PinReader([0,1,2,3]);
	this._nextRank = 1;
	this._reader.addPinChangeListener(this._pinHandler.bind(this));
	this.reset();
	this._reader.openPins();
};

TiebreakerStatus.prototype._pinHandler = function(state) {
	this.isConfigured = true;
	var quadrant = this.quadrants[state.pin];
	if (state.value && quadrant.rank === null) {
		quadrant.rank = this._nextRank++;
		quadrant.isSwitchOn = true;
	}
};

TiebreakerStatus.prototype.reset = function() {
	this._nextRank = 1;
	this.quadrants.forEach(function(quadrant) {
		quadrant.isSwitchOn =
		  this._reader.pinStates[quadrant.pin] === 1;
		if (quadrant.isSwitchOn) {
			setTimeout(function() {
				quadrant.rank = this._nextRank++;
			}.bind(this), Math.floor(Math.random() * 10));
		}
	}.bind(this));
};

TiebreakerStatus.prototype.toJson = function() {
	return JSON.stringify({
		isConfigured: this.isConfigured,
	        quadrants: this.quadrants
	});
};

TiebreakerStatus.prototype.toXml = function() {
	var xml = "<DATA><DEVSTATUS><CONFIG>" + 
		(this.isConfigured ? 1 : 0) +
		"</CONFIG></DEVSTATUS>";
	if (this.isConfigured) {
		xml += "<TIEBREAK>";
		xml += this.quadrants.reduce(function(quadrantText, quadrant) {
			return (
				quadrantText + "<" + quadrant.name.toUpperCase() +
				">" + quadrant.rank + "</" + quadrant.name.toUpperCase() +
				">"
			);
		}, "");
		xml += "</TIEBREAK>";
		xml += "<SWSTATUS>";
		xml += this.quadrants.reduce(function(quadrantText, quadrant) {
			return (
				quadrantText + "<" + quadrant.name.toUpperCase() +
				">" + (quadrant.isSwitchOn ? 1 : 0) + "</" +
				quadrant.name.toUpperCase() + ">"
			);
		}, "");
		xml += "</SWSTATUS>";
	}

	xml += "</DATA>";
	return xml;
}

module.exports = TiebreakerStatus;

