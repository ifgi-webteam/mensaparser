var restify = require('restify');
var moment = require('moment');
var pg = require('pg');
var conString = "postgres://docker:mensaparser@db/docker";
var client = new pg.Client(conString);//a
var xmlbuilder = require('xmlbuilder');

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
	List possible queries / output the help HTML document
*/
function respondHello(req, res, next) {
	res.send('See /docs for a list of commands');
	next();
}

/*
	List recent 30 inserts
*/
function respondAll(req, res, next) {
	queryDatabase("SELECT * FROM menus ORDER BY id DESC LIMIT 30", [], function(response) {
		res.send( response.rows );
		next();
	});
}

/*
	Respond with the current week's canteen menu
*/
function respondCurrentMenu(req, res, next) {
	var lastSunday = moment().day("Sunday");
	var nextSunday = moment().day("Sunday").add(7, 'days');
	console.log('respondCurrentMenu:', 'Query between ', lastSunday.format("YYYY-MM-DD"), nextSunday.format("YYYY-MM-DD"));
	queryDatabase("SELECT data FROM menus WHERE data->>'date' > $1 AND data->>'date' < $2 ", 
		[lastSunday.format("YYYY-MM-DD"), nextSunday.format("YYYY-MM-DD")],
		function(response) {
		res.send( response.rows );
		next();
	});
}

/*
	List all available canteens
*/
function respondMensen(req, res, next) {
	console.log('respondMensen');
	queryDatabase("SELECT DISTINCT data->'mensa' as mensa FROM menus", [], function(response) {
		res.send( response.rows );
		next();
	});
}

/*
	List menu by week nr. [unused]
*/
function respondMenuByWeek(req, res, next) {
	var lastSunday = moment().day("Sunday");
	var nextSunday = moment().day("Sunday").add(7, 'days');
	console.log('respondMenuByWeek:', 'Query between ', lastSunday.format("YYYY-MM-DD"), nextSunday.format("YYYY-MM-DD"));
	queryDatabase("SELECT data FROM menus WHERE data->>'date' > $1 AND data->>'date' < $2 ", 
		[lastSunday.format("YYYY-MM-DD"), nextSunday.format("YYYY-MM-DD")],
		function(response) {
		res.send( response.rows );
		next();
	});
}

/*
	List menu by canteen via identifier string
*/
function respondCurrentMenuByMensa(req, res, next) {
	var lastSunday = moment().day("Sunday");
	var nextSunday = moment().day("Sunday").add(7, 'days');
	console.log('respondCurrentMenuByMensa:', req.params[0]);

	// query for current mensa food
	// concatenate query parameter with "$" to form a regular expression
	queryDatabase("SELECT data FROM menus WHERE data->>'date' > $1 AND data->>'date' <= $2 AND data->'mensa'->>'uid' ~ ($3||'$')", 
		[lastSunday.format("YYYY-MM-DD"), nextSunday.format("YYYY-MM-DD"), req.params[0]],
		function(response) {
		res.send( response.rows );
		next();
	});
}

/*
	Fetch data in OpenMensa XML feed format as specified here:
	http://doc.openmensa.org/feed/v2/
*/
function fetchXML(res, querystart, queryend, mensaid) {
	res.setHeader('content-type', 'application/xml');

	queryDatabase("SELECT data FROM menus WHERE data->>'date' >= $1 AND data->>'date' <= $2 AND data->'mensa'->>'uid' ~ ($3||'$')", 
		[querystart, queryend, mensaid],
		function(response) {

			// preprocess the database response and group by date
			var menuByDay = {};
			for(var index in response.rows) {
				var aMenu = response.rows[index].data;
				if(menuByDay[aMenu.date] === null) menuByDay[aMenu.date] = [];
				menuByDay[aMenu.date].push(aMenu);
			}

			// create the XML root
			var xml = xmlbuilder.create('openmensa')
				.dec('1.0', 'UTF-8')
				.att('version', '2.0')
				.att('xmlns', "http://openmensa.org/open-mensa-v2")
				.att('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance")
				.att('xsi:schemaLocation', "http://openmensa.org/open-mensa-v2 http://openmensa.org/open-mensa-v2.xsd")
			.ele('canteen');

			// add meals from our sorted object
			for(var index in menuByDay) {
				var aDay = menuByDay[index];
				var omday = xml.ele('day').att('date', aDay[0].date);
				for(var index2 in aDay) {
					var aMenu = aDay[index2];
					var omcategory = omday.ele('category').att('name', aMenu.menuName);
					if(aMenu.name.indexOf("Geschloss") !== 0) {
						omcategory.ele('meal')
							.ele('name', aMenu.name)
							.up()
							.ele('price', aMenu.minPrice)
							  .att('role', 'student')
							.up()
							.ele('price', aMenu.maxPrice)
							  .att('role', 'other');
					}
					// check length of category, if 0 then mark mensa as closed (see below)
					if(omcategory.children.length === 0) {
						omcategory.remove();
					}
				}
				// check occurences of 'category' element, if 0 then mark mensa as closed
				if(omday.children.length == 0) {
					omday.ele('closed');
				}
			}

			res.send( xml.end({ pretty: true }) 
		);
	});
}

/*
	List week's menu by Mensa via identifier string for OpenMensa
*/
function respondCurrentMenuByMensaXML(req, res, next) {
	var lastSunday = moment().day("Sunday");
	var nextSunday = moment().day("Sunday").add(7, 'days');
	console.log('respondCurrentMenuByMensaXML');

	fetchXML(res, lastSunday.format("YYYY-MM-DD"), nextSunday.format("YYYY-MM-DD"), req.params[0]);
	next();
}

/*
	List today's menu by Mensa via identifier string for OpenMensa
*/
function respondTodaysMenuByMensaXML(req, res, next) {
	var today = moment();
	console.log('respondTodaysMenuByMensaXML');

	fetchXML(res, today.format("YYYY-MM-DD"), today.format("YYYY-MM-DD"), req.params[0]);
	next();
}

var server = restify.createServer();
server.use(restify.fullResponse()); // enable CORS

// JSON responses
server.get('/', respondHello);
server.get('/all', respondAll);
server.get('/mensen', respondMensen);
server.get('/menu', respondCurrentMenu);
server.get(/^\/menu\/([a-zA-Z0-9]{4,32})/, respondCurrentMenuByMensa);

// OpenMensa XML responses
server.get(/^\/openmensa\/canteen\/([a-zA-Z0-9]{4,32})/, respondCurrentMenuByMensaXML);
server.get(/^\/openmensa\/today\/([a-zA-Z0-9]{4,32})/, respondTodaysMenuByMensaXML);

// Serve the docs
// usage hints: http://stackoverflow.com/questions/15463841/serving-static-files-with-restify-node-js
server.get(/^\/docs\/?.*/, restify.serveStatic({
		directory: __dirname,
		default: 'index.html'
	})
);

// log request address and IP to console
server.pre(function(req, res, next) {
	res.charSet('UTF-8');
	var ip = req.headers['x-forwarded-for'] || 
		req.connection.remoteAddress || 
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
	console.log('Query by '+ip);
	return next();
});

server.listen(9000, function() {
	console.log('%s listening at %s', server.name, server.url);
});