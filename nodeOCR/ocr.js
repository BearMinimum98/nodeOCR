var nodecr = require("nodecr");
var http = require("http");
var fs = require("fs");
var WebSocketServer = require("ws").Server;

function start() {
	var ws = new WebSocketServer({port: 8888});
	wss.on("connection", function (ws) {
		ws.on("message", function (message) {
			console.log((new Date()) + ": Message received.\n");
			if (message != "") {
				var body = message.replace(/^data:image\/jpeg;base64,/,"");
				var random = Math.floor(Math.random() * 100000);
				fs.writeFile("temp/temp" + random + ".jpg", body, 'base64', function(err) {
					if (err) {
						console.log("\n" + (new Date()) + ": " + err);
					} else {
						console.log("\n" + (new Date()) + ": temp%d.jpg created", random);
					}
				});
				nodecr.process("temp/temp" + random + ".jpg", function(err, text) {
					if (err) {
						console.log("Tesseract error!");
						ws.send("Tesseract error");
						fs.unlink("temp/temp" + random + ".jpg", function(err) {
							if (err) {
								console.log((new Date()) + ": Couldn't delete temp%d.jpg!", random);
							} else {
								console.log((new Date()) + ": temp%d.jpg deleted", random);
							}
						});
					} else {
						console.log("\nSuccess: %s", text);
						ws.send(text);
						fs.unlink("temp/temp" + random + ".jpg", function(err) {
							if (err) {
								console.log((new Date()) + ": Couldn't delete temp%d.jpg!", random);
							} else {
								console.log((new Date()) + ": temp%d.jpg deleted", random);
							}
						});
					}
				});
			} else {
				console.log((new Date()) + ": No body found!");
				ws.send("No body found!");
			}
		});
	});
	console.log((new Date()) + ": Server has started.");
}

exports.start = start;