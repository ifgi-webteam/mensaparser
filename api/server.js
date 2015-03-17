var restify = require('restify');
var moment = require('moment');
var pg = require('pg');
var conString = "postgres://docker:docker123@db/docker";
var client = new pg.Client(conString);

/*
	Connect to PostgreSQL database or exit
*/
client.connect(function(err) {
	if(err) {
		return console.error('Could not connect to postgres', err);
	}
	console.log('Connected to database');
});

/*
	Query the database and respond by calling callback(response)
*/
var queryDatabase = function(querystring, params, callback) {
	var query = client.query(querystring, params);
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	query.on("end", callback);
};

/*
	List possible queries
*/
function respondHello(req, res, next) {
	res.charSet('UTF-8');
	res.send('See /docs for a list of commands');
	next();
}

/*
	List all
*/
function respondAll(req, res, next) {
	res.charSet('UTF-8');
	queryDatabase("SELECT * FROM menus", [], function(response) {
		res.send( response.rows );
		next();
	});
}

/*
	Respond with the current Mensa menu
*/
function respondCurrentMenu(req, res, next) {
	res.charSet('UTF-8');
	var nextSunday = moment().day("Sunday");
	var lastSunday = moment().day("Sunday").subtract(7, 'days');
	console.log('respondHello:', 'Query between ', lastSunday.format("YYYY-MM-DD"), nextSunday.format("YYYY-MM-DD"));
	queryDatabase("SELECT * FROM menus WHERE data->>'date' > $1 AND data->>'date' < $2 ", 
		[lastSunday.format("YYYY-MM-DD"), nextSunday.format("YYYY-MM-DD")],
		function(response) {
		res.send( response.rows );
		next();
	});
}

/*
	List all available Mensas
*/
function respondMensen(req, res, next) {
	res.charSet('UTF-8');
	queryDatabase("SELECT DISTINCT data->'mensa' as mensa FROM menus", [], function(response) {
		res.send( response.rows );
		next();
	});
}

/*
	List menu by week nr.
*/
function respondMenuByWeek(req, res, next) {
	res.charSet('UTF-8');
	var nextSunday = moment().day("Sunday");
	var lastSunday = moment().day("Sunday").subtract(7, 'days');
	console.log('respondMenuByWeek:', 'Query between ', lastSunday.format("YYYY-MM-DD"), nextSunday.format("YYYY-MM-DD"));
	queryDatabase("SELECT * FROM menus WHERE data->>'date' > $1 AND data->>'date' < $2 ", 
		[lastSunday.format("YYYY-MM-DD"), nextSunday.format("YYYY-MM-DD")],
		function(response) {
		res.send( response.rows );
		next();
	});
}

/*
	List menu by Mensa via identifier string
*/
function respondCurrentMenuByMensa(req, res, next) {
	res.charSet('UTF-8');
	var nextSunday = moment().day("Sunday");
	var lastSunday = moment().day("Sunday").subtract(7, 'days');
	console.log(req.params[0]);

	// query for current mensa food
	// concatenate query parameter with "$" to form a regular expression
	queryDatabase("SELECT * FROM menus WHERE data->>'date' > $1 AND data->>'date' <= $2 AND data->'mensa'->>'uid' ~ ($3||'$')", 
		[lastSunday.format("YYYY-MM-DD"), nextSunday.format("YYYY-MM-DD"), req.params[0]],
		function(response) {
		res.send( response.rows );
		next();
	});
}


var server = restify.createServer();
server.use(restify.fullResponse()); // enable CORS
server.get('/', respondHello);
server.get('/all', respondAll);
server.get('/mensen', respondMensen);
server.get('/menu', respondCurrentMenu);
server.get(/^\/menu\/([a-zA-Z0-9]{32})/, respondCurrentMenuByMensa);

// Serve the docs
// usage hints: http://stackoverflow.com/questions/15463841/serving-static-files-with-restify-node-js
server.get(/^\/docs\/?.*/, restify.serveStatic({
		directory: __dirname,
		default: 'index.html'
	})
);

server.listen(9000, function() {
	console.log('%s listening at %s', server.name, server.url);
});