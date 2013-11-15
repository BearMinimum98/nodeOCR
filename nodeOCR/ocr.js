var nodecr = require('nodecr');
var http = require("http");
var url = require('url');
var fs = require('fs');

function start() {
	function onRequest(request, response) {
		var body = "";
		request.on("data", function (chunk) {
			body += chunk;
		});
		request.on("end", function() {
			console.log("\n" + (new Date()) + ": Request received.");
			if (body != "") {
				body = body.replace(/^data:image\/jpeg;base64,/,"");
				fs.writeFile("temp/temp.jpg", body, 'base64', function(err) {
					if (err) {
						console.log((new Date()) + ": " + err);
					}
				});
			}
			nodecr.process("temp/temp.jpg", function(err, text) {
				if (err) {
					console.log("Tesseract error!");
					response.writeHead(500, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
					response.write("Tesseract error");
					response.end();
					fs.unlink("temp/temp.jpg", function(err) {
						if (err) {
							console.log((new Date()) + ": Couldn't delete temp.jpg!");
						} else {
							console.log((new Date()) + ": temp.jpg deleted");
						}
					});
				} else {
					console.log("Success: %s", text);
					response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
					response.write(text.substring(0, 5));
					response.end();
					fs.unlink("temp/temp.jpg", function(err) {
						if (err) {
							console.log((new Date()) + ": Couldn't delete temp.jpg!");
						} else {
							console.log((new Date()) + ": temp.jpg deleted");
						}
					});
				}
			});
		});
	}
	http.createServer(onRequest).listen(8888);
	console.log((new Date()) + ": Server has started.");
}

exports.start = start;