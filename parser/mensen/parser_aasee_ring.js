// main method for module export & start point
var ringparser = function(mensa) {
	var request = require('request');
	request(mensa.url, process);

	// PostgreSQL
	var pg = require('pg');
	var conString = "postgres://docker:docker123@db/docker";
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
	function insertData(toInsert) {
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
			// preise[1] (Menü 1 Student), 
			// preise[2] (Menü 1 Sonst.), 
			// preise[3] (Menü 2 Student),
			// preise[4] (Menü 2 Sonst.),
			// preise[5] (Menü 3 Student),
			// preise[6] (Menü 3 Sonst.)
			var content = $("table.contentpaneopen").text();
			//console.log(content);
			var preise = content.match(/[0P]reise\s*Stud.\s*\/\s*Sonst.\s*Menü\s*I\s*([0-9],[0-9]+)\s*€\s*\/\s*([0-9],[0-9]+)\s*€\s*Menü\s*II\s*([0-9],[0-9]+)\s*€\s*\/\s*([0-9],[0-9]+)\s*€\s*Menü\s*III\s*([0-9],[0-9]+)\s*€\s*\/\s*([0-9],[0-9]+)\s*€/);

			// iterate idList as week days
			for (weekDay in idList) { // mo, di, mi, do, fr
				// Datum des Tages parsen
				var dateToday = $( '#' + idList[weekDay] ).text().split(" ").pop().replace("\r\n", "");
				
				// iterate over the 3 daily menus
				for(var i = 1; i <= 3; i++) {
					// JSON Objekt für jedes Menü
					var fooditem = {
						"mensa": {
							"name": mensa.name,
							"uid": mensa.uid
						},
						"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
						"name": $( '#' + idList[weekDay] + "_menu" + i ).text(),
						"minPrice": parseFloat( preise[i*2-1].replace(',','.') ).toFixed(2),
						"maxPrice": parseFloat( preise[i*2].replace(',','.') ).toFixed(2),
						"menuName": "Menü " + Array(i+1).join('I'),
						"closed": 0
					};
					if(fooditem.name.toLowerCase().indexOf("geschlossen") != -1
						|| fooditem.name.toLowerCase().indexOf("keine ausg") != -1) {
						fooditem.minPrice = "0";
						fooditem.maxPrice = "0";
						fooditem.closed = 1;
					}
					console.log("" + fooditem.date + ": " + fooditem.name + " (" + fooditem.minPrice + "/" + fooditem.maxPrice + ")");
					insertData(fooditem);
				}
			}
		}
	}
}

module.exports.ringparser = ringparser;
