/*
	Common functions, such as database connectivity, for all parsers
*/

// PostgreSQL
var pg = require('pg');
var conString = "postgres://docker:mensaparser@db/docker";
var client = new pg.Client(conString);
// asynchronous database requests counter to know when to disconnect
var requestCounter = 0;

// connect to PostgreSQL database
client.connect(function(err) {
	if(err) {
		return console.error('could not connect to postgres', err);
	}
	console.log('Connected to database');
});

// disconnect from PostgreSQL database
function disconnect() {
	console.log("Disconnecting from database");
	client.end();
}

// insert data into PostgreSQL database
var insertData = function(toInsert) {
	var fooditem = toInsert; 
	//console.log(toInsert);
	requestCounter++;
	console.log("" + requestCounter + " -> calling db insert");
	
	client.query('INSERT INTO menus (data) VALUES ($1)', [fooditem], function(err, result) {
		requestCounter--;
		console.log("" + requestCounter + " -> inserted");

		// no more database requests to be filled, disconnect
		if(requestCounter===0) {
			disconnect();
		}

		if(err) {
			if(err.code=='23505')
				return console.error('Ignoring duplicate');
			return console.error('Error running query', err);
		}
		//console.log(requestCounter);
		//console.log(result);
	});
}

module.exports.insertData = insertData;