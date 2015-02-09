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

	//var query = client.query('SELECT * FROM menus');
    //query.on('row', function(row) {
    //  console.log(row);
    //});
});

http.createServer(function(req, res) {
	var list_records = function(req, res) {
		
	};
	if(req.method == 'GET') {
		//res.writeHead(200, {"Content-Type": "text/html"});
		//res.write('here be data');
		//res.end();

		var query = client.query("SELECT * FROM menus");
		query.on("row", function (row, result) {
			result.addRow(row);
		});
		query.on("end", function (result) {
			//console.log(JSON.stringify(result.rows, null, "    "));
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.write(JSON.stringify(result.rows) + "\n");
			res.end();
		});
	}
}).listen(port);

console.log("Connected to port "+port);