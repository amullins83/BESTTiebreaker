var TiebreakerStatus = require("./status");
var dgram = require("dgram");

var TiebreakerSocket = function(port) {
	this.port = port;
	this._socket = dgram.createSocket("udp4");
	this._socket.on('message', this._handleMessage.bind(this));
	this._socket.bind(port);
	this._status = new TiebreakerStatus();
};

TiebreakerSocket.prototype._handleMessage = function(msg, rinfo) {
	if (msg) {
		var text = msg.toString();
		switch (text) {
			case "QRY": this._sendStatus(rinfo.address); break;
			case "RST": this._resetStatus(rinfo.address); break;
			default: this._sendError(rinfo.adrress); break;
		}
	}
};

TiebreakerSocket.prototype._sendStatus = function(address) {
	this._sendMessage(this._status.toXml(), address);
};

TiebreakerSocket.prototype._resetStatus = function(address) {
	this._status.reset();
	this._sendMessage("OK", address);
};

TiebreakerSocket.prototype._sendError = function(address) {
	this._sendMessage("ERROR", address);
};

TiebreakerSocket.prototype._sendMessage = function(message, address) {
	var buffer = new Buffer(message);
	this._socket.send(
		buffer,
		0,
		buffer.length,
		this.port,
		address);
};

module.exports = TiebreakerSocket;

