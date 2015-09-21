var PinReader = require("./read_pins");

var Quadrant = function(name, pin) {
	this.name = name;
	this.rank = null;
	this.isSwitchOn = false;
	this.pin = pin;
};

var TiebreakerStatus = function() {
	this.isConfigured = false;
	this.reset();
	this._reader = new PinReader([0,1,2,3], this._pinHandler.bind(this));
};

TiebreakerStatus.prototype._pinHandler = function(state) {
	var quadrant = this.quadrants[state.pin];
	if (state.value && quadrant.rank === null) {
		quadrant.rank = this._nextRank++;
		quadrant.isSwitchOn = true;
	}
};

TiebreakerStatus.prototype.reset = function() {
	this.quadrants = {
		0: new Quadrant("red", 0),
	        1: new Quadrant("blue", 1),
		2: new Quadrant("yellow", 2),
		3: new Quadrant("green", 3)
	};
	
	this._nextRank = 1;
};

module.exports = TiebreakerStatus;

