console.log("is this real life");
var pg = require('pg');
var http = require("http")
var conString = "postgres://docker:docker123@db/docker";
var client = new pg.Client(conString);
var port = 8080;

client.connect(function(err) {
	if(err) {
		return console.error('could not connect to postgres', err);
	}
	console.log('Connected to database');
});

var list_records = function(querystring, writecallback) {
	var query = client.query(querystring);
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	query.on("end", writecallback);		
};

http.createServer(function(req, res) {
	if(req.method == 'GET') {
		function writecallback(result) {
			res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8'});
			res.write(JSON.stringify(result.rows) + "\n");
			res.end();
		}
		list_records("SELECT * FROM menus", writecallback);
	}
}).listen(port);

console.log("Connected to port "+port);