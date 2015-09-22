var Socket = require("./socket");

const DEFAULT_PORT = 33250;
var port = NaN;
if (process.argv.length > 2) {
	port = parseInt(process.argv[2], 10);
}

if (isNaN(port)) {
	port = DEFAULT_PORT;
}

var socket = new Socket(port);
console.log("Listening on UDP port " + port);

