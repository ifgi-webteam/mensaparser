// main method for module export & start point
var bispinghofparser = function(mensa) {
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

			var content = $("table.contentpaneopen").text();
			//console.log(content);

			// calculate the weekday dates from the title 
			// because there's only 1 food plan for the whole week
			var dateString = $("td#woche h2 strong").text();
			var weekDates = dateString.match(/Wochenspeiseplan\s+([0-9]{2}\.[0-9]{2}\.[0-9]{4}).+([0-9]{2}\.[0-9]{2}\.[0-9]{4})$/);
			//weekDates[1] // monday
			//weekDates[2] // friday
			var monday = moment(weekDates[1], "DD.MM.YYYY");

			for(var i = 0; i < 5; i++) {
				var dateToday = moment(monday).add(i, 'days');
				//console.log(moment(today).format('YYYY-MM-DD'));

				// iterate over the 3 daily menus
				for(var i = 1; i <= 3; i++) {
					var preiseToday = $('#menu' + i + "_preis");
					var preise = ["0", "0"];
					if(preiseToday.text().trim().length > 0) {
						preise = preiseToday.text().match(/([0-9],[0-9]{2})/g);
					}

					// JSON Objekt für jedes Menü
					var fooditem = {
						"mensa": {
							"name": mensa.name,
							"uid": mensa.uid
						},
						"date": moment(dateToday, "DD.MM.YYYY").format('YYYY-MM-DD'),
						"name": $( '#menu' + i + '_menu' ).text(),
						"minPrice": parseFloat( preise[0].replace(',','.') ).toFixed(2),
						"maxPrice": parseFloat( preise[1].replace(',','.') ).toFixed(2),
						"menuName": "Menü " + Array(i+1).join('I'),
						"closed": 0
					};
					if(fooditem.name.toLowerCase().indexOf("geschloss") != -1
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

module.exports.bispinghofparser = bispinghofparser;
