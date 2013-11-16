var nodecr = require("nodecr");
var http = require("http");
var fs = require("fs");

function start() {
	function onRequest(request, response) {
		var body = "";
		request.on("data", function (chunk) {
			body += chunk;
		});
		request.on("end", function() {
			console.log((new Date()) + ": Request received.\n");
			
			if (body != "") {
				body = body.replace(/^data:image\/jpeg;base64,/,"");
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
						
						response.writeHead(500, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
						response.write("Tesseract error");
						response.end();
						
						fs.unlink("temp/temp" + random + ".jpg", function(err) {
							if (err) {
								console.log((new Date()) + ": Couldn't delete temp%d.jpg!", random);
							} else {
								console.log((new Date()) + ": temp%d.jpg deleted", random);
							}
						});
					} else {
						console.log("\nSuccess: %s", text);
						
						response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
						response.write(text.substring(0, text.length));
						response.end();
						
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
				
				response.writeHead(500, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
				response.write("No body found!");
				response.end();
			}
		});
	}
	
	http.createServer(onRequest).listen(8888);
	console.log((new Date()) + ": Server has started.");
}

exports.start = start;