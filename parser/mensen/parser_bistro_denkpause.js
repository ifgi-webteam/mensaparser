// PostgreSQL
var pg = require('pg');
var conString = "postgres://docker:docker123@db/docker";
var client = new pg.Client(conString);
// asynchronous database requests counter to know when to disconnect
var requestCounter = 0;
// initialize empty mensa object, to be filled by main ringparser() method
var mensa = new Object();

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
function insertData(toInsert) {
	var fooditem = toInsert;
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
			return console.error('error running query', err);
		}		
		//console.log(requestCounter);
		//console.log(result);
	});
}

// process the html data and find the data we are interested in
function process(error, response, html) {
	// moment library for date conversion
	var moment = require("moment");
	// cheerio library for html parsing
	var cheerio = require('cheerio');
	// html element id list for parsing & extracting data
	var idList = [ "montag", "dienstag", "mittwoch", "donnerstag", "freitag" ];

	// check if request was successfull (html response code 200)
	if(!error && response.statusCode == 200) {
		var $ = cheerio.load(html);

		// Preise abfragen
		// Ergebnisse in Variable preise: 
		// preise[0] komplettes pattern match
		// preise[1] (Menü 1/2 Student), 
		// preise[2] (Menü 1/2 Sonst.), 
		// preise[3] (Menü 3 Student),
		// preise[4] (Menü 3 Sonst.),
		// preise[5] (Einopf Student),
		// preise[6] (Eintopf Sonst.)
		var content = $("table.contentpaneopen").text();
		var preise = content.match(/Preise\sMenü\sI\s\/II\sStud\.\s([0-9],[0-9]+)\s€\/Sonst\.\s([0-9],[0-9]+)\s€Preise\sMenü\sIII\s+Stud\.\s([0-9],[0-9]+)\s€\/Sonst\.\s([0-9],[0-9]+)\s€\s+Eintopf\s+Stud\.\s([0-9],[0-9]+)\s€\/Sonst\.\s([0-9],[0-9]+)\s€/);

		// iterate idList as week days
		for (weekDay in idList) { // mo, di, mi, do, fr
			// Datum des Tages parsen
			var dateToday = $( '#' + idList[weekDay] ).text().split(" ").pop().replace("\r\n", "");
			
			// JSON Objekt für jedes Menü
			// Menü I
			var fooditem = {
				"mensa": {
					"name": mensa.name,
					"uid": mensa.uid
				},
				"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
				"name": $( '#' + idList[weekDay] + "_menu1" ).text(),
				"minPrice": preise[1],
				"maxPrice": preise[2]
			};
			console.log("" + fooditem.date + ": " + fooditem.name + " (" + fooditem.minPrice + "/" + fooditem.maxPrice + ")");
			
			// Menü II
			var fooditem = {
				"mensa": {
					"name": mensa.name,
					"uid": mensa.uid
				},
				"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
				"name": $( '#' + idList[weekDay] + "_menu2" ).text(),
				"minPrice": preise[1],
				"maxPrice": preise[2]
			};
			console.log("" + fooditem.date + ": " + fooditem.name + " (" + fooditem.minPrice + "/" + fooditem.maxPrice + ")");

			// insertData(fooditem);
		}
	}
}

// main method for module export & start point
function bistroparser(mens) {
	var request = require('request');
	mensa = mens;
	request(mensa.url, process);
}

module.exports.bistroparser = bistroparser;
